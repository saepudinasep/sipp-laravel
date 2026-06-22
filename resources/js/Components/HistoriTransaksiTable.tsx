import EmptyState from "@/Components/EmptyState";
import Pagination from "@/Components/Pagination";
import { router } from "@inertiajs/react";
import { useState } from "react";

interface TransaksiRow {
    id: number;
    tgl_bayar: string;
    siswa_nama: string;
    kelas: string | null;
    spp_jenis: string;
    spp_bulan_label: string;
    nominal: number;
    petugas_nama: string;
    keterangan: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransaksi {
    data: TransaksiRow[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

interface KelasOption {
    id: number;
    nama_kelas: string;
}

interface BulanOption {
    value: number;
    label: string;
}

interface PetugasOption {
    id: number;
    nama: string;
}

interface Props {
    /** Prefix nama route: "admin", "petugas", atau "siswa". */
    routePrefix: "admin" | "petugas" | "siswa";
    transaksis: PaginatedTransaksi;
    /** Tidak dikirim untuk role siswa (siswa tidak butuh filter kelas). */
    kelasList?: KelasOption[];
    bulanList: BulanOption[];
    /** Hanya dikirim untuk role petugas — filter "lihat punya petugas lain". */
    petugasList?: PetugasOption[];
    filters: {
        search?: string | null;
        bulan: string | null;
        kelas_id?: string | null;
        petugas_id?: string | null;
    };
}

function formatRupiah(value: number) {
    return "Rp " + value.toLocaleString("id-ID");
}

function formatTanggalIndo(iso: string) {
    const date = new Date(iso + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** Badge warna kelas diturunkan dari tingkat agar konsisten tanpa data tambahan. */
function kelasBadgeClass(namaKelas: string | null) {
    if (!namaKelas) return "badge-gray";
    if (namaKelas.startsWith("X ")) return "badge-amber";
    if (namaKelas.startsWith("XI ")) return "badge-blue";
    if (namaKelas.startsWith("XII ")) return "badge-red";
    return "badge-gray";
}

export default function HistoriTransaksiTable({
    routePrefix,
    transaksis,
    kelasList,
    bulanList,
    petugasList,
    filters,
}: Props) {
    const isSiswa = routePrefix === "siswa";
    const isPetugas = routePrefix === "petugas";

    const [search, setSearch] = useState(filters.search ?? "");
    const [bulan, setBulan] = useState(filters.bulan ?? "");
    const [kelasId, setKelasId] = useState(filters.kelas_id ?? "");
    const [petugasId, setPetugasId] = useState(filters.petugas_id ?? "");
    const [searching, setSearching] = useState(false);

    const applyFilter = (next: {
        search?: string;
        bulan?: string;
        kelasId?: string;
        petugasId?: string;
    }) => {
        router.get(
            route(`${routePrefix}.histori.index`),
            {
                search: (next.search ?? search) || undefined,
                bulan: (next.bulan ?? bulan) || undefined,
                kelas_id: (next.kelasId ?? kelasId) || undefined,
                petugas_id: (next.petugasId ?? petugasId) || undefined,
            },
            {
                preserveState: true,
                replace: true,
                onStart: () => setSearching(true),
                onFinish: () => setSearching(false),
            },
        );
    };

    // Pencarian dipicu manual lewat tombol "Cari" atau tombol Enter,
    // selaras dengan pola pencarian di halaman Data Siswa.
    const handleSearch = () => applyFilter({});

    const handleClearSearch = () => {
        setSearch("");
        applyFilter({ search: "" });
    };

    const handleBulanChange = (value: string) => {
        setBulan(value);
        applyFilter({ bulan: value });
    };

    const handleKelasChange = (value: string) => {
        setKelasId(value);
        applyFilter({ kelasId: value });
    };

    const handlePetugasChange = (value: string) => {
        setPetugasId(value);
        applyFilter({ petugasId: value });
    };

    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <div className="card-title">
                        {isSiswa
                            ? "Riwayat Pembayaran Saya"
                            : "Semua Transaksi"}
                    </div>
                    <div className="card-subtitle">
                        {transaksis.total.toLocaleString("id-ID")} transaksi
                        tercatat
                    </div>
                </div>

                <div className="card-actions">
                    {!isSiswa && (
                        <div className="siswa-search-row">
                            <div className="search-box">
                                <svg viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari siswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSearch();
                                        }
                                    }}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        aria-label="Hapus pencarian"
                                        style={{
                                            border: "none",
                                            background: "transparent",
                                            cursor: "pointer",
                                            color: "var(--gray3)",
                                            fontSize: 16,
                                            lineHeight: 1,
                                            padding: 0,
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                className="btn-search"
                                onClick={handleSearch}
                                disabled={searching}
                            >
                                {searching ? (
                                    <span className="btn-search-spinner" />
                                ) : (
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                    </svg>
                                )}
                                Cari
                            </button>
                        </div>
                    )}

                    <select
                        className="form-select"
                        style={{ width: 130, padding: "8px 12px" }}
                        value={bulan}
                        onChange={(e) => handleBulanChange(e.target.value)}
                    >
                        <option value="">Semua Bulan</option>
                        {bulanList.map((b) => (
                            <option key={b.value} value={b.value}>
                                {b.label}
                            </option>
                        ))}
                    </select>

                    {!isSiswa && kelasList && (
                        <select
                            className="form-select"
                            style={{ width: 130, padding: "8px 12px" }}
                            value={kelasId}
                            onChange={(e) => handleKelasChange(e.target.value)}
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama_kelas}
                                </option>
                            ))}
                        </select>
                    )}

                    {isPetugas && petugasList && (
                        <select
                            className="form-select"
                            style={{ width: 150, padding: "8px 12px" }}
                            value={petugasId}
                            onChange={(e) =>
                                handlePetugasChange(e.target.value)
                            }
                        >
                            <option value="">Transaksi Saya</option>
                            {petugasList.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {transaksis.data.length === 0 ? (
                <EmptyState
                    title="Belum ada transaksi"
                    description="Riwayat pembayaran akan muncul di sini setelah ada transaksi tercatat."
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tanggal</th>
                                    {!isSiswa && <th>Siswa</th>}
                                    {!isSiswa && <th>Kelas</th>}
                                    <th>Jenis SPP</th>
                                    <th>Nominal</th>
                                    <th>Petugas</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaksis.data.map((t) => (
                                    <tr key={t.id}>
                                        <td className="td-mono">#TRX-{t.id}</td>
                                        <td>
                                            {formatTanggalIndo(t.tgl_bayar)}
                                        </td>
                                        {!isSiswa && (
                                            <td>
                                                <span className="td-name">
                                                    {t.siswa_nama}
                                                </span>
                                            </td>
                                        )}
                                        {!isSiswa && (
                                            <td>
                                                <span
                                                    className={`badge ${kelasBadgeClass(
                                                        t.kelas,
                                                    )}`}
                                                >
                                                    {t.kelas ?? "—"}
                                                </span>
                                            </td>
                                        )}
                                        <td>
                                            {t.spp_jenis} · {t.spp_bulan_label}
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: 700,
                                                color: "var(--green)",
                                            }}
                                        >
                                            {formatRupiah(t.nominal)}
                                        </td>
                                        <td>{t.petugas_nama}</td>
                                        <td>
                                            <span className="badge badge-green">
                                                <span className="badge-dot" />{" "}
                                                Lunas
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={transaksis.links}
                        from={transaksis.from ?? undefined}
                        to={transaksis.to ?? undefined}
                        total={transaksis.total}
                    />
                </>
            )}
        </div>
    );
}
