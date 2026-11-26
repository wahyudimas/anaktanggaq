// Aktivitas tambahan: huruf besar-kecil, urut angka, banyak-sedikit, kurang, kartu ingatan,
// warna, bentuk, lengkapi kata, dan 5 aktivitas hijaiyah.
(function () {
  const { h, rnd, shuffle, pick, wait } = G;
  const A = G.acts, R = G._r, { rounds, opt, big, itemsBox } = R;
  const AR = (g, cls = "") => h("span", { class: "ar " + cls, lang: "ar", dir: "rtl" }, g);
  const FUN = ["🍎", "🐥", "⭐", "🍓", "🎈", "🐟", "🌸", "🚗", "🐞", "🍪"];
  const ALLL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // ---------- Huruf besar & kecil ----------
  A.hurufkecil = (ctx) => {
    const set = ctx.p.set, k = ctx.p.opts || 3, rev = !!ctx.p.rev;
    const qs = shuffle(set).slice(0, 3).concat(shuffle(set)).slice(0, 3).map((L) => {
      const others = shuffle(set.concat(ALLL).filter((x) => x !== L)).filter((x, i, a) => a.indexOf(x) === i).slice(0, k - 1);
      const show = rev ? L.toLowerCase() : L, want = rev ? L : L.toLowerCase();
      return {
        prompt: rev ? "Mana huruf besar dari " + show + "?" : "Mana huruf kecil dari " + show + "?",
        say: (rev ? "Mana huruf besarnya?" : "Mana huruf kecilnya?") + " Huruf " + L.toLowerCase(),
        stage: h("div", { class: "letterbox solo" }, h("b", {}, show)), optCls: "letter",
        options: shuffle([L, ...others]).map((x) => opt(big(rev ? x : x.toLowerCase()), x === L, rev ? x : x.toLowerCase()))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Urutkan angka ----------
  A.urut = (ctx) => {
    const from = ctx.p.from || 1, count = ctx.p.count || 5, nums = Array.from({ length: count }, (_, i) => from + i);
    let next = 0, errors = 0;
    ctx.prompt("Ketuk dari " + from + " sampai " + (from + count - 1), "Ketuk angkanya berurutan, mulai dari " + from);
    const line = h("div", { class: "numline" }, nums.map(() => h("i", {})));
    const grid = h("div", { class: "lgrid urut" }, shuffle(nums).map((v) => {
      const b = h("button", { class: "cell", "data-v": v }, String(v));
      b.onclick = () => {
        if (b.disabled) return;
        if (v === nums[next]) {
          b.disabled = true; b.classList.add("good"); line.children[next].textContent = v; line.children[next].classList.add("on"); next++; G.sfx("pop");
          if (next === nums.length) { ctx.ok(); wait(900).then(() => ctx.done(errors)); }
        } else { errors++; b.classList.add("shake"); ctx.bad(); setTimeout(() => b.classList.remove("shake"), 500); }
      };
      return b;
    }));
    ctx.cheat = () => { const b = grid.querySelector('[data-v="' + nums[next] + '"]'); if (b) b.click(); };
    ctx.el.append(line, grid);
  };

  // ---------- Mana lebih banyak / sedikit ----------
  A.banyak = (ctx) => {
    const max = ctx.p.max || 8;
    const qs = [0, 1, 2].map((k) => {
      const less = ctx.p.less ? k !== 1 : k === 1, e = FUN[(k * 3 + rnd(3)) % FUN.length];
      let a = 1 + rnd(max), b = 1 + rnd(max); while (a === b || Math.abs(a - b) > Math.max(2, Math.ceil(max / 2))) { a = 1 + rnd(max); b = 1 + rnd(max); }
      const want = less ? Math.min(a, b) : Math.max(a, b);
      return {
        prompt: less ? "Mana yang lebih SEDIKIT?" : "Mana yang lebih BANYAK?", say: less ? "Mana yang lebih sedikit?" : "Mana yang lebih banyak?", optCls: "grp",
        options: [a, b].map((v) => opt(itemsBox(v, e), v === want, v + " " + e))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Kurang bergambar ----------
  A.kurang = (ctx) => {
    const max = Math.max(3, ctx.p.max || 5);
    const qs = [0, 1, 2].map((k) => {
      const a = 2 + rnd(max - 1), b = 1 + rnd(a - 1), ans = a - b, e = FUN[(k * 4 + rnd(4)) % FUN.length];
      const box = h("div", { class: "items" + (a > 10 ? " many" : "") }, Array.from({ length: a }, (_, i) => h("span", { class: i >= a - b ? "gone" : "" }, e)));
      const wrong = shuffle(Array.from({ length: 11 }, (_, x) => x).filter((x) => x !== ans && Math.abs(x - ans) <= 2)).slice(0, 2);
      return {
        prompt: a + " − " + b + " = ?", say: a + " dikurangi " + b + " sama dengan berapa?", optCls: "num",
        stage: h("div", { class: "kurangbox" }, box, h("small", {}, b + " pergi, sisa berapa?")),
        options: shuffle([ans, ...wrong]).map((x) => opt(big(x), x === ans, String(x)))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Kartu ingatan ----------
  A.memori = (ctx) => {
    const n = G.clamp(ctx.p.pairs || 3, 2, 8);
    let faces;
    if (ctx.p.hij) faces = pick(ctx.p.letters || C.HIJ.map((x) => x.i), n).map((i) => AR(C.HIJ[i].g));
    else faces = pick((ctx.p.world ? ctx.p.world.set : []).concat(["🐶", "🐱", "🦁", "🐸", "🐵", "🦄", "🐢", "🐙", "🍉", "🚀", "🌈", "🍩"]).filter((x, i, a) => a.indexOf(x) === i), n).map((e) => h("em", {}, e));
    const ids = shuffle([...Array(n).keys(), ...Array(n).keys()]);
    let open = [], found = 0, miss = 0, lock = false;
    ctx.prompt("Cari pasangan kartu yang sama", "Buka dua kartu. Cari pasangan yang sama");
    const cols = n * 2 <= 6 ? 3 : 4;
    const grid = h("div", { class: "memgrid", style: { gridTemplateColumns: "repeat(" + cols + ",1fr)" } });
    const cards = ids.map((id, i) => {
      const c = h("button", { class: "mcard", "data-id": id, "aria-label": "Kartu " + (i + 1) }, h("div", { class: "back" }, "?"), h("div", { class: "front" }, faces[id].cloneNode(true)));
      c.onclick = async () => {
        if (lock || c.classList.contains("flip")) return;
        c.classList.add("flip"); G.sfx("tap"); open.push(c);
        if (open.length < 2) return;
        lock = true;
        const [x, y] = open; open = [];
        if (x.dataset.id === y.dataset.id) {
          x.classList.add("match"); y.classList.add("match"); found++; G.sfx("ok");
          if (found === n) { ctx.ok(); await wait(900); ctx.done(Math.max(0, miss - n)); }
        } else { miss++; await wait(800); x.classList.remove("flip"); y.classList.remove("flip"); }
        lock = false;
      };
      grid.append(c); return c;
    });
    ctx.cheat = () => {
      if (lock) return;
      const op = cards.find((c) => c.classList.contains("flip") && !c.classList.contains("match"));
      if (op) { const twin = cards.find((c) => c !== op && c.dataset.id === op.dataset.id); twin.click(); return; }
      const c = cards.find((c) => !c.classList.contains("flip")); if (c) c.click();
    };
    ctx.el.append(grid);
  };

  // ---------- Warna ----------
  A.warna = (ctx) => {
    const pool = C.COLORS.slice(0, G.clamp(ctx.p.k || 3, 3, C.COLORS.length));
    const qs = shuffle(pool).slice(0, 3).map(([name, col]) => {
      const others = shuffle(pool.filter((c) => c[0] !== name)).slice(0, Math.min(3, pool.length - 1));
      return {
        prompt: "Mana warna " + name.toUpperCase() + "?", say: "Mana warna " + name + "?", optCls: "col",
        options: shuffle([[name, col], ...others]).map(([n2, c2]) => opt(h("span", { class: "swatch", style: { background: c2 } }), n2 === name, n2))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Bentuk ----------
  const SVG = {
    lingkaran: '<circle cx="50" cy="50" r="40"/>',
    segitiga: '<polygon points="50,10 92,88 8,88"/>',
    persegi: '<rect x="14" y="14" width="72" height="72" rx="4"/>',
    bintang: '<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>',
    hati: '<path d="M50 88 C10 60 6 34 22 22 C34 13 46 20 50 30 C54 20 66 13 78 22 C94 34 90 60 50 88Z"/>',
    "persegi panjang": '<rect x="6" y="26" width="88" height="48" rx="4"/>',
    oval: '<ellipse cx="50" cy="50" rx="44" ry="28"/>',
    "belah ketupat": '<polygon points="50,6 90,50 50,94 10,50"/>'
  };
  const shape = (n, col) => h("span", { class: "shape", html: '<svg viewBox="0 0 100 100" fill="' + col + '">' + SVG[n] + "</svg>" });
  A.bentuk = (ctx) => {
    const pool = C.SHAPES.slice(0, G.clamp(ctx.p.k || 3, 3, C.SHAPES.length)), cols = ["#FF8A3D", "#1E88E5", "#43A047", "#8E24AA", "#E53935"];
    const qs = shuffle(pool).slice(0, 3).map((name, k) => {
      const others = shuffle(pool.filter((x) => x !== name)).slice(0, Math.min(3, pool.length - 1));
      return {
        prompt: "Mana bentuk " + name.toUpperCase() + "?", say: "Mana bentuk " + name + "?", optCls: "shp",
        options: shuffle([name, ...others]).map((x, i) => opt(shape(x, cols[(i + k) % cols.length]), x === name, x))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Lengkapi kata ----------
  A.lengkapi = (ctx) => {
    const ws = shuffle(ctx.p.words.map(C.word).filter(Boolean)).slice(0, 3);
    const qs = ws.map((w) => {
      const gap = rnd(w.s.length), ans = w.s[gap];
      const dec = shuffle(C.SYL.concat(C.words.flatMap((x) => x.s)).filter((x) => x !== ans && x.length <= 4)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 2);
      return {
        prompt: "Lengkapi: " + w.s.map((x, i) => (i === gap ? "__" : x)).join(" "), say: "Lengkapi katanya. " + w.w, optCls: "syl",
        stage: h("div", { class: "wordbox" }, h("em", {}, w.e), h("div", { class: "readword sm" }, w.s.map((x, i) => h("span", { class: i === gap ? "gap" : "" }, i === gap ? "?" : x)))),
        options: shuffle([ans, ...dec]).map((x) => opt(big(x), x === ans, x))
      };
    });
    rounds(ctx, qs);
  };

  // ================= HIJAIYAH =================
  const H = () => C.HIJ;
  const others = (L, n, pool) => shuffle((pool && pool.length > n ? pool.map((i) => H()[i]) : H()).filter((x) => x.i !== L.i && x.name !== L.name)).slice(0, n);
  const pickL = (p, k) => (p.mix ? H()[p.mix[(k + rnd(p.mix.length)) % p.mix.length]] : H()[p.letter]);

  A.hkenal = (ctx) => {
    const p = ctx.p, nopt = p.n || 3;
    const qs = [0, 1, 2].map((k) => {
      const L = pickL(p, k), alt = others(L, nopt - 1, p.pool && p.pool.length >= nopt ? p.pool : null);
      if (k === 1) // tampilkan huruf, pilih namanya
        return { prompt: "Ini huruf apa?", say: "Ini huruf apa?", stage: h("div", { class: "hijbox" }, AR(L.g, "xl")), optCls: "name",
          options: shuffle([L, ...alt]).map((x) => opt(big(x.name), x.i === L.i, x.name)), after: L.name };
      return { prompt: "Mana huruf " + L.name + "?", say: "Mana huruf " + L.name + "?", stage: k === 0 && !p.mix ? h("div", { class: "hijbox intro" }, AR(L.g, "xl"), h("b", {}, L.name)) : null, optCls: "arab",
        options: shuffle([L, ...alt]).map((x) => opt(AR(x.g), x.i === L.i, x.name)), after: L.name };
    });
    rounds(ctx, qs);
  };

  A.htrace = (ctx) => {
    const L = H()[ctx.p.letter];
    R.traceText(ctx, L.g, '"Noto Naskh Arabic", "Geeza Pro", "Arial", serif', ["Tebalkan huruf " + L.name, "Tebalkan huruf " + L.name + " dengan jarimu"]);
  };

  A.hkata = (ctx) => {
    const p = ctx.p;
    const qs = [0, 1, 2].map((k) => {
      const L = pickL(p, k), alt = others(L, 2);
      if (k === 1) return { // pilih gambar yang diawali huruf ini
        prompt: "Gambar mana yang diawali huruf " + L.name + "?", say: "Gambar mana yang diawali huruf " + L.name + "?",
        stage: h("div", { class: "hijbox" }, AR(L.g, "lg")),
        options: shuffle([L, ...alt]).map((x) => opt(h("span", { class: "pic" }, h("em", {}, x.e), h("small", {}, x.mean.split(" (")[0])), x.i === L.i, x.mean)) };
      return {
        prompt: "Huruf awal kata ini?", say: "Ini " + L.mean.split("(")[1].replace(")", "") + ". Huruf awalnya yang mana?", optCls: "arab",
        stage: h("div", { class: "hijword" }, h("em", {}, L.e), AR(L.word, "word"), h("small", {}, L.mean)),
        options: shuffle([L, ...alt]).map((x) => opt(AR(x.g), x.i === L.i, x.name))
      };
    });
    rounds(ctx, qs);
  };

  A.hharakat = (ctx) => {
    const letters = ctx.p.letters, vs = shuffle(["a", "i", "u"]);
    const qs = [0, 1, 2].map((k) => {
      const L = H()[letters[(k + rnd(letters.length)) % letters.length]], v = vs[k];
      return {
        prompt: "Dibaca apa?", say: "Huruf " + L.name + " dengan " + C.harakatName[v] + ", dibaca apa?", optCls: "syl",
        stage: h("div", { class: "hijbox" }, AR(C.harakat(L, v), "xl"), h("small", {}, L.name + " · " + C.harakatName[v])),
        options: ["a", "i", "u"].map((x) => opt(big(C.harakatRead(L, x)), x === v, C.harakatRead(L, x))), after: C.harakatRead(L, v)
      };
    });
    rounds(ctx, qs);
  };

  A.hcari = (ctx) => {
    const p = ctx.p, L = p.mix ? H()[p.mix[rnd(p.mix.length)]] : H()[p.letter];
    const decoy = others(L, 6), total = 12, targets = 4 + rnd(2);
    const cells = shuffle(Array.from({ length: total }, (_, k) => (k < targets ? { t: true, g: L.g } : { t: false, g: decoy[k % decoy.length].g })));
    let found = 0, errors = 0;
    ctx.prompt("Ketuk semua huruf " + L.name + "  " + L.g, "Cari dan ketuk semua huruf " + L.name);
    const counter = h("div", { class: "count" }, "0 / " + targets);
    const grid = h("div", { class: "lgrid" }, cells.map((c) => {
      const b = h("button", { class: "cell arcell", "data-t": c.t ? 1 : null }, AR(c.g));
      b.onclick = () => {
        if (b.disabled) return; b.disabled = true;
        if (c.t) { found++; b.classList.add("good"); G.sfx("pop"); counter.textContent = found + " / " + targets; if (found === targets) { ctx.ok(); wait(900).then(() => ctx.done(errors)); } }
        else { errors++; b.classList.add("bad", "shake"); ctx.bad(); }
      };
      return b;
    }));
    ctx.cheat = () => { const b = ctx.el.querySelector("[data-t]:not(:disabled)"); if (b) b.click(); };
    ctx.el.append(h("div", { class: "hijbox mini" }, AR(L.g, "lg"), h("b", {}, L.name)), counter, grid);
  };
})();
