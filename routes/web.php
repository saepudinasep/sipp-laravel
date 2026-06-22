<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\TransaksiController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('guest.redirect')->name('welcome');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))
            ->name('dashboard');

        Route::resource('siswa', SiswaController::class)
            ->except(['show']);

        Route::get('/petugas', fn() => Inertia::render('Admin/Petugas/Index'))
            ->name('petugas.index');

        Route::get('/kelas', fn() => Inertia::render('Admin/Kelas/Index'))
            ->name('kelas.index');

        Route::get('/spp', fn() => Inertia::render('Admin/SPP/Index'))
            ->name('spp.index');

        // Catatan: Admin TIDAK memiliki halaman Entri Pembayaran.
        // Tabel `transaksis` mewajibkan `petugas_id` (FK ke tabel `petugas`),
        // dan Admin tidak punya baris di tabel tersebut — sehingga entri
        // pembayaran hanya tersedia untuk role Petugas. Admin tetap bisa
        // memantau semua transaksi lewat Histori Pembayaran di bawah.

        Route::get('/histori', [TransaksiController::class, 'histori'])
            ->name('histori.index');

        Route::get('/laporan', fn() => Inertia::render('Admin/Laporan/Index'))
            ->name('laporan.index');
    });

/*
|--------------------------------------------------------------------------
| PETUGAS
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:petugas'])
    ->prefix('petugas')
    ->name('petugas.')
    ->group(function () {

        Route::get('/dashboard', fn() => Inertia::render('Petugas/Dashboard'))
            ->name('dashboard');

        Route::get('/transaksi', [TransaksiController::class, 'index'])
            ->name('transaksi.index');

        Route::post('/transaksi', [TransaksiController::class, 'store'])
            ->name('transaksi.store');

        Route::get('/transaksi/cari-siswa', [TransaksiController::class, 'searchSiswa'])
            ->name('transaksi.cari-siswa');

        Route::get('/histori', [TransaksiController::class, 'histori'])
            ->name('histori.index');
    });

/*
|--------------------------------------------------------------------------
| SISWA
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {

        Route::get('/dashboard', fn() => Inertia::render('Siswa/Dashboard'))
            ->name('dashboard');

        Route::get('/histori', [TransaksiController::class, 'histori'])
            ->name('histori.index');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin,petugas'])
    ->resource('siswa', SiswaController::class);

require __DIR__ . '/auth.php';
