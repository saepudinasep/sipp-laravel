<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $table = 'transaksis';

    protected $fillable = [
        'siswa_id',
        'spp_id',
        'petugas_id',
        'tgl_bayar',
        'nominal',
        'keterangan',
    ];

    protected $casts = [
        'tgl_bayar' => 'date',
        'nominal' => 'decimal:2',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function petugas()
    {
        return $this->belongsTo(Petugas::class);
    }

    public function spp()
    {
        return $this->belongsTo(Spp::class);
    }
}
