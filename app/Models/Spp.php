<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Spp extends Model
{
    use SoftDeletes;

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
