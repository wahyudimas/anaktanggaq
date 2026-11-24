#!/usr/bin/env node
// Membuat kode akses game. Pemakaian:  node tools/make-codes.js <cal|pet|all> <jumlah>
// Kode (CAL-XXXX-XXXX) dikirim ke pembeli. Tempel baris "codes" ke game/config.js (hanya hash yang disimpan).
const crypto = require("crypto"), fs = require("fs"), path = require("path");
const scope = process.argv[2], count = parseInt(process.argv[3] || "10", 10);
if (!["cal", "pet", "all"].includes(scope)) { console.error("Pemakaian: node tools/make-codes.js <cal|pet|all> <jumlah>"); process.exit(1); }
const cfg = fs.readFileSync(path.join(__dirname, "../game/config.js"), "utf8");
const salt = (cfg.match(/salt:\s*"([^"]*)"/) || [, ""])[1];
const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", prefix = { cal: "CAL", pet: "PET", all: "PKT" }[scope];
const rnd = (n) => Array.from(crypto.randomBytes(n), (b) => A[b % A.length]).join("");
const rows = [];
for (let i = 0; i < count; i++) { const code = `${prefix}-${rnd(4)}-${rnd(4)}`; const h = crypto.createHash("sha256").update(salt + code.replace(/[^A-Z0-9]/g, "")).digest("hex"); rows.push({ code, h }); }
console.log("== KODE UNTUK PEMBELI (simpan, jangan masuk repo) ==");
rows.forEach((r) => console.log(r.code));
console.log("\n== TEMPEL KE game/config.js, di dalam array codes ==");
rows.forEach((r) => console.log(`    { h: "${r.h}", scope: "${scope}" },`));
