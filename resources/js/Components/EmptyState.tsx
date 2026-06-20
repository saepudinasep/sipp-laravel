interface Props {
    title: string;
    description?: string;
}

export default function EmptyState({ title, description }: Props) {
    return (
        <div className="empty-state">
            <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ margin: "0 auto 12px", opacity: 0.5 }}
            >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 13h6M9 17h3" />
            </svg>
            <p style={{ fontWeight: 600, color: "var(--text2)" }}>{title}</p>
            {description && (
                <p style={{ marginTop: 4, fontSize: 12 }}>{description}</p>
            )}
        </div>
    );
}
