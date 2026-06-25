import AppLayout from "@/Layouts/AppLayout";
import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface Petugas {
    id: number;
    nama: string;
    nip: string;
    jabatan: string;
    user: {
        email: string;
    } | null;
}

interface Props {
    petugas: Petugas;
}

export default function Edit({ petugas }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: petugas.nama ?? "",
        nip: petugas.nip ?? "",
        jabatan: petugas.jabatan ?? "",
        email: petugas.user?.email ?? "",
        password: "",
    });

    // console.log(petugas);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("admin.petugas.update", petugas.id));
    };

    return (
        <AppLayout title="Edit Petugas">
            <Head title="Edit Petugas" />

            <div className="breadcrumb">
                <Link href={route("admin.petugas.index")}>Data Petugas</Link> ·{" "}
                <span>Edit Petugas</span>
            </div>
            <div className="page-header">
                <h1>Edit Data Petugas</h1>
                <p>Perbarui data {petugas.nama}.</p>
            </div>

            <form onSubmit={submit}>
                <div className="two-col">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Data Pribadi</div>
                        </div>
                        <div className="card-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">
                                        Nama Lengkap{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
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
                        </div>
                    </div>

                    <div className="card" style={{ alignSelf: "start" }}>
                        <div className="card-header">
                            <div className="card-title">Akun Login</div>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">
                                    Email <span className="req">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
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
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <div className="form-hint">
                                    Minimal 6 karakter. Biarkan kosong untuk
                                    mempertahankan password lama.
                                </div>
                                <InputError
                                    message={errors.password}
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
                        marginTop: 4,
                    }}
                >
                    <Link
                        href={route("admin.petugas.index")}
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
