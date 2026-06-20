<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiswaController;
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
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:admin'])
    ->group(function () {

        Route::get('/admin/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');
    });

Route::middleware(['auth', 'role:petugas'])
    ->group(function () {

        Route::get('/petugas/dashboard', function () {
            return Inertia::render('Petugas/Dashboard');
        })->name('petugas.dashboard');
    });

Route::middleware(['auth', 'role:siswa'])
    ->group(function () {

        Route::get('/siswa/dashboard', function () {
            return Inertia::render('Siswa/Dashboard');
        })->name('siswa.dashboard');
    });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin,petugas'])
    ->resource('siswa', SiswaController::class);

require __DIR__ . '/auth.php';
