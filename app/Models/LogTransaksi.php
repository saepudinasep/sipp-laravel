<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogTransaksi extends Model
{
    protected $table = 'log_transaksis';

    public $timestamps = false;

    protected $fillable = [
        'transaksi_id',
        'aksi',
        'keterangan',
        'waktu',
    ];

    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class);
    }
}
