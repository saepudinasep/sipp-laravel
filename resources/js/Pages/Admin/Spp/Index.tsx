import AppLayout from "@/Layouts/AppLayout";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";
import EmptyState from "@/Components/EmptyState";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, router } from "@inertiajs/react";
import { useMemo, useState } from "react";

interface SppItem {
    id: number;
    jenis: string;
    nominal: number;
    bulan: number;
    bulan_label: string;
    tahun_ajaran: string;
}

interface Props {
    sppList: SppItem[];
    tahunAjaranList: string[];
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

export default function Index({ sppList, tahunAjaranList, filters }: Props) {
    const [tahunAjaran, setTahunAjaran] = useState(
        filters.tahun_ajaran ?? tahunAjaranList[0] ?? "",
    );

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

                <Link
                    href={route("admin.spp.create")}
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
                    Tambah SPP (12 Bulan)
                </Link>
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
                                                    <Link
                                                        href={route(
                                                            "admin.spp.edit",
                                                            spp.id,
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
