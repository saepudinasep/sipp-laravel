<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')
                ->constrained('siswas')
                ->cascadeOnUpdate();

            $table->foreignId('spp_id')
                ->constrained('spps')
                ->cascadeOnUpdate();

            $table->foreignId('petugas_id')
                ->constrained('petugas')
                ->cascadeOnUpdate();

            $table->date('tgl_bayar');

            $table->decimal('nominal', 12, 2);

            $table->string('keterangan')
                ->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
