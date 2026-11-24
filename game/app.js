// Layar & alur permainan.
(function () {
  const { h } = G, app = document.getElementById("app"), CFG = window.GAME_CONFIG;
  const AVATARS = ["🐻", "🐰", "🦊", "🐼", "🐯", "🐸", "🦄", "🐙"];
  let token = 0;

  const view = (...kids) => { token++; document.onkeydown = null; app.replaceChildren(...kids); window.scrollTo(0, 0); };
  const btn = (cls, txt, on) => h("button", { class: "btn " + cls, onclick: on }, txt);
  const back = (on, label = "‹ Kembali") => h("button", { class: "back", onclick: on, "aria-label": "Kembali" }, label);
  const chip = (i, t) => h("span", { class: "chip" }, h("b", {}, i), " ", t);

  // ---------- modal ----------
  function modal(...kids) {
    const ov = h("div", { class: "overlay", onclick: (e) => { if (e.target === ov) ov.remove(); } }, h("div", { class: "sheet" }, h("button", { class: "x", onclick: () => ov.remove(), "aria-label": "Tutup" }, "✕"), ...kids));
    document.body.append(ov); return ov;
  }

  // ---------- profil ----------
  function screenWelcome() {
    const first = !G.state.profiles.length;
    let av = AVATARS[0];
    const input = h("input", { class: "input", maxlength: 14, placeholder: "Nama si kecil", "aria-label": "Nama anak" });
    const picks = h("div", { class: "avatars" }, AVATARS.map((a, i) => { const b = h("button", { class: "av" + (i ? "" : " sel"), onclick: () => { av = a; picks.querySelectorAll(".av").forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); G.sfx("pop"); } }, a); return b; }));
    const go = btn("primary big", "Ayo mulai! 🪜", () => { const n = input.value.trim(); if (!n) { input.classList.add("shake"); input.focus(); setTimeout(() => input.classList.remove("shake"), 500); return; } G.addProfile(n, av); screenHome(); });
    view(h("main", { class: "page center" },
      !first && back(screenProfiles),
      h("div", { class: "hero-m" }, G.m("happy")),
      h("h1", {}, first ? "Halo! Ayo naik tangga bersama" : "Siapa yang mau belajar?"),
      h("p", { class: "lead" }, "Satu anak tangga sehari. Belajar calistung sambil bermain, cukup 10–15 menit."),
      input, h("p", { class: "label" }, "Pilih teman:"), picks, go,
      first && h("p", { class: "micro" }, "Data tersimpan di perangkat ini saja. Tanpa akun, tanpa iklan.")));
    setTimeout(() => G.say("Halo! Ayo naik tangga bersama"), 300);
  }
  function screenProfiles() {
    view(h("main", { class: "page center" },
      h("div", { class: "hero-m" }, G.m("happy")), h("h1", {}, "Siapa yang main hari ini?"),
      h("div", { class: "pcards" }, G.state.profiles.map((p) => h("button", { class: "pcard", onclick: () => { G.state.current = p.id; G.save(); screenHome(); } }, h("em", {}, p.avatar), h("b", {}, p.name)))),
      G.state.profiles.length < 4 && btn("ghost", "+ Tambah anak", screenWelcome)));
  }

  // ---------- beranda ----------
  function screenHome() {
    const p = G.profile(); if (!p) return screenWelcome();
    const card = (t) => {
      const T = C.TRACKS[t], dn = G.doneCount(t), pct = Math.round((dn / T.days) * 100), open = G.isUnlocked(t);
      return h("button", { class: "track " + t, onclick: () => screenMap(t) },
        h("em", {}, T.icon), h("div", {}, h("b", {}, T.name), h("span", {}, T.sub), h("div", { class: "bar" }, h("i", { style: { width: pct + "%" } })), h("small", {}, dn + " / " + T.days + " hari" + (open ? "" : " · pratinjau gratis " + CFG.freeDays[t] + " hari"))),
        h("span", { class: "go" }, "›"));
    };
    const stk = G.doneCount("cal") + G.doneCount("pet");
    view(h("main", { class: "page" },
      h("header", { class: "topbar" }, h("button", { class: "who", onclick: screenProfiles }, p.avatar, " ", p.name, " ▾"), h("button", { class: "gear", onclick: parentGate, "aria-label": "Area orang tua" }, "⚙️")),
      h("div", { class: "greet" }, h("div", { class: "hero-m sm" }, G.m("happy")), h("div", {}, h("h1", {}, "Halo, " + p.name + "!"), h("p", { class: "lead" }, G.streak() > 0 ? "Kamu sudah main " + G.streak() + " hari berturut-turut. Keren!" : "Siap naik satu anak tangga hari ini?"))),
      h("div", { class: "chips" }, chip("🔥", G.streak() + " hari"), chip("⭐", G.totalStars() + " bintang"), chip("🧸", stk + " stiker")),
      h("h2", {}, "Pilih tangga"), card("cal"), card("pet"),
      h("div", { class: "row2" }, btn("ghost", "🧸 Album stiker", () => screenAlbum("cal")), btn("ghost", "🏅 Sertifikat", screenCerts)),
      !(G.isUnlocked("cal") && G.isUnlocked("pet")) && h("div", { class: "unlockbar" }, h("span", {}, "Buka semua hari dengan kode dari pembelian"), btn("primary small", "Masukkan kode", () => unlockModal()))));
  }

  // ---------- peta tangga ----------
  const PHASES = { cal: [[10, "Mengenal huruf", "🔤"], [20, "Angka & berhitung", "🔢"], [27, "Mulai membaca", "📖"], [30, "Menambah", "➕"]] };
  function maxDone(t) { return Math.max(0, ...Object.keys(G.profile().prog[t].d).map(Number)); }
  function dayState(t, n) {
    if (!G.dayOpen(t, n)) return "nopay";
    if (G.done(t, n)) return "done";
    const nx = maxDone(t) + 1;
    if (n === nx) return !G.state.settings.free && G.profile().prog[t].last === G.today() ? "wait" : "current";
    return "future";
  }
  function screenMap(t) {
    const T = C.TRACKS[t], rows = []; let currentEl = null;
    for (let n = T.days; n >= 1; n--) {
      const st = dayState(t, n), plan = C.plan(t, n), d = G.done(t, n);
      if (t === "pet" && n % 10 === 0) { const w = C.worlds[n / 10 - 1]; rows.push(h("div", { class: "banner", style: { background: w.color } }, h("em", {}, w.icon), h("b", {}, w.name))); }
      if (t === "cal") { const ph = PHASES.cal.find((x) => x[0] === n); if (ph) rows.push(h("div", { class: "banner", style: { background: "#1B2A4A" } }, h("em", {}, ph[2]), h("b", {}, ph[1]))); }
      const inner = st === "done" ? [h("span", { class: "stk" }, C.sticker(t, n)), h("span", { class: "stars" }, "★".repeat(d.stars) + "☆".repeat(3 - d.stars))]
        : st === "nopay" ? [h("span", { class: "lk" }, "🔒")] : st === "wait" ? [h("span", { class: "lk" }, "🌙")] : [h("b", {}, n)];
      const node = h("button", { class: "node " + st, onclick: () => dayModal(t, n, st), "aria-label": "Hari " + n + " " + plan.title }, inner, st === "current" && h("div", { class: "me" }, G.m("happy")));
      if (st === "current" || (st === "wait" && !currentEl)) currentEl = node;
      rows.push(h("div", { class: "rowm pos" + (n % 4) }, h("div", { class: "stepblock" }), node, h("span", { class: "dlabel" }, "Hari " + n)));
    }
    view(h("main", { class: "page map " + t },
      h("header", { class: "topbar" }, back(screenHome), h("b", { class: "ttl" }, T.name), h("span", { class: "chip" }, "🔥 " + G.streak())),
      h("p", { class: "lead sm" }, G.doneCount(t) + " dari " + T.days + " hari selesai · satu anak tangga sehari"),
      h("div", { class: "stairs" }, rows, h("div", { class: "ground" }, "🌱 Mulai dari sini"))));
    if (currentEl && !G.fast) setTimeout(() => currentEl.scrollIntoView({ block: "center", behavior: "smooth" }), 150);
  }
  function dayModal(t, n, st) {
    const plan = C.plan(t, n);
    const steps = h("ol", { class: "stepsl" }, plan.steps.map((s) => h("li", {}, h("em", {}, s.icon), s.label)));
    G.sfx("pop");
    if (st === "nopay") {
      const m = modal(h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, "Hari " + n + " ada di paket lengkap"), h("p", {}, "Kamu sudah mencoba " + CFG.freeDays[t] + " hari gratis. Masukkan kode untuk membuka semua hari."),
        btn("primary", "Masukkan kode", () => { m.remove(); unlockModal(t); }), h("a", { class: "btn ghost", href: CFG.shopLinks[t], target: "_blank", rel: "noopener" }, "Lihat paketnya di toko"));
      return;
    }
    if (st === "future") { modal(h("div", { class: "hero-m sm" }, G.m("happy")), h("h2", {}, "Belum waktunya 😊"), h("p", {}, "Selesaikan hari sebelumnya dulu, ya. Naik tangga satu per satu.")); return; }
    if (st === "wait") { modal(h("div", { class: "hero-m sm" }, G.m("happy")), h("h2", {}, "Hari ini sudah naik! 🌙"), h("p", {}, "Satu anak tangga sehari sudah cukup. Besok kita lanjut ke hari " + n + ". Boleh latihan ulang hari yang sudah selesai kok.")); return; }
    const m = modal(h("div", { class: "daybig" }, h("small", {}, "Hari " + n), h("h2", {}, plan.title)), steps, h("p", { class: "micro" }, "Sekitar 10–15 menit. Berhenti kapan saja kalau anak lelah."), btn("primary big", st === "done" ? "Main lagi ▶" : "Mulai! ▶", () => { m.remove(); play(t, n); }));
  }

  // ---------- bermain ----------
  async function play(t, n) {
    const plan = C.plan(t, n), my = ++token, W = t === "pet" ? C.worlds[plan.world] : null;
    const mascotEl = h("div", { class: "mm" }, h("span", { html: G.mascot("happy") }));
    const bubble = h("div", { class: "bubble" }); let lastSay = "";
    const speak = h("button", { class: "speak", onclick: () => G.say(lastSay), "aria-label": "Dengarkan" }, "🔊");
    const stage = h("div", { class: "stage" }), toast = h("div", { class: "toast" });
    const stepper = h("div", { class: "stepper" }, plan.steps.map((s, i) => h("div", { class: "stp s" + i }, h("em", {}, s.icon), h("small", {}, s.label))));
    let curAct = null;
    const root = h("main", { class: "page play " + (W ? "w-" + W.id : "") , style: W ? { "--wbg": W.bg, "--wc": W.color } : null },
      h("header", { class: "topbar" }, back(() => { if (curAct && curAct.onExit) curAct.onExit(); screenMap(t); }, "✕"), h("b", { class: "ttl" }, "Hari " + n + " · " + plan.title), h("span", {})),
      stepper, h("div", { class: "mrow" }, mascotEl, h("div", { class: "bwrap" }, bubble, speak)), stage, toast);
    view(root); const mine = ++token; // view() sudah menaikkan token; gunakan nilai terkini
    const alive = () => token === mine;
    const mood = (m, ms) => { mascotEl.firstChild.innerHTML = G.mascot(m); if (ms) setTimeout(() => alive() && (mascotEl.firstChild.innerHTML = G.mascot("happy")), ms); };
    const say = (m) => { toast.textContent = m; toast.classList.remove("on"); void toast.offsetWidth; toast.classList.add("on"); };
    let errors = 0;
    for (let i = 0; i < plan.steps.length; i++) {
      if (!alive()) return;
      stepper.querySelectorAll(".stp").forEach((e, k) => { e.classList.toggle("done", k < i); e.classList.toggle("cur", k === i); });
      stage.innerHTML = ""; stage.className = "stage st-" + plan.steps[i].type;
      const s = plan.steps[i];
      const res = await new Promise((resolve) => {
        const ctx = { el: stage, p: s.p, done: resolve,
          prompt: (txt, sp) => { bubble.textContent = txt; lastSay = sp || txt; G.say(lastSay); },
          ok: () => { G.sfx("ok"); mood("wow", 1200); say(G.praise[G.rnd(G.praise.length)]); },
          bad: () => { G.sfx("bad"); mood("oops", 900); say(G.oops[G.rnd(G.oops.length)]); } };
        curAct = ctx; G.current = ctx; G.acts[s.type](ctx);
      });
      if (curAct && curAct.onExit) curAct.onExit();
      errors += res;
      if (!alive()) return;
      stepper.querySelectorAll(".stp")[i].classList.add("done"); stepper.querySelectorAll(".stp")[i].classList.remove("cur");
      if (i < plan.steps.length - 1) { G.sfx("win"); stage.innerHTML = ""; stage.append(h("div", { class: "interlude" }, h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, "Naik satu anak tangga! ⬆️"), h("p", {}, "Tinggal " + (plan.steps.length - 1 - i) + " langkah lagi"))); G.say("Hebat! Naik satu anak tangga"); await G.wait(1600); }
    }
    if (!alive()) return;
    const stars = errors <= 1 ? 3 : errors <= 4 ? 2 : 1, first = !G.done(t, n);
    G.markDone(t, n, stars); screenReward(t, n, stars, first);
  }

  function screenReward(t, n, stars, first) {
    const T = C.TRACKS[t], plan = C.plan(t, n), stk = C.sticker(t, n);
    const milestone = (t === "cal" && n === 30) || (t === "pet" && n % 10 === 0);
    const nextOpen = n < T.days && G.dayOpen(t, n + 1);
    view(h("main", { class: "page center reward" },
      h("div", { class: "hero-m" }, G.m("wow")), h("h1", {}, "Hebat, " + G.profile().name + "!"),
      h("p", { class: "lead" }, "Hari " + n + " selesai: " + plan.title),
      h("div", { class: "starrow" }, [1, 2, 3].map((k) => h("span", { class: "big-star " + (k <= stars ? "on" : ""), style: { animationDelay: k * 0.25 + "s" } }, "★"))),
      first && h("div", { class: "sticker-new" }, h("em", {}, stk), h("small", {}, "Stiker baru!")),
      milestone && h("div", { class: "milestone" }, "🏅 Kamu menyelesaikan " + (t === "cal" ? "Tangga Calistung" : C.worlds[n / 10 - 1].name) + "!"),
      milestone && btn("primary big", "Lihat sertifikat", () => screenCert(t, n)),
      h("p", { class: "micro" }, G.state.settings.free || !first ? "" : "Satu anak tangga sehari sudah cukup. Sampai jumpa besok! 🌙"),
      btn(milestone ? "ghost" : "primary big", "Ke peta tangga", () => screenMap(t)),
      !first && nextOpen && false && btn("ghost", "Hari berikutnya", () => play(t, n + 1))));
    G.sfx("win"); G.confetti(); G.say("Hebat sekali!");
  }

  // ---------- album & sertifikat ----------
  function screenAlbum(t) {
    const T = C.TRACKS[t], got = G.profile().prog[t].d;
    view(h("main", { class: "page" }, h("header", { class: "topbar" }, back(screenHome), h("b", { class: "ttl" }, "Album stiker"), h("span", {})),
      h("div", { class: "tabs" }, ["cal", "pet"].map((x) => h("button", { class: "tab" + (x === t ? " on" : ""), onclick: () => screenAlbum(x) }, C.TRACKS[x].icon + " " + C.TRACKS[x].name))),
      h("p", { class: "lead sm" }, Object.keys(got).length + " dari " + T.days + " stiker terkumpul"),
      h("div", { class: "album" }, Array.from({ length: T.days }, (_, i) => { const n = i + 1, ok = got[n]; return h("div", { class: "sticker " + (ok ? "got" : "") }, h("em", {}, ok ? C.sticker(t, n) : "?"), h("small", {}, "Hari " + n)); }))));
  }
  function certs() {
    const out = [], P = G.profile();
    if (P.prog.cal.d[30]) out.push({ t: "cal", n: 30, label: "Tangga Calistung 30 Hari" });
    C.worlds.forEach((w, i) => { if (P.prog.pet.d[(i + 1) * 10]) out.push({ t: "pet", n: (i + 1) * 10, label: w.name }); });
    return out;
  }
  function screenCerts() {
    const list = certs();
    view(h("main", { class: "page center" }, h("header", { class: "topbar" }, back(screenHome), h("b", { class: "ttl" }, "Sertifikat"), h("span", {})),
      list.length ? h("div", { class: "pcards" }, list.map((c) => h("button", { class: "pcard", onclick: () => screenCert(c.t, c.n) }, h("em", {}, "🏅"), h("b", {}, c.label)))) :
        h("div", {}, h("div", { class: "hero-m sm" }, G.m("happy")), h("p", { class: "lead" }, "Sertifikat muncul setelah menamatkan Tangga Calistung (30 hari) atau satu dunia Petualangan (10 hari)."))));
  }
  function screenCert(t, n) {
    const P = G.profile(), what = t === "cal" ? "Tangga Calistung 30 Hari" : C.worlds[Math.ceil(n / 10) - 1].name + " (Petualangan Tangga)";
    const date = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    view(h("main", { class: "page center" }, h("header", { class: "topbar noprint" }, back(screenHome), h("b", { class: "ttl" }, "Sertifikat"), h("span", {})),
      h("div", { class: "cert" }, h("div", { class: "cert-in" }, h("div", { class: "hero-m sm" }, G.m("happy")), h("small", {}, "SERTIFIKAT JUARA TANGGA"), h("p", {}, "diberikan kepada"), h("h1", {}, P.name), h("p", {}, "yang telah menamatkan"), h("h2", {}, what), h("p", { class: "cd" }, date), h("b", { class: "sign" }, "Anak Tangga Q · satu anak tangga sehari"))),
      h("div", { class: "noprint" }, btn("primary big", "🖨️ Cetak / simpan PDF", () => window.print()))));
    G.confetti();
  }

  // ---------- kode akses ----------
  function unlockModal(t) {
    const input = h("input", { class: "input", placeholder: "Contoh: CAL-XXXX-XXXX", autocapitalize: "characters", "aria-label": "Kode akses" }), msg = h("p", { class: "micro" }, "Kode dikirim bersama pembelian di toko.");
    const m = modal(h("h2", {}, "Masukkan kode akses"), input, msg,
      btn("primary", "Buka", () => {
        const sc = G.tryCode(input.value);
        if (sc) { m.remove(); G.sfx("win"); G.confetti(); modal(h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, "Berhasil dibuka! 🎉"), h("p", {}, sc === "all" ? "Semua hari sudah terbuka." : "Paket " + C.TRACKS[sc].name + " sudah terbuka."), btn("primary", "Mulai belajar", () => { document.querySelectorAll(".overlay").forEach((o) => o.remove()); screenHome(); })); }
        else { msg.textContent = "Kode belum cocok. Periksa lagi ya."; msg.className = "micro err"; input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
      }),
      h("a", { class: "btn ghost", href: CFG.shopUrl, target: "_blank", rel: "noopener" }, "Belum punya kode? Lihat toko"));
    input.focus();
  }

  // ---------- area orang tua ----------
  function parentGate() {
    const a = 6 + G.rnd(4), b = 5 + G.rnd(4), ans = a + b, opts = G.shuffle([ans, ans + 2, ans - 3]);
    const m = modal(h("h2", {}, "Area orang tua"), h("p", {}, "Untuk memastikan ini orang dewasa: berapa " + a + " + " + b + "?"),
      h("div", { class: "opts n3 num" }, opts.map((o) => h("button", { class: "opt", onclick: () => { if (o === ans) { m.remove(); screenParent(); } else { m.remove(); } } }, h("span", { class: "bigtxt" }, o)))));
  }
  function toggle(label, key, hint) {
    const s = G.state.settings, b = h("button", { class: "toggle" + (s[key] ? " on" : ""), role: "switch", "aria-checked": String(!!s[key]), onclick: () => { s[key] = !s[key]; G.save(); b.classList.toggle("on", s[key]); b.setAttribute("aria-checked", String(s[key])); } }, h("i", {}));
    return h("div", { class: "setrow" }, h("div", {}, h("b", {}, label), hint && h("small", {}, hint)), b);
  }
  function screenParent() {
    const P = G.profile();
    view(h("main", { class: "page" }, h("header", { class: "topbar" }, back(screenHome), h("b", { class: "ttl" }, "Area orang tua"), h("span", {})),
      h("div", { class: "panel" }, h("h2", {}, "Perkembangan " + P.name),
        h("p", {}, "Calistung: " + G.doneCount("cal") + "/30 hari · Petualangan: " + G.doneCount("pet") + "/60 hari · beruntun " + G.streak() + " hari"),
        h("p", { class: "micro" }, "Tips: cukup satu hari per sesi, 10–15 menit. Dampingi di awal, lalu biarkan anak mencoba sendiri.")),
      h("div", { class: "panel" }, h("h2", {}, "Pengaturan"), toggle("Suara efek", "sound"), toggle("Suara bacaan (pembaca otomatis)", "voice", "Memakai suara bahasa Indonesia bawaan perangkat bila tersedia"),
        toggle("Mode bebas", "free", "Boleh naik lebih dari satu hari per hari (tanpa batas harian)")),
      h("div", { class: "panel" }, h("h2", {}, "Akses"), h("p", {}, "Calistung: " + (G.isUnlocked("cal") ? "✅ terbuka" : "🔒 " + CFG.freeDays.cal + " hari gratis") + " · Petualangan: " + (G.isUnlocked("pet") ? "✅ terbuka" : "🔒 " + CFG.freeDays.pet + " hari gratis")),
        btn("ghost", "Masukkan kode", () => unlockModal())),
      h("div", { class: "panel" }, h("h2", {}, "Data"),
        btn("ghost", "Ulangi dari awal untuk " + P.name, () => { if (confirm("Hapus semua kemajuan " + P.name + "?")) { P.prog = { cal: { d: {}, last: "" }, pet: { d: {}, last: "" } }; P.dates = []; G.save(); screenParent(); } }),
        btn("ghost", "Hapus profil " + P.name, () => { if (confirm("Hapus profil " + P.name + "?")) { G.state.profiles = G.state.profiles.filter((x) => x.id !== P.id); G.state.current = (G.state.profiles[0] || {}).id || null; G.save(); G.state.current ? screenProfiles() : screenWelcome(); } }))));
  }

  // ---------- mulai ----------
  G.screens = { home: screenHome, map: screenMap, play, welcome: screenWelcome };
  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol) && !G.fast) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (G.state.profiles.length > 1 && !new URLSearchParams(location.search).has("go")) screenProfiles();
  else if (G.profile()) screenHome(); else screenWelcome();
})();
