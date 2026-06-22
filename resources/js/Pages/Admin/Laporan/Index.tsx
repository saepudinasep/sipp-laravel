import AppLayout from "@/Layouts/AppLayout";
import EmptyState from "@/Components/EmptyState";
import LoadingButton from "@/Components/LoadingButton";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

interface BulanOption {
    value: number;
    label: string;
}

interface KelasOption {
    id: number;
    nama_kelas: string;
}

interface DetailRow {
    no: number;
    nis: string;
    nama: string;
    kelas: string;
    jenis_spp: string;
    tgl_bayar: string | null;
    nominal: number | null;
    lunas: boolean;
}

interface Summary {
    total_siswa: number;
    sudah_bayar: number;
    belum_bayar: number;
}

interface Props {
    bulanList: BulanOption[];
    tahunAjaranList: string[];
    kelasList: KelasOption[];
    filters: {
        bulan: string | null;
        tahun_ajaran: string | null;
        kelas_id: string | null;
    };
    sudahGenerate: boolean;
    detail: DetailRow[];
    summary: Summary;
    totalTerkumpul: number;
    bulanLabel: string | null;
    kelasLabel: string;
    dicetakOleh: string;
}

function formatRupiah(value: number) {
    return "Rp " + value.toLocaleString("id-ID");
}

