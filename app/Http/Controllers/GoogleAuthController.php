<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\General;
use App\Services\EmailNotificationService;
use App\Notifications\VerifyAccountNotification;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use SoDe\Extend\Response;
use Spatie\Permission\Models\Role;

class GoogleAuthController extends Controller
{
    /**
     * Get Google OAuth credentials from database
     */
    private function getGoogleCredentials()
    {
        $clientId = General::where('correlative', 'google_client_id')->first();
        $clientSecret = General::where('correlative', 'google_client_secret')->first();
        $enabled = General::where('correlative', 'google_oauth_enabled')->first();
        
        return [
            'client_id' => $clientId ? $clientId->description : env('GOOGLE_CLIENT_ID'),
            'client_secret' => $clientSecret ? $clientSecret->description : env('GOOGLE_CLIENT_SECRET'),
            'enabled' => $enabled ? ($enabled->description === 'true') : false,
        ];
    }

    /**
     * Redirect to Google OAuth provider
     */
    public function redirectToGoogle()
    {
        $credentials = $this->getGoogleCredentials();
        
        if (!$credentials['enabled'] || !$credentials['client_id'] || !$credentials['client_secret']) {
            return redirect('/login?message=' . urlencode('Google OAuth no está configurado correctamente') . '&type=error');
        }

        return Socialite::driver('google')
            ->setClientId($credentials['client_id'])
            ->setClientSecret($credentials['client_secret'])
            ->setRedirectUrl(env('APP_URL') . '/auth/google/callback')
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $credentials = $this->getGoogleCredentials();
            
            if (!$credentials['enabled'] || !$credentials['client_id'] || !$credentials['client_secret']) {
                return redirect('/login?message=' . urlencode('Google OAuth no está configurado correctamente') . '&type=error');
            }

            // Get user from Google
            $googleUser = Socialite::driver('google')
                ->setClientId($credentials['client_id'])
                ->setClientSecret($credentials['client_secret'])
                ->setRedirectUrl(env('APP_URL') . '/auth/google/callback')
                ->user();
            
            // Check if user already exists with this email
            $existingUser = User::where('email', $googleUser->getEmail())->first();
            
            if ($existingUser) {
                // If user exists, check if Google ID is already linked
                if (!$existingUser->google_id) {
                    // Link Google account to existing user
                    $existingUser->google_id = $googleUser->getId();
                    $existingUser->save();
                }
                
                // Log in the user
                Auth::login($existingUser);
                
                return redirect('/?message=' . urlencode('Inicio de sesión exitoso con Google') . '&type=success');
            } else {
                // Create new user
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(),
                    'password' => bcrypt(str()->random(16)), // Random password since they'll use Google
                ]);
                
                // Assign Customer role
                $role = Role::firstOrCreate(['name' => 'Customer']);
                $newUser->assignRole($role);
                
                // Send welcome email
                try {
                    $notificationService = new EmailNotificationService();
                    $notificationService->sendToUser($newUser, new VerifyAccountNotification(url('/')));
                } catch (Exception $e) {
                    // Email failed but continue with login
                }
                
                // Log in the user
                Auth::login($newUser);
                
                return redirect('/?message=' . urlencode('Cuenta creada e inicio de sesión exitoso con Google') . '&type=success');
            }
        } catch (Exception $e) {
            return redirect('/login?message=' . urlencode('Error al autenticar con Google: ' . $e->getMessage()) . '&type=error');
        }
    }

    /**
     * API endpoint for Google login (for SPA/AJAX calls)
     */
    public function loginWithGoogle(Request $request): HttpResponse | ResponseFactory
    {
        $response = new Response();
        
        try {
            $credentials = $this->getGoogleCredentials();
            
            if (!$credentials['enabled']) {
                throw new Exception('Google OAuth está deshabilitado');
            }
            
            if (!$credentials['client_id']) {
                throw new Exception('Google Client ID no configurado');
            }

            $request->validate([
                'credential' => 'required|string',
            ]);
            
            // Verify Google ID token
            $googleUser = $this->verifyGoogleToken($request->credential, $credentials['client_id']);
            
            if (!$googleUser) {
                throw new Exception('Token de Google inválido');
            }
            
            // Check if user already exists with this email
            $existingUser = User::where('email', $googleUser['email'])->first();
            
            if ($existingUser) {
                // If user exists, check if Google ID is already linked
                if (!$existingUser->google_id) {
                    // Link Google account to existing user
                    $existingUser->google_id = $googleUser['sub'];
                    $existingUser->save();
                }
                
                // Log in the user
                Auth::login($existingUser);
                
                $response->status = 200;
                $response->message = 'Inicio de sesión exitoso con Google';
                $response->data = [
                    'user' => $existingUser
                ];
            } else {
                // Create new user
                $newUser = User::create([
                    'name' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'google_id' => $googleUser['sub'],
                    'email_verified_at' => now(),
                    'password' => bcrypt(str()->random(16)), // Random password since they'll use Google
                ]);
                
                // Assign Customer role
                $role = Role::firstOrCreate(['name' => 'Customer']);
                $newUser->assignRole($role);
                
                // Send welcome email
                try {
                    $notificationService = new EmailNotificationService();
                    $notificationService->sendToUser($newUser, new VerifyAccountNotification(url('/')));
                } catch (Exception $e) {
                    // Email failed but continue with login
                }
                
                // Log in the user
                Auth::login($newUser);
                
                $response->status = 200;
                $response->message = 'Cuenta creada e inicio de sesión exitoso con Google';
                $response->data = [
                    'user' => $newUser
                ];
            }
        } catch (Exception $e) {
            $response->status = 400;
            $response->message = 'Error al autenticar con Google: ' . $e->getMessage();
        }
        
        return response($response->toArray(), $response->status);
    }

    /**
     * Verify Google ID token
     */
    private function verifyGoogleToken($idToken, $clientId)
    {
        try {
            $client = new \Google_Client(['client_id' => $clientId]);
            $payload = $client->verifyIdToken($idToken);
            
            if ($payload) {
                return $payload;
            }
            
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
}
