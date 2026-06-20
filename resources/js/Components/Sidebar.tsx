// import React from "react";

// // ─────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────
// export type PageKey =
//     | "dashboard"
//     | "entri-bayar"
//     | "histori"
//     | "laporan"
//     | "data-siswa"
//     | "data-petugas"
//     | "data-kelas"
//     | "data-spp";

// export interface SidebarUser {
//     nama: string;
//     role: string;
//     inisial: string;
// }

// interface SidebarProps {
//     activePage: PageKey;
//     user?: SidebarUser;
//     onNavigate?: (page: PageKey) => void;
//     onLogout?: () => void;
// }

// // ─────────────────────────────────────────────
// // Nav item config
// // ─────────────────────────────────────────────
// const NAV_UTAMA: {
//     key: PageKey;
//     label: string;
//     badge?: number;
//     path: string;
// }[] = [
//     {
//         key: "dashboard",
//         label: "Dashboard",
//         path: "M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 8h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10 0h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm0-18h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v4a1 1 0 001 1z",
//     },
//     {
//         key: "entri-bayar",
//         label: "Entri Pembayaran",
//         badge: 5,
//         path: "M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
//     },
//     {
//         key: "histori",
//         label: "Histori Pembayaran",
//         path: "M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
//     },
//     {
//         key: "laporan",
//         label: "Laporan",
//         path: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
//     },
// ];

// const NAV_MASTER: { key: PageKey; label: string; path: string }[] = [
//     {
//         key: "data-siswa",
//         label: "Data Siswa",
//         path: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
//     },
//     {
//         key: "data-petugas",
//         label: "Data Petugas",
//         path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z",
//     },
//     {
//         key: "data-kelas",
//         label: "Data Kelas",
//         path: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
//     },
//     {
//         key: "data-spp",
//         label: "Data SPP",
//         path: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
//     },
// ];

