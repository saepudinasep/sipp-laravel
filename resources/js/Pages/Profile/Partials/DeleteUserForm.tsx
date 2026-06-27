/**
 * Catatan: penghapusan akun sendiri (self-service) sengaja TIDAK
 * ditampilkan di halaman Profil pada sistem ini. Akun pengguna
 * (admin/petugas/siswa) terhubung ke data lain yang penting (riwayat
 * transaksi, data siswa/petugas) — menghapus akun sendiri berisiko
 * menimbulkan data tidak konsisten atau, untuk admin, membuat sistem
 * tidak bisa diakses sama sekali jika tidak ada admin lain.
 *
 * Endpoint backend (`profile.destroy`) tetap dipertahankan apa adanya
 * untuk kompatibilitas, namun tidak dipanggil dari UI mana pun.
 * Penghapusan akun pengguna sebaiknya dilakukan oleh Admin lewat
 * halaman Data Siswa / Data Petugas, bukan oleh pengguna itu sendiri.
 */
export default function DeleteUserForm() {
    return null;
}
