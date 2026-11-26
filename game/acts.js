// Aktivitas interaktif. Tiap aktivitas: A[type](ctx). Selesai -> ctx.done(jumlahSalah).
(function () {
  const { h, rnd, shuffle, pick, wait } = G;
  const A = (G.acts = {});
  G._r = {};
  const NS = "http://www.w3.org/2000/svg";

  // ---------- pembantu: ronde pilihan ----------
  function rounds(ctx, qs) {
    let i = 0, errors = 0, lock = false;
    const stage = ctx.el;
    function show() {
      lock = false; stage.innerHTML = "";
      const q = qs[i];
      ctx.prompt(q.prompt, q.say || q.prompt);
      const dots = h("div", { class: "rdots" }, qs.map((_, k) => h("i", { class: k < i ? "on" : k === i ? "cur" : "" })));
      const grid = h("div", { class: "opts n" + q.options.length });
      q.options.forEach((o) => {
        const b = h("button", { class: "opt " + (q.optCls || ""), "data-ok": o.ok ? 1 : null, "aria-label": o.label || null }, o.c);
        b.onclick = async () => {
          if (lock || b.disabled) return;
          if (o.ok) {
            lock = true; b.classList.add("good"); ctx.ok(); if (q.after) setTimeout(() => G.say(q.after), 350); await wait(950);
            i++; if (i >= qs.length) ctx.done(errors); else show();
          } else { errors++; b.disabled = true; b.classList.add("bad", "shake"); ctx.bad(); }
        };
        grid.append(b);
      });
      stage.append(dots, h("div", { class: "q" }, q.stage || ""), grid);
    }
    ctx.cheat = () => { const b = stage.querySelector("[data-ok]"); if (b && !lock) b.click(); };
    show();
  }
  const opt = (c, ok, label) => ({ c, ok, label });
  const big = (t) => h("span", { class: "bigtxt" }, t);

  // ---------- Kenali huruf ----------
  A.kenal = (ctx) => {
    const L = ctx.p.letter;
    const good = shuffle(C.byInitial(L));
    const pool = shuffle(C.words.filter((w) => w.w[0].toUpperCase() !== L));
    const qs = [];
    for (let k = 0; k < 3; k++) {
      const g = good[k % good.length];
      const others = pool.filter((w) => w.w !== g.w).slice(k * 2, k * 2 + 2);
      qs.push({
        prompt: "Mana yang diawali huruf " + L + "?", say: "Mana gambar yang diawali huruf " + L.toLowerCase() + "?",
        stage: h("div", { class: "letterbox" }, h("b", {}, L), h("span", {}, L.toLowerCase())),
        options: shuffle([g, ...others]).map((w) => opt(h("span", { class: "pic" }, h("em", {}, w.e), h("small", {}, w.w)), w.w === g.w, w.w))
      });
    }
    rounds(ctx, qs);
  };

  // ---------- Cari huruf ----------
  A.cari = (ctx) => {
    const L = ctx.p.letter, lo = L.toLowerCase();
    const decoys = shuffle(C.LETTERS.filter((x) => x !== L).concat(["T", "D", "R", "N", "L"]));
    const total = 12, targets = 4 + rnd(2);
    const cells = shuffle(Array.from({ length: total }, (_, k) => (k < targets ? { t: true, c: rnd(2) ? L : lo } : { t: false, c: (rnd(2) ? decoys[k % decoys.length] : decoys[k % decoys.length].toLowerCase()) })));
    let found = 0, errors = 0;
    ctx.prompt("Ketuk semua huruf " + L + "!", "Cari dan ketuk semua huruf " + lo + "!");
    const counter = h("div", { class: "count" }, "0 / " + targets);
    const grid = h("div", { class: "lgrid" }, cells.map((c) => {
      const b = h("button", { class: "cell", "data-t": c.t ? 1 : null }, c.c);
      b.onclick = () => {
        if (b.disabled) return; b.disabled = true;
        if (c.t) { found++; b.classList.add("good"); G.sfx("pop"); counter.textContent = found + " / " + targets; if (found === targets) { ctx.ok(); wait(900).then(() => ctx.done(errors)); } }
        else { errors++; b.classList.add("bad", "shake"); ctx.bad(); }
      };
      return b;
    }));
    ctx.cheat = () => { const b = ctx.el.querySelector("[data-t]:not(:disabled)"); if (b) b.click(); };
    ctx.el.append(counter, grid);
  };

  // ---------- Hitung benda (pilih angka) ----------
  function itemsBox(n, emoji) {
    return h("div", { class: "items" + (n > 10 ? " many" : "") }, Array.from({ length: n }, (_, k) => h("span", { style: { animationDelay: k * 0.05 + "s" } }, emoji)));
  }
  A.hitung = (ctx) => {
    const n = ctx.p.n, em = pick(["🍎", "⭐", "🐟", "🎈", "🐥", "🍓", "🚗", "🌸"], 3);
    const R = ctx.p.range; const vals = R ? [0, 1, 2].map(() => R[0] + rnd(R[1] - R[0] + 1)) : [n, G.clamp(n + (n < 6 ? 1 : -1), 1, 10), n];
    const qs = vals.map((v, k) => {
      const wrong = shuffle(Array.from({ length: 20 }, (_, k) => k + 1).filter((x) => x !== v && Math.abs(x - v) <= 3)).slice(0, 2);
      return {
        prompt: "Ada berapa?", say: "Ada berapa " + (k === 0 ? "benda" : "gambar") + " ini?",
        stage: itemsBox(v, em[k]), optCls: "num",
        options: shuffle([v, ...wrong]).map((x) => opt(big(x), x === v, String(x)))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Ambil / warnai sebanyak n ----------
  function pickCount(ctx, n, emoji, paint) {
    const total = G.clamp(n + 3 + rnd(2), 6, 12);
    let sel = 0, errors = 0, finished = false;
    ctx.prompt((paint ? "Warnai " : "Ketuk ") + n + " " + (paint ? "gambar" : "benda") + "!", (paint ? "Warnai " : "Ambil ") + n + "!");
    const counter = h("div", { class: "count" }, "0 / " + n);
    const grid = h("div", { class: "pgrid" }, Array.from({ length: total }, () => {
      const b = h("button", { class: "pitem" + (paint ? " paint" : "") }, emoji);
      b.onclick = () => {
        if (finished || b.classList.contains("on")) return;
        if (sel >= n) { errors++; b.classList.add("shake"); ctx.bad(); setTimeout(() => b.classList.remove("shake"), 500); return; }
        b.classList.add("on"); sel++; G.sfx("pop"); counter.textContent = sel + " / " + n;
        if (sel === n) { finished = true; ctx.ok(); wait(950).then(() => ctx.done(errors)); }
      };
      return b;
    }));
    ctx.cheat = () => { const b = grid.querySelector(".pitem:not(.on)"); if (b) b.click(); };
    ctx.el.append(counter, grid);
  }
  A.ambil = (ctx) => pickCount(ctx, ctx.p.n, pick(["🍎", "🍓", "⭐", "🐥", "🎈"], 1)[0], false);
  A.warnai = (ctx) => {
    const lvl = ctx.p.level, n = G.clamp(2 + Math.round(lvl * 8) + rnd(2), 2, 10);
    pickCount(ctx, n, pick(ctx.p.world.set, 1)[0], true);
  };

  // ---------- Suku kata pertama ----------
  A.suku = (ctx) => {
    const ws = shuffle(ctx.p.words.map(C.word)).slice(0, 3);
    while (ws.length < 3) ws.push(pick(C.words, 1)[0]);
    const qs = ws.map((w) => {
      const first = w.s[0];
      const dec = shuffle(C.SYL.filter((s) => s !== first)).slice(0, 2);
      return {
        prompt: "Suku kata pertama: " + w.w, say: "Suku kata pertama dari " + w.w + " yang mana?",
        stage: h("div", { class: "wordbox" }, h("em", {}, w.e), h("b", {}, w.s.join(" · "))), optCls: "syl",
        options: shuffle([first, ...dec]).map((s) => opt(big(s), s === first, s))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Baca kata -> pilih gambar ----------
  A.baca = (ctx) => {
    const ws = shuffle(ctx.p.words.map(C.word)).slice(0, 3);
    while (ws.length < 3) ws.push(pick(C.words, 1)[0]);
    const qs = ws.map((w) => {
      const dec = shuffle(C.words.filter((x) => x.w !== w.w && x.e !== w.e)).slice(0, 2);
      return {
        prompt: "Baca: " + w.w, say: w.w, stage: h("div", { class: "readword" }, w.s.map((s) => h("span", {}, s))),
        options: shuffle([w, ...dec]).map((x) => opt(h("span", { class: "pic" }, h("em", {}, x.e)), x.w === w.w, x.w))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Susun kata ----------
  A.susun = (ctx) => {
    const ws = shuffle(ctx.p.words.map(C.word).filter((w) => w.s.length <= 3)).slice(0, 2);
    let i = 0, errors = 0;
    function show() {
      const w = ws[i]; let next = 0; ctx.el.innerHTML = "";
      ctx.prompt("Susun kata: " + w.w, "Susun suku kata menjadi " + w.w);
      const slots = h("div", { class: "slots" }, w.s.map(() => h("div", { class: "slot" })));
      const tiles = h("div", { class: "tiles" }, shuffle(w.s.map((s, idx) => ({ s, idx }))).map((t) => {
        const b = h("button", { class: "tile", "data-idx": t.idx }, t.s);
        b.onclick = async () => {
          if (b.disabled) return;
          if (t.idx === next) {
            b.disabled = true; b.classList.add("used"); slots.children[next].textContent = t.s; slots.children[next].classList.add("fill"); G.sfx("pop"); next++;
            if (next === w.s.length) { ctx.ok(); G.say(w.w); await wait(1100); i++; if (i >= ws.length) ctx.done(errors); else show(); }
          } else { errors++; b.classList.add("shake"); ctx.bad(); setTimeout(() => b.classList.remove("shake"), 500); }
        };
        return b;
      }));
      ctx.el.append(h("div", { class: "wordbox" }, h("em", {}, w.e)), slots, tiles);
      ctx.cheat = () => { const t = tiles.querySelector('.tile[data-idx="' + next + '"]:not(:disabled)'); if (t) t.click(); };
    }
    show();
  };

  // ---------- Tambah bergambar ----------
  A.tambah = (ctx) => {
    const mx = ctx.p.max, em = pick(["🍎", "🐥", "⭐", "🍓", "🎈", "🐟"], 3);
    const qs = [0, 1, 2].map((k) => {
      let a = 1 + rnd(Math.max(1, mx - 1)), b = 1 + rnd(Math.max(1, mx - a)); if (a + b > Math.max(mx, 2)) b = Math.max(1, mx - a);
      const sum = a + b;
      const wrong = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x !== sum && Math.abs(x - sum) <= 2)).slice(0, 2);
      return {
        prompt: a + " + " + b + " = ?", say: a + " tambah " + b + " sama dengan berapa?", optCls: "num",
        stage: h("div", { class: "sum" }, itemsBox(a, em[k]), h("b", {}, "+"), itemsBox(b, em[k])),
        options: shuffle([sum, ...wrong]).map((x) => opt(big(x), x === sum, String(x)))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- mesin menebalkan (huruf/angka/garis) ----------
  function tracer(ctx, o) {
    const S = 320;
    const mk = () => { const c = document.createElement("canvas"); c.width = c.height = S; return c; };
    const guide = mk(), ink = mk(), mask = mk(), reach = mk();
    guide.className = "tc g"; ink.className = "tc i";
    const gx = guide.getContext("2d"), ix = ink.getContext("2d"), mx = mask.getContext("2d"), rx = reach.getContext("2d");
    o.mask(mx, S); o.guide(gx, S);
    const wrap = h("div", { class: "tracebox" }, guide, ink);
    const msg = h("div", { class: "hint" }, o.hint || "Ikuti garis putus-putus dengan jarimu");
    const clear = h("button", { class: "btn ghost small", onclick: () => { ix.clearRect(0, 0, S, S); rx.clearRect(0, 0, S, S); } }, "↺ Ulangi");
    ctx.el.append(wrap, msg, clear);
    let drawing = false, last = null, finished = false;
    const pos = (e) => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) * S / r.width, (e.clientY - r.top) * S / r.height]; };
    ix.lineCap = ix.lineJoin = "round"; ix.lineWidth = 26; ix.strokeStyle = "rgba(255,138,61,.92)";
    rx.lineCap = rx.lineJoin = "round"; rx.lineWidth = o.reach; rx.strokeStyle = "#000";
    function seg(a, b) { [ix, rx].forEach((x) => { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }); }
    ink.addEventListener("pointerdown", (e) => { if (finished) return; drawing = true; last = pos(e); seg(last, last); ink.setPointerCapture(e.pointerId); e.preventDefault(); });
    ink.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); seg(last, p); last = p; e.preventDefault(); });
    const end = () => { if (!drawing) return; drawing = false; check(); };
    ink.addEventListener("pointerup", end); ink.addEventListener("pointercancel", end);
    function coverage() {
      const m = mx.getImageData(0, 0, S, S).data, d = ix.getImageData(0, 0, S, S).data, rr = rx.getImageData(0, 0, S, S).data;
      let mt = 0, cov = 0, it = 0;
      for (let k = 3; k < m.length; k += 4) { const on = m[k] > 128; if (on) { mt++; if (rr[k] > 20) cov++; } if (d[k] > 20) it++; }
      return mt ? [cov / mt, it / mt] : [1, 0];
    }
    function check() {
      const [cv, over] = coverage();
      if (cv >= o.need && over < o.over) { finished = true; msg.textContent = "Wah, bagus sekali!"; ink.style.opacity = 1; ctx.ok(); wait(1100).then(() => ctx.done(0)); }
      else if (cv > 0.15) msg.textContent = cv >= o.need ? "Terlalu banyak coretan, coba ulangi ya" : "Hampir! Lanjutkan mengikuti garis";
    }
    ctx.cov = coverage;
    ctx.cheat = () => { // isi seluruh area mask lalu periksa
      const m = mx.getImageData(0, 0, S, S).data; ix.fillStyle = "rgba(255,138,61,.92)"; rx.fillStyle = "#000";
      for (let y = 0; y < S; y += 6) for (let x = 0; x < S; x += 6) if (m[(y * S + x) * 4 + 3] > 128) { ix.fillRect(x - 4, y - 4, 8, 8); rx.fillRect(x - 6, y - 6, 12, 12); }
      check();
    };
  }

  // gambar teks di tengah kanvas, ukuran menyesuaikan bentuk hurufnya
  function fitText(x, S, t, family, fill) {
    x.font = "800 200px " + family; x.textAlign = "left"; x.textBaseline = "alphabetic";
    let m = x.measureText(t), w = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || 120, hh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 140;
    const k = Math.min((S * 0.72) / w, (S * 0.72) / hh, 1.6), size = Math.round(200 * k);
    x.font = "800 " + size + "px " + family; m = x.measureText(t);
    const L = m.actualBoundingBoxLeft, R = m.actualBoundingBoxRight, A = m.actualBoundingBoxAscent, D = m.actualBoundingBoxDescent;
    const px = S / 2 - (R - L) / 2, py = S / 2 + (A - D) / 2;
    fill(x, px, py, size);
  }
  function traceText(ctx, t, family, say) {
    ctx.prompt(say[0], say[1]);
    const ready = document.fonts && document.fonts.load ? document.fonts.load("800 200px " + family, t) : Promise.resolve();
    ready.catch(() => {}).then(() => {
      tracer(ctx, {
        need: 0.85, over: 3.2, reach: 66,
        mask: (x, S) => fitText(x, S, t, family, (c, px, py, size) => { c.fillStyle = "#000"; c.strokeStyle = "#000"; c.lineWidth = Math.max(6, size * 0.05); c.lineJoin = "round"; c.fillText(t, px, py); c.strokeText(t, px, py); }),
        guide: (x, S) => fitText(x, S, t, family, (c, px, py, size) => {
          c.fillStyle = "#FFF1CF"; c.strokeStyle = "#FFF1CF"; c.lineWidth = Math.max(6, size * 0.05); c.lineJoin = "round"; c.fillText(t, px, py); c.strokeText(t, px, py);
          c.setLineDash([2, 13]); c.lineWidth = 4.5; c.lineCap = "round"; c.strokeStyle = "#1B2A4A"; c.strokeText(t, px, py); c.setLineDash([]);
        })
      });
    });
  }
  G._r.traceText = traceText;
  A.trace = (ctx) => {
    const t = ctx.p.text, what = (ctx.p.kind === "angka" ? "angka " : "huruf ");
    traceText(ctx, t, '"Baloo 2", Nunito, Arial, sans-serif', ["Tebalkan " + what + t, "Tebalkan " + what + t.toLowerCase() + " dengan jarimu"]);
  };

  // ---------- Jejak garis ----------
  function curve(kind, S) {
    const pts = []; const N = 60;
    for (let k = 0; k <= N; k++) {
      const t = k / N; let x, y;
      if (kind === 0) { x = 30 + t * 260; y = S / 2; }                                    // lurus
      else if (kind === 1) { x = 30 + t * 260; y = S / 2 + Math.sin(t * Math.PI * 4) * 70; } // gelombang
      else if (kind === 2) { x = 30 + t * 260; y = S / 2 + (Math.abs(((t * 4) % 2) - 1) - 0.5) * 190; } // zig-zag
      else if (kind === 3) { const a = t * Math.PI * 2.1 - Math.PI / 2; x = S / 2 + Math.cos(a) * 105; y = S / 2 + Math.sin(a) * 105; } // lingkaran
      else { const a = t * Math.PI * 5; const r = 18 + t * 118; x = S / 2 + Math.cos(a) * r; y = S / 2 + Math.sin(a) * r; } // spiral
      pts.push([x, y]);
    }
    return pts;
  }
  A.jejak = (ctx) => {
    const lvl = ctx.p.level, kind = G.clamp(Math.floor(lvl * 5.4 - 0.2 + rnd(2) * 0.6), 0, 4);
    const pts = curve(kind, 320);
    const path = (x) => { x.beginPath(); pts.forEach((p, k) => (k ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); };
    ctx.prompt("Ikuti jejak garis", "Ikuti jejak garisnya dari titik hijau sampai bendera");
    tracer(ctx, {
      need: 0.85, over: 3.4, reach: 48, hint: "Mulai dari titik hijau ke bendera 🏁",
      mask: (x) => { x.lineWidth = 36; x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#000"; path(x); x.stroke(); },
      guide: (x) => {
        x.lineCap = x.lineJoin = "round"; x.lineWidth = 36; x.strokeStyle = "#FFF1CF"; path(x); x.stroke();
        x.setLineDash([2, 14]); x.lineWidth = 5; x.strokeStyle = "#1B2A4A"; path(x); x.stroke(); x.setLineDash([]);
        x.fillStyle = "#2E9E5B"; x.beginPath(); x.arc(pts[0][0], pts[0][1], 13, 0, 7); x.fill();
        x.font = "30px serif"; x.textAlign = "center"; x.fillText("🏁", pts[pts.length - 1][0], pts[pts.length - 1][1] + 10);
      }
    });
  };

  // ---------- Labirin ----------
  function genMaze(n) {
    const wallR = Array.from({ length: n }, () => Array(n).fill(true)), wallB = Array.from({ length: n }, () => Array(n).fill(true));
    const seen = Array.from({ length: n }, () => Array(n).fill(false)), st = [[0, 0]]; seen[0][0] = true;
    while (st.length) {
      const [r, c] = st[st.length - 1];
      const nb = shuffle([[0, 1], [1, 0], [0, -1], [-1, 0]]).map(([dr, dc]) => [r + dr, c + dc, dr, dc]).filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < n && !seen[a][b]);
      if (!nb.length) { st.pop(); continue; }
      const [a, b, dr, dc] = nb[0]; seen[a][b] = true;
      if (dr === 1) wallB[r][c] = false; else if (dr === -1) wallB[a][b] = false; else if (dc === 1) wallR[r][c] = false; else wallR[a][b] = false;
      st.push([a, b]);
    }
    return { wallR, wallB };
  }
  A.maze = (ctx) => {
    const n = 4 + Math.round(ctx.p.level * 3), cs = Math.floor(Math.min(330, ctx.el.clientWidth || 330) / n) || 48;
    const cell = Math.min(cs, 64), M = genMaze(n);
    const can = (r, c, r2, c2) => {
      if (r2 < 0 || c2 < 0 || r2 >= n || c2 >= n) return false;
      if (r2 === r + 1 && c2 === c) return !M.wallB[r][c]; if (r2 === r - 1 && c2 === c) return !M.wallB[r2][c2];
      if (c2 === c + 1 && r2 === r) return !M.wallR[r][c]; if (c2 === c - 1 && r2 === r) return !M.wallR[r2][c2]; return false;
    };
    ctx.prompt("Antar " + ctx.p.world.char + " ke bintang!", "Bantu temanmu sampai ke bintang. Geser jarimu melewati jalan");
    const grid = h("div", { class: "maze", style: { width: cell * n + "px", height: cell * n + "px", gridTemplateColumns: `repeat(${n},${cell}px)`, gridTemplateRows: `repeat(${n},${cell}px)`, fontSize: cell * 0.6 + "px" } });
    const cells = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const d = h("div", { class: "mc" }); d.style.borderRight = M.wallR[r][c] && c < n - 1 ? "4px solid #1B2A4A" : "4px solid transparent"; d.style.borderBottom = M.wallB[r][c] && r < n - 1 ? "4px solid #1B2A4A" : "4px solid transparent";
      cells.push(d); grid.append(d);
    }
    cells[(n - 1) * n + n - 1].textContent = "⭐"; cells[(n - 1) * n + n - 1].classList.add("goal");
    let pr = 0, pc = 0, finished = false; cells[0].classList.add("trail"); cells[0].textContent = ctx.p.world.char;
    function place(r, c) {
      cells[pr * n + pc].textContent = pr === n - 1 && pc === n - 1 ? "⭐" : ""; pr = r; pc = c;
      cells[r * n + c].classList.add("trail"); cells[r * n + c].textContent = ctx.p.world.char; G.sfx("tap");
      if (r === n - 1 && c === n - 1 && !finished) { finished = true; ctx.ok(); wait(1000).then(() => ctx.done(0)); }
    }
    function route(r, c) { // BFS dari posisi sekarang ke (r,c)
      const q = [[pr, pc]], prev = { [pr * n + pc]: -1 };
      while (q.length) { const [a, b] = q.shift(); if (a === r && b === c) break; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const x = a + dr, y = b + dc; if (can(a, b, x, y) && !(x * n + y in prev)) { prev[x * n + y] = a * n + b; q.push([x, y]); } }); }
      if (!((r * n + c) in prev)) return []; const out = []; let k = r * n + c; while (k !== pr * n + pc) { out.unshift([Math.floor(k / n), k % n]); k = prev[k]; } return out;
    }
    let drag = false;
    const at = (e) => { const rc = grid.getBoundingClientRect(); const c = Math.floor((e.clientX - rc.left) / cell), r = Math.floor((e.clientY - rc.top) / cell); return r >= 0 && c >= 0 && r < n && c < n ? [r, c] : null; };
    const go = (e) => { const t = at(e); if (!t || finished) return; const p = route(t[0], t[1]); if (p.length && p.length <= 3) p.forEach(([a, b]) => place(a, b)); };
    grid.addEventListener("pointerdown", (e) => { drag = true; grid.setPointerCapture(e.pointerId); go(e); e.preventDefault(); });
    grid.addEventListener("pointermove", (e) => { if (drag) go(e); });
    grid.addEventListener("pointerup", () => (drag = false));
    document.onkeydown = (e) => { const m = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key]; if (m && !finished && can(pr, pc, pr + m[0], pc + m[1])) { place(pr + m[0], pc + m[1]); e.preventDefault(); } };
    ctx.onExit = () => (document.onkeydown = null);
    ctx.cheat = () => { if (finished) return; const p = route(n - 1, n - 1); if (p.length) place(p[0][0], p[0][1]); };
    ctx.el.append(h("div", { class: "mazewrap" }, grid), h("div", { class: "hint" }, "Geser jari dari awal sampai bintang"));
  };

  // ---------- Pola ----------
  A.pola = (ctx) => {
    const lvl = ctx.p.level, pool = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⭐", "❤️", "🔷"];
    const qs = [0, 1, 2].map((k) => {
      const types = lvl < 0.25 ? ["AB"] : lvl < 0.5 ? ["AB", "AAB", "ABB"] : lvl < 0.75 ? ["AAB", "ABB", "ABC"] : ["ABC", "AABB", "ABCB"];
      const pat = types[(k + rnd(3)) % types.length], syms = pick(pool.concat(ctx.p.world.set), 3);
      const unit = pat.split("").map((c) => syms["ABC".indexOf(c)]);
      const len = Math.min(unit.length * 2 + 1, 9), seq = Array.from({ length: len }, (_, i) => unit[i % unit.length]), ans = unit[len % unit.length];
      const options = [ans]; shuffle(pool.concat(syms)).forEach((x) => { if (options.length < 3 && !options.includes(x)) options.push(x); });
      return {
        prompt: "Apa yang berikutnya?", say: "Lanjutkan polanya. Apa yang berikutnya?",
        stage: h("div", { class: "pattern" }, seq.map((s) => h("span", {}, s)), h("span", { class: "qmark" }, "?")),
        options: shuffle(options).map((s) => opt(h("span", { class: "pic" }, h("em", {}, s)), s === ans))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Hubungkan titik ----------
  A.titik = (ctx) => {
    const n = 5 + Math.round(ctx.p.level * 7), star = n >= 8 && n % 2 === 0 && rnd(2);
    const pts = Array.from({ length: n }, (_, k) => {
      const a = (k / n) * Math.PI * 2 - Math.PI / 2, r = star ? (k % 2 ? 62 : 128) : 118;
      return [160 + Math.cos(a) * r, 160 + Math.sin(a) * r];
    });
    ctx.prompt("Hubungkan titik 1 sampai " + n, "Ketuk titik dari angka satu sampai " + n);
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 320 320"); svg.setAttribute("class", "dots");
    const lines = document.createElementNS(NS, "g"), fill = document.createElementNS(NS, "polygon"); fill.setAttribute("class", "dfill"); fill.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    svg.append(fill, lines);
    let next = 1, errors = 0, prev = null, finished = false;
    const reveal = h("div", { class: "reveal-e" }, pick(ctx.p.world.set, 1)[0]);
    pts.forEach((p, k) => {
      const g = document.createElementNS(NS, "g"); g.setAttribute("class", "dot"); g.setAttribute("data-k", k + 1);
      g.innerHTML = `<circle cx="${p[0]}" cy="${p[1]}" r="19"/><text x="${p[0]}" y="${p[1] + 6}" text-anchor="middle">${k + 1}</text>`;
      g.addEventListener("pointerdown", (e) => {
        e.preventDefault(); if (finished) return;
        if (k + 1 === next) {
          g.classList.add("done"); G.sfx("pop");
          if (prev) { const l = document.createElementNS(NS, "line"); l.setAttribute("x1", prev[0]); l.setAttribute("y1", prev[1]); l.setAttribute("x2", p[0]); l.setAttribute("y2", p[1]); lines.append(l); }
          prev = p; next++;
          if (next > n) { finished = true; const l = document.createElementNS(NS, "line"); l.setAttribute("x1", p[0]); l.setAttribute("y1", p[1]); l.setAttribute("x2", pts[0][0]); l.setAttribute("y2", pts[0][1]); lines.append(l); fill.classList.add("on"); reveal.classList.add("on"); ctx.ok(); wait(1300).then(() => ctx.done(errors)); }
        } else { errors++; g.classList.add("shake"); ctx.bad(); setTimeout(() => g.classList.remove("shake"), 500); }
      });
      svg.append(g);
    });
    ctx.cheat = () => { if (!finished) svg.querySelector('.dot[data-k="' + next + '"]').dispatchEvent(new Event("pointerdown")); };
    ctx.el.append(h("div", { class: "dotswrap" }, svg, reveal));
  };

  // ---------- Sudoku bentuk ----------
  A.sudoku = (ctx) => {
    const SH = shuffle(["🔴", "🟦", "🔺"]), base = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
    const rows = shuffle([0, 1, 2]), cols = shuffle([0, 1, 2]);
    const sol = rows.map((r) => cols.map((c) => SH[base[r][c]]));
    const blanks = G.clamp(3 + Math.round(ctx.p.level * 3), 3, 6), empty = new Set(pick(Array.from({ length: 9 }, (_, k) => k), blanks));
    const cur = sol.map((r) => r.slice()); empty.forEach((k) => (cur[Math.floor(k / 3)][k % 3] = null));
    let sel = null, errors = 0; const left = new Set(empty);
    ctx.prompt("Isi kotak kosong", "Setiap baris dan kolom harus punya tiga bentuk yang berbeda. Isi kotak yang kosong");
    const grid = h("div", { class: "sudo" });
    const cells = []; for (let k = 0; k < 9; k++) {
      const b = h("button", { class: "sc" + (empty.has(k) ? " empty" : ""), "data-k": k }, cur[Math.floor(k / 3)][k % 3] || "");
      b.onclick = () => { if (!left.has(k)) return; sel = k; cells.forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); };
      cells.push(b); grid.append(b);
    }
    const nextSel = () => { const k = [...left][0]; if (k == null) return; sel = k; cells.forEach((x) => x.classList.remove("sel")); cells[k].classList.add("sel"); };
    const pal = h("div", { class: "palette" }, SH.map((s) => {
      const b = h("button", { class: "opt", "data-s": s }, h("span", { class: "pic" }, h("em", {}, s)));
      b.onclick = async () => {
        if (sel == null) return; const k = sel, want = sol[Math.floor(k / 3)][k % 3];
        if (s === want) { cells[k].textContent = s; cells[k].classList.remove("empty", "sel"); cells[k].classList.add("good"); left.delete(k); G.sfx("pop"); sel = null; if (!left.size) { ctx.ok(); await wait(1000); ctx.done(errors); } else nextSel(); }
        else { errors++; cells[k].classList.add("shake"); ctx.bad(); setTimeout(() => cells[k].classList.remove("shake"), 500); }
      };
      return b;
    }));
    ctx.cheat = () => { if (!left.size) return; if (sel == null || !left.has(sel)) nextSel(); const want = sol[Math.floor(sel / 3)][sel % 3]; pal.querySelector('[data-s="' + want + '"]').click(); };
    ctx.el.append(grid, pal); nextSel();
  };

  // ---------- Cermin ajaib ----------
  A.cermin = (ctx) => {
    const R = 4, Cc = 3, k = G.clamp(3 + Math.round(ctx.p.level * 4), 3, 7);
    const on = new Set(pick(Array.from({ length: R * Cc }, (_, i) => i), k));
    ctx.prompt("Tiru bayangannya di cermin", "Warnai kotak di sisi kanan supaya sama seperti bayangan cermin");
    let errors = 0, need = k; const right = [];
    const mk = (side) => {
      const g = h("div", { class: "mgrid" });
      for (let r = 0; r < R; r++) for (let c = 0; c < Cc; c++) {
        const idx = r * Cc + c, b = h("button", { class: "mcell" + (side === "L" && on.has(idx) ? " lit" : ""), disabled: side === "L" ? "" : null });
        if (side === "R") {
          const mirror = r * Cc + (Cc - 1 - c); b.dataset.m = on.has(mirror) ? 1 : "";
          b.onclick = async () => {
            if (b.classList.contains("lit")) return;
            if (on.has(mirror)) { b.classList.add("lit"); G.sfx("pop"); need--; if (!need) { ctx.ok(); await wait(1000); ctx.done(errors); } }
            else { errors++; b.classList.add("shake"); ctx.bad(); setTimeout(() => b.classList.remove("shake"), 500); }
          };
          right.push(b);
        }
        g.append(b);
      }
      return g;
    };
    ctx.cheat = () => { const b = right.find((x) => x.dataset.m && !x.classList.contains("lit")); if (b) b.click(); };
    ctx.el.append(h("div", { class: "mirror" }, mk("L"), h("div", { class: "axis" }, "🪞"), mk("R")));
  };

  // ---------- Besar – kecil ----------
  A.besar = (ctx) => {
    const set = ctx.p.world.set.concat(["🐘", "🍎", "🐱", "🌳", "🐟"]);
    const qs = [0, 1, 2].map((k) => {
      const e = pick(set, 1)[0], sizes = shuffle([46, 80, 118]), wantBig = k !== 1;
      const target = wantBig ? 118 : 46;
      return {
        prompt: wantBig ? "Pilih yang paling BESAR" : "Pilih yang paling KECIL", say: wantBig ? "Pilih yang paling besar" : "Pilih yang paling kecil", optCls: "sz",
        options: sizes.map((s) => opt(h("span", { style: { fontSize: s + "px", lineHeight: 1 } }, e), s === target))
      };
    });
    rounds(ctx, qs);
  };

  // ---------- Cari yang sama / beda ----------
  A.sama = (ctx) => {
    const pairs = [["🐶", "🐱"], ["🍎", "🍊"], ["🚗", "🚕"], ["🐟", "🐠"], ["🌸", "🌼"], ["🐰", "🐭"], ["⭐", "🌟"], ["🍓", "🍒"]];
    const qs = [0, 1, 2].map((k) => {
      const pr = shuffle(pairs.slice())[0].slice(), [a, b] = rnd(2) ? pr : pr.reverse();
      if (k % 2 === 0) { // cari yang berbeda
        const odd = rnd(9), cells = Array.from({ length: 9 }, (_, i) => (i === odd ? b : a));
        return { prompt: "Mana yang berbeda?", say: "Mana gambar yang berbeda sendiri?", optCls: "odd", options: cells.map((c, i) => opt(h("span", { class: "pic sm" }, h("em", {}, c)), i === odd)), grid: 3 };
      }
      const others = shuffle(pairs.flat().filter((x) => x !== a)).slice(0, 3);
      return { prompt: "Cari yang sama", say: "Cari gambar yang sama persis", stage: h("div", { class: "wordbox" }, h("em", {}, a)), options: shuffle([a, ...others]).map((c) => opt(h("span", { class: "pic" }, h("em", {}, c)), c === a)) };
    });
    rounds(ctx, qs);
  };

  // ---------- Cari bayangan ----------
  A.bayang = (ctx) => {
    const set = shuffle(ctx.p.world.set.concat(["🐘", "🐱", "🐟", "🍎", "🚗", "🦋", "🐢", "🌳"]));
    const qs = [0, 1, 2].map((k) => {
      const e = set[k], others = set.slice(3).filter((x) => x !== e).slice(k, k + 2);
      return {
        prompt: "Mana bayangannya?", say: "Mana bayangan yang cocok dengan gambar ini?", stage: h("div", { class: "wordbox" }, h("em", {}, e)),
        options: shuffle([e, ...others]).map((c) => opt(h("span", { class: "pic shadow" }, h("em", {}, c)), c === e))
      };
    });
    rounds(ctx, qs);
  };
  Object.assign(G._r, { rounds, opt, big, itemsBox, pickCount, tracer });
})();