// // ─────────────────────────────────────────────
// // Component
// // ─────────────────────────────────────────────
// const Sidebar: React.FC<SidebarProps> = ({
//     activePage,
//     user = { nama: "Admin Sekolah", role: "Administrator", inisial: "AD" },
//     onNavigate = () => {},
//     onLogout = () => {},
// }) => {
//     const NavItem = ({
//         pageKey,
//         label,
//         iconPath,
//         badge,
//     }: {
//         pageKey: PageKey;
//         label: string;
//         iconPath: string;
//         badge?: number;
//     }) => {
//         const isActive = activePage === pageKey;
//         return (
//             <div
//                 onClick={() => onNavigate(pageKey)}
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     padding: "9px 10px",
//                     borderRadius: 8,
//                     color: isActive ? "#fff" : "rgba(255,255,255,.5)",
//                     background: isActive ? "#1E6FE8" : "transparent",
//                     fontSize: 13,
//                     fontWeight: 500,
//                     cursor: "pointer",
//                     marginBottom: 2,
//                     transition: "all .15s",
//                 }}
//             >
//                 <svg
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     style={{
//                         width: 18,
//                         height: 18,
//                         flexShrink: 0,
//                         opacity: isActive ? 1 : 0.7,
//                     }}
//                 >
//                     <path d={iconPath} />
//                 </svg>
//                 {label}
//                 {badge !== undefined && (
//                     <span
//                         style={{
//                             marginLeft: "auto",
//                             background: "#EF4444",
//                             color: "#fff",
//                             fontSize: 10,
//                             fontWeight: 700,
//                             padding: "2px 7px",
//                             borderRadius: 20,
//                         }}
//                     >
//                         {badge}
//                     </span>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <aside
//             style={{
//                 width: 224,
//                 flexShrink: 0,
//                 background: "#0F1F3D",
//                 display: "flex",
//                 flexDirection: "column",
//                 position: "sticky",
//                 top: 0,
//                 height: "100vh",
//                 overflowY: "auto",
//                 fontFamily: "'Plus Jakarta Sans', sans-serif",
//             }}
//         >
//             {/* ── Logo ── */}
//             <div
//                 style={{
//                     padding: "20px 20px 16px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 10,
//                     borderBottom: "1px solid rgba(255,255,255,.07)",
//                     marginBottom: 8,
//                 }}
//             >
//                 <div
//                     style={{
//                         width: 36,
//                         height: 36,
//                         background: "#1E6FE8",
//                         borderRadius: 9,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                     }}
//                 >
//                     <svg
//                         viewBox="0 0 24 24"
//                         style={{ width: 18, height: 18, fill: "#fff" }}
//                     >
//                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
//                     </svg>
//                 </div>
//                 <div>
//                     <div
//                         style={{
//                             fontSize: 15,
//                             fontWeight: 700,
//                             color: "#fff",
//                             letterSpacing: "-.2px",
//                         }}
//                     >
//                         SiPP
//                     </div>
//                     <div
//                         style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}
//                     >
//                         SMK RPL
//                     </div>
//                 </div>
//             </div>

//             {/* ── Nav Utama ── */}
//             <div style={{ padding: "6px 12px", marginBottom: 4 }}>
//                 <div
//                     style={{
//                         fontSize: 10,
//                         fontWeight: 700,
//                         color: "rgba(255,255,255,.3)",
//                         letterSpacing: 1,
//                         textTransform: "uppercase",
//                         padding: "4px 8px",
//                         marginBottom: 4,
//                     }}
//                 >
//                     Utama
//                 </div>
//                 {NAV_UTAMA.map((n) => (
//                     <NavItem
//                         key={n.key}
//                         pageKey={n.key}
//                         label={n.label}
//                         iconPath={n.path}
//                         badge={n.badge}
//                     />
//                 ))}
//             </div>

//             {/* ── Master Data ── */}
//             <div style={{ padding: "6px 12px", marginBottom: 4 }}>
//                 <div
//                     style={{
//                         fontSize: 10,
//                         fontWeight: 700,
//                         color: "rgba(255,255,255,.3)",
//                         letterSpacing: 1,
//                         textTransform: "uppercase",
//                         padding: "4px 8px",
//                         marginBottom: 4,
//                     }}
//                 >
//                     Master Data
//                 </div>
//                 {NAV_MASTER.map((n) => (
//                     <NavItem
//                         key={n.key}
//                         pageKey={n.key}
//                         label={n.label}
//                         iconPath={n.path}
//                     />
//                 ))}
//             </div>

//             {/* ── User + Logout ── */}
//             <div
//                 style={{
//                     marginTop: "auto",
//                     padding: "16px 12px",
//                     borderTop: "1px solid rgba(255,255,255,.07)",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 10,
//                         padding: 10,
//                         borderRadius: 8,
//                         background: "rgba(255,255,255,.05)",
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: 34,
//                             height: 34,
//                             borderRadius: "50%",
//                             background: "#1E6FE8",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: 13,
//                             fontWeight: 700,
//                             color: "#fff",
//                             flexShrink: 0,
//                         }}
//                     >
//                         {user.inisial}
//                     </div>
//                     <div>
//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 600,
//                                 color: "#fff",
//                             }}
//                         >
//                             {user.nama}
//                         </div>
//                         <div
//                             style={{
//                                 fontSize: 11,
//                                 color: "rgba(255,255,255,.35)",
//                             }}
//                         >
//                             {user.role}
//                         </div>
//                     </div>
//                 </div>
//                 <button
//                     onClick={onLogout}
//                     style={{
//                         marginTop: 8,
//                         width: "100%",
//                         padding: 8,
//                         border: "1px solid rgba(255,255,255,.1)",
//                         borderRadius: 7,
//                         background: "transparent",
//                         color: "rgba(255,255,255,.4)",
//                         fontFamily: "'Plus Jakarta Sans', sans-serif",
//                         fontSize: 12,
//                         cursor: "pointer",
//                     }}
//                 >
//                     ← Keluar
//                 </button>
//             </div>
//         </aside>
//     );
// };

// export default Sidebar;

import { Link } from "@inertiajs/react";

interface Props {
    menus: {
        name: string;
        route: string;
    }[];
}

export default function Sidebar({ menus }: Props) {
    return (
        <aside className="w-64 bg-slate-900 text-white">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="font-bold">SPP APP</h1>
            </div>

            <nav className="p-4 space-y-2">
                {menus.map((menu) => (
                    <Link
                        key={menu.route}
                        href={route(menu.route)}
                        className="block px-4 py-2 rounded hover:bg-slate-800"
                    >
                        {menu.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
