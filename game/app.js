// Layar & alur permainan.
(function () {
  const { h } = G, app = document.getElementById("app"), CFG = window.GAME_CONFIG;
  const AVATARS = ["🐻", "🐰", "🦊", "🐼", "🐯", "🐸", "🦄", "🐙"];
  const TR = ["cal", "hij", "pet"];
  let token = 0;

  const view = (...kids) => { token++; document.onkeydown = null; document.querySelectorAll(".overlay").forEach((o) => o.remove()); app.replaceChildren(...kids); window.scrollTo(0, 0); };
  const btn = (cls, txt, on) => h("button", { class: "btn " + cls, onclick: on }, txt);
  const back = (on, label = "‹ Kembali") => h("button", { class: "back", onclick: on, "aria-label": "Kembali" }, label);
  const chip = (i, t) => h("span", { class: "chip" }, h("b", {}, i), " ", t);
  const top = (onBack, title, right) => h("header", { class: "topbar" }, back(onBack), h("b", { class: "ttl" }, title), right || h("span", { class: "spacer" }));
  const shopLink = (k, label) => h("a", { class: "btn ghost", href: CFG.shopLinks[k] || CFG.shopUrl, target: "_blank", rel: "noopener" }, label);

  function modal(...kids) {
    const ov = h("div", { class: "overlay", onclick: (e) => { if (e.target === ov) ov.remove(); } }, h("div", { class: "sheet", role: "dialog", "aria-modal": "true" }, h("button", { class: "x", onclick: () => ov.remove(), "aria-label": "Tutup" }, "✕"), ...kids));
    document.body.append(ov); return ov;
  }

  // ================= PROFIL =================
  function screenWelcome() {
    const first = !G.state.profiles.length;
    let av = AVATARS[0];
    const input = h("input", { class: "input", maxlength: 14, placeholder: "Nama si kecil", "aria-label": "Nama anak", autocomplete: "off" });
    const picks = h("div", { class: "avatars" }, AVATARS.map((a, i) => { const b = h("button", { class: "av" + (i ? "" : " sel"), "aria-label": "Pilih teman " + a, onclick: () => { av = a; picks.querySelectorAll(".av").forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); G.sfx("pop"); } }, a); return b; }));
    const go = () => { const n = input.value.trim(); if (!n) { input.classList.add("shake"); input.focus(); setTimeout(() => input.classList.remove("shake"), 500); return; } G.addProfile(n, av); screenHome(); };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    view(h("main", { class: "page center" },
      !first && h("header", { class: "topbar" }, back(screenProfiles), h("span", {})),
      h("div", { class: "hero-m" }, G.m("happy")),
      h("h1", {}, first ? "Halo! Aku Qiqi 👋" : "Siapa yang mau belajar?"),
      h("p", { class: "lead" }, "Ayo naik tangga bersama. Belajar calistung, hijaiyah, dan logika sambil bermain, cukup 10–15 menit sehari."),
      h("label", { class: "label" }, "Siapa namamu?"), input, h("p", { class: "label" }, "Pilih teman bermain:"), picks, btn("primary big", "Ayo mulai! 🪜", go),
      first && h("p", { class: "micro" }, "Data tersimpan di perangkat ini saja. Tanpa akun, tanpa iklan.")));
    setTimeout(() => G.say("Halo! Aku Qiqi. Ayo naik tangga bersama"), 300);
  }
  function screenProfiles() {
    view(h("main", { class: "page center" },
      h("div", { class: "hero-m" }, G.m("happy")), h("h1", {}, "Siapa yang main hari ini?"),
      h("div", { class: "pcards" }, G.state.profiles.map((p) => h("button", { class: "pcard", onclick: () => { G.state.current = p.id; G.save(); screenHome(); } }, h("em", {}, p.avatar), h("b", {}, p.name)))),
      G.state.profiles.length < 4 && btn("ghost", "+ Tambah anak", screenWelcome)));
  }

  // ================= BERANDA =================
  function trackCard(t) {
    const T = C.TRACKS[t], dn = G.doneCount(t), pct = Math.round((dn / T.days) * 100), open = G.isUnlocked(t);
    const today = G.profile().prog[t].last === G.today();
    return h("button", { class: "track " + t, onclick: () => screenMap(t) },
      h("em", {}, T.icon),
      h("div", { class: "tinfo" }, h("b", {}, T.name), h("span", {}, T.sub),
        h("div", { class: "bar" }, h("i", { style: { width: Math.max(pct, 3) + "%" } })),
        h("div", { class: "tmeta" }, h("small", {}, dn + " / " + T.days + " hari"), today && h("i", { class: "pill ok" }, "✅ hari ini"), !open && h("i", { class: "pill" }, CFG.freeDays[t] + " hari gratis"))),
      h("span", { class: "go", "aria-hidden": "true" }, "›"));
  }
  function screenHome() {
    const p = G.profile(); if (!p) return screenWelcome();
    const stk = TR.reduce((a, t) => a + G.doneCount(t), 0), lat = C.SKILLS.reduce((a, s) => a + G.latDone(s.id), 0);
    const st = G.streak();
    view(h("main", { class: "page home" },
      h("header", { class: "topbar" }, h("button", { class: "who", onclick: screenProfiles, "aria-label": "Ganti anak" }, p.avatar, " ", p.name, h("small", {}, " ▾")), h("button", { class: "gear", onclick: parentGate, "aria-label": "Area orang tua" }, "⚙️")),
      h("div", { class: "greet" }, h("div", { class: "hero-m sm" }, G.m("happy")), h("div", {}, h("h1", {}, "Halo, " + p.name + "!"), h("p", { class: "lead" }, st > 1 ? "Sudah " + st + " hari berturut-turut. Keren!" : "Siap naik satu anak tangga hari ini?"))),
      h("div", { class: "chips" }, chip("🔥", st + " hari"), chip("⭐", G.totalStars() + " bintang"), chip("🧸", stk + " stiker")),
      h("h2", { class: "sec" }, "Tangga harian", h("small", {}, "satu hari, satu anak tangga")),
      TR.map(trackCard),
      h("h2", { class: "sec" }, "Bermain bebas"),
      h("div", { class: "tiles2" },
        h("button", { class: "bigtile park", onclick: screenPark }, h("em", {}, "🎡"), h("b", {}, "Taman Latihan"), h("small", {}, lat + " / " + C.SKILLS.length * C.LEVELS + " level")),
        h("button", { class: "bigtile rut", onclick: () => screenRoutine(new Date().getHours() < 14 ? "pagi" : "malam") }, h("em", {}, "🌅"), h("b", {}, "Papan Rutinitas"), h("small", {}, routineCount() + " / 6 hari ini"))),
      h("div", { class: "row2" }, btn("ghost", "🧸 Album stiker", () => screenAlbum("cal")), btn("ghost", "🏅 Sertifikat", screenCerts)),
      !TR.every(G.isUnlocked) && h("div", { class: "unlockbar" }, h("span", {}, "🔑 Punya kode dari pembelian? Buka semua hari dan level."), btn("primary small", "Masukkan kode", () => unlockModal()))));
  }

  // ================= PETA TANGGA =================
  const PHASES = {
    cal: [[10, "Mengenal huruf", "🔤", "#1B2A4A"], [20, "Angka & berhitung", "🔢", "#1B9AC4"], [27, "Mulai membaca", "📖", "#2E9E5B"], [30, "Menambah", "➕", "#5B3FC4"]],
    hij: [[7, "Alif sampai Kho", "🌙", "#0F8A6B"], [14, "Dal sampai Shod", "⭐", "#1B9AC4"], [21, "Dhod sampai Ghoin", "🌟", "#5B3FC4"], [28, "Fa sampai Ya", "✨", "#C23A7C"], [30, "Ulangan & kelulusan", "🎓", "#1B2A4A"]]
  };
  const maxDone = (t) => Math.max(0, ...Object.keys(G.profile().prog[t].d).map(Number));
  function dayState(t, n) {
    if (G.done(t, n)) return "done";
    if (!G.dayOpen(t, n)) return "nopay";
    const nx = maxDone(t) + 1;
    if (n === nx) return !G.state.settings.free && G.profile().prog[t].last === G.today() ? "wait" : "current";
    return "future";
  }
  function screenMap(t) {
    const T = C.TRACKS[t], rows = []; let currentEl = null;
    for (let n = T.days; n >= 1; n--) {
      const st = dayState(t, n), plan = C.plan(t, n), d = G.done(t, n);
      if (t === "pet" && n % 10 === 0) { const w = C.worlds[n / 10 - 1]; rows.push(h("div", { class: "banner", style: { background: w.color } }, h("em", {}, w.icon), h("b", {}, w.name), h("small", {}, "hari " + (n - 9) + "–" + n))); }
      const ph = (PHASES[t] || []).find((x) => x[0] === n); if (ph) rows.push(h("div", { class: "banner", style: { background: ph[3] } }, h("em", {}, ph[2]), h("b", {}, ph[1])));
      const face = t === "hij" && n <= 28 ? h("span", { class: "ar nodear", lang: "ar" }, C.HIJ[n - 1].g) : h("b", {}, n);
      const inner = st === "done" ? [h("span", { class: "stk" }, C.sticker(t, n)), h("span", { class: "stars" }, "★".repeat(d.stars) + "☆".repeat(3 - d.stars))]
        : st === "nopay" ? [h("span", { class: "lk" }, "🔒")] : st === "wait" ? [h("span", { class: "lk" }, "🌙")] : [face];
      const node = h("button", { class: "node " + st, onclick: () => dayModal(t, n, st), "aria-label": "Hari " + n + ": " + plan.title + (st === "done" ? ", selesai" : st === "nopay" ? ", terkunci" : "") }, inner, st === "current" && h("div", { class: "me" }, G.m("happy")));
      if (st === "current" || st === "wait") currentEl = currentEl || node;
      rows.push(h("div", { class: "rowm pos" + (n % 4) }, h("div", { class: "stepblock" }), node, h("span", { class: "dlabel" }, "Hari " + n)));
    }
    const legend = h("div", { class: "legend" }, h("span", {}, "★ selesai"), h("span", {}, "🌙 lanjut besok"), h("span", {}, "🔒 perlu kode"));
    view(h("main", { class: "page map " + t },
      top(screenHome, T.name, h("span", { class: "chip" }, "🔥 " + G.streak())),
      h("p", { class: "lead sm" }, G.doneCount(t) + " dari " + T.days + " hari selesai"), legend,
      h("div", { class: "stairs" }, rows, h("div", { class: "ground" }, "🌱 Mulai dari sini"))));
    if (currentEl && !G.fast) setTimeout(() => currentEl.scrollIntoView({ block: "center", behavior: "smooth" }), 150);
  }
  function stepList(plan) { return h("ol", { class: "stepsl" }, plan.steps.map((s, i) => h("li", {}, h("i", {}, i + 1), h("em", {}, s.icon), s.label))); }
  function lockedModal(k, what) {
    const m = modal(h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, what + " ada di versi lengkap"),
      h("p", {}, "Masukkan kode dari pembelian untuk membuka semuanya. Paket Lengkap membuka Calistung, Hijaiyah, dan Petualangan sekaligus."),
      btn("primary", "🔑 Masukkan kode", () => { m.remove(); unlockModal(); }), shopLink(k, "Lihat di toko"), shopLink("all", "Paket Lengkap"));
  }
  function dayModal(t, n, st) {
    const plan = C.plan(t, n);
    G.sfx("pop");
    if (st === "nopay") return lockedModal(t, "Hari " + n);
    if (st === "future") return modal(h("div", { class: "hero-m sm" }, G.m("happy")), h("h2", {}, "Belum waktunya 😊"), h("p", {}, "Selesaikan hari " + (maxDone(t) + 1) + " dulu, ya. Naik tangga satu per satu."));
    if (st === "wait") return modal(h("div", { class: "hero-m sm" }, G.m("happy")), h("h2", {}, "Hari ini sudah naik! 🌙"), h("p", {}, "Satu anak tangga sehari sudah cukup. Besok lanjut ke hari " + n + "."), h("p", { class: "micro" }, "Masih mau main? Coba Taman Latihan, atau ulangi hari yang sudah selesai."), btn("primary", "🎡 Ke Taman Latihan", screenPark));
    const m = modal(h("div", { class: "daybig" }, h("small", {}, C.TRACKS[t].name + " · hari " + n), h("h2", {}, plan.title)), stepList(plan),
      h("p", { class: "micro" }, plan.steps.length + " langkah, sekitar 10–15 menit. Boleh berhenti kapan saja kalau anak lelah."),
      btn("primary big", st === "done" ? "Main lagi ▶" : "Mulai! ▶", () => { m.remove(); playDay(t, n); }));
  }

  // ================= PEMAIN (dipakai hari & level) =================
  async function play(plan, o) {
    const W = plan.world != null ? C.worlds[plan.world] : null;
    const mascotEl = h("div", { class: "mm" }, h("span", { html: G.mascot("happy") }));
    const bubble = h("div", { class: "bubble", "aria-live": "polite" }); let lastSay = "";
    const speak = h("button", { class: "speak", onclick: () => G.say(lastSay), "aria-label": "Dengarkan lagi" }, "🔊");
    const stage = h("div", { class: "stage" }), toast = h("div", { class: "toast", role: "status" });
    const N = plan.steps.length;
    const stepper = h("div", { class: "stepper n" + N }, plan.steps.map((s, i) => h("div", { class: "stp", style: { height: 50 + i * (N > 3 ? 9 : 14) + "px" } }, h("em", {}, s.icon), h("small", {}, s.label))));
    let curAct = null;
    const exit = () => { if (curAct && curAct.onExit) curAct.onExit(); if ("speechSynthesis" in window) speechSynthesis.cancel(); o.exit(); };
    const root = h("main", { class: "page play" + (W ? " w-" + W.id : ""), style: W ? { "--wbg": W.bg, "--wc": W.color } : null },
      h("header", { class: "topbar" }, back(exit, "✕ Keluar"), h("b", { class: "ttl" }, o.title), h("span", { class: "spacer" })),
      stepper, h("div", { class: "mrow" }, mascotEl, h("div", { class: "bwrap" }, bubble, speak)), stage, toast);
    view(root); const mine = token;
    const alive = () => token === mine;
    const mood = (m, ms) => { mascotEl.firstChild.innerHTML = G.mascot(m); if (ms) setTimeout(() => alive() && (mascotEl.firstChild.innerHTML = G.mascot("happy")), ms); };
    const say = (m, bad) => { toast.textContent = m; toast.className = "toast" + (bad ? " bad" : ""); void toast.offsetWidth; toast.classList.add("on"); };
    let errors = 0;
    for (let i = 0; i < N; i++) {
      if (!alive()) return;
      stepper.querySelectorAll(".stp").forEach((e, k) => { e.classList.toggle("done", k < i); e.classList.toggle("cur", k === i); });
      const s = plan.steps[i];
      stage.innerHTML = ""; stage.className = "stage st-" + s.type;
      const res = await new Promise((resolve) => {
        const ctx = { el: stage, p: s.p, done: resolve,
          prompt: (txt, sp) => { bubble.textContent = txt; lastSay = sp || txt; G.say(lastSay); },
          ok: () => { G.sfx("ok"); mood("wow", 1200); say(G.praise[G.rnd(G.praise.length)]); },
          bad: () => { G.sfx("bad"); mood("oops", 900); say(G.oops[G.rnd(G.oops.length)], true); } };
        curAct = ctx; G.current = ctx;
        try { G.acts[s.type](ctx); } catch (e) { console.error(e); resolve(0); }
      });
      if (curAct && curAct.onExit) curAct.onExit();
      errors += res;
      if (!alive()) return;
      stepper.querySelectorAll(".stp")[i].classList.add("done"); stepper.querySelectorAll(".stp")[i].classList.remove("cur");
      if (i < N - 1) {
        G.sfx("win"); stage.innerHTML = "";
        stage.append(h("div", { class: "interlude" }, h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, "Naik satu anak tangga! ⬆️"), h("p", {}, "Tinggal " + (N - 1 - i) + " langkah lagi"), h("div", { class: "ministeps" }, plan.steps.map((_, k) => h("i", { class: k <= i ? "on" : "" })))));
        G.say("Hebat! Naik satu anak tangga"); await G.wait(1500);
      }
    }
    if (!alive()) return;
    o.finish(errors <= 1 ? 3 : errors <= 4 ? 2 : 1);
  }
  function playDay(t, n) {
    const plan = C.plan(t, n);
    play(plan, { title: "Hari " + n + " · " + plan.title, exit: () => screenMap(t), finish: (stars) => { const first = !G.done(t, n); G.markDone(t, n, stars); screenReward(t, n, stars, first); } });
  }

  function rewardShell(title, line, stars, extra, actions) {
    view(h("main", { class: "page center reward" },
      h("div", { class: "hero-m" }, G.m("wow")), h("h1", {}, title), h("p", { class: "lead" }, line),
      h("div", { class: "starrow", "aria-label": stars + " dari 3 bintang" }, [1, 2, 3].map((k) => h("span", { class: "big-star " + (k <= stars ? "on" : ""), style: { animationDelay: k * 0.25 + "s" } }, "★"))),
      stars < 3 && h("p", { class: "micro" }, "Main lagi kapan-kapan untuk dapat 3 bintang!"),
      extra, h("div", { class: "actions" }, actions)));
    G.sfx("win"); G.confetti(); G.say("Hebat sekali!");
  }
  function screenReward(t, n, stars, first) {
    const T = C.TRACKS[t], plan = C.plan(t, n);
    const milestone = ((t === "cal" || t === "hij") && n === 30) || (t === "pet" && n % 10 === 0);
    const canNext = n < T.days && G.dayOpen(t, n + 1) && (G.state.settings.free || !first);
    rewardShell("Hebat, " + G.profile().name + "!", "Hari " + n + " selesai: " + plan.title, stars,
      [first && h("div", { class: "sticker-new" }, h("em", {}, C.sticker(t, n)), h("small", {}, "Stiker baru untuk albummu!")),
        milestone && h("div", { class: "milestone" }, "🏅 Kamu menamatkan " + certName(t, n) + "!"),
        first && !G.state.settings.free && n < T.days && h("p", { class: "micro" }, "Satu anak tangga sehari sudah cukup. Sampai jumpa besok! 🌙")],
      [milestone && btn("primary big", "🏅 Lihat sertifikat", () => screenCert(t, n)),
        canNext && btn("primary big", "Hari " + (n + 1) + " ▶", () => playDay(t, n + 1)),
        btn(milestone || canNext ? "ghost" : "primary big", "Ke peta tangga", () => screenMap(t)),
        btn("ghost", "🏠 Beranda", screenHome)]);
  }

  // ================= TAMAN LATIHAN =================
  function screenPark() {
    view(h("main", { class: "page" }, top(screenHome, "🎡 Taman Latihan"),
      h("p", { class: "lead sm" }, "Main bebas kapan saja. Setiap keterampilan punya " + C.LEVELS + " level yang makin menantang."),
      h("div", { class: "skills" }, C.SKILLS.map((s) => {
        const dn = G.latDone(s.id), stars = Object.values(G.profile().prog.lat[s.id] || {}).reduce((a, b) => a + b, 0);
        return h("button", { class: "skill", style: { "--sc": s.color }, onclick: () => screenSkill(s.id) },
          h("em", {}, s.icon), h("b", {}, s.name), h("div", { class: "bar" }, h("i", { style: { width: Math.max(3, (dn / C.LEVELS) * 100) + "%" } })),
          h("small", {}, "Level " + Math.min(dn + 1, C.LEVELS) + " · ⭐ " + stars));
      }))));
  }
  function levelState(sk, n) {
    if (G.latStars(sk, n)) return "done";
    if (!G.levelOpen(sk, n)) return "nopay";
    return n === 1 || G.latStars(sk, n - 1) ? "current" : "future";
  }
  function screenSkill(sk) {
    const S = C.skill(sk);
    view(h("main", { class: "page", style: { "--sc": S.color } }, top(screenPark, S.icon + " " + S.name),
      h("p", { class: "lead sm" }, G.latDone(sk) + " dari " + C.LEVELS + " level selesai"),
      h("div", { class: "levels" }, Array.from({ length: C.LEVELS }, (_, i) => {
        const n = i + 1, st = levelState(sk, n), s = G.latStars(sk, n);
        return h("button", { class: "lvl " + st, "aria-label": "Level " + n + (st === "nopay" ? ", terkunci" : ""), onclick: () => levelModal(sk, n, st) },
          h("b", {}, st === "nopay" ? "🔒" : st === "future" ? "🔐" : n),
          h("span", { class: "stars" }, st === "done" ? "★".repeat(s) + "☆".repeat(3 - s) : st === "current" ? "main!" : ""));
      })),
      h("div", { class: "legend" }, h("span", {}, "★ selesai"), h("span", {}, "🔐 selesaikan level sebelumnya"), h("span", {}, "🔒 perlu kode")),
      G.latDone(sk) === C.LEVELS && h("div", { class: "center" }, btn("primary", "🏅 Sertifikat " + S.name, () => screenCert("lat", sk)))));
  }
  function levelModal(sk, n, st) {
    const S = C.skill(sk), plan = S.level(n);
    G.sfx("pop");
    if (st === "nopay") return lockedModal(S.track, "Level " + n);
    if (st === "future") return modal(h("div", { class: "hero-m sm" }, G.m("happy")), h("h2", {}, "Level " + n + " masih terkunci"), h("p", {}, "Selesaikan level " + (n - 1) + " dulu untuk membukanya."));
    const m = modal(h("div", { class: "daybig" }, h("small", {}, S.name + " · level " + n), h("h2", {}, plan.title)), stepList(plan), btn("primary big", "Main! ▶", () => { m.remove(); playLevel(sk, n); }));
  }
  function playLevel(sk, n) {
    const S = C.skill(sk), plan = S.level(n);
    play(plan, { title: S.name + " · level " + n, exit: () => screenSkill(sk), finish: (stars) => {
      G.markLat(sk, n, stars);
      const nx = n < C.LEVELS && G.levelOpen(sk, n + 1);
      rewardShell("Level " + n + " selesai!", S.icon + " " + S.name + ": " + plan.title, stars,
        [G.latDone(sk) === C.LEVELS && h("div", { class: "milestone" }, "🏅 Semua level " + S.name + " tamat!")],
        [nx && btn("primary big", "Level " + (n + 1) + " ▶", () => playLevel(sk, n + 1)),
          !nx && n < C.LEVELS && btn("primary", "🔑 Buka level berikutnya", () => lockedModal(S.track, "Level " + (n + 1))),
          btn(nx ? "ghost" : "ghost", "Pilih level", () => screenSkill(sk)), btn("ghost", "🏠 Beranda", screenHome)]);
    } });
  }

  // ================= PAPAN RUTINITAS =================
  function routineToday() { const p = G.profile(); p.routine = p.routine || {}; const d = (p.routine[G.today()] = p.routine[G.today()] || { pagi: [], malam: [] }); return d; }
  function routineCount() { const d = (G.profile().routine || {})[G.today()]; return d ? d.pagi.length + d.malam.length : 0; }
  function screenRoutine(tab) {
    const d = routineToday(), list = C.ROUTINE[tab];
    const all = () => d[tab].length === list.length;
    const head = h("div", { class: "rhead" });
    const paint = () => { head.textContent = all() ? "🎉 Semua kegiatan " + tab + " selesai. Hebat!" : d[tab].length + " dari " + list.length + " kegiatan " + tab + " selesai"; head.classList.toggle("ok", all()); };
    view(h("main", { class: "page" }, top(screenHome, "🌅 Papan Rutinitas"),
      h("div", { class: "tabs" }, ["pagi", "malam"].map((x) => h("button", { class: "tab" + (x === tab ? " on" : ""), onclick: () => screenRoutine(x) }, x === "pagi" ? "☀️ Pagi" : "🌙 Malam"))),
      head,
      h("div", { class: "rgrid" }, list.map(([label, e], i) => {
        const b = h("button", { class: "rcard" + (d[tab].includes(i) ? " on" : ""), "aria-pressed": String(d[tab].includes(i)) }, h("em", {}, e), h("b", {}, label), h("span", { class: "tick" }, "✓"));
        b.onclick = () => {
          const k = d[tab].indexOf(i);
          if (k >= 0) d[tab].splice(k, 1); else { d[tab].push(i); G.sfx("ok"); G.say(label + ". Hebat!"); }
          b.classList.toggle("on", k < 0); b.setAttribute("aria-pressed", String(k < 0)); G.touchToday(); paint();
          if (k < 0 && all()) { G.sfx("win"); G.confetti(); }
        };
        return b;
      })),
      h("p", { class: "micro center" }, "Ketuk kartu setelah kegiatannya selesai. Papan kembali kosong setiap hari."),
      h("div", { class: "promo" }, h("span", {}, "Mau versi cetak untuk ditempel di rumah? Kit Rutinitas berisi papan, 30 kartu kegiatan, dan pelacak 30 hari."), shopLink("rut", "Lihat Kit Rutinitas"))));
    paint();
  }

  // ================= ALBUM & SERTIFIKAT =================
  function screenAlbum(t) {
    const T = C.TRACKS[t], got = G.profile().prog[t].d;
    view(h("main", { class: "page" }, top(screenHome, "🧸 Album stiker"),
      h("div", { class: "tabs" }, TR.map((x) => h("button", { class: "tab" + (x === t ? " on" : ""), onclick: () => screenAlbum(x) }, C.TRACKS[x].icon + " " + C.TRACKS[x].name.replace("Tangga ", "").replace(" Tangga", "")))),
      h("p", { class: "lead sm" }, Object.keys(got).length + " dari " + T.days + " stiker terkumpul"),
      h("div", { class: "album" }, Array.from({ length: T.days }, (_, i) => { const n = i + 1, ok = got[n]; return h("div", { class: "sticker " + (ok ? "got" : "") }, h("em", {}, ok ? C.sticker(t, n) : "?"), h("small", {}, "Hari " + n)); }))));
  }
  function certName(t, n) {
    if (t === "cal") return "Tangga Calistung 30 Hari";
    if (t === "hij") return "Tangga Hijaiyah 30 Hari";
    if (t === "lat") return "Taman Latihan: " + C.skill(n).name;
    return C.worlds[Math.ceil(n / 10) - 1].name + " (Petualangan Tangga)";
  }
  function certs() {
    const out = [], P = G.profile();
    if (P.prog.cal.d[30]) out.push(["cal", 30]);
    if (P.prog.hij.d[30]) out.push(["hij", 30]);
    C.worlds.forEach((w, i) => { if (P.prog.pet.d[(i + 1) * 10]) out.push(["pet", (i + 1) * 10]); });
    C.SKILLS.forEach((s) => { if (G.latDone(s.id) === C.LEVELS) out.push(["lat", s.id]); });
    return out;
  }
  function screenCerts() {
    const list = certs();
    view(h("main", { class: "page center" }, top(screenHome, "🏅 Sertifikat"),
      list.length ? h("div", { class: "pcards" }, list.map(([t, n]) => h("button", { class: "pcard wide", onclick: () => screenCert(t, n) }, h("em", {}, "🏅"), h("b", {}, certName(t, n))))) :
        h("div", {}, h("div", { class: "hero-m sm" }, G.m("happy")), h("p", { class: "lead" }, "Belum ada sertifikat. Sertifikat muncul setelah menamatkan Tangga Calistung atau Hijaiyah (30 hari), satu dunia Petualangan (10 hari), atau semua level satu keterampilan di Taman Latihan."))));
  }
  function screenCert(t, n) {
    const P = G.profile(), date = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    view(h("main", { class: "page center" }, h("header", { class: "topbar noprint" }, back(screenCerts), h("b", { class: "ttl" }, "Sertifikat"), h("span", { class: "spacer" })),
      h("div", { class: "cert" }, h("div", { class: "cert-in" }, h("div", { class: "hero-m sm" }, G.m("happy")), h("small", {}, "SERTIFIKAT JUARA TANGGA"), h("p", {}, "diberikan kepada"), h("h1", {}, P.name), h("p", {}, "yang telah menamatkan"), h("h2", {}, certName(t, n)), h("p", { class: "cd" }, date), h("b", { class: "sign" }, "Anak Tangga Q · satu anak tangga sehari"))),
      h("div", { class: "noprint" }, btn("primary big", "🖨️ Cetak / simpan PDF", () => window.print()))));
    G.confetti();
  }

  // ================= KODE AKSES =================
  const SCOPE_TXT = { cal: "Tangga Calistung", hij: "Tangga Hijaiyah", pet: "Petualangan Tangga", hemat: "Calistung dan Petualangan", all: "Semua tangga dan level" };
  function unlockModal() {
    const input = h("input", { class: "input code", placeholder: "Contoh: LKP-AB12-CD34", autocapitalize: "characters", autocomplete: "off", spellcheck: "false", "aria-label": "Kode akses" }), msg = h("p", { class: "micro" }, "Kode dikirim bersama pembelian di toko.");
    const go = () => {
      const sc = G.tryCode(input.value);
      if (sc) { m.remove(); G.sfx("win"); G.confetti(); modal(h("div", { class: "hero-m sm" }, G.m("wow")), h("h2", {}, "Berhasil dibuka! 🎉"), h("p", {}, SCOPE_TXT[sc] + " sudah terbuka untuk semua anak di perangkat ini."), btn("primary", "Mulai belajar", screenHome)); }
      else { msg.textContent = "Kode belum cocok. Periksa huruf dan angkanya ya."; msg.className = "micro err"; input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500); }
    };
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    const m = modal(h("h2", {}, "🔑 Masukkan kode akses"), input, msg, btn("primary", "Buka", go), shopLink("all", "Belum punya kode? Lihat toko"));
    setTimeout(() => input.focus(), 50);
  }

  // ================= AREA ORANG TUA =================
  function parentGate() {
    const a = 6 + G.rnd(4), b = 5 + G.rnd(4), ans = a + b, opts = G.shuffle([ans, ans + 2, ans - 3]);
    const m = modal(h("h2", {}, "Area orang tua"), h("p", {}, "Untuk memastikan ini orang dewasa, jawab:"), h("div", { class: "gateq" }, a + " + " + b + " = ?"),
      h("div", { class: "opts n3 num" }, opts.map((o) => h("button", { class: "opt", onclick: () => { m.remove(); if (o === ans) screenParent(); } }, h("span", { class: "bigtxt" }, o)))));
  }
  function toggle(label, key, hint) {
    const s = G.state.settings, b = h("button", { class: "toggle" + (s[key] ? " on" : ""), role: "switch", "aria-checked": String(!!s[key]), "aria-label": label, onclick: () => { s[key] = !s[key]; G.save(); b.classList.toggle("on", s[key]); b.setAttribute("aria-checked", String(s[key])); } }, h("i", {}));
    return h("div", { class: "setrow" }, h("div", {}, h("b", {}, label), hint && h("small", {}, hint)), b);
  }
  function screenParent() {
    const P = G.profile();
    const row = (icon, name, val) => h("div", { class: "prow" }, h("em", {}, icon), h("span", {}, name), h("b", {}, val));
    view(h("main", { class: "page" }, top(screenHome, "Area orang tua"),
      h("div", { class: "panel" }, h("h2", {}, "Perkembangan " + P.name),
        TR.map((t) => row(C.TRACKS[t].icon, C.TRACKS[t].name, G.doneCount(t) + " / " + C.TRACKS[t].days + " hari")),
        C.SKILLS.map((s) => row(s.icon, "Latihan " + s.name, G.latDone(s.id) + " / " + C.LEVELS + " level")),
        row("🔥", "Hari bermain berturut-turut", G.streak() + " hari"),
        h("p", { class: "micro" }, "Tips: cukup satu hari per sesi, 10–15 menit. Dampingi di awal, lalu biarkan anak mencoba sendiri. Puji usahanya, bukan hanya hasilnya.")),
      h("div", { class: "panel" }, h("h2", {}, "Pengaturan"), toggle("Suara efek", "sound"), toggle("Suara bacaan", "voice", "Memakai suara bahasa Indonesia bawaan perangkat, bila tersedia"),
        toggle("Mode bebas", "free", "Anak boleh naik lebih dari satu hari per hari")),
      h("div", { class: "panel" }, h("h2", {}, "Akses"), TR.map((t) => row(C.TRACKS[t].icon, C.TRACKS[t].name, G.isUnlocked(t) ? "✅ terbuka" : "🔒 " + CFG.freeDays[t] + " hari gratis")),
        btn("ghost", "🔑 Masukkan kode", unlockModal), shopLink("all", "Toko Anak Tangga Q")),
      h("div", { class: "panel" }, h("h2", {}, "Data"),
        btn("ghost", "Ulangi dari awal untuk " + P.name, () => { if (confirm("Hapus semua kemajuan " + P.name + "? Ini tidak bisa dibatalkan.")) { P.prog = G.freshProg(); P.dates = []; P.routine = {}; G.save(); screenParent(); } }),
        btn("ghost danger", "Hapus profil " + P.name, () => { if (confirm("Hapus profil " + P.name + "? Ini tidak bisa dibatalkan.")) { G.state.profiles = G.state.profiles.filter((x) => x.id !== P.id); G.state.current = (G.state.profiles[0] || {}).id || null; G.save(); G.state.current ? screenProfiles() : screenWelcome(); } }))));
  }

  // ================= MULAI =================
  G.screens = { home: screenHome, map: screenMap, playDay, playLevel, park: screenPark, skill: screenSkill, routine: screenRoutine, album: screenAlbum, certs: screenCerts, cert: screenCert, parent: screenParent, welcome: screenWelcome, unlock: unlockModal };
  G.screens.play = playDay;
  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol) && !G.fast) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (G.state.profiles.length > 1) screenProfiles();
  else if (G.profile()) screenHome(); else screenWelcome();
})();
