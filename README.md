# Anak Tangga Q — Website

Situs statis satu halaman untuk Anak Tangga Q.

## Struktur

- `index.html` — seluruh konten halaman
- `styles.css` — warna, tipografi, layout responsif
- `script.js` — tahun dinamis + penanda navigasi
- `.nojekyll` — memberitahu GitHub Pages agar tidak memproses dengan Jekyll

## Publish

Situs ini di-deploy ke GitHub Pages:

```
https://anaktanggaq.pages.dev/
```

Untuk memperbarui:

```sh
git add .
git commit -m "Update situs"
git push
```

GitHub Pages akan otomatis build ulang dalam beberapa menit.

## Domain kustom

Kalau domain `anaktanggaq.com` sudah aktif:

1. Tambahkan file `CNAME` berisi `anaktanggaq.com`
2. Di GitHub: Settings → Pages → Custom domain → `anaktanggaq.com`
3. Di pengaturan DNS: A record ke `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

## Game belajar (`game/`)

Game edukasi statis, jalan di browser (HP/tablet/desktop), tanpa server, bisa offline setelah dibuka sekali.

Isi:
- **Tangga harian:** Calistung 30 hari, Hijaiyah 30 hari (28 huruf + ulangan + kelulusan), Petualangan 60 hari (6 dunia)
- **Taman Latihan:** 7 keterampilan (Huruf A–Z, Membaca, Angka, Berhitung, Hijaiyah, Logika, Warna & Bentuk) × 12 level
- **Papan Rutinitas:** kegiatan pagi & malam yang dicentang anak setiap hari
- 30+ jenis aktivitas, 120 stiker, sertifikat cetak, hingga 4 profil anak, area orang tua

File:
- `game/index.html` — halaman game
- `game/content.js` — data kata, huruf hijaiyah, dunia, rencana harian, level latihan, rutinitas
- `game/acts.js`, `game/acts2.js` — aktivitas interaktif
- `game/app.js` — layar dan alur
- `game/core.js` — penyimpanan (localStorage), suara, maskot, efek, kode akses
- `game/config.js` — hari/level gratis, tautan toko, daftar hash kode akses
- `game/fonts/` — font yang disimpan sendiri (lisensi OFL)
- `tools/make-codes.js` — pembuat kode akses

### Kode akses

```sh
node tools/make-codes.js all 20     # Paket Lengkap: Calistung + Hijaiyah + Petualangan
node tools/make-codes.js hemat 20   # Paket Hemat: Calistung + Petualangan
node tools/make-codes.js cal 20     # Calistung saja
node tools/make-codes.js hij 20     # Hijaiyah saja
node tools/make-codes.js pet 20     # Petualangan saja
```

Kode ditampilkan di terminal untuk dikirim ke pembeli. Tempel baris `{ h: "...", scope: "..." }` ke `codes` di `game/config.js`. Hanya hash yang disimpan di repo. Kode membuka tangga harian sekaligus level Taman Latihan yang terkait.

> **Catatan keamanan:** karena situs ini statis dan repo publik, pembatas kode hanya mengunci tampilan. Orang yang paham teknis tetap bisa membuka semua hari lewat kode sumber, dan satu kode bisa dibagikan ke banyak orang. Untuk perlindungan sungguhan, pindahkan game ke hosting dengan login/pembayaran.

### Uji otomatis

Tambahkan `?test=1` pada alamat game untuk mode uji (jeda dipersingkat, semua hari terbuka).
