<?php

namespace App\Http\Controllers;

use App\Http\Classes\EmailConfig;
use App\Services\EmailNotificationService;
use App\Notifications\VerifyAccountNotification;
use App\Notifications\PasswordChangedNotification;
use App\Notifications\SubscriptionNotification;
use App\Notifications\BlogPublishedNotification;
use App\Notifications\OrderStatusChangedNotification;
use App\Notifications\ClaimNotification;
use App\Http\Services\ReCaptchaService;
use App\Models\Constant;
use App\Models\ModelHasRoles;
use App\Models\User;
use App\Models\Person;
use App\Models\PreUser;
use App\Models\SpecialtiesByUser;
use App\Models\Specialty;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use SoDe\Extend\Trace;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{

  public function loginView(Request $request, string $confirmation = null)
  {
    if (Auth::check()) {
      $sessionJpa = User::find(Auth::id());
      switch ($sessionJpa->getRole()) {
        case 'Admin':
          return redirect('/admin/home');
          break;
        case 'Root':
          return redirect('/admin/home');
          break;
        default:
          Auth::guard('web')->logout();
          $request->session()->invalidate();
          $request->session()->regenerateToken();
          return redirect('/login');
          break;
      }
    };


    if ($confirmation) {
      $userJpa = new User();
      try {
        //code...
        $preUserJpa = PreUser::select()
          ->where('confirmation_token', $confirmation)
          ->first();
        if (!$preUserJpa) return redirect('/login');

        $roleJpa = Role::where('relative_id', $preUserJpa->role)->first();

        $userJpa = User::create([
          'uuid' => Crypto::randomUUID(),
          'name' => $preUserJpa->name,
          'lastname' => $preUserJpa->lastname,
          'email' => $preUserJpa->email,
          'email_verified_at' => Trace::getDate('mysql'),
          'password' => $preUserJpa->password,
          'birthdate' => $preUserJpa->birthdate,
          'status' => false
        ])->assignRole($roleJpa->name);

        $specialties = JSON::parse($preUserJpa->specialties);
        foreach ($specialties as $specialty) {
          SpecialtiesByUser::create([
            'user_id' => $userJpa->id,
            'specialty_id' => $specialty
          ]);
        }

        $message = 'La confirmacion se ha realizado con exito';

        $preUserJpa->delete();
        return redirect('/login?message=' . $message);
      } catch (\Throwable $th) {
        $userJpa->delete();
        // dump($th);
        // return redirect('/login');
      }
    }

    $message = $request->query('message');

    // Get Google OAuth configuration from database
    $googleClientId = \App\Models\General::where('correlative', 'google_client_id')->first();
    $googleOauthEnabled = \App\Models\General::where('correlative', 'google_oauth_enabled')->first();

    // Get Culqi configuration from database
    $culqiPublicKey = \App\Models\General::where('correlative', 'checkout_culqi_public_key')->first();
    $culqiEnabled = \App\Models\General::where('correlative', 'checkout_culqi')->first();
    $culqiName = \App\Models\General::where('correlative', 'checkout_culqi_name')->first();

    return Inertia::render('Login', [
      'message' => $message ?? null,
      'global' => [
        'PUBLIC_RSA_KEY' => Controller::$PUBLIC_RSA_KEY,
        'APP_NAME' => env('APP_NAME'),
        'APP_URL' => env('APP_URL'),
        'APP_DOMAIN' => env('APP_DOMAIN'),
        'APP_PROTOCOL' => env('APP_PROTOCOL', 'https'),
        'GOOGLE_CLIENT_ID' => $googleClientId ? $googleClientId->description : env('GOOGLE_CLIENT_ID'),
        'GOOGLE_OAUTH_ENABLED' => $googleOauthEnabled ? ($googleOauthEnabled->description === 'true') : false,
        'CULQI_PUBLIC_KEY' => $culqiPublicKey ? $culqiPublicKey->description : env('CULQI_PUBLIC_KEY'),
        'CULQI_ENABLED' => $culqiEnabled ? ($culqiEnabled->description === 'true') : false,
        'CULQI_NAME' => $culqiName ? $culqiName->description : 'Culqi',
      ],
    ])->rootView('auth');
  }

  public function registerView()
  {
    if (Auth::check()) return redirect('/home');

    $roles = Role::where('public', true)->get();
    $specialties = Specialty::all();

    return Inertia::render('Register', [
      'roles' => $roles,
      'APP_PROTOCOL' => env('APP_PROTOCOL', 'https'),
      'PUBLIC_RSA_KEY' => Controller::$PUBLIC_RSA_KEY,
      'RECAPTCHA_SITE_KEY' => env('RECAPTCHA_SITE_KEY'),
      'terms' => Constant::value('terms'),
      'specialties' => $specialties
    ])->rootView('auth');
  }

  public function confirmEmailView(Request $request, string $token)
  {
    if (Auth::check()) return redirect('/home');

    $preUserJpa = PreUser::where('token', $token)->first();
    if (!$preUserJpa) return redirect('/login');

    return Inertia::render('ConfirmEmail', [
      'email' => $preUserJpa->email
    ])->rootView('auth');
  }

  /**
   * Handle an incoming authentication request.
   */
  public function login(Request $request): HttpResponse | ResponseFactory | RedirectResponse
  {
    $response = Response::simpleTryCatch(function (Response $response) use ($request) {
      $email = $request->email;
      $password = $request->password;

      if (!Auth::attempt([
        'email' => Controller::decode($email),
        'password' => Controller::decode($password)
      ])) {
        throw new Exception('Credenciales invalidas');
      }

      $request->session()->regenerate();
    });
    return response($response->toArray(), $response->status);
  }

  public function signup(Request $request): HttpResponse | ResponseFactory | RedirectResponse
  {
    $response = new Response();
    try {
      $request->validate([
        'name' => 'required|string|max:255',
        'lastname' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string',
        'confirmation' => 'required|string',
        'captcha' => 'required|string',
        'terms' => 'required|accepted',
        'specialties' => 'required|array'
      ]);

      $body = $request->all();

      if (!isset($request->password) || !isset($request->confirmation)) throw new Exception('Debes ingresar una contraseña para el nuevo usuario');
      if (Controller::decode($request->password) != Controller::decode($request->confirmation)) throw new Exception('Las contraseñas deben ser iguales');

      if (!ReCaptchaService::verify($request->captcha)) throw new Exception('Captcha invalido. Seguro que no eres un robot?');

      $roleExists = Role::where('relative_id', $body['role'])->exists();

      if (!$roleExists) throw new Exception('El rol que ingresaste no existe, que intentas hacer?');

      $preUserJpa = PreUser::updateOrCreate([
        'email' => $body['email']
      ], [
        'name' => $body['name'],
        'lastname' => $body['lastname'],
        'email' => $body['email'],
        'role' => $body['role'],
        'password' => Controller::decode($body['password']),
        'confirmation_token' => Crypto::randomUUID(),
        'token' => Crypto::randomUUID(),
        'specialties' => JSON::stringify($body['specialties'])
      ]);


      // Enviar correo de verificación usando notificación
      $verificationUrl = env('APP_URL') . '/confirmation/' . $preUserJpa->confirmation_token;
      $userFake = new User([
        'name' => $preUserJpa->name,
        'email' => $preUserJpa->email
      ]);
      $notificationService = new EmailNotificationService();
      $notificationService->sendToUser($userFake, new VerifyAccountNotification($verificationUrl));

      $response->status = 200;
      $response->message = 'Operacion correcta';
      $response->data = $preUserJpa->token;
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
}
