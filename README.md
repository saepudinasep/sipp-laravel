<div align="center">

  <h1>⚖️ SIPP — Sistem Informasi Pengelolaan Perkara</h1>

  <p>Aplikasi web untuk mengelola data perkara secara digital — mulai dari pencatatan, pelacakan status, hingga cetak dokumen dan ekspor laporan.</p>

  <p>
    <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
    <img src="https://img.shields.io/badge/Inertia.js-React-8b5cf6?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  </p>

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur](#-fitur)
- [Screenshot](#-screenshot)
- [Tech Stack](#-tech-stack)
- [Instalasi](#-instalasi)
- [Login Demo](#-login-demo)
- [Struktur Database](#-struktur-database)
- [Author](#-author)

---

## 📖 Tentang Proyek

**SIPP (Sistem Informasi Pengelolaan Perkara)** adalah aplikasi web yang dirancang untuk membantu instansi atau lembaga dalam mengelola data perkara secara terstruktur dan efisien.

Dengan antarmuka yang modern berbasis **React + Inertia.js**, pengguna dapat mencatat, memantau, dan mencetak dokumen perkara tanpa perlu berpindah sistem. Aplikasi ini juga dilengkapi sistem **role & permission** sehingga setiap pengguna hanya dapat mengakses fitur yang sesuai dengan kewenangannya.

---

## ✨ Fitur

- 📁 **Manajemen Perkara** — Tambah, edit, hapus, dan cari data perkara dengan mudah
- 👥 **Manajemen Pengguna** — Kelola akun pengguna beserta role dan permission-nya
- 🔐 **Role & Permission** — Kontrol akses berbasis peran menggunakan Spatie Laravel Permission
- 📊 **Ekspor Excel** — Unduh data perkara dalam format `.xlsx` siap pakai
- 🖨️ **Cetak PDF** — Generate dan cetak dokumen perkara langsung dari browser
- 📋 **Tabel Interaktif** — Sorting, filtering, dan pagination menggunakan TanStack Table
- 🔔 **Notifikasi** — Konfirmasi aksi dengan SweetAlert2
- ✅ **Validasi Form** — Validasi sisi klien menggunakan React Hook Form + Zod

---

## 📸 Screenshot

> **Petunjuk untuk pemilik repo:** Ganti gambar di bawah dengan screenshot asli aplikasimu.
> Upload gambar ke folder `public/screenshots/` lalu sesuaikan path-nya.

### Halaman Login
<!-- Ganti src berikut dengan screenshot halaman login -->
![Halaman Login](public/screenshots/login.png)

### Dashboard
<!-- Ganti src berikut dengan screenshot halaman dashboard/beranda -->
![Dashboard](public/screenshots/dashboard.png)

### Daftar Perkara
<!-- Ganti src berikut dengan screenshot halaman list data perkara (tabel) -->
![Daftar Perkara](public/screenshots/daftar-perkara.png)

### Form Tambah Perkara
<!-- Ganti src berikut dengan screenshot form input/edit perkara -->
![Form Perkara](public/screenshots/form-perkara.png)

### Manajemen Pengguna
<!-- Ganti src berikut dengan screenshot halaman kelola user & role -->
![Manajemen Pengguna](public/screenshots/manajemen-pengguna.png)

---

## 🛠️ Tech Stack

### Backend
| Paket | Versi | Fungsi |
|---|---|---|
| Laravel | ^12.0 | Framework utama |
| PHP | ^8.2 | Runtime |
| Spatie Permission | ^6.25 | Role & permission |
| barryvdh/laravel-dompdf | ^3.1 | Generate PDF |
| Maatwebsite Excel | ^3.1 | Ekspor Excel |
| Laravel Sanctum | ^4.0 | API authentication |
| Laravel Breeze | ^2.4 | Starter kit autentikasi |

### Frontend
| Paket | Versi | Fungsi |
|---|---|---|
| Inertia.js (React) | ^2.0.0 | Jembatan Laravel ↔ React |
| React | ^18.2.0 | UI library |
| TypeScript | ^5.0.2 | Type-safe JavaScript |
| Tailwind CSS | ^3.2.1 | Utility-first CSS |
| TanStack Table | ^8.21.3 | Tabel interaktif |
| React Hook Form | ^7.79.0 | Manajemen form |
| Zod | ^4.4.3 | Validasi skema |
| SweetAlert2 | ^11.26.25 | Dialog & notifikasi |
| Vite | ^7.0.7 | Build tool |

---

## 🚀 Instalasi

### Prasyarat

Pastikan perangkat sudah terinstal:

- **PHP** >= 8.2
- **Composer**
- **Node.js** >= 18 + **npm**
- **SQLite** (sudah bawaan PHP) _atau_ **MySQL/MariaDB**

---

### Langkah Instalasi

**1. Clone repository**

```bash
git clone https://github.com/saepudinasep/sipp-laravel.git
cd sipp-laravel
```

**2. Instalasi otomatis** _(direkomendasikan)_

```bash
composer run setup
```

Perintah ini secara otomatis akan:
- Install dependensi PHP & Node.js
- Membuat file `.env`
- Generate application key
- Menjalankan migrasi database
- Build aset frontend

**3. Jalankan aplikasi**

```bash
composer run dev
```

Aplikasi berjalan di → **http://localhost:8000**

---

### Instalasi Manual _(opsional)_

Jika ingin menjalankan langkah satu per satu:

```bash
# 1. Install dependensi PHP
composer install

# 2. Salin file konfigurasi environment
cp .env.example .env

# 3. Generate application key
php artisan key:generate

# 4. Jalankan migrasi database
php artisan migrate

# 5. (Opsional) Jalankan seeder untuk data awal
php artisan db:seed

# 6. Install dependensi Node.js
npm install

# 7. Build aset frontend
npm run build

# 8. Jalankan server
php artisan serve
```

---

### Konfigurasi Database

Default menggunakan **SQLite** (tanpa konfigurasi tambahan). Untuk beralih ke **MySQL**, edit file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sipp_db
DB_USERNAME=root
DB_PASSWORD=password_kamu
```

Lalu jalankan ulang migrasi:

```bash
php artisan migrate
```

---

## 🔑 Login Demo

Gunakan akun berikut untuk mencoba aplikasi:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@example.com` | `password` |
| Operator | `operator@example.com` | `password` |

> **Catatan:** Akun demo ini tersedia jika kamu sudah menjalankan `php artisan db:seed`.

---

## 🗄️ Struktur Database

Berikut tabel-tabel utama yang digunakan dalam aplikasi:

```
┌─────────────────────────────────────────────────────────┐
│                     SIPP DATABASE                       │
├──────────────────────┬──────────────────────────────────┤
│ users                │ id, name, email, password        │
│                      │ email_verified_at, remember_token│
├──────────────────────┼──────────────────────────────────┤
│ roles                │ id, name, guard_name             │
│ permissions          │ id, name, guard_name             │
│ model_has_roles      │ role_id, model_type, model_id    │
│ model_has_permissions│ permission_id, model_type,       │
│                      │ model_id                         │
│ role_has_permissions │ permission_id, role_id           │
├──────────────────────┼──────────────────────────────────┤
│ perkara              │ id, nomor_perkara, judul,        │
│                      │ jenis, status, tanggal_masuk,    │
│                      │ keterangan, timestamps           │
├──────────────────────┼──────────────────────────────────┤
│ sessions             │ id, user_id, ip_address,         │
│                      │ payload, last_activity           │
│ cache                │ key, value, expiration           │
│ jobs                 │ id, queue, payload, attempts     │
└──────────────────────┴──────────────────────────────────┘
```

> **Catatan:** Skema lengkap ada di folder `database/migrations/`. Jalankan `php artisan migrate` untuk membuat semua tabel secara otomatis.

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/saepudinasep">
        <img src="https://github.com/saepudinasep.png" width="100px;" alt="Saepudin Asep"/><br />
        <b>Saepudin Asep</b>
      </a>
      <br />
      <a href="https://github.com/saepudinasep">@saepudinasep</a>
    </td>
  </tr>
</table>

---

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan Laravel & React</p>
  <p>
    <a href="https://github.com/saepudinasep/sipp-laravel/issues">Laporkan Bug</a> ·
    <a href="https://github.com/saepudinasep/sipp-laravel/issues">Request Fitur</a>
  </p>
</div>
