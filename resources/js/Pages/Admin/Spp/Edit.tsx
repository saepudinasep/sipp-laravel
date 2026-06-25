import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface SppItem {
    id: number;
    jenis: string;
    nominal: number;
    bulan: number;
    tahun_ajaran: string;
}

interface BulanOption {
    value: number;
    label: string;
}

interface Props {
    spp: SppItem;
    bulanList: BulanOption[];
}

export default function Edit({ spp, bulanList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        jenis: spp.jenis ?? "",
        nominal: String(spp.nominal ?? ""),
        bulan: String(spp.bulan ?? ""),
        tahun_ajaran: spp.tahun_ajaran ?? "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("admin.spp.update", spp.id));
    };

    return (
        <AppLayout title="Edit SPP">
            <Head title="Edit SPP" />

            <div className="breadcrumb">
                <Link href={route("admin.spp.index")}>Data SPP</Link> ·{" "}
                <span>Edit SPP</span>
            </div>
            <div className="page-header">
                <h1>Edit Data SPP</h1>
                <p>Perbarui data SPP {spp.jenis}.</p>
            </div>

            <form onSubmit={submit}>
                <div className="card" style={{ maxWidth: 560 }}>
                    <div className="card-header">
                        <div className="card-title">Data SPP</div>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">
                                Jenis SPP <span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
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
                                    {bulanList.map((b) => (
                                        <option key={b.value} value={b.value}>
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
                                    Tahun Ajaran <span className="req">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
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
                                value={data.nominal}
                                onChange={(e) =>
                                    setData("nominal", e.target.value)
                                }
                            />
                            <div className="form-hint">
                                Hanya mengubah nominal bulan ini, bulan lain
                                tidak terpengaruh.
                            </div>
                            <InputError
                                message={errors.nominal}
                                className="form-error"
                            />
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
                        loadingText="Menyimpan..."
                    >
                        Simpan Perubahan
                    </LoadingButton>
                </div>
            </form>
        </AppLayout>
    );
}
