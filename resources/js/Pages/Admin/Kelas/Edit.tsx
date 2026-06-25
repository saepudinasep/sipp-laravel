import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface Kelas {
    id: number;
    nama_kelas: string;
    tingkat: "X" | "XI" | "XII";
    jurusan: string;
}

interface Props {
    kelas: Kelas;
}

export default function Edit({ kelas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: kelas.nama_kelas ?? "",
        tingkat: (kelas.tingkat ?? "") as string,
        jurusan: kelas.jurusan ?? "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("admin.kelas.update", kelas.id));
    };

    return (
        <AppLayout title="Edit Kelas">
            <Head title="Edit Kelas" />

            <div className="breadcrumb">
                <Link href={route("admin.kelas.index")}>Data Kelas</Link> ·{" "}
                <span>Edit Kelas</span>
            </div>
            <div className="page-header">
                <h1>Edit Data Kelas</h1>
                <p>Perbarui data {kelas.nama_kelas}.</p>
            </div>

            <form onSubmit={submit}>
                <div className="card" style={{ maxWidth: 560 }}>
                    <div className="card-header">
                        <div className="card-title">Data Kelas</div>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">
                                Nama Kelas <span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.nama_kelas}
                                onChange={(e) =>
                                    setData("nama_kelas", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.nama_kelas}
                                className="form-error"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Tingkat <span className="req">*</span>
                            </label>
                            <select
                                className="form-select"
                                value={data.tingkat}
                                onChange={(e) =>
                                    setData("tingkat", e.target.value)
                                }
                            >
                                <option value="">Pilih tingkat...</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                            </select>
                            <InputError
                                message={errors.tingkat}
                                className="form-error"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Jurusan <span className="req">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={data.jurusan}
                                onChange={(e) =>
                                    setData("jurusan", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.jurusan}
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
                        href={route("admin.kelas.index")}
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
