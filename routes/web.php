<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PetugasController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\SppController;
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

        Route::get('/dashboard', [DashboardController::class, 'admin'])
            ->name('dashboard');

        Route::resource('siswa', SiswaController::class)
            ->except(['show']);

        Route::get('/siswa-export', [SiswaController::class, 'export'])
            ->name('siswa.export');

        Route::get('/siswa-template', [SiswaController::class, 'downloadTemplate'])
            ->name('siswa.template');

        Route::post('/siswa-import', [SiswaController::class, 'import'])
            ->name('siswa.import');

        Route::resource('petugas', PetugasController::class)
            ->parameters(['petugas' => 'petugas'])
            ->except(['show']);

        Route::get('/petugas-export', [PetugasController::class, 'export'])
            ->name('petugas.export');

        Route::get('/petugas-template', [PetugasController::class, 'downloadTemplate'])
            ->name('petugas.template');

        Route::post('/petugas-import', [PetugasController::class, 'import'])
            ->name('petugas.import');

        Route::resource('kelas', KelasController::class)
            ->parameters(['kelas' => 'kelas'])
            ->except(['show']);

        Route::get('/kelas-export', [KelasController::class, 'export'])
            ->name('kelas.export');

        Route::get('/kelas-template', [KelasController::class, 'downloadTemplate'])
            ->name('kelas.template');

        Route::post('/kelas-import', [KelasController::class, 'import'])
            ->name('kelas.import');

        Route::resource('spp', SppController::class)
            ->except(['show']);

        Route::delete('/spp-bulk', [SppController::class, 'destroyBulk'])
            ->name('spp.destroy-bulk');

        // Catatan: Admin TIDAK memiliki halaman Entri Pembayaran.
        // Tabel `transaksis` mewajibkan `petugas_id` (FK ke tabel `petugas`),
        // dan Admin tidak punya baris di tabel tersebut — sehingga entri
        // pembayaran hanya tersedia untuk role Petugas. Admin tetap bisa
        // memantau semua transaksi lewat Histori Pembayaran di bawah.

        Route::get('/histori', [TransaksiController::class, 'histori'])
            ->name('histori.index');

        Route::get('/laporan', [LaporanController::class, 'index'])
            ->name('laporan.index');

        Route::get('/laporan/export-excel', [LaporanController::class, 'exportExcel'])
            ->name('laporan.export-excel');

        Route::get('/laporan/export-pdf', [LaporanController::class, 'exportPdf'])
            ->name('laporan.export-pdf');
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

        Route::get('/dashboard', [DashboardController::class, 'petugas'])
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

        Route::get('/dashboard', [DashboardController::class, 'siswa'])
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
