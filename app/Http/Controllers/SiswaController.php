<?php

namespace App\Http\Controllers;

use App\Exports\SiswaExport;
use App\Exports\SiswaTemplateExport;
use App\Imports\SiswaImport;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Excel;

class SiswaController extends Controller
{
    public function __construct(protected Excel $excel) {}

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

    /**
     * Export seluruh data siswa saat ini ke file Excel (.xlsx).
     */
    public function export()
    {
        return $this->excel->download(new SiswaExport(), 'data-siswa.xlsx');
    }

    /**
     * Download template Excel kosong untuk diisi lalu di-import kembali.
     */
    public function downloadTemplate()
    {
        return $this->excel->download(new SiswaTemplateExport(), 'template-import-siswa.xlsx');
    }

    /**
     * Import data siswa dari file Excel (.xlsx/.csv) hasil isian template.
     * Setiap baris yang valid otomatis membuat akun User (role siswa)
     * sekaligus data Siswa. Baris yang gagal dilaporkan tanpa
     * menggagalkan baris lain yang valid.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ], [
            'file.required' => 'Pilih file Excel terlebih dahulu.',
            'file.mimes' => 'File harus berformat .xlsx, .xls, atau .csv.',
            'file.max' => 'Ukuran file maksimal 5MB.',
        ]);

        $import = new SiswaImport();
        $this->excel->import($import, $request->file('file'));

        if (empty($import->gagal)) {
            return redirect()
                ->route('admin.siswa.index')
                ->with('success', "{$import->berhasil} siswa berhasil diimpor.");
        }

        $pesanGagal = collect($import->gagal)
            ->map(fn($g) => "Baris {$g['baris']}: {$g['pesan']}")
            ->implode(' | ');

        return redirect()
            ->route('admin.siswa.index')
            ->with(
                $import->berhasil > 0 ? 'success' : 'error',
                "{$import->berhasil} siswa berhasil diimpor. " .
                    count($import->gagal) . " baris gagal — {$pesanGagal}",
            );
    }
}
