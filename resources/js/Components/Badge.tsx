interface Props {
    text: string;
    type?: "success" | "warning" | "danger";
}

export default function Badge({ text, type = "success" }: Props) {
    const color = {
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm ${color[type]}`}>
            {text}
        </span>
    );
}
