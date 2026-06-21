import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

/**
 * Overlay loading tipis yang otomatis muncul setiap kali Inertia
 * berpindah halaman (klik Link, redirect setelah submit form, dll).
 * Dipasang sekali di AppLayout/GuestLayout sehingga berlaku otomatis
 * di seluruh halaman tanpa perlu setup manual per halaman.
 *
 * Bekerja berdampingan dengan progress bar bawaan Inertia (di app.tsx) —
 * progress bar untuk indikasi cepat di bagian atas, overlay ini untuk
 * navigasi yang sedikit lebih lama supaya halaman tidak terasa "diam".
 */
export default function PageLoader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;

        const removeStart = router.on("start", () => {
            // Delay kecil agar navigasi super cepat (<150ms) tidak memicu
            // flash overlay yang mengganggu mata.
            timeout = setTimeout(() => setVisible(true), 150);
        });

        const removeFinish = router.on("finish", () => {
            if (timeout) clearTimeout(timeout);
            setVisible(false);
        });

        return () => {
            removeStart();
            removeFinish();
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="page-loading-overlay">
            <div className="page-loading-spinner" />
        </div>
    );
}
