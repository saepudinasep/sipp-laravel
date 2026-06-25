import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface Props {
    tahunAjaranList: string[];
}

export default function Create({ tahunAjaranList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        jenis: "",
        nominal: "",
        tahun_ajaran: tahunAjaranList[0] ?? "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.spp.store"));
    };

    return (
        <AppLayout title="Tambah SPP">
            <Head title="Tambah SPP" />

            <div className="breadcrumb">
                <Link href={route("admin.spp.index")}>Data SPP</Link> ·{" "}
                <span>Tambah SPP</span>
            </div>
            <div className="page-header">
                <h1>Tambah Data SPP</h1>
                <p>
                    Lengkapi data SPP yang akan ditambahkan. SPP akan otomatis
                    dibuat untuk 12 bulan (Januari–Desember) dengan nominal yang
                    sama.
                </p>
            </div>

            <form onSubmit={submit}>
                <div className="card" style={{ maxWidth: 560 }}>
                    <div className="card-header">
                        <div className="card-title">Data SPP</div>
                    </div>
                    <div className="card-body">
                        <div
                            className="info-panel"
                            style={{ marginBottom: 18 }}
                        >
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "var(--gray4)",
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                SPP akan otomatis dibuat untuk{" "}
                                <strong>12 bulan (Januari–Desember)</strong>{" "}
                                dengan nominal yang sama. Bulan yang sudah ada
                                sebelumnya akan dilewati.
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
                                    Tahun Ajaran <span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="2026/2027"
                                    value={data.tahun_ajaran}
                                    onChange={(e) =>
                                        setData("tahun_ajaran", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.tahun_ajaran}
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
                                    value={data.nominal}
                                    onChange={(e) =>
                                        setData("nominal", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.nominal}
                                    className="form-error"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 16,
                    }}
                >
                    <Link
                        href={route("admin.spp.index")}
                        className="btn btn-outline"
                    >
                        Batal
                    </Link>
                    <LoadingButton
                        type="submit"
                        loading={processing}
                        loadingText="Membuat 12 bulan..."
                    >
                        Buat untuk 12 Bulan
                    </LoadingButton>
                </div>
            </form>
        </AppLayout>
    );
}
