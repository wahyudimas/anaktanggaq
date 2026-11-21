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
