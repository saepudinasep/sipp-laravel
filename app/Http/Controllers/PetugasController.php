<?php

namespace App\Http\Controllers;

use App\Models\Petugas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PetugasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $petugas = Petugas::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhere('jabatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama')
            ->get();

        return Inertia::render('Admin/Petugas/Index', [
            'petugasList' => $petugas,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Petugas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'nip' => ['required', 'string', 'max:30', 'unique:petugas,nip'],
            'jabatan' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'petugas',
                'is_active' => true,
            ]);

            Petugas::create([
                'nip' => $validated['nip'],
                'nama' => $validated['nama'],
                'jabatan' => $validated['jabatan'],
                'user_id' => $user->id,
            ]);
        });

        return redirect()
            ->route('admin.petugas.index')
            ->with('success', 'Petugas baru berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Petugas $petugas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Petugas $petugas)
    {
        $petugas->load('user');

        // dd($petugas->toArray()); // baris sementara untuk debug

        return Inertia::render('Admin/Petugas/Edit', [
            'petugas' => $petugas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Petugas $petugas)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'nip' => ['required', 'string', 'max:30', Rule::unique('petugas', 'nip')->ignore($petugas->id)],
            'jabatan' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($petugas->user_id)],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated, $petugas) {
            $petugas->update([
                'nama' => $validated['nama'],
                'nip' => $validated['nip'],
                'jabatan' => $validated['jabatan'],
            ]);

            $userData = ['email' => $validated['email']];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $petugas->user()->update($userData);
        });

        return redirect()
            ->route('admin.petugas.index')
            ->with('success', 'Data petugas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Petugas $petugas)
    {
        if ($petugas->transaksi()->exists()) {
            return back()->with('error', 'Petugas tidak dapat dihapus karena memiliki riwayat transaksi.');
        }

        $petugas->delete();

        return redirect()
            ->route('admin.petugas.index')
            ->with('success', 'Data petugas berhasil dihapus.');
    }
}
