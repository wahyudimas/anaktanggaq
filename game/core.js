// Inti: util, penyimpanan, suara, maskot, efek.
(function () {
  const G = (window.G = {});
  G.fast = /[?&]test=1/.test(location.search);

  G.h = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v);
    }
    kids.flat(9).forEach((c) => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c)); });
    return e;
  };
  G.rnd = (n) => Math.floor(Math.random() * n);
  G.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = G.rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  G.pick = (a, n) => G.shuffle(a).slice(0, n);
  G.wait = (ms) => new Promise((r) => setTimeout(r, G.fast ? 15 : ms));
  G.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  G.today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

  // ---------- penyimpanan ----------
  const KEY = "atq_game_v1";
  function fresh() { return { v: 1, profiles: [], current: null, settings: { sound: true, voice: true, free: false }, unlocked: { cal: false, pet: false } }; }
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.profiles) return s; } catch (e) {} return fresh(); }
  G.state = load();
  G.save = () => { try { localStorage.setItem(KEY, JSON.stringify(G.state)); } catch (e) {} };
  G.profile = () => G.state.profiles.find((p) => p.id === G.state.current) || null;
  G.addProfile = (name, avatar) => {
    const p = { id: "p" + Date.now() + G.rnd(999), name, avatar, prog: { cal: { d: {}, last: "" }, pet: { d: {}, last: "" } }, dates: [] };
    G.state.profiles.push(p); G.state.current = p.id; G.save(); return p;
  };
  G.done = (track, n) => (G.profile().prog[track].d[n] || null);
  G.doneCount = (track) => Object.keys(G.profile().prog[track].d).length;
  G.totalStars = () => { const p = G.profile(); let s = 0; ["cal", "pet"].forEach((t) => Object.values(p.prog[t].d).forEach((x) => (s += x.stars))); return s; };
  G.streak = () => {
    const ds = new Set(G.profile().dates); let n = 0; const d = new Date();
    if (!ds.has(G.today())) d.setDate(d.getDate() - 1);
    for (;;) { const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); if (!ds.has(k)) break; n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  G.markDone = (track, n, stars) => {
    const p = G.profile(), t = p.prog[track];
    const old = t.d[n];
    t.d[n] = { stars: Math.max(stars, old ? old.stars : 0), at: G.today() };
    if (!old) t.last = G.today();
    if (!p.dates.includes(G.today())) p.dates.push(G.today());
    G.save();
  };

  // ---------- akses / kode ----------
  function sha256(str) {
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const b = Array.from(unescape(encodeURIComponent(str)), (c) => c.charCodeAt(0));
    const l = b.length * 8; b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    for (let i = 7; i >= 0; i--) b.push(i > 3 ? 0 : (l >>> (i * 8)) & 255);
    let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const rr = (x, n) => (x >>> n) | (x << (32 - n));
    for (let o = 0; o < b.length; o += 64) {
      const w = []; for (let i = 0; i < 16; i++) w[i] = (b[o+i*4]<<24)|(b[o+i*4+1]<<16)|(b[o+i*4+2]<<8)|b[o+i*4+3];
      for (let i = 16; i < 64; i++) { const s0 = rr(w[i-15],7)^rr(w[i-15],18)^(w[i-15]>>>3), s1 = rr(w[i-2],17)^rr(w[i-2],19)^(w[i-2]>>>10); w[i] = (w[i-16]+s0+w[i-7]+s1)|0; }
      let [a,bb,c,d,e,f,g,hh] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rr(e,6)^rr(e,11)^rr(e,25), ch = (e&f)^(~e&g), t1 = (hh+S1+ch+K[i]+w[i])|0;
        const S0 = rr(a,2)^rr(a,13)^rr(a,22), mj = (a&bb)^(a&c)^(bb&c), t2 = (S0+mj)|0;
        hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=bb; bb=a; a=(t1+t2)|0;
      }
      H = [(H[0]+a)|0,(H[1]+bb)|0,(H[2]+c)|0,(H[3]+d)|0,(H[4]+e)|0,(H[5]+f)|0,(H[6]+g)|0,(H[7]+hh)|0];
    }
    return H.map((x) => (x >>> 0).toString(16).padStart(8, "0")).join("");
  }
  G.sha256 = sha256;
  G.hashCode = (code) => sha256((window.GAME_CONFIG.salt || "") + String(code).toUpperCase().replace(/[^A-Z0-9]/g, ""));
  G.tryCode = (code) => {
    const hh = G.hashCode(code), hit = window.GAME_CONFIG.codes.find((c) => c.h === hh);
    if (!hit) return null;
    if (hit.scope === "all" || hit.scope === "cal") G.state.unlocked.cal = true;
    if (hit.scope === "all" || hit.scope === "pet") G.state.unlocked.pet = true;
    G.save(); return hit.scope;
  };
  G.isUnlocked = (track) => G.state.unlocked[track] || G.fast;
  G.dayOpen = (track, n) => G.isUnlocked(track) || n <= window.GAME_CONFIG.freeDays[track];

  // ---------- suara ----------
  let ac;
  function tone(f, t0, dur, type = "sine", vol = 0.14) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f; o.connect(g); g.connect(ac.destination);
    const t = ac.currentTime + t0;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  G.sfx = (name) => {
    if (!G.state.settings.sound || G.fast) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      if (name === "ok") { tone(660, 0, 0.14, "triangle"); tone(880, 0.1, 0.2, "triangle"); }
      else if (name === "bad") { tone(220, 0, 0.18, "sawtooth", 0.07); tone(180, 0.12, 0.22, "sawtooth", 0.06); }
      else if (name === "pop") tone(520, 0, 0.08, "triangle", 0.1);
      else if (name === "tap") tone(440, 0, 0.05, "sine", 0.08);
      else if (name === "win") [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle"));
    } catch (e) {}
  };
  let voice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find((v) => /^id/i.test(v.lang)) || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  G.say = (text) => {
    if (!G.state.settings.voice || G.fast || !("speechSynthesis" in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = "id-ID"; if (voice) u.voice = voice; u.rate = 0.82; u.pitch = 1.2;
      speechSynthesis.speak(u);
    } catch (e) {}
  };

  // ---------- maskot (karakter orisinal "Qiqi") ----------
  G.mascot = (mood = "happy") => {
    const mouth = mood === "wow" ? '<ellipse cx="60" cy="74" rx="7" ry="8" fill="#1B2A4A"/>'
      : mood === "oops" ? '<path d="M50 78 Q60 70 70 78" stroke="#1B2A4A" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<path d="M48 70 Q60 84 72 70" stroke="#1B2A4A" stroke-width="4" fill="none" stroke-linecap="round"/>';
    return `<svg class="mascot ${mood}" viewBox="0 0 120 130" aria-hidden="true">
      <rect x="52" y="6" width="14" height="8" rx="3" fill="#1B2A4A"/><rect x="60" y="0" width="14" height="8" rx="3" fill="#1B2A4A"/><rect x="44" y="12" width="14" height="8" rx="3" fill="#1B2A4A"/>
      <ellipse cx="60" cy="72" rx="46" ry="46" fill="#FFC94A"/>
      <ellipse cx="22" cy="82" rx="10" ry="14" fill="#FFB020" transform="rotate(18 22 82)"/><ellipse cx="98" cy="82" rx="10" ry="14" fill="#FFB020" transform="rotate(-18 98 82)"/>
      <circle cx="42" cy="58" r="9" fill="#fff"/><circle cx="78" cy="58" r="9" fill="#fff"/>
      <circle cx="43" cy="59" r="5" fill="#1B2A4A"/><circle cx="77" cy="59" r="5" fill="#1B2A4A"/><circle cx="45" cy="57" r="1.8" fill="#fff"/><circle cx="79" cy="57" r="1.8" fill="#fff"/>
      <ellipse cx="32" cy="74" rx="7" ry="4.5" fill="#FF8A3D" opacity=".55"/><ellipse cx="88" cy="74" rx="7" ry="4.5" fill="#FF8A3D" opacity=".55"/>
      ${mouth}
      <ellipse cx="44" cy="120" rx="13" ry="7" fill="#FF8A3D"/><ellipse cx="76" cy="120" rx="13" ry="7" fill="#FF8A3D"/></svg>`;
  };

  G.m = (mood) => { const d = document.createElement('div'); d.innerHTML = G.mascot(mood); return d.firstElementChild; };

  // ---------- efek ----------
  G.confetti = (n = 46) => {
    if (G.fast) return;
    const colors = ["#FFC94A", "#FF8A3D", "#1B2A4A", "#2E9E5B", "#5B3FC4", "#1B9AC4"];
    const box = G.h("div", { class: "confetti" });
    for (let i = 0; i < n; i++) {
      const p = G.h("i", { style: { left: Math.random() * 100 + "%", background: colors[i % colors.length], animationDelay: Math.random() * 0.5 + "s", animationDuration: 1.6 + Math.random() * 1.4 + "s", transform: "rotate(" + G.rnd(360) + "deg)" } });
      box.append(p);
    }
    document.body.append(box); setTimeout(() => box.remove(), 3400);
  };
  G.praise = ["Hebat!", "Pintar sekali!", "Benar!", "Keren!", "Wah, tepat!", "Mantap!"];
  G.oops = ["Coba lagi ya", "Hampir! Coba lagi", "Pelan-pelan, kamu pasti bisa"];
})();
