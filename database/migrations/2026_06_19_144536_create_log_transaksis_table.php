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
        Schema::create('log_transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaksi_id')
                ->constrained('transaksis')
                ->cascadeOnDelete();

            $table->string('aksi', 20);

            $table->string('keterangan')
                ->nullable();

            $table->timestamp('waktu')
                ->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_transaksis');
    }
};
