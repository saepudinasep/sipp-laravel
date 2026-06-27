import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ status }: PageProps<{ status?: string }>) {
    return (
        <AppLayout title="Profil Saya">
            <Head title="Profil" />

            <div className="page-header">
                <h1>Profil Saya</h1>
                <p>Kelola informasi akun dan keamanan login Anda.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="card">
                    <div className="card-body">
                        <UpdateProfileInformationForm
                            status={status}
                            className="max-w-xl"
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
