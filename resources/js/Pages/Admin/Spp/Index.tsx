import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<SppItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SppItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            jenis: "",
            nominal: "",
            bulan: "",
            tahun_ajaran: tahunAjaran,
        });

    const handleTahunAjaranChange = (value: string) => {
        setTahunAjaran(value);
        router.get(
            route("admin.spp.index"),
            { tahun_ajaran: value || undefined },
            { preserveState: true, replace: true },
        );
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setData({
            jenis: "",
            nominal: "",
            bulan: "",
            tahun_ajaran: tahunAjaran,
        });
        setEditTarget(null);
        setModalOpen(true);
    };

    const openEditModal = (spp: SppItem) => {
        clearErrors();
        setData({
            jenis: spp.jenis,
            nominal: String(spp.nominal),
            bulan: String(spp.bulan),
            tahun_ajaran: spp.tahun_ajaran,
        });
        setEditTarget(spp);
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
            put(route("admin.spp.update", editTarget.id), {
                onSuccess: closeModal,
            });
        } else {
            post(route("admin.spp.store"), {
                onSuccess: closeModal,
            });
        }
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

    return (
        <AppLayout title="Data SPP">
            <Head title="Data SPP" />

            <div className="breadcrumb">
                Master Data · <span>Data SPP</span>
            </div>
            <div className="page-header">
                <h1>Data SPP</h1>
                <p>Kelola jenis dan nominal SPP per periode.</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title">Daftar Jenis SPP</div>
                        <div className="card-subtitle">
                            TA {tahunAjaran || "—"}
                        </div>
                    </div>

                    <div className="card-actions">
                        <select
                            className="form-select"
                            style={{ width: 150, padding: "8px 12px" }}
                            value={tahunAjaran}
                            onChange={(e) =>
                                handleTahunAjaranChange(e.target.value)
                            }
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
                            Tambah SPP
                        </button>
                    </div>
                </div>

                {sppList.length === 0 ? (
                    <EmptyState
                        title="Belum ada data SPP"
                        description="Klik tombol Tambah SPP untuk menambahkan jenis SPP baru."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Jenis SPP</th>
                                    <th>Nominal</th>
                                    <th>Bulan</th>
                                    <th>Tahun Ajaran</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sppList.map((spp, idx) => (
                                    <tr key={spp.id}>
                                        <td>{idx + 1}</td>
                                        <td className="td-name">{spp.jenis}</td>
                                        <td
                                            style={{
                                                fontWeight: 700,
                                                color: "var(--blue)",
                                            }}
                                        >
                                            {formatRupiah(spp.nominal)}
                                        </td>
                                        <td>{spp.bulan_label}</td>
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
                                                    title="Hapus"
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
                )}
            </div>

            {modalOpen && (
                <div className="modal-overlay open">
                    <div className="modal">
                        <form onSubmit={submit}>
                            <div className="modal-head">
                                <h3>
                                    {editTarget
                                        ? "Edit Data SPP"
                                        : "Tambah Data SPP"}
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
                                <div className="form-group">
                                    <label className="form-label">
                                        Jenis SPP <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Contoh: SPP Reguler"
                                        value={data.jenis}
                                        onChange={(e) =>
                                            setData("jenis", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.jenis}
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
                                            value={data.bulan}
                                            onChange={(e) =>
                                                setData("bulan", e.target.value)
                                            }
                                        >
                                            <option value="">
                                                Pilih bulan...
                                            </option>
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
                                            message={errors.bulan}
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
                                            placeholder="2026/2027"
                                            value={data.tahun_ajaran}
                                            onChange={(e) =>
                                                setData(
                                                    "tahun_ajaran",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.tahun_ajaran}
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
                                        placeholder="150000"
                                        value={data.nominal}
                                        onChange={(e) =>
                                            setData("nominal", e.target.value)
                                        }
                                    />
                                    <div className="form-hint">
                                        Nominal dalam Rupiah, tanpa titik atau
                                        koma.
                                    </div>
                                    <InputError
                                        message={errors.nominal}
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
                                        : "Simpan SPP"}
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
