import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useEffect, useState } from "react";

interface FlashProps extends PageProps {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

export default function Toast() {
    const { props } = usePage<FlashProps>();
    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    useEffect(() => {
        if (props.flash?.success) {
            setMessage({ text: props.flash.success, type: "success" });
        } else if (props.flash?.error) {
            setMessage({ text: props.flash.error, type: "error" });
        }
    }, [props.flash?.success, props.flash?.error]);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(null), 3000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    return (
        <div className="notif show">
            <div
                className="notif-dot"
                style={{
                    background:
                        message.type === "error"
                            ? "var(--red)"
                            : "var(--green)",
                }}
            />
            <span>{message.text}</span>
        </div>
    );
}
