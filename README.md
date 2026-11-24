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
https://wahyudimas.github.io/anaktanggaq/
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

Game edukasi statis, jalan di browser (HP/tablet/desktop), tanpa server.

- `game/index.html` — halaman game
- `game/content.js` — data kata, dunia, dan rencana 30 hari Calistung + 60 hari Petualangan
- `game/acts.js` — 19 jenis aktivitas (tebak huruf, tebalkan dengan jari, labirin, titik, sudoku bentuk, dll.)
- `game/app.js` — layar: profil, peta tangga, bermain, hadiah, album stiker, sertifikat, area orang tua
- `game/core.js` — penyimpanan (localStorage), suara, maskot, efek
- `game/config.js` — hari gratis, tautan toko, daftar hash kode akses
- `tools/make-codes.js` — pembuat kode akses

### Kode akses

```sh
node tools/make-codes.js all 20   # paket hemat (semua)
node tools/make-codes.js cal 20   # hanya Calistung
node tools/make-codes.js pet 20   # hanya Petualangan
```

Kode ditampilkan di terminal untuk dikirim ke pembeli. Tempel baris `{ h: "...", scope: "..." }` ke `codes` di `game/config.js`. Hanya hash yang disimpan di repo.

> **Catatan keamanan:** karena situs ini statis dan repo publik, pembatas kode hanya mengunci tampilan. Orang yang paham teknis tetap bisa membuka semua hari lewat kode sumber, dan satu kode bisa dibagikan ke banyak orang. Untuk perlindungan sungguhan, pindahkan game ke hosting dengan login/pembayaran.

### Uji otomatis

Tambahkan `?test=1` pada alamat game untuk mode uji (jeda dipersingkat, semua hari terbuka).
