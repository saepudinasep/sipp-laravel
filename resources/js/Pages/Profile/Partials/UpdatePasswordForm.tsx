import InputError from "@/Components/InputError";
import LoadingButton from "@/Components/LoadingButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="card-title" style={{ marginBottom: 4 }}>
                Ubah Password
            </div>
            <p
                style={{
                    fontSize: 12,
                    color: "var(--gray3)",
                    marginBottom: 18,
                }}
            >
                Gunakan password yang panjang dan acak agar akun Anda tetap
                aman.
            </p>

            <form onSubmit={updatePassword}>
                <div className="form-group">
                    <label className="form-label">Password Saat Ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        className="form-input"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="form-error"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password Baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        className="form-input"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password}
                        className="form-error"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Konfirmasi Password Baru
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className="form-input"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="form-error"
                    />
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
