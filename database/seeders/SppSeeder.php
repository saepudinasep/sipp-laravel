<?php

namespace Database\Seeders;

use App\Models\Spp;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($bulan = 1; $bulan <= 12; $bulan++) {

            Spp::create([
                'jenis' => 'SPP Reguler',
                'nominal' => 250000,
                'bulan' => $bulan,
                'tahun_ajaran' => '2026/2027',
            ]);
        }
    }
}
