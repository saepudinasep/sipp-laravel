import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

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

interface Props {
    petugasList: Petugas[];
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
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Petugas | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Petugas | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nama: "",
            nip: "",
            jabatan: "",
            email: "",
            password: "",
        });

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

    const openCreateModal = () => {
        reset();
        clearErrors();
        setEditTarget(null);
        setModalOpen(true);
    };

    const openEditModal = (petugas: Petugas) => {
        clearErrors();
        setData({
            nama: petugas.nama,
            nip: petugas.nip,
            jabatan: petugas.jabatan,
            email: petugas.user?.email ?? "",
            password: "",
        });
        setEditTarget(petugas);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditTarget(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editTarget) {
            put(route("admin.petugas.update", editTarget.id), {
                onSuccess: closeModal,
            });
        } else {
            post(route("admin.petugas.store"), {
                onSuccess: closeModal,
            });
        }
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
                            {petugasList.length} petugas aktif
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

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openCreateModal}
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
                        </button>
                    </div>
                </div>

                {petugasList.length === 0 ? (
                    <EmptyState
                        title="Belum ada data petugas"
                        description="Klik tombol Tambah Petugas untuk menambahkan data baru."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Petugas</th>
                                    <th>NIP</th>
                                    <th>Jabatan</th>
                                    <th>Username</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {petugasList.map((petugas, idx) => (
                                    <tr key={petugas.id}>
                                        <td>{idx + 1}</td>
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
                                                        background: avatarColor(
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
                                            <div className="td-actions">
                                                <button
                                                    className="btn-icon"
                                                    title="Edit"
                                                    onClick={() =>
                                                        openEditModal(petugas)
                                                    }
                                                >
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn-icon danger"
                                                    title="Hapus"
                                                    onClick={() =>
                                                        setDeleteTarget(petugas)
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

            {modalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submit}>
                            <div className="modal-head">
                                <h3>
                                    {editTarget
                                        ? "Edit Petugas"
                                        : "Tambah Petugas Baru"}
                                </h3>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={closeModal}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Nama Lengkap{" "}
                                            <span className="req">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Contoh: Ibu Wati"
                                            value={data.nama}
                                            onChange={(e) =>
                                                setData("nama", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.nama}
                                            className="form-error"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            NIP <span className="req">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="19800101200001001"
                                            value={data.nip}
                                            onChange={(e) =>
                                                setData("nip", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.nip}
                                            className="form-error"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Jabatan <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: Staff Keuangan"
                                        value={data.jabatan}
                                        onChange={(e) =>
                                            setData("jabatan", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.jabatan}
                                        className="form-error"
                                    />
                                </div>

                                <div
                                    style={{
                                        borderTop: "1px solid var(--gray1)",
                                        margin: "18px 0 14px",
                                        paddingTop: 14,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: "var(--gray4)",
                                    }}
                                >
                                    AKUN LOGIN
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Email <span className="req">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="nama@sekolah.id"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="form-error"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Password{" "}
                                        {!editTarget && (
                                            <span className="req">*</span>
                                        )}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder={
                                            editTarget
                                                ? "Kosongkan jika tidak diubah"
                                                : "Minimal 6 karakter"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="form-error"
                                    />
                                </div>
                            </div>

                            <div className="modal-foot">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeModal}
                                >
                                    Batal
                                </button>
                                <LoadingButton
                                    type="submit"
                                    loading={processing}
                                    loadingText="Menyimpan..."
                                >
                                    {editTarget
                                        ? "Simpan Perubahan"
                                        : "Simpan Petugas"}
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
