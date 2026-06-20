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
        Schema::create('spps', function (Blueprint $table) {
            $table->id();
            $table->string('jenis', 50);

            $table->decimal('nominal', 12, 2);

            $table->tinyInteger('bulan');

            $table->string('tahun_ajaran', 10);

            $table->timestamps();
            $table->softDeletes(); // <-- tambahkan ini

            $table->unique([
                'jenis',
                'bulan',
                'tahun_ajaran'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spps');
    }
};
