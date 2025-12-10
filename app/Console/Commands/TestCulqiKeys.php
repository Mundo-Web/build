<?php

namespace App\Console\Commands;

use App\Helpers\CulqiConfig;
use App\Models\General;
use Illuminate\Console\Command;

class TestCulqiKeys extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:culqi-keys';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Culqi RSA keys configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Testing Culqi Configuration ===');
        
        // Test Public Key
        $publicKey = CulqiConfig::getPublicKey();
        $this->info('Public Key: ' . $publicKey);
        $this->info('Public Key starts with pk_: ' . (str_starts_with($publicKey ?? '', 'pk_') ? 'YES' : 'NO'));
        
        // Test RSA ID
        $rsaId = CulqiConfig::getRsaId();
        $this->info('RSA ID: ' . $rsaId);
        $this->info('RSA ID length: ' . strlen($rsaId ?? ''));
        
        // Test RSA Public Key
        $rsaPublicKey = CulqiConfig::getRsaPublicKey();
        $this->info('RSA Public Key length: ' . strlen($rsaPublicKey ?? ''));
        $this->info('RSA Public Key has newlines: ' . (strpos($rsaPublicKey ?? '', "\n") !== false ? 'YES' : 'NO'));
        $this->info('RSA Public Key has BEGIN marker: ' . (strpos($rsaPublicKey ?? '', '-----BEGIN PUBLIC KEY-----') !== false ? 'YES' : 'NO'));
        $this->info('RSA Public Key has END marker: ' . (strpos($rsaPublicKey ?? '', '-----END PUBLIC KEY-----') !== false ? 'YES' : 'NO'));
        
        // Show the full RSA key
        $this->info('');
        $this->info('=== Full RSA Public Key ===');
        $this->line($rsaPublicKey);
        
        // Check from database directly
        $this->info('');
        $this->info('=== Direct Database Check ===');
        $rsaKeyFromDb = General::where('correlative', 'checkout_culqi_rsa_public_key')->first();
        if ($rsaKeyFromDb) {
            $this->info('Found in DB: YES');
            $this->info('DB value length: ' . strlen($rsaKeyFromDb->description ?? ''));
            $this->info('DB value (first 100 chars): ' . substr($rsaKeyFromDb->description ?? '', 0, 100));
        } else {
            $this->error('RSA Key NOT found in database!');
        }
        
        return 0;
    }
}
