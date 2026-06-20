<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'email' => 'admin@spp.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'email' => 'petugas@spp.com',
            'password' => bcrypt('password'),
            'role' => 'petugas',
            'is_active' => true,
        ]);

        User::create([
            'email' => 'siswa@spp.com',
            'password' => bcrypt('password'),
            'role' => 'siswa',
            'is_active' => true,
        ]);
    }
}
