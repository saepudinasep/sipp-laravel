import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import Pagination from "@/Components/Pagination";
import EmptyState from "@/Components/EmptyState";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface User {
    id: number;
    email: string;
    is_active: boolean;
}

interface Siswa {
    id: number;
    nis: string;
    nama: string;
    telp: string | null;
    kelas: Kelas | null;
    user: User | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedSiswa {
    data: Siswa[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

interface Props {
    siswas: PaginatedSiswa;
    kelasList: Kelas[];
    filters: {
        search: string | null;
        kelas_id: string | null;
    };
}

/** Warna avatar konsisten berdasarkan nama (deterministik, bukan acak). */
const AVATAR_COLORS = [
    "#1E6FE8",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#0EA5E9",
];

function avatarColor(name: string) {
    const sum = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/** Badge warna kelas diturunkan dari tingkat agar konsisten tanpa data tambahan. */
function kelasBadgeClass(namaKelas: string) {
    if (namaKelas.startsWith("X ")) return "badge-amber";
    if (namaKelas.startsWith("XI ")) return "badge-blue";
    if (namaKelas.startsWith("XII ")) return "badge-red";
    return "badge-gray";
}

export default function Index({ siswas, kelasList, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [kelasId, setKelasId] = useState(filters.kelas_id ?? "");
    const [deleteTarget, setDeleteTarget] = useState<Siswa | null>(null);
    const isFirstRender = useRef(true);

    const applyFilter = (nextSearch: string, nextKelasId: string) => {
        router.get(
            route("admin.siswa.index"),
            {
                search: nextSearch || undefined,
                kelas_id: nextKelasId || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    // Auto-search: kirim request 400ms setelah pengguna berhenti mengetik,
    // tanpa perlu menekan Enter atau tombol cari.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            applyFilter(search, kelasId);
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleKelasChange = (value: string) => {
        setKelasId(value);
        applyFilter(search, value);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        router.delete(route("admin.siswa.destroy", deleteTarget.id), {
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout title="Data Siswa">
            <Head title="Data Siswa" />

            <div className="breadcrumb">
                Master Data · <span>Data Siswa</span>
            </div>
            <div className="page-header">
                <h1>Data Siswa</h1>
                <p>Kelola data siswa yang terdaftar di sistem.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Daftar Siswa</div>
                        <div className="card-subtitle">
                            {siswas.total} siswa terdaftar
                        </div>
                    </div>

                    <div className="card-actions">
                        <div className="search-box">
                            <svg viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari nama / NIS..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
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

                        <select
                            className="form-select"
                            style={{ width: 150, padding: "8px 12px" }}
                            value={kelasId}
                            onChange={(e) => handleKelasChange(e.target.value)}
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList.map((kelas) => (
                                <option key={kelas.id} value={kelas.id}>
                                    {kelas.nama_kelas}
                                </option>
                            ))}
                        </select>

                        <Link
                            href={route("admin.siswa.create")}
                            className="btn btn-primary"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Tambah Siswa
                        </Link>
                    </div>
                </div>

                {siswas.data.length === 0 ? (
                    <EmptyState
                        title="Belum ada data siswa"
                        description="Klik tombol Tambah Siswa untuk menambahkan data baru."
                    />
                ) : (
                    <>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Siswa</th>
                                        <th>NIS</th>
                                        <th>Kelas</th>
                                        <th>No. Telepon</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siswas.data.map((siswa, idx) => (
                                        <tr key={siswa.id}>
                                            <td>{(siswas.from ?? 1) + idx}</td>
                                            <td>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 10,
                                                    }}
                                                >
                                                    <div
                                                        className="avatar-sm"
                                                        style={{
                                                            background:
                                                                avatarColor(
                                                                    siswa.nama,
                                                                ),
                                                        }}
                                                    >
                                                        {initials(siswa.nama)}
                                                    </div>
                                                    <span className="td-name">
                                                        {siswa.nama}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="td-mono">
                                                {siswa.nis}
                                            </td>
                                            <td>
                                                {siswa.kelas ? (
                                                    <span
                                                        className={`badge ${kelasBadgeClass(
                                                            siswa.kelas
                                                                .nama_kelas,
                                                        )}`}
                                                    >
                                                        {siswa.kelas.nama_kelas}
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-gray">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td>{siswa.telp || "—"}</td>
                                            <td className="td-mono">
                                                {siswa.user?.email ?? "—"}
                                            </td>
                                            <td>
                                                {siswa.user?.is_active ? (
                                                    <span className="badge badge-green">
                                                        <span className="badge-dot" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-gray">
                                                        <span className="badge-dot" />
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <Link
                                                        href={route(
                                                            "admin.siswa.edit",
                                                            siswa.id,
                                                        )}
                                                        className="btn-icon"
                                                        title="Edit"
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        className="btn-icon danger"
                                                        title="Hapus"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                siswa,
                                                            )
                                                        }
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            links={siswas.links}
                            from={siswas.from ?? undefined}
                            to={siswas.to ?? undefined}
                            total={siswas.total}
                        />
                    </>
                )}
            </div>

            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onDelete={confirmDelete}
            />
        </AppLayout>
    );
}
