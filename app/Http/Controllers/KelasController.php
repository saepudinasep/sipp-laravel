<?php

namespace App\Http\Controllers;

use App\Exports\KelasExport;
use App\Exports\KelasTemplateExport;
use App\Imports\KelasImport;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Excel;

class KelasController extends Controller
{
    public function __construct(protected Excel $excel) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $kelas = Kelas::query()
            ->withCount('siswa')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_kelas', 'like', "%{$search}%")
                        ->orWhere('jurusan', 'like', "%{$search}%");
                });
            })
            ->orderBy('nama_kelas')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Kelas/Index', [
            'kelasList' => $kelas,
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
        return Inertia::render('Admin/Kelas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:20', 'unique:kelas,nama_kelas'],
            'tingkat' => ['required', Rule::in(['X', 'XI', 'XII'])],
            'jurusan' => ['required', 'string', 'max:50'],
        ]);

        Kelas::create($validated);

        return redirect()
            ->route('admin.kelas.index')
            ->with('success', 'Kelas baru berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kelas $kelas)
    {
        return Inertia::render('Admin/Kelas/Edit', [
            'kelas' => $kelas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas)
    {
        $validated = $request->validate([
            'nama_kelas' => ['required', 'string', 'max:20', Rule::unique('kelas', 'nama_kelas')->ignore($kelas->id)],
            'tingkat' => ['required', Rule::in(['X', 'XI', 'XII'])],
            'jurusan' => ['required', 'string', 'max:50'],
        ]);

        $kelas->update($validated);

        return redirect()
            ->route('admin.kelas.index')
            ->with('success', 'Data kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas)
    {
        if ($kelas->siswa()->exists()) {
            return back()->with('error', 'Kelas tidak dapat dihapus karena masih memiliki siswa terdaftar.');
        }

        $kelas->delete();

        return redirect()
            ->route('admin.kelas.index')
            ->with('success', 'Data kelas berhasil dihapus.');
    }

    /**
     * Export seluruh data kelas saat ini ke file Excel (.xlsx).
     */
    public function export()
    {
        return $this->excel->download(new KelasExport(), 'data-kelas.xlsx');
    }

    /**
     * Download template Excel kosong untuk diisi lalu di-import kembali.
     */
    public function downloadTemplate()
    {
        return $this->excel->download(new KelasTemplateExport(), 'template-import-kelas.xlsx');
    }

    /**
     * Import data kelas dari file Excel (.xlsx/.csv) hasil isian template.
     * Baris yang gagal validasi dilaporkan ke user tanpa menggagalkan
     * baris lain yang valid.
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

        $import = new KelasImport();
        $this->excel->import($import, $request->file('file'));

        if (empty($import->gagal)) {
            return redirect()
                ->route('admin.kelas.index')
                ->with('success', "{$import->berhasil} kelas berhasil diimpor.");
        }

        $pesanGagal = collect($import->gagal)
            ->map(fn($g) => "Baris {$g['baris']}: {$g['pesan']}")
            ->implode(' | ');

        return redirect()
            ->route('admin.kelas.index')
            ->with(
                $import->berhasil > 0 ? 'success' : 'error',
                "{$import->berhasil} kelas berhasil diimpor. " .
                    count($import->gagal) . " baris gagal — {$pesanGagal}",
            );
    }
}
