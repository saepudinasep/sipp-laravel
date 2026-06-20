interface Props {
    title: string;
    value: string | number;
    sub?: string;
    variant?: "blue" | "green" | "amber" | "red";
    trend?: { direction: "up" | "down"; label: string };
}

const ICONS: Record<string, string> = {
    blue: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    green: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    amber: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
    red: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
};

export default function DashboardCard({
    title,
    value,
    sub,
    variant = "blue",
    trend,
}: Props) {
    return (
        <div className={`stat-card ${variant}`}>
            <div className="stat-card-top">
                <div className="stat-card-label">{title}</div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 24 24">
                        <path d={ICONS[variant]} />
                    </svg>
                </div>
            </div>
            <div>
                <div className="stat-card-val">{value}</div>
                {sub && <div className="stat-card-sub">{sub}</div>}
            </div>
            {trend && (
                <div>
                    <span className={`stat-trend ${trend.direction}`}>
                        {trend.direction === "up" ? "↑" : "↓"} {trend.label}
                    </span>
                </div>
            )}
        </div>
    );
}
