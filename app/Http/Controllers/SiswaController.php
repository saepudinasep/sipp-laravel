<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kelasId = $request->input('kelas_id');

        $siswas = Siswa::query()
            ->with(['kelas', 'user'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($kelasId, function ($query, $kelasId) {
                $query->where('kelas_id', $kelasId);
            })
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Siswa/Index', [
            'siswas' => $siswas,
            'kelasList' => Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']),
            'filters' => [
                'search' => $search,
                'kelas_id' => $kelasId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Siswa/Create', [
            'kelasList' => Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'nis' => ['required', 'string', 'max:20', 'unique:siswas,nis'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'alamat' => ['nullable', 'string'],
            'telp' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'siswa',
                'is_active' => true,
            ]);

            Siswa::create([
                'nis' => $validated['nis'],
                'nama' => $validated['nama'],
                'kelas_id' => $validated['kelas_id'],
                'alamat' => $validated['alamat'] ?? null,
                'telp' => $validated['telp'] ?? null,
                'user_id' => $user->id,
            ]);
        });

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Siswa baru berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Siswa $siswa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Siswa $siswa)
    {
        $siswa->load(['kelas', 'user']);

        return Inertia::render('Admin/Siswa/Edit', [
            'siswa' => $siswa,
            'kelasList' => Kelas::orderBy('nama_kelas')->get(['id', 'nama_kelas']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'nis' => ['required', 'string', 'max:20', Rule::unique('siswas', 'nis')->ignore($siswa->id)],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'alamat' => ['nullable', 'string'],
            'telp' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($siswa->user_id)],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        DB::transaction(function () use ($validated, $siswa) {
            $siswa->update([
                'nama' => $validated['nama'],
                'nis' => $validated['nis'],
                'kelas_id' => $validated['kelas_id'],
                'alamat' => $validated['alamat'] ?? null,
                'telp' => $validated['telp'] ?? null,
            ]);

            $userData = ['email' => $validated['email']];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $siswa->user()->update($userData);
        });

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Siswa $siswa)
    {
        $siswa->delete();

        return redirect()
            ->route('admin.siswa.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }
}