function formatTanggalIndo(iso: string | null) {
    if (!iso) return "—";
    const date = new Date(iso + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function tanggalHariIni() {
    return new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default function Index({
    bulanList,
    tahunAjaranList,
    kelasList,
    filters,
    sudahGenerate,
    detail,
    summary,
    totalTerkumpul,
    bulanLabel,
    kelasLabel,
    dicetakOleh,
}: Props) {
    const [bulan, setBulan] = useState(filters.bulan ?? "");
    const [tahunAjaran, setTahunAjaran] = useState(
        filters.tahun_ajaran ?? tahunAjaranList[0] ?? "",
    );
    const [kelasId, setKelasId] = useState(filters.kelas_id ?? "");
    const [generating, setGenerating] = useState(false);

    // Query string untuk export — selalu memakai filter dari server
    // (filters props), bukan state form, supaya hasil export selalu
    // sama dengan laporan yang sedang tampil di halaman.
    const exportQuery = new URLSearchParams({
        bulan: filters.bulan ?? "",
        tahun_ajaran: filters.tahun_ajaran ?? "",
        ...(filters.kelas_id ? { kelas_id: filters.kelas_id } : {}),
    }).toString();

    const handleGenerate = () => {
        if (!bulan || !tahunAjaran) return;

        router.get(
            route("admin.laporan.index"),
            {
                bulan,
                tahun_ajaran: tahunAjaran,
                kelas_id: kelasId || undefined,
            },
            {
                preserveState: true,
                onStart: () => setGenerating(true),
                onFinish: () => setGenerating(false),
            },
        );
    };

    return (
        <AppLayout title="Laporan">
            <Head title="Laporan Pembayaran SPP" />

            <div className="breadcrumb">
                Admin · <span>Laporan</span>
            </div>
            <div className="page-header">
                <h1>Laporan Pembayaran SPP</h1>
                <p>Generate dan cetak laporan rekapitulasi pembayaran.</p>
            </div>

            <div className="filter-bar">
                <select
                    className="form-select"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                >
                    <option value="">-- Pilih Bulan --</option>
                    {bulanList.map((b) => (
                        <option key={b.value} value={b.value}>
                            {b.label}
                        </option>
                    ))}
                </select>

                <select
                    className="form-select"
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                >
                    {tahunAjaranList.length === 0 && (
                        <option value="">-- Tidak ada data --</option>
                    )}
                    {tahunAjaranList.map((ta) => (
                        <option key={ta} value={ta}>
                            {ta}
                        </option>
                    ))}
                </select>

                <select
                    className="form-select"
                    value={kelasId}
                    onChange={(e) => setKelasId(e.target.value)}
                >
                    <option value="">Semua Kelas</option>
                    {kelasList.map((k) => (
                        <option key={k.id} value={k.id}>
                            {k.nama_kelas}
                        </option>
                    ))}
                </select>

                <LoadingButton
                    loading={generating}
                    loadingText="Memuat..."
                    disabled={!bulan || !tahunAjaran}
                    onClick={handleGenerate}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="white"
                    >
                        <path d="M7 2v2h1v14a3 3 0 003 3h2a3 3 0 003-3V4h1V2H7zm5 16a1 1 0 110-2 1 1 0 010 2zm1-4h-2V7h2v7z" />
                    </svg>
                    Generate Laporan
                </LoadingButton>

                {sudahGenerate && (
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => window.print()}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                        </svg>
                        Print
                    </button>
                )}

                {sudahGenerate && (
                    <a
                        href={
                            route("admin.laporan.export-excel") +
                            "?" +
                            exportQuery
                        }
                        className="btn btn-outline"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2v16c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1.17 13.13L11 13.41l-1.83 1.72L8 13.95l1.83-1.72L8 10.5l1.17-1.18L11 11.05l1.83-1.73L14 10.5l-1.83 1.19L14 13.95l-1.17 1.18z" />
                        </svg>
                        Excel
                    </a>
                )}

                {sudahGenerate && (
                    <a
                        href={
                            route("admin.laporan.export-pdf") +
                            "?" +
                            exportQuery
                        }
                        className="btn btn-outline"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2v16c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V8l-6-6zM9.5 11.5c0 .83-.67 1.5-1.5 1.5H7v1.5H5.5v-5H8c.83 0 1.5.67 1.5 1.5v.5zm4 1c0 .83-.67 1.5-1.5 1.5h-2v-5h2c.83 0 1.5.67 1.5 1.5v2zm4-2H17v.75h.5V12.5H17v1.5h-1.5v-5H18v1zM7 12h.5v-1H7v1zm5.5 1.5h.5v-2h-.5v2z" />
                        </svg>
                        PDF
                    </a>
                )}
            </div>

            {!sudahGenerate ? (
                <EmptyState
                    title="Pilih bulan dan tahun ajaran"
                    description="Lengkapi filter di atas lalu klik Generate Laporan untuk melihat rekapitulasi."
                />
            ) : (
                <>
                    <div className="report-header">
                        <div>
                            <h2>Rekapitulasi Pembayaran SPP</h2>
                            <p>
                                Periode: {bulanLabel} {filters.tahun_ajaran} ·{" "}
                                {kelasLabel}
                            </p>
                        </div>
                        <div className="report-meta">
                            Dicetak oleh: {dicetakOleh}
                            <br />
                            Tanggal: {tanggalHariIni()}
                        </div>
                    </div>

                    <div className="report-summary">
                        <div className="report-sum-card">
                            <div
                                className="report-sum-val"
                                style={{ color: "var(--blue)" }}
                            >
                                {summary.total_siswa}
                            </div>
                            <div className="report-sum-label">Total Siswa</div>
                        </div>
                        <div className="report-sum-card">
                            <div
                                className="report-sum-val"
                                style={{ color: "var(--green)" }}
                            >
                                {summary.sudah_bayar}
                            </div>
                            <div className="report-sum-label">Sudah Bayar</div>
                        </div>
                        <div className="report-sum-card">
                            <div
                                className="report-sum-val"
                                style={{ color: "var(--amber)" }}
                            >
                                {summary.belum_bayar}
                            </div>
                            <div className="report-sum-label">Belum Bayar</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">
                                Detail Rekapitulasi
                            </div>
                            <div className="card-subtitle">
                                {bulanLabel} {filters.tahun_ajaran} —{" "}
                                {kelasLabel}
                            </div>
                        </div>

                        {detail.length === 0 ? (
                            <EmptyState
                                title="Tidak ada data siswa"
                                description="Belum ada siswa terdaftar untuk kelas yang dipilih."
                            />
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NIS</th>
                                            <th>Nama Siswa</th>
                                            <th>Kelas</th>
                                            <th>Jenis SPP</th>
                                            <th>Tgl Bayar</th>
                                            <th>Nominal</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detail.map((row) => (
                                            <tr key={row.nis}>
                                                <td>{row.no}</td>
                                                <td className="td-mono">
                                                    {row.nis}
                                                </td>
                                                <td className="td-name">
                                                    {row.nama}
                                                </td>
                                                <td>{row.kelas}</td>
                                                <td>{row.jenis_spp}</td>
                                                <td>
                                                    {formatTanggalIndo(
                                                        row.tgl_bayar,
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {row.nominal !== null
                                                        ? formatRupiah(
                                                              row.nominal,
                                                          )
                                                        : "—"}
                                                </td>
                                                <td>
                                                    {row.lunas ? (
                                                        <span className="badge badge-green">
                                                            LUNAS
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-red">
                                                            BELUM
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div
                            style={{
                                padding: "16px 22px",
                                borderTop: "1px solid var(--gray1)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--gray3)",
                                }}
                            >
                                Total terkumpul bulan ini
                            </span>
                            <span
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "var(--blue)",
                                }}
                            >
                                {formatRupiah(totalTerkumpul)}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}
