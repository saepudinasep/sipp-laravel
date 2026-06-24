import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useMemo, useState } from "react";

interface SppItem {
    id: number;
    jenis: string;
    nominal: number;
    bulan: number;
    bulan_label: string;
    tahun_ajaran: string;
}

interface BulanOption {
    value: number;
    label: string;
}

interface Props {
    sppList: SppItem[];
    tahunAjaranList: string[];
    bulanList: BulanOption[];
    filters: {
        tahun_ajaran: string | null;
    };
}

interface GroupTarget {
    jenis: string;
    tahun_ajaran: string;
    [key: string]: string;
}

function formatRupiah(value: number) {
    return "Rp " + value.toLocaleString("id-ID");
}

export default function Index({
    sppList,
    tahunAjaranList,
    bulanList,
    filters,
}: Props) {
    const [tahunAjaran, setTahunAjaran] = useState(
        filters.tahun_ajaran ?? tahunAjaranList[0] ?? "",
    );

    // Modal "Tambah SPP" — sekali submit otomatis generate 12 bulan.
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const createForm = useForm({
        jenis: "",
        nominal: "",
        tahun_ajaran: tahunAjaran,
    });

    // Modal "Edit" — tetap per-bulan, untuk penyesuaian satu bulan saja.
    const [editTarget, setEditTarget] = useState<SppItem | null>(null);
    const editForm = useForm({
        jenis: "",
        nominal: "",
        bulan: "",
        tahun_ajaran: "",
    });

    // Hapus satu bulan saja.
    const [deleteTarget, setDeleteTarget] = useState<SppItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Hapus seluruh 12 bulan dalam satu jenis SPP sekaligus.
    const [deleteGroupTarget, setDeleteGroupTarget] =
        useState<GroupTarget | null>(null);
    const [isDeletingGroup, setIsDeletingGroup] = useState(false);

    // Kelompokkan data per jenis SPP, supaya satu kartu mewakili satu
    // "paket" SPP 12 bulan — bukan 12 baris terpisah yang membingungkan.
    const groups = useMemo(() => {
        const map = new Map<string, SppItem[]>();
        for (const item of sppList) {
            const list = map.get(item.jenis) ?? [];
            list.push(item);
            map.set(item.jenis, list);
        }
        return Array.from(map.entries()).map(([jenis, items]) => ({
            jenis,
            items: items.sort((a, b) => a.bulan - b.bulan),
        }));
    }, [sppList]);

    const handleTahunAjaranChange = (value: string) => {
        setTahunAjaran(value);
        router.get(
            route("admin.spp.index"),
            { tahun_ajaran: value || undefined },
            { preserveState: true, replace: true },
        );
    };

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        createForm.setData({
            jenis: "",
            nominal: "",
            tahun_ajaran: tahunAjaran,
        });
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route("admin.spp.store"), {
            onSuccess: closeCreateModal,
        });
    };

    const openEditModal = (spp: SppItem) => {
        editForm.clearErrors();
        editForm.setData({
            jenis: spp.jenis,
            nominal: String(spp.nominal),
            bulan: String(spp.bulan),
            tahun_ajaran: spp.tahun_ajaran,
        });
        setEditTarget(spp);
    };

    const closeEditModal = () => {
        setEditTarget(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(route("admin.spp.update", editTarget.id), {
            onSuccess: closeEditModal,
        });
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route("admin.spp.destroy", deleteTarget.id), {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const confirmDeleteGroup = () => {
        if (!deleteGroupTarget) return;
        setIsDeletingGroup(true);
        router.delete(route("admin.spp.destroy-bulk"), {
            data: deleteGroupTarget,
            onFinish: () => {
                setIsDeletingGroup(false);
                setDeleteGroupTarget(null);
            },
        });
    };

    return (
        <AppLayout title="Data SPP">
            <Head title="Data SPP" />

            <div className="breadcrumb">
                Master Data · <span>Data SPP</span>
            </div>
            <div className="page-header">
                <h1>Data SPP</h1>
                <p>
                    Kelola jenis dan nominal SPP. Sekali tambah otomatis berlaku
                    untuk 12 bulan (Januari–Desember).
                </p>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    flexWrap: "wrap",
                    gap: 10,
                }}
            >
                <select
                    className="form-select"
                    style={{ width: 150, padding: "8px 12px" }}
                    value={tahunAjaran}
                    onChange={(e) => handleTahunAjaranChange(e.target.value)}
                >
                    {tahunAjaranList.length === 0 && (
                        <option value="">Belum ada data</option>
                    )}
                    {tahunAjaranList.map((ta) => (
                        <option key={ta} value={ta}>
                            {ta}
                        </option>
                    ))}
                </select>

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
                    Tambah SPP (12 Bulan)
                </button>
            </div>

            {groups.length === 0 ? (
                <EmptyState
                    title="Belum ada data SPP"
                    description="Klik tombol Tambah SPP untuk membuat jenis SPP baru — otomatis untuk 12 bulan."
                />
            ) : (
                groups.map((group) => (
                    <div className="card" key={group.jenis}>
                        <div className="card-header">
                            <div>
                                <div className="card-title">{group.jenis}</div>
                                <div className="card-subtitle">
                                    TA {tahunAjaran} · {group.items.length} dari
                                    12 bulan ·{" "}
                                    {formatRupiah(group.items[0]?.nominal ?? 0)}
                                    /bulan
                                </div>
                            </div>
                            <div className="card-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() =>
                                        setDeleteGroupTarget({
                                            jenis: group.jenis,
                                            tahun_ajaran: tahunAjaran,
                                        })
                                    }
                                    style={{ color: "var(--red)" }}
                                >
                                    Hapus Semua Bulan
                                </button>
                            </div>
                        </div>

                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Bulan</th>
                                        <th>Nominal</th>
                                        <th>Tahun Ajaran</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.items.map((spp) => (
                                        <tr key={spp.id}>
                                            <td className="td-name">
                                                {spp.bulan_label}
                                            </td>
                                            <td
                                                style={{
                                                    fontWeight: 700,
                                                    color: "var(--blue)",
                                                }}
                                            >
                                                {formatRupiah(spp.nominal)}
                                            </td>
                                            <td className="td-mono">
                                                {spp.tahun_ajaran}
                                            </td>
                                            <td>
                                                <div className="td-actions">
                                                    <button
                                                        className="btn-icon"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEditModal(spp)
                                                        }
                                                    >
                                                        <svg viewBox="0 0 24 24">
                                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        className="btn-icon danger"
                                                        title="Hapus bulan ini"
                                                        onClick={() =>
                                                            setDeleteTarget(spp)
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
                    </div>
                ))
            )}

            {/* Modal Tambah SPP — generate 12 bulan sekaligus */}
            {createModalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submitCreate}>
                            <div className="modal-head">
                                <h3>Tambah Data SPP</h3>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={closeCreateModal}
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
                                        SPP akan otomatis dibuat untuk{" "}
                                        <strong>
                                            12 bulan (Januari–Desember)
                                        </strong>{" "}
                                        dengan nominal yang sama. Bulan yang
                                        sudah ada sebelumnya akan dilewati.
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Jenis SPP <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: SPP Reguler"
                                        value={createForm.data.jenis}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "jenis",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={createForm.errors.jenis}
                                        className="form-error"
                                    />
                                </div>

                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Tahun Ajaran{" "}
                                            <span className="req">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="2026/2027"
                                            value={createForm.data.tahun_ajaran}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "tahun_ajaran",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                createForm.errors.tahun_ajaran
                                            }
                                            className="form-error"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Nominal / Bulan{" "}
                                            <span className="req">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            className="form-input"
                                            placeholder="150000"
                                            value={createForm.data.nominal}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "nominal",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={createForm.errors.nominal}
                                            className="form-error"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-foot">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeCreateModal}
                                >
                                    Batal
                                </button>
                                <LoadingButton
                                    type="submit"
                                    loading={createForm.processing}
                                    loadingText="Membuat 12 bulan..."
                                >
                                    Buat untuk 12 Bulan
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit — satu bulan saja */}
            {editTarget && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submitEdit}>
                            <div className="modal-head">
                                <h3>Edit SPP — {editTarget.bulan_label}</h3>
                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={closeEditModal}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">
                                        Jenis SPP <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={editForm.data.jenis}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "jenis",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={editForm.errors.jenis}
                                        className="form-error"
                                    />
                                </div>

                                <div className="form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Bulan <span className="req">*</span>
                                        </label>
                                        <select
                                            className="form-select"
                                            value={editForm.data.bulan}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "bulan",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {bulanList.map((b) => (
                                                <option
                                                    key={b.value}
                                                    value={b.value}
                                                >
                                                    {b.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={editForm.errors.bulan}
                                            className="form-error"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Tahun Ajaran{" "}
                                            <span className="req">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={editForm.data.tahun_ajaran}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "tahun_ajaran",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                editForm.errors.tahun_ajaran
                                            }
                                            className="form-error"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Nominal <span className="req">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        className="form-input"
                                        value={editForm.data.nominal}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "nominal",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <div className="form-hint">
                                        Hanya mengubah nominal bulan ini, bulan
                                        lain tidak terpengaruh.
                                    </div>
                                    <InputError
                                        message={editForm.errors.nominal}
                                        className="form-error"
                                    />
                                </div>
                            </div>

                            <div className="modal-foot">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeEditModal}
                                >
                                    Batal
                                </button>
                                <LoadingButton
                                    type="submit"
                                    loading={editForm.processing}
                                    loadingText="Menyimpan..."
                                >
                                    Simpan Perubahan
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

            {deleteGroupTarget && (
                <div className="modal-overlay open">
                    <div className="modal" style={{ maxWidth: 400 }}>
                        <div className="modal-head">
                            <h3>Hapus Semua Bulan?</h3>
                            <button
                                className="modal-close"
                                onClick={() => setDeleteGroupTarget(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 13, color: "var(--text2)" }}>
                                Seluruh 12 bulan untuk{" "}
                                <strong>{deleteGroupTarget.jenis}</strong> TA{" "}
                                {deleteGroupTarget.tahun_ajaran} akan dihapus.
                                Bulan yang sudah punya transaksi pembayaran akan
                                otomatis dilindungi dan tidak ikut terhapus.
                            </p>
                        </div>
                        <div className="modal-foot">
                            <button
                                className="btn btn-outline"
                                onClick={() => setDeleteGroupTarget(null)}
                            >
                                Batal
                            </button>
                            <LoadingButton
                                variant="danger"
                                loading={isDeletingGroup}
                                loadingText="Menghapus..."
                                onClick={confirmDeleteGroup}
                            >
                                Hapus Semua
                            </LoadingButton>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
