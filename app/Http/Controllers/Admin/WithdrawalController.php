<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class WithdrawalController extends BasicController
{
    public $model = Withdrawal::class;
    public $reactView = 'Admin/Withdrawals';
    public $skipStatusFilter = true;

    private $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Vista de la Billetera para el Vendedor
     */
    public function wallet(Request $request)
    {
        if (Auth::user()->hasRole('Provider')) {
            $this->reactView = 'Provider/Wallet';
        } else {
            $this->reactView = 'Seller/Wallet';
        }
        return $this->reactView($request);
    }

    /**
     * Sobreescribir props para la vista de React
     */
    public function setReactViewProperties(Request $request)
    {
        $user = Auth::user();

        if (str_starts_with($this->reactView, 'Seller/') || str_starts_with($this->reactView, 'Provider/')) {
            return [
                'wallet' => [
                    'available' => $this->walletService->getAvailableBalance($user),
                    'pending' => $this->walletService->getPendingBalance($user),
                    'total_earned' => $this->walletService->getTotalEarned($user),
                ],
                'history' => $this->walletService->getTransactionHistory($user),
                'user_financial_details' => [
                    'bank_name' => $user->bank_name,
                    'account_number' => $user->account_number,
                    'cci_number' => $user->cci_number,
                    'yape_plin_number' => $user->yape_plin_number,
                ]
            ];
        }

        return [];
    }

    /**
     * Guardar solicitud de retiro (Vendedor)
     */
    public function storeRequest(Request $request)
    {
        $user = Auth::user();
        $amount = $request->input('amount');
        \Illuminate\Support\Facades\Log::info('Withdrawal Request:', $request->all());

        // Validar saldo disponible
        $available = $this->walletService->getAvailableBalance($user);
        if ($amount > $available) {
            return response()->json(['message' => 'Saldo insuficiente'], 400);
        }

        if ($amount < 50) {
            return response()->json(['message' => 'El monto mínimo de retiro es S/ 50'], 400);
        }

        $withdrawal = Withdrawal::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'method' => $request->input('method'),
            'details' => $request->input('details'), // JSON con datos del banco/yape en el momento del pedido
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Solicitud de retiro enviada correctamente',
            'data' => $withdrawal
        ]);
    }

    /**
     * Procesar retiro (Admin)
     */
    public function process(Request $request, $id)
    {
        $withdrawal = Withdrawal::findOrFail($id);
        $status = $request->input('status'); // approved, rejected, completed

        $withdrawal->status = $status;
        $withdrawal->notes = $request->input('notes');

        if ($status === 'completed') {
            $withdrawal->processed_at = Carbon::now();
            // Aquí se guardaría el receipt_path si se subió un archivo
            if ($request->hasFile('receipt')) {
                $full = $request->file('receipt');
                $uuid = \SoDe\Extend\Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/withdrawal/{$uuid}.{$ext}";
                \Illuminate\Support\Facades\Storage::put($path, file_get_contents($full));
                $withdrawal->receipt_path = "{$uuid}.{$ext}";
            }
        }

        $withdrawal->save();

        return response()->json([
            'status' => 200,
            'message' => 'Retiro actualizado correctamente'
        ]);
    }
}
