import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import LoadingButton from "@/Components/LoadingButton";
import Pagination from "@/Components/Pagination";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

interface User {
    id: number;
    email: string;
    is_active: boolean;
}

interface Petugas {
    id: number;
    nip: string;
    nama: string;
    jabatan: string;
    user: User | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPetugas {
    data: Petugas[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

interface Props {
    petugasList: PaginatedPetugas;
    filters: {
        search: string | null;
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

/** Badge warna jabatan diturunkan dari kata kunci agar konsisten tanpa data tambahan. */
function jabatanBadgeClass(jabatan: string) {
    const lower = jabatan.toLowerCase();
    if (lower.includes("kepala")) return "badge-blue";
    if (lower.includes("keuangan") || lower.includes("bendahara"))
        return "badge-green";
    return "badge-gray";
}

export default function Index({ petugasList, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [searching, setSearching] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Petugas | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const importForm = useForm<{ file: File | null }>({ file: null });

    const handleSearch = () => {
        router.get(
            route("admin.petugas.index"),
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
            route("admin.petugas.index"),
            {},
            { preserveState: true, replace: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route("admin.petugas.destroy", deleteTarget.id), {
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

        importForm.post(route("admin.petugas.import"), {
            forceFormData: true,
            onSuccess: closeImportModal,
        });
    };

    return (
        <AppLayout title="Data Petugas">
            <Head title="Data Petugas" />

            <div className="breadcrumb">
                Master Data · <span>Data Petugas</span>
            </div>
            <div className="page-header">
                <h1>Data Petugas</h1>
                <p>Kelola akun dan data petugas TU/keuangan.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Daftar Petugas</div>
                        <div className="card-subtitle">
                            {petugasList.total} petugas aktif
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
                                    placeholder="Cari nama / NIP / jabatan..."
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
                            href={route("admin.petugas.export")}
                            className="btn btn-outline"
                            title="Export data petugas ke Excel"
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
                            title="Import data petugas dari Excel"
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
                            href={route("admin.petugas.create")}
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
                            Tambah Petugas
                        </Link>
                    </div>
                </div>

                {petugasList.data.length === 0 ? (
                    <EmptyState
                        title="Belum ada data petugas"
                        description="Klik tombol Tambah Petugas untuk menambahkan data baru."
                    />
                ) : (
                    <>
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama Petugas</th>
                                        <th>NIP</th>
                                        <th>Jabatan</th>
                                        <th>Username</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {petugasList.data.map((petugas, idx) => (
                                        <tr key={petugas.id}>
                                            <td>
                                                {(petugasList.from ?? 1) + idx}
                                            </td>
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
                                                                    petugas.nama,
                                                                ),
                                                        }}
                                                    >
                                                        {initials(petugas.nama)}
                                                    </div>
                                                    <span className="td-name">
                                                        {petugas.nama}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="td-mono">
                                                {petugas.nip}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${jabatanBadgeClass(
                                                        petugas.jabatan,
                                                    )}`}
                                                >
                                                    {petugas.jabatan}
                                                </span>
                                            </td>
                                            <td className="td-mono">
                                                {petugas.user?.email ?? "—"}
                                            </td>
                                            <td>
                                                {petugas.user?.is_active ? (
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
                                                            "admin.petugas.edit",
                                                            petugas.id,
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
                                                                petugas,
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
                            links={petugasList.links}
                            from={petugasList.from ?? undefined}
                            to={petugasList.to ?? undefined}
                            total={petugasList.total}
                            itemLabel="Data Petugas"
                        />
                    </>
                )}
            </div>

            {importModalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submitImport}>
                            <div className="modal-head">
                                <h3>Import Data Petugas</h3>
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
                                            href={route(
                                                "admin.petugas.template",
                                            )}
                                            style={{
                                                color: "var(--blue)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            template Excel
                                        </a>{" "}
                                        terlebih dahulu, isi datanya, lalu
                                        upload kembali di sini. Kolom Password
                                        boleh dikosongkan — jika kosong, NIP
                                        otomatis dipakai sebagai password awal.
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
