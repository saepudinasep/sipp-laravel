import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: "X" | "XI" | "XII";
    jurusan: string;
    siswa_count: number;
}

interface Props {
    kelasList: Kelas[];
    filters: {
        search: string | null;
    };
}

const TINGKAT_BADGE: Record<string, string> = {
    X: "badge-green",
    XI: "badge-blue",
    XII: "badge-amber",
};

export default function Index({ kelasList, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [searching, setSearching] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Kelas | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = () => {
        router.get(
            route("admin.kelas.index"),
            { search: search || undefined },
            {
                preserveState: true,
                replace: true,
                onStart: () => setSearching(true),
                onFinish: () => setSearching(false),
            },
        );
    };

    const handleClearSearch = () => {
        setSearch("");
        router.get(
            route("admin.kelas.index"),
            {},
            { preserveState: true, replace: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route("admin.kelas.destroy", deleteTarget.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <AppLayout title="Data Kelas">
            <Head title="Data Kelas" />

            <div className="breadcrumb">
                Master Data · <span>Data Kelas</span>
            </div>
            <div className="page-header">
                <h1>Data Kelas</h1>
                <p>Kelola data kelas yang tersedia.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Daftar Kelas</div>
                        <div className="card-subtitle">
                            {kelasList.length} kelas aktif
                        </div>
                    </div>

                    <div className="card-actions">
                        <div className="siswa-search-row">
                            <div className="search-box">
                                <svg viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Cari nama kelas / jurusan..."
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

                        <Link
                            href={route("admin.kelas.create")}
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
                            Tambah Kelas
                        </Link>
                    </div>
                </div>

                {kelasList.length === 0 ? (
                    <EmptyState
                        title="Belum ada data kelas"
                        description="Klik tombol Tambah Kelas untuk menambahkan data baru."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Kelas</th>
                                    <th>Tingkat</th>
                                    <th>Jurusan</th>
                                    <th>Jumlah Siswa</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kelasList.map((kelas, idx) => (
                                    <tr key={kelas.id}>
                                        <td>{idx + 1}</td>
                                        <td className="td-name">
                                            {kelas.nama_kelas}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${TINGKAT_BADGE[kelas.tingkat]}`}
                                            >
                                                {kelas.tingkat}
                                            </span>
                                        </td>
                                        <td>{kelas.jurusan}</td>
                                        <td>{kelas.siswa_count} siswa</td>
                                        <td>
                                            <div className="td-actions">
                                                <Link
                                                    href={route(
                                                        "admin.kelas.edit",
                                                        kelas.id,
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
                                                        setDeleteTarget(kelas)
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
                )}
            </div>

            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onDelete={confirmDelete}
                loading={isDeleting}
            />
        </AppLayout>
    );
}
