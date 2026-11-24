// Konten & rencana belajar. Semua level dibuat dari data ini.
(function () {
  const C = (window.C = {});

  // kata: w=kata, e=emoji, s=suku kata
  C.words = [
    ["apel","🍎",["a","pel"]],["ayam","🐔",["a","yam"]],["ikan","🐟",["i","kan"]],["ibu","👩",["i","bu"]],
    ["ular","🐍",["u","lar"]],["udang","🦐",["u","dang"]],["elang","🦅",["e","lang"]],["eskrim","🍦",["es","krim"]],
    ["ombak","🌊",["om","bak"]],["obat","💊",["o","bat"]],
    ["bola","⚽",["bo","la"]],["buku","📖",["bu","ku"]],["bebek","🦆",["be","bek"]],["bunga","🌸",["bu","nga"]],
    ["baju","👕",["ba","ju"]],["bibir","👄",["bi","bir"]],
    ["mata","👀",["ma","ta"]],["mobil","🚗",["mo","bil"]],["mangga","🥭",["ma","ngga"]],["minum","🥤",["mi","num"]],
    ["sapi","🐄",["sa","pi"]],["susu","🥛",["su","su"]],["sepatu","👟",["se","pa","tu"]],["sapu","🧹",["sa","pu"]],
    ["kuda","🐴",["ku","da"]],["kaki","🦶",["ka","ki"]],["kucing","🐱",["ku","cing"]],["kapal","🚢",["ka","pal"]],
    ["pisang","🍌",["pi","sang"]],["pensil","✏️",["pen","sil"]],["pohon","🌳",["po","hon"]],["payung","☂️",["pa","yung"]],
    ["pulau","🏝️",["pu","lau"]],["pita","🎀",["pi","ta"]],
    ["topi","🧢",["to","pi"]],["roti","🍞",["ro","ti"]]
  ].map(([w, e, s]) => ({ w, e, s }));
  C.word = (w) => C.words.find((x) => x.w === w);
  C.byInitial = (L) => C.words.filter((x) => x.w[0].toUpperCase() === L);

  C.LETTERS = ["A","I","U","E","O","B","M","S","K","P"];
  C.SYL = ["ba","bi","bu","ma","mi","mu","sa","si","su","ka","ki","ku","pa","pi","pu","ta","ti","tu","da","di","du"];

  C.worlds = [
    { id: "hutan", name: "Dunia Hutan", icon: "🌲", color: "#2E9E5B", bg: "#E4F6E8", char: "🐿️", set: ["🌲","🍄","🦊","🐿️","🍂"] },
    { id: "pantai", name: "Dunia Pantai", icon: "🏖️", color: "#1B9AC4", bg: "#E1F4FB", char: "🦀", set: ["🐚","🦀","🐠","⭐","🐙"] },
    { id: "kebun", name: "Dunia Kebun", icon: "🥕", color: "#E07B1F", bg: "#FFEFD9", char: "🐰", set: ["🥕","🍅","🌻","🐛","🍎"] },
    { id: "kota", name: "Dunia Kota", icon: "🏙️", color: "#6B7A99", bg: "#E8ECF4", char: "🚗", set: ["🚗","🏠","🚌","🚦","🏢"] },
    { id: "angkasa", name: "Dunia Angkasa", icon: "🚀", color: "#5B3FC4", bg: "#E9E3FA", char: "🚀", set: ["🚀","🌟","🪐","🌙","👽"] },
    { id: "istana", name: "Dunia Istana", icon: "🏰", color: "#C23A7C", bg: "#FBE4EF", char: "👸", set: ["👑","🏰","💎","🦄","🌹"] }
  ];

  const PET = ["maze","jejak","pola","titik","sudoku","cermin","hitung","besar","sama","bayang"];
  C.act = {
    kenal: ["Kenali Huruf", "🔤"], cari: ["Cari Huruf", "🔎"], trace: ["Tebalkan", "✍️"],
    hitung: ["Hitung Benda", "🔢"], ambil: ["Ambil Sebanyak", "🧺"], suku: ["Suku Kata", "🧩"],
    susun: ["Susun Kata", "🧱"], baca: ["Baca Kata", "📖"], tambah: ["Tambah Gambar", "➕"],
    maze: ["Labirin", "🌀"], jejak: ["Jejak Garis", "〰️"], pola: ["Pola", "🔁"], titik: ["Hubungkan Titik", "⚫"],
    sudoku: ["Sudoku Bentuk", "🔷"], cermin: ["Cermin Ajaib", "🪞"], warnai: ["Hitung & Warnai", "🎨"],
    besar: ["Besar – Kecil", "🐘"], sama: ["Cari yang Sama", "👀"], bayang: ["Cari Bayangan", "👤"]
  };

  C.TRACKS = {
    cal: { id: "cal", name: "Tangga Calistung", sub: "30 hari · siap masuk SD", days: 30, age: "4–6 th", icon: "📘" },
    pet: { id: "pet", name: "Petualangan Tangga", sub: "60 hari · 6 dunia", days: 60, age: "3–6 th", icon: "🗺️" }
  };

  const STICKERS = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐤","🦆","🦉",
    "🦄","🐝","🦋","🐞","🐢","🐙","🦀","🐠","🐬","🐳","🦒","🐘","🦓","🐊","🦔","🦜","🐌","🐓","🦈","🐋",
    "🍎","🍌","🍇","🍓","🍉","🍒","🥕","🌽","🍍","🥝","🍩","🍪","🧁","🍦","🍕","🍔","🍟","🥞","🍯","🍑",
    "⭐","🌈","🎈","🎁","🚀","🚂","🚁","⛵","🎨","🎸","⚽","🏀","🧸","🪁","🎺","🔔","👑","💎","🌻","🌷",
    "🌵","🍄","🌙","☀️","⛄","🏰","🎠","🎡","🚲","🛴","🎹","🥁","🔭","🧩","🎯","🏆","🪀","🎻","🚒","🚜"];
  C.sticker = (track, n) => STICKERS[(track === "cal" ? n - 1 : 30 + n - 1) % STICKERS.length];
  C.stickerCount = STICKERS.length;

  // Rencana tiap hari: daftar langkah {type, p, label}
  C.plan = function (track, n) {
    const S = (type, p = {}) => ({ type, p, label: C.act[type][0], icon: C.act[type][1] });
    if (track === "cal") {
      if (n <= 10) {
        const L = C.LETTERS[n - 1];
        return { title: "Huruf " + L, steps: [S("kenal", { letter: L }), S("trace", { text: L, kind: "huruf" }), S("cari", { letter: L })] };
      }
      if (n <= 20) {
        const k = n - 10;
        return { title: "Angka " + k, steps: [S("hitung", { n: k }), S("trace", { text: String(k), kind: "angka" }), S("ambil", { n: k })] };
      }
      const SYL = { 21: ["ba","bi","bu"], 22: ["ma","mi","mu"], 23: ["sa","si","su"], 24: ["ka","ki","ku"], 25: ["pa","pi","pu"] };
      const W = { 21: ["baju","buku","bibir","bunga"], 22: ["mata","mangga","minum"], 23: ["sapi","susu","sapu"],
        24: ["kuda","kaki","kucing","kapal"], 25: ["pisang","payung","pulau","pita"],
        26: ["bola","topi","roti","baju","kuda"], 27: ["sapi","buku","apel","ikan","ayam","mata"] };
      if (n <= 25) return { title: "Suku kata " + SYL[n].join(" "), steps: [S("suku", { words: W[n] }), S("susun", { words: W[n] }), S("baca", { words: W[n] })] };
      if (n <= 27) return { title: n === 26 ? "Membaca kata pertamaku" : "Ulang membaca", steps: [S("baca", { words: W[n] }), S("susun", { words: W[n] }), S("suku", { words: W[n] })] };
      const mx = { 28: 3, 29: 5, 30: 8 }[n];
      return { title: n === 30 ? "Hari terakhir: tambah-tambahan" : "Penjumlahan bergambar " + (n - 27), steps: [S("tambah", { max: Math.min(mx, 3) }), S("tambah", { max: mx }), S("tambah", { max: Math.min(10, mx + 2) })] };
    }
    const w = Math.floor((n - 1) / 10), i = (n - 1) % 10, W = C.worlds[w];
    const lvl = (n - 1) / 59;
    const steps = [0, 1, 2].map((k) => {
      const t = PET[(i + k * 3 + w) % 10];
      return S(t === "hitung" ? "warnai" : t, { level: Math.min(1, lvl + k * 0.03), world: W });
    });
    return { title: W.name + " · hari " + (i + 1), steps, world: w };
  };
})();
