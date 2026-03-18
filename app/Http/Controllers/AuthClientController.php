<?php

namespace App\Http\Controllers;

use App\Http\Classes\EmailConfig;
use App\Http\Services\ReCaptchaService;
use App\Models\Constant;
use App\Models\ModelHasRoles;
use App\Models\User;
use App\Models\Person;
use App\Models\PreUser;
use App\Models\SpecialtiesByUser;
use App\Models\Specialty;
use App\Notifications\PasswordChangedNotification;
use App\Notifications\VerifyAccountNotification;
use App\Providers\RouteServiceProvider;
use App\Services\EmailNotificationService;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use SoDe\Extend\Trace;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Access\AuthorizationException;
use Spatie\Permission\Models\Role;

class AuthClientController extends BasicController
{

    public function validarEmail($email)
    {
        $regex = "/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/";
        return preg_match($regex, $email) === 1;
    }

    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            throw new AuthorizationException;
        }

        if ($user->hasVerifiedEmail()) {
            return redirect('/?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect('/?verified=1');
    }

    public function login(Request $request): HttpResponse | ResponseFactory | RedirectResponse
    {
        //dump($request->all());

        $response = Response::simpleTryCatch(function (Response $response) use ($request) {
            $email = Controller::decode($request->email);
            $password = Controller::decode($request->password);

            if (!Auth::attempt(['email' => $email, 'password' => $password])) {

                $response->status = 400;
                $response->message = 'Operación Incorrecta. Por favor, ingresar credenciales válidas';
                return;
            }

            // 🔴 Regenerar sesión
            $request->session()->regenerate();

            // ✅ Agregar usuario autenticado a la respuesta
            /** @var \App\Models\User */
            $user = Auth::user();
            $user->load('roles'); // Cargar roles para que el frontend sepa si es Cliente o Proveedor

            $response->status = 200;
            $response->message = 'Operación Correcta. Has iniciado sesión';
            $response->data = [
                'user' => $user,
                'role' => $user->roles->first()?->name // Helper para fácil acceso
            ];
        });

        //dump($response->toArray(), $response->status);
        return response($response->toArray(), $response->status);
    }

    public function signup(Request $request): HttpResponse | ResponseFactory
    {
        $response = new Response();
        try {
            Log::info('--- Signup Process Start (Original Version) ---');
            Log::info('Signup - Raw Request:', $request->all());

            $email = Controller::decode($request->email);
            $password = Controller::decode($request->password);
            $confirmation = Controller::decode($request->confirmation);
            $name = Controller::decode($request->name);
            $lastname = Controller::decode($request->lastname);

            Log::info('Signup - Decoded Data:', [
                'email' => $email,
                'name' => $name,
                'lastname' => $lastname
            ]);

            // Validar contraseñas
            if ($password !== $confirmation) {
                $response->status = 400;
                $response->message = 'Las contraseñas no coinciden.';
                return response($response->toArray(), $response->status);
            }

            // Validar formato email
            if (!$this->validarEmail($email)) {
                $response->status = 400;
                $response->message = 'Correo electrónico inválido.';
                return response($response->toArray(), $response->status);
            }

            // Verificar email único
            if (User::where('email', $email)->exists()) {
                $response->status = 400;
                $response->message = 'El correo ya está registrado.';
                return response($response->toArray(), $response->status);
            }

            // Crear usuario
            $user = User::create([
                'name' => $name,
                'lastname' => $lastname,
                'email' => $email,
                'password' => bcrypt($password),
                'email_verified_at' => null, // Se verificará por correo
            ]);

            // Generar URL de verificación firmada
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $user->id, 'hash' => sha1($user->email)]
            );

            // Enviar correo de bienvenida con link de verificación
            try {
                if ($request->invitation_token || $request->invitation_type) {
                    // Si es una invitación, usamos Notification::route
                    Log::info('Sending invitation email (Route Notification)...', ['email' => $email]);
                    \Illuminate\Support\Facades\Notification::route('mail', $email)
                        ->notify(new VerifyAccountNotification($verificationUrl, $name, $lastname));
                } else {
                    // Flujo normal para customers
                    Log::info('Sending standard customer email (User Notification)...', ['user_id' => $user->id]);
                    $notificationService = new EmailNotificationService();
                    $notificationService->sendToUser($user, new VerifyAccountNotification($verificationUrl));
                }
                Log::info('Welcome email sent successfully.');
            } catch (\Throwable $th) {
                // Silently fail email sending but LOG IT
                Log::error('Welcome email failed: ' . $th->getMessage());
            }

            // Asignar rol por defecto Customer si no es invitación
            if (!$request->invitation_type) {
                $role = Role::firstOrCreate(['name' => 'Customer']);
                $user->assignRole($role);
            }

            // Validar si es una invitación de proveedor (Lógica posterior al registro base)
            try {
                if ($request->invitation_token && $request->invitation_type === 'seller') {
                    $invitation = \App\Models\SellerInvitation::where('token', $request->invitation_token)
                        ->where('email', $email)
                        ->where('status', 'pending')
                        ->first();

                    if ($invitation) {
                        $invitation->status = 'accepted';
                        $invitation->save();

                        // Cambiar rol a Seller
                        $user->syncRoles(['Seller']);

                        // Guardar referido: leer de la cookie, del request ref, o de la job_application
                        $referralCode = $request->cookie('referral_code');
                        if (!$referralCode) {
                            // Por si viene como parámetro en la URL de invitación (&ref=xxx)
                            $referralCode = $request->input('ref');
                        }

                        if ($referralCode) {
                            $referrer = \App\Models\User::where('uuid', $referralCode)->first();
                            if ($referrer) {
                                $user->referred_by = $referrer->id;
                                $user->save();
                                Log::info('Seller referred_by set during signup', [
                                    'user_id' => $user->id,
                                    'referred_by' => $referrer->id,
                                    'referral_code' => $referralCode
                                ]);
                            }
                        }

                        // Si no se encontró por cookie/ref, intentar desde la job_application
                        if (!$user->referred_by && $invitation->job_application_id) {
                            $jobApp = \App\Models\JobApplication::find($invitation->job_application_id);
                            if ($jobApp && $jobApp->referred_by_uuid) {
                                $referrer = \App\Models\User::where('uuid', $jobApp->referred_by_uuid)->first();
                                if ($referrer) {
                                    $user->referred_by = $referrer->id;
                                    $user->save();
                                    Log::info('Seller referred_by set from job_application', [
                                        'user_id' => $user->id,
                                        'referred_by' => $referrer->id
                                    ]);
                                }
                            }
                        }
                    }
                } elseif ($request->invitation_token && $request->invitation_type === 'provider') {
                    $invitation = \App\Models\ProviderInvitation::where('token', $request->invitation_token)
                        ->where('email', $email)
                        ->where('status', 'pending')
                        ->first();

                    if ($invitation) {
                        $invitation->status = 'accepted';
                        $invitation->save();

                        // Cambiar rol a Provider
                        $user->syncRoles(['Provider']);

                        // Enviar correo de bienvenida al proveedor
                        try {
                            $notificationService = new EmailNotificationService();
                            $notificationService->sendToUser($user, new \App\Notifications\WelcomeProviderNotification($name, $email, $password));
                        } catch (\Throwable $th) {
                            Log::error('WelcomeProviderNotification failed: ' . $th->getMessage());
                        }
                    }
                }
            } catch (\Throwable $th) {
                // Ignorar error de invitación pero loggear
                Log::error('Error during seller invitation processing: ' . $th->getMessage());
            }

            // Iniciar sesión (opcional)
            Auth::login($user);
            Log::info('User logged in. Signup process completed successfully.');

            $response->status = 200;
            $response->message = 'Usuario registrado exitosamente.';
            $response->data = ['user' => $user];
        } catch (\Throwable $th) {
            $response->status = 500;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $response = new Response();
        try {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $response->status = 200;
            $response->message = 'Cierre de sesion exitoso';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function forgotPassword(Request $request): HttpResponse | ResponseFactory
    {
        $response = new Response();
        try {
            // Validar el correo electrónico
            $request->validate([
                'email' => 'required',
            ]);

            $email = Controller::decode($request->email);

            if (!$this->validarEmail($email)) {
                $response->status = 400;
                $response->message = 'Operación Incorrecta. Por favor, ingresa un correo electrónico válido.';
                return response($response->toArray(), $response->status);
            }

            // Buscar al usuario por correo electrónico
            $user = User::where('email', $email)->first();

            if (!$user) {
                // En lugar de devolver error, devolvemos éxito pero con información específica
                $response->status = 200;
                $response->message = 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.';
                $response->data = [
                    'user_exists' => false,
                    'email' => $email
                ];
                return response($response->toArray(), $response->status);
            }

            // Si el usuario existe, proceder con el envío del correo
            $token = Password::createToken($user);
            $resetUrl = env('APP_URL') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

            // Renderizar la plantilla Blade
            $content = View::make('emails.reset_password', ['RESET_URL' => $resetUrl])->render();

            // Enviar notificación con el link de restablecimiento de contraseña
            $notificationService = new EmailNotificationService();
            $notificationService->sendToUser($user, new \App\Notifications\PasswordResetLinkNotification($resetUrl));

            // Respuesta exitosa
            $response->status = 200;
            $response->message = 'Se ha enviado un enlace para restablecer tu contraseña.';
            $response->data = [
                'user_exists' => true,
                'email' => $email
            ];
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function resetPassword(Request $request): HttpResponse | ResponseFactory
    {
        $response = new Response();
        //dump($request->all());
        try {
            // Validar los datos de entrada
            $request->validate([
                'email' => 'required|string',
                'token' => 'required|string',
                'password' => 'required|string',
                'confirmation' => 'required|string',
            ]);
            // Verificar que las contraseñas coincidan
            if (Controller::decode($request->password) !== Controller::decode($request->confirmation)) {
                $response->status = 400;
                $response->message = 'Operación Incorrecta. Por favor, las contraseñas deben ser iguales';
            }
            // Restablecer la contraseña usando Laravel Password Broker
            $status = Password::reset(
                [
                    'email' => Controller::decode($request->email),
                    'password' => Controller::decode($request->password),
                    'password_confirmation' => Controller::decode($request->password_confirmation),
                    'token' => $request->token,
                ],
                function ($user, $password) {

                    $user->forceFill([
                        'password' => bcrypt($password),
                        'remember_token' => null,
                    ])->save();
                }
            );
            //dump($status);

            if ($status === Password::PASSWORD_RESET) {
                // Enviar notificación de contraseña restablecida
                $user = User::where('email', Controller::decode($request->email))->first();
                if ($user) {
                    $notificationService = new EmailNotificationService();
                    $notificationService->sendToUser($user, new PasswordChangedNotification());
                }
                $response->status = 200;
                $response->message = 'Contraseña restablecida correctamente.';
            } else {
                throw new Exception('Error al restablecer la contraseña.');
            }
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
