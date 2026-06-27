import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function UpdateProfileInformation({
    className = "",
}: {
    mustVerifyEmail?: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <div className="card-title" style={{ marginBottom: 4 }}>
                Informasi Akun
            </div>
            <p
                style={{
                    fontSize: 12,
                    color: "var(--gray3)",
                    marginBottom: 18,
                }}
            >
                Perbarui alamat email yang digunakan untuk login.
            </p>

            {user.role && (
                <div className="info-panel" style={{ marginBottom: 18 }}>
                    <div className="info-row">
                        <span className="info-key">Peran</span>
                        <span
                            className="info-val"
                            style={{ textTransform: "capitalize" }}
                        >
                            {user.role}
                        </span>
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div className="form-group">
                    <label className="form-label">
                        Email <span className="req">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="username"
                    />
                    <InputError message={errors.email} className="form-error" />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 4,
                    }}
                >
                    <LoadingButton
                        type="submit"
                        loading={processing}
                        loadingText="Menyimpan..."
                    >
                        Simpan
                    </LoadingButton>

                    {recentlySuccessful && (
                        <span
                            style={{
                                fontSize: 13,
                                color: "var(--green)",
                                fontWeight: 600,
                            }}
                        >
                            Tersimpan.
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
