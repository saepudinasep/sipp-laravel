import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import LoadingButton from "@/Components/LoadingButton";
import Pagination from "@/Components/Pagination";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: "X" | "XI" | "XII";
    jurusan: string;
    siswa_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedKelas {
    data: Kelas[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

interface Props {
    kelasList: PaginatedKelas;
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
    const [importModalOpen, setImportModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const importForm = useForm<{ file: File | null }>({ file: null });

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

    const openImportModal = () => {
        importForm.reset();
        importForm.clearErrors();
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImportModalOpen(true);
    };

    const closeImportModal = () => {
        setImportModalOpen(false);
        importForm.reset();
        importForm.clearErrors();
    };

    const submitImport: FormEventHandler = (e) => {
        e.preventDefault();
        if (!importForm.data.file) return;

        importForm.post(route("admin.kelas.import"), {
            forceFormData: true,
            onSuccess: closeImportModal,
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
                            {kelasList.total} kelas aktif
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

                        <a
                            href={route("admin.kelas.export")}
                            className="btn btn-outline"
                            title="Export data kelas ke Excel"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2v16c0 1.1.89 2 1.99 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1.17 13.13L11 13.41l-1.83 1.72L8 13.95l1.83-1.72L8 10.5l1.17-1.18L11 11.05l1.83-1.73L14 10.5l-1.83 1.19L14 13.95l-1.17 1.18z" />
                            </svg>
                            Export Excel
                        </a>

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={openImportModal}
                            title="Import data kelas dari Excel"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
                            </svg>
                            Import Excel
                        </button>

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

                {kelasList.data.length === 0 ? (
                    <EmptyState
                        title="Belum ada data kelas"
                        description="Klik tombol Tambah Kelas untuk menambahkan data baru."
                    />
                ) : (
                    <>
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
                                    {kelasList.data.map((kelas, idx) => (
                                        <tr key={kelas.id}>
                                            <td>
                                                {(kelasList.from ?? 1) + idx}
                                            </td>
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
                                                            setDeleteTarget(
                                                                kelas,
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
                            links={kelasList.links}
                            from={kelasList.from ?? undefined}
                            to={kelasList.to ?? undefined}
                            total={kelasList.total}
                            itemLabel="Data Kelas"
                        />
                    </>
                )}
            </div>

            {importModalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submitImport}>
                            <div className="modal-head">
                                <h3>Import Data Kelas</h3>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={closeImportModal}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="info-panel">
                                    <p
                                        style={{
                                            fontSize: 12,
                                            color: "var(--gray4)",
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}
                                    >
                                        Belum punya file? Download{" "}
                                        <a
                                            href={route("admin.kelas.template")}
                                            style={{
                                                color: "var(--blue)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            template Excel
                                        </a>{" "}
                                        terlebih dahulu, isi datanya, lalu
                                        upload kembali di sini.
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        File Excel{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        className="form-input"
                                        onChange={(e) =>
                                            importForm.setData(
                                                "file",
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                    <div className="form-hint">
                                        Format .xlsx, .xls, atau .csv. Maksimal
                                        5MB.
                                    </div>
                                    {importForm.errors.file && (
                                        <div className="form-error">
                                            {importForm.errors.file}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-foot">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeImportModal}
                                >
                                    Batal
                                </button>
                                <LoadingButton
                                    type="submit"
                                    loading={importForm.processing}
                                    loadingText="Mengimpor..."
                                    disabled={!importForm.data.file}
                                >
                                    Upload &amp; Import
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onDelete={confirmDelete}
                loading={isDeleting}
            />
        </AppLayout>
    );
}
