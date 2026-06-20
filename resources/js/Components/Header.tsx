import { Link } from "@inertiajs/react";

interface Props {
    title: string;
    user: any;
}

export default function Header({ title, user }: Props) {
    return (
        <header className="bg-white border-b">
            <div className="h-16 px-6 flex items-center justify-between">
                <h2 className="font-semibold text-xl">{title}</h2>

                <div className="flex gap-4 items-center">
                    <div>
                        <div>{user.email}</div>

                        <div className="text-xs text-gray-500">{user.role}</div>
                    </div>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </header>
    );
}
