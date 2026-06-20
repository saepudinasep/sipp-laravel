<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $table = 'kelas';

    protected $fillable = [
        'nama_kelas',
        'tingkat',
        'jurusan'
    ];

    public function siswa()
    {
        return $this->hasMany(Siswa::class);
    }
}
