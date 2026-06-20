<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spp extends Model
{
    protected $table = 'spps';

    protected $fillable = [
        'jenis',
        'nominal',
        'bulan',
        'tahun_ajaran',
    ];

    public function transaksi()
    {
        return $this->hasMany(Transaksi::class);
    }
}
