<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\General;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class ComplaintController extends BasicController
{
    public $model = Complaint::class;
    public $reactView = 'Complaint';
    public $reactRootView = 'public';
    private function verifyRecaptcha($recaptchaToken)
    {
        $secretKey = env('RECAPTCHA_SECRET_KEY');
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}");
        $result = json_decode($response);

        return $result->success;
    }



    public function saveComplaint(Request $request)
    {
        //  dump($request->all());
        try {

            $request->validate([
                'nombre' => 'required|string|max:255',
                'tipo_documento' => 'required|string|in:ruc,dni,ce,pasaporte',
                'numero_identidad' => 'required|string|max:20',
                'celular' => 'nullable|string|max:20',
                'correo_electronico' => 'required|email|max:255',
                'departamento' => 'required|string|max:100',
                'provincia' => 'required|string|max:100',
                'distrito' => 'required|string|max:100',
                'direccion' => 'required|string|max:255',
                'tipo_producto' => 'required|string|in:producto,servicio',
                'monto_reclamado' => 'nullable|numeric',
                'descripcion_producto' => 'required|string',
                'tipo_reclamo' => 'required|string|in:reclamo,queja',
                'fecha_ocurrencia' => 'nullable|date',
                'numero_pedido' => 'nullable|string|max:50',
                'detalle_reclamo' => 'required|string',
                'acepta_terminos' => 'required|boolean',
                'recaptcha_token' => 'required|string',
            ]);

            if ($request->acepta_terminos != true) {
                return response()->json([
                    'type' => 'error',
                    'message' => 'Por favor aceptar los términos y condiciones'
                ], 400);
            }
            // Verificar reCAPTCHA
            if (!$this->verifyRecaptcha($request->recaptcha_token)) {
                return response()->json([
                    'type' => 'error',
                    'message' => 'reCAPTCHA no válido'
                ], 400);
            }

            // Guardar en la base de datos
            $complaint = Complaint::create([
                'nombre' => $request->nombre,
                'tipo_documento' => $request->tipo_documento,
                'numero_identidad' => $request->numero_identidad,
                'celular' => $request->celular,
                'correo_electronico' => $request->correo_electronico,
                'departamento' => $request->departamento,
                'provincia' => $request->provincia,
                'distrito' => $request->distrito,
                'direccion' => $request->direccion,
                'tipo_producto' => $request->tipo_producto,
                'monto_reclamado' => $request->monto_reclamado,
                'descripcion_producto' => $request->descripcion_producto,
                'tipo_reclamo' => $request->tipo_reclamo,
                'fecha_ocurrencia' => $request->fecha_ocurrencia,
                'numero_pedido' => $request->numero_pedido,
                'detalle_reclamo' => $request->detalle_reclamo,
                'acepta_terminos' => $request->acepta_terminos,
                'recaptcha_token' => $request->recaptcha_token,
            ]);

            // Notificar al cliente con respaldo del reclamo
            $complaint->notify(new \App\Notifications\ClaimNotification($complaint));
            //dump(DB::getQueryLog());
            // dump($complaint);

            return response()->json([
                'type' => 'success',
                'message' => 'Reclamo registrado con éxito',
                'data' => $complaint
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'type' => 'error',
                'message' => 'Error al registrar el reclamo' . $e->getMessage(),
            ], 500);
        }
    }
}
 /* public function saveComplaint(Request $request)
    {
        //dump($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'dni' => 'nullable|string|max:20',
            'type' => 'required|in:queja,sugerencia,reclamo técnico',
            'incident_date' => 'nullable|date',
            'order_number' => 'nullable|string|max:50',
            'priority' => 'required|in:baja,media,alta',
            'description' => 'required|string',
            'files.*' => 'nullable|file',
        ]);

        $filePaths = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $full = $file;
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/complaint/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $filePaths[] = "{$uuid}.{$ext}";
            }
        }
        //dump($filePaths);
        $complaint = Complaint::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'dni' => $request->dni,
            'type' => $request->type,
            'incident_date' => $request->incident_date,
            'order_number' => $request->order_number,
            'priority' => $request->priority,
            'description' => $request->description,
            'file_paths' => $filePaths,
        ]);
        //dump(DB::getQueryLog());

        //dump($complaint);

        return response()->json(['message' => 'Reclamo registrado con éxito', 'data' => $complaint], 201);
    }*/