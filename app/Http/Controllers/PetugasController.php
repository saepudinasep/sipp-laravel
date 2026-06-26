<?php

namespace App\Http\Controllers;

use App\Exports\PetugasExport;
use App\Exports\PetugasTemplateExport;
use App\Imports\PetugasImport;
use App\Models\Petugas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Excel;

class PetugasController extends Controller
{
    public function __construct(protected Excel $excel) {}

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
            ->paginate(10)
            ->withQueryString();

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


    /**
     * Export seluruh data petugas saat ini ke file Excel (.xlsx).
     */
    public function export()
    {
        return $this->excel->download(new PetugasExport(), 'data-petugas.xlsx');
    }

    /**
     * Download template Excel kosong untuk diisi lalu di-import kembali.
     */
    public function downloadTemplate()
    {
        return $this->excel->download(new PetugasTemplateExport(), 'template-import-petugas.xlsx');
    }

    /**
     * Import data petugas dari file Excel (.xlsx/.csv) hasil isian template.
     * Setiap baris yang valid otomatis membuat akun User (role petugas)
     * sekaligus data Petugas — sama seperti store(). Baris yang gagal
     * dilaporkan tanpa menggagalkan baris lain yang valid.
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

        $import = new PetugasImport();
        $this->excel->import($import, $request->file('file'));

        if (empty($import->gagal)) {
            return redirect()
                ->route('admin.petugas.index')
                ->with('success', "{$import->berhasil} petugas berhasil diimpor.");
        }

        $pesanGagal = collect($import->gagal)
            ->map(fn($g) => "Baris {$g['baris']}: {$g['pesan']}")
            ->implode(' | ');

        return redirect()
            ->route('admin.petugas.index')
            ->with(
                $import->berhasil > 0 ? 'success' : 'error',
                "{$import->berhasil} petugas berhasil diimpor. " .
                    count($import->gagal) . " baris gagal — {$pesanGagal}",
            );
    }
}
