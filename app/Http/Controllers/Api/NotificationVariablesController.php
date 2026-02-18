<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationVariablesController extends Controller
{
    public function getVariables($type)
    {
        \Illuminate\Support\Facades\Log::info("NotificationVariablesController: Fetching variables for type: {$type}");
        $variables = [];
        $notificationClass = null;

        $mapping = [
            'purchase_summary' => \App\Notifications\PurchaseSummaryNotification::class,
            'order_status_changed' => \App\Notifications\OrderStatusChangedNotification::class,
            'blog_published' => \App\Notifications\BlogPublishedNotification::class,
            'claim' => \App\Notifications\ClaimNotification::class,
            'whistleblowing' => \App\Notifications\WhistleblowingNotification::class,
            'password_changed' => \App\Notifications\PasswordChangedNotification::class,
            'password_reset' => \App\Notifications\PasswordResetLinkNotification::class,
            'subscription' => \App\Notifications\SubscriptionNotification::class,
            'verify_account' => \App\Notifications\VerifyAccountNotification::class,
            'message_contact' => \App\Notifications\MessageContactNotification::class,
            'admin_purchase' => \App\Notifications\AdminPurchaseNotification::class,
            'admin_contact' => \App\Notifications\AdminContactNotification::class,
            'admin_claim' => \App\Notifications\AdminClaimNotification::class,
            'admin_whistleblowing' => \App\Notifications\AdminWhistleblowingNotification::class,
            'job_application' => \App\Notifications\JobApplicationNotification::class,
            'admin_job_application' => \App\Notifications\AdminJobApplicationNotification::class,
            'invite_provider' => \App\Notifications\InviteProviderNotification::class,
        ];

        if (array_key_exists($type, $mapping)) {
            $notificationClass = $mapping[$type];
        }

        if ($notificationClass && class_exists($notificationClass)) {
            if (method_exists($notificationClass, 'availableVariables')) {
                $variables = $notificationClass::availableVariables();
                \Illuminate\Support\Facades\Log::info("NotificationVariablesController: Found " . count($variables) . " variables for class {$notificationClass}");
            } else {
                \Illuminate\Support\Facades\Log::warning("NotificationVariablesController: Method availableVariables not found in class {$notificationClass}");
            }
        } else {
            \Illuminate\Support\Facades\Log::warning("NotificationVariablesController: Class not found or not mapped for type {$type} (Class: " . ($notificationClass ?? 'null') . ")");
            // Fallback for types not mapped or classes without the method (backward compatibility)
            switch ($type) {
                case 'purchase_summary':
                    $variables = [
                        'user_name' => 'Nombre del usuario',
                        'order_id' => 'ID del pedido',
                        'order_total' => 'Total del pedido',
                        // ... legacy fallback if needed
                    ];
                    break;
                    // ... add other fallbacks if strictly necessary, but preferably rely on the classes
            }
        }

        return response()->json([
            'type' => $type,
            'variables' => $variables
        ]);
    }
}
