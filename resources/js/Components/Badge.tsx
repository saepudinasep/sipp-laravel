interface Props {
    text: string;
    type?: "success" | "warning" | "danger" | "info" | "neutral";
}

const CLASS_MAP: Record<string, string> = {
    success: "badge-green",
    warning: "badge-amber",
    danger: "badge-red",
    info: "badge-blue",
    neutral: "badge-gray",
};

export default function Badge({ text, type = "success" }: Props) {
    return <span className={`badge ${CLASS_MAP[type]}`}>{text}</span>;
}
