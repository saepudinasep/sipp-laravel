import { Link } from "@inertiajs/react";

interface HeaderUser {
    name?: string;
    email: string;
    role?: string;
}

interface Props {
    title: string;
    user: HeaderUser;
}

export default function Header({ title, user }: Props) {
    const initials = (user.name || user.email || "?")
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <header className="topbar">
            <h2 className="topbar-title">{title}</h2>

            <div className="topbar-user">
                <div className="user-avatar">{initials}</div>

                <div className="topbar-user-info">
                    <div className="topbar-user-email">
                        {user.name || user.email}
                    </div>
                    {user.role && (
                        <div className="topbar-user-role">{user.role}</div>
                    )}
                </div>

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="topbar-logout"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18z" />
                    </svg>
                    Logout
                </Link>
            </div>
        </header>
    );
}
