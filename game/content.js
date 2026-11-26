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
    ["topi","🧢",["to","pi"]],["roti","🍞",["ro","ti"]],
    ["gajah","🐘",["ga","jah"]],["semut","🐜",["se","mut"]],["tomat","🍅",["to","mat"]],["wortel","🥕",["wor","tel"]],
    ["nanas","🍍",["na","nas"]],["gitar","🎸",["gi","tar"]],["bulan","🌙",["bu","lan"]],["bintang","⭐",["bin","tang"]],
    ["rumah","🏠",["ru","mah"]],["kunci","🔑",["kun","ci"]],["gigi","🦷",["gi","gi"]],["hidung","👃",["hi","dung"]],
    ["lebah","🐝",["le","bah"]],["domba","🐑",["dom","ba"]],["siput","🐌",["si","put"]],["paus","🐋",["pa","us"]],
    ["keju","🧀",["ke","ju"]],["nasi","🍚",["na","si"]],["telur","🥚",["te","lur"]],["madu","🍯",["ma","du"]],
    ["sabun","🧼",["sa","bun"]],["jagung","🌽",["ja","gung"]],["monyet","🐒",["mo","nyet"]],
    ["kelinci","🐇",["ke","lin","ci"]],["kelapa","🥥",["ke","la","pa"]],["sepeda","🚲",["se","pe","da"]],
    ["kereta","🚆",["ke","re","ta"]],["pesawat","✈️",["pe","sa","wat"]],["boneka","🧸",["bo","ne","ka"]],
    ["celana","👖",["ce","la","na"]],["jerapah","🦒",["je","ra","pah"]],["harimau","🐯",["ha","ri","mau"]],
    ["telinga","👂",["te","li","nga"]],["kamera","📷",["ka","me","ra"]]
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
    kenal: ["Kenali Huruf", "🔤"], hurufkecil: ["Besar & Kecil", "🔠"], urut: ["Urutkan Angka", "🔢"], banyak: ["Mana Lebih Banyak", "⚖️"],
    kurang: ["Kurang Gambar", "➖"], memori: ["Kartu Ingatan", "🃏"], warna: ["Kenal Warna", "🌈"], bentuk: ["Kenal Bentuk", "🔺"], lengkapi: ["Lengkapi Kata", "🧩"],
    hkenal: ["Kenali Huruf", "🕌"], htrace: ["Tebalkan", "✍️"], hkata: ["Kata Contoh", "🖼️"], hharakat: ["Harakat", "🔊"], hcari: ["Cari Huruf", "🔎"], cari: ["Cari Huruf", "🔎"], trace: ["Tebalkan", "✍️"],
    hitung: ["Hitung Benda", "🔢"], ambil: ["Ambil Sebanyak", "🧺"], suku: ["Suku Kata", "🧩"],
    susun: ["Susun Kata", "🧱"], baca: ["Baca Kata", "📖"], tambah: ["Tambah Gambar", "➕"],
    maze: ["Labirin", "🌀"], jejak: ["Jejak Garis", "〰️"], pola: ["Pola", "🔁"], titik: ["Hubungkan Titik", "⚫"],
    sudoku: ["Sudoku Bentuk", "🔷"], cermin: ["Cermin Ajaib", "🪞"], warnai: ["Hitung & Warnai", "🎨"],
    besar: ["Besar – Kecil", "🐘"], sama: ["Cari yang Sama", "👀"], bayang: ["Cari Bayangan", "👤"]
  };

  C.TRACKS = {
    cal: { id: "cal", name: "Tangga Calistung", sub: "30 hari · baca, tulis, hitung", days: 30, age: "4–6 th", icon: "✏️" },
    hij: { id: "hij", name: "Tangga Hijaiyah", sub: "30 hari · 28 huruf hijaiyah", days: 30, age: "3–6 th", icon: "🕌" },
    pet: { id: "pet", name: "Petualangan Tangga", sub: "60 hari · logika & motorik", days: 60, age: "3–6 th", icon: "🧩" }
  };

  const STICKERS = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐤","🦆","🦉",
    "🦄","🐝","🦋","🐞","🐢","🐙","🦀","🐠","🐬","🐳","🦒","🐘","🦓","🐊","🦔","🦜","🐌","🐓","🦈","🐋",
    "🍎","🍌","🍇","🍓","🍉","🍒","🥕","🌽","🍍","🥝","🍩","🍪","🧁","🍦","🍕","🍔","🍟","🥞","🍯","🍑",
    "⭐","🌈","🎈","🎁","🚀","🚂","🚁","⛵","🎨","🎸","⚽","🏀","🧸","🪁","🎺","🔔","👑","💎","🌻","🌷",
    "🌵","🍄","🌙","☀️","⛄","🏰","🎠","🎡","🚲","🛴","🎹","🥁","🔭","🧩","🎯","🏆","🪀","🎻","🚒","🚜"];
  const HSTK = ["🐫","🌴","🏜️","🕌","🫖","🍏","🍐","🍋","🥭","🥥","🫐","🥐","🦚","🦢","🦩","🕊️","🦦","🦥","🌺","🌼","🍀","🌾","🪴","🌊","🪐","☄️","🧭","🛶","🏮","📚"];
  C.sticker = (track, n) => track === "hij" ? HSTK[(n - 1) % HSTK.length] : STICKERS[(track === "cal" ? n - 1 : 30 + n - 1) % STICKERS.length];
  C.stickerCount = STICKERS.length;

  // ---------- Hijaiyah ----------
  // [huruf, nama, konsonan latin, kata Arab, arti, emoji]
  C.HIJ = [
    ["ا","Alif","","أَسَد","asad (singa)","🦁"],["ب","Ba","b","بَقَرَة","baqarah (sapi)","🐄"],["ت","Ta","t","تُفَّاح","tuffah (apel)","🍎"],
    ["ث","Tsa","ts","ثَعْلَب","tsa'lab (rubah)","🦊"],["ج","Jim","j","جَمَل","jamal (unta)","🐫"],["ح","Ha","h","حِصَان","hishan (kuda)","🐴"],
    ["خ","Kho","kh","خُبْز","khubz (roti)","🍞"],["د","Dal","d","دَجَاجَة","dajajah (ayam)","🐔"],["ذ","Dzal","dz","ذُرَة","dzurah (jagung)","🌽"],
    ["ر","Ro","r","رِيشَة","risyah (bulu)","🪶"],["ز","Za","z","زَرَافَة","zarafah (jerapah)","🦒"],["س","Sin","s","سَمَك","samak (ikan)","🐟"],
    ["ش","Syin","sy","شَمْس","syams (matahari)","☀️"],["ص","Shod","sh","صَقْر","shaqr (elang)","🦅"],["ض","Dhod","dh","ضِفْدَع","dhifda' (katak)","🐸"],
    ["ط","Tho","th","طَائِرَة","tha-irah (pesawat)","✈️"],["ظ","Zho","zh","ظَرْف","zharf (amplop)","✉️"],["ع","'Ain","'","عِنَب","'inab (anggur)","🍇"],
    ["غ","Ghoin","gh","غَزَال","ghazal (kijang)","🦌"],["ف","Fa","f","فِيل","fil (gajah)","🐘"],["ق","Qof","q","قَمَر","qamar (bulan)","🌙"],
    ["ك","Kaf","k","كِتَاب","kitab (buku)","📖"],["ل","Lam","l","لَيْمُون","laimun (jeruk lemon)","🍋"],["م","Mim","m","مَوْز","mauz (pisang)","🍌"],
    ["ن","Nun","n","نَحْلَة","nahlah (lebah)","🐝"],["و","Wau","w","وَرْدَة","wardah (mawar)","🌹"],["ه","Ha","h","هَدِيَّة","hadiyyah (hadiah)","🎁"],
    ["ي","Ya","y","يَد","yad (tangan)","✋"]
  ].map(([g, name, lat, word, mean, e], i) => ({ i, g, name, lat, word, mean, e }));
  const HAR = { a: "\u064E", i: "\u0650", u: "\u064F" };
  C.harakat = (L, v) => (L.i === 0 ? { a: "أ", i: "إ", u: "أ" }[v] : L.g) + HAR[v];
  C.harakatRead = (L, v) => (L.lat === "'" ? "'" : L.lat) + v;
  C.harakatName = { a: "fathah", i: "kasrah", u: "dhammah" };

  // ---------- Warna & bentuk ----------
  C.COLORS = [["merah","#E53935"],["biru","#1E88E5"],["kuning","#FDD835"],["hijau","#43A047"],["ungu","#8E24AA"],["oranye","#FB8C00"],["merah muda","#F48FB1"],["cokelat","#795548"],["hitam","#212121"],["putih","#FFFFFF"]];
  C.SHAPES = ["lingkaran","segitiga","persegi","bintang","hati","persegi panjang","oval","belah ketupat"];

  // Rencana tiap hari: daftar langkah {type, p, label}
  const S = (type, p = {}) => ({ type, p, label: C.act[type][0], icon: C.act[type][1] });
  C.S = S;
  C.plan = function (track, n) {
    if (track === "hij") {
      if (n <= 28) {
        const L = C.HIJ[n - 1], known = C.HIJ.slice(0, n);
        return { title: "Huruf " + L.name + " " + L.g, steps: [S("hkenal", { letter: L.i, pool: known.map((x) => x.i) }), S("htrace", { letter: L.i }), S("hkata", { letter: L.i }), S("hharakat", { letters: [L.i] }), S("hcari", { letter: L.i })] };
      }
      const all = C.HIJ.map((x) => x.i);
      if (n === 29) return { title: "Ulangan campuran", steps: [S("hkenal", { mix: all }), S("hharakat", { letters: all }), S("hkata", { mix: all }), S("hcari", { mix: all })] };
      return { title: "Hari kelulusan 🎓", steps: [S("hkenal", { mix: all, n: 4 }), S("hkata", { mix: all }), S("hharakat", { letters: all }), S("memori", { pairs: 4, hij: true })] };
    }
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

  // ---------- Taman Latihan: 7 keterampilan × 12 level ----------
  const WL = (k) => C.words.filter((w) => w.s.length === k).map((w) => w.w);
  const W2 = WL(2), W3 = WL(3);
  const grp = (str) => str.split("");
  const LG = ["AIUEO", "BMSKP", "TDRNL", "CGHJF", "VWYZQX"];
  const ALL = LG.join("");
  const lv = (n) => (n - 1) / 11;
  C.SKILLS = [
    { id: "huruf", name: "Huruf A–Z", icon: "🔤", track: "cal", color: "#FF8A3D",
      level: (n) => {
        const set = n <= 5 ? grp(LG[n - 1]) : grp(ALL), opts = n <= 4 ? 3 : 4, rev = n >= 6 && n % 2 === 0;
        const L = set[(n * 7) % set.length];
        return { title: n <= 5 ? "Huruf " + set.join(" ") : "Campuran " + (n - 5), steps: [S("hurufkecil", { set, opts, rev }), S("cari", { letter: L }), n <= 8 ? S("trace", { text: L, kind: "huruf" }) : S("hurufkecil", { set, opts: 4, rev: !rev })] };
      } },
    { id: "baca", name: "Membaca", icon: "📖", track: "cal", color: "#2E9E5B",
      level: (n) => {
        const pool = n <= 6 ? W2 : n <= 9 ? W2.concat(W3) : W3, k = (n * 5) % pool.length;
        const words = Array.from({ length: 6 }, (_, i) => pool[(k + i * 3) % pool.length]);
        const steps = n <= 3 ? [S("suku", { words }), S("suku", { words: words.slice(3) }), S("baca", { words })]
          : n <= 6 ? [S("susun", { words }), S("lengkapi", { words }), S("baca", { words })]
          : [S("lengkapi", { words }), S("susun", { words: words.slice(2) }), S("baca", { words: words.slice(1) })];
        return { title: n <= 3 ? "Suku kata pertama" : n <= 6 ? "Kata dua suku" : n <= 9 ? "Kata makin panjang" : "Kata tiga suku", steps };
      } },
    { id: "angka", name: "Angka", icon: "🔢", track: "cal", color: "#1B9AC4",
      level: (n) => {
        const R = [[1, 3], [1, 5], [1, 7], [1, 10], [1, 10], [1, 10], [5, 12], [8, 15], [10, 20], [10, 20], [1, 20], [1, 20]][n - 1];
        const steps = n <= 4 ? [S("hitung", { range: R }), S("ambil", { n: R[1] }), S("hitung", { range: R })]
          : n <= 6 ? [S("urut", { from: 1, count: n === 5 ? 5 : 8 }), S("hitung", { range: R }), S("ambil", { n: 6 + n % 3 })]
          : n <= 10 ? [S("hitung", { range: R }), S("urut", { from: R[0], count: 6 + (n % 3) }), S("banyak", { max: Math.min(R[1], 12) })]
          : [S("urut", { from: 1 + n, count: 8 }), S("banyak", { max: 15, less: n === 12 }), S("hitung", { range: R })];
        return { title: n <= 4 ? "Hitung " + R[0] + "–" + R[1] : n <= 6 ? "Urutkan angka" : "Angka sampai " + R[1], steps };
      } },
    { id: "hitung", name: "Berhitung", icon: "➕", track: "cal", color: "#5B3FC4",
      level: (n) => {
        const steps = n <= 2 ? [S("banyak", { max: 5 + n * 2 }), S("banyak", { max: 5 + n * 2, less: true }), S("tambah", { max: 3 })]
          : n <= 7 ? [S("tambah", { max: [5, 6, 7, 9, 10][n - 3] }), S("tambah", { max: [5, 6, 7, 9, 10][n - 3] }), S("banyak", { max: 10, less: n % 2 === 0 })]
          : n <= 10 ? [S("kurang", { max: [4, 6, 8][n - 8] }), S("kurang", { max: [5, 7, 10][n - 8] }), S("tambah", { max: 10 })]
          : [S("tambah", { max: 10 }), S("kurang", { max: 10 }), S(n === 11 ? "tambah" : "kurang", { max: 10 })];
        return { title: n <= 2 ? "Lebih banyak, lebih sedikit" : n <= 7 ? "Tambah sampai " + [5, 6, 7, 9, 10][n - 3] : n <= 10 ? "Kurang-kurangan" : "Tambah & kurang", steps };
      } },
    { id: "hijaiyah", name: "Hijaiyah", icon: "🕌", track: "hij", color: "#0F8A6B",
      level: (n) => {
        const letters = n <= 7 ? [0, 1, 2, 3].map((k) => (n - 1) * 4 + k) : C.HIJ.map((x) => x.i).slice(0, Math.min(28, 8 + (n - 7) * 4));
        return { title: n <= 7 ? letters.map((i) => C.HIJ[i].g).join(" ") : "Campuran " + (n - 7), steps: [S("hkenal", { mix: letters, n: n <= 7 ? 3 : 4 }), S("hharakat", { letters }), n % 2 ? S("hcari", { mix: letters }) : S("memori", { pairs: 3 + Math.min(2, Math.floor(n / 5)), hij: true, letters })] };
      } },
    { id: "logika", name: "Logika", icon: "🧩", track: "pet", color: "#C23A7C",
      level: (n) => {
        const t = [["pola", "maze", "sama"], ["titik", "bayang", "pola"], ["sudoku", "cermin", "maze"], ["memori", "pola", "titik"], ["maze", "sudoku", "bayang"], ["cermin", "memori", "pola"]][(n - 1) % 6];
        const world = C.worlds[(n - 1) % 6];
        return { title: world.name + " · level " + n, world: (n - 1) % 6, steps: t.map((x) => S(x, { level: lv(n), world, pairs: 3 + Math.floor(n / 4) })) };
      } },
    { id: "bentuk", name: "Warna & Bentuk", icon: "🌈", track: "pet", color: "#E07B1F",
      level: (n) => {
        const world = C.worlds[(n + 1) % 6];
        const steps = n <= 3 ? [S("warna", { k: 2 + n }), S("warna", { k: 2 + n }), S("besar", { level: 0, world })]
          : n <= 6 ? [S("bentuk", { k: n - 1 }), S("bentuk", { k: n - 1 }), S("warna", { k: 6 })]
          : n <= 9 ? [S("warna", { k: 8 + (n - 7) }), S("bentuk", { k: 6 + (n - 7) }), S("memori", { pairs: 3 + (n - 7) })]
          : [S("pola", { level: 0.6, world }), S("bentuk", { k: 8 }), S("memori", { pairs: 5 + (n - 10) })];
        return { title: n <= 3 ? "Kenal warna" : n <= 6 ? "Kenal bentuk" : n <= 9 ? "Warna, bentuk & ingatan" : "Tantangan", steps };
      } }
  ];
  C.skill = (id) => C.SKILLS.find((s) => s.id === id);
  C.LEVELS = 12;

  // ---------- Papan rutinitas ----------
  C.ROUTINE = {
    pagi: [["Bangun & rapikan kasur", "🛏️"], ["Sikat gigi", "🪥"], ["Mandi", "🛁"], ["Pakai baju sendiri", "👕"], ["Sarapan", "🥣"], ["Siapkan tas", "🎒"]],
    malam: [["Bereskan mainan", "🧸"], ["Makan malam", "🍽️"], ["Mandi sore", "🧼"], ["Sikat gigi", "🪥"], ["Baca buku bersama", "📚"], ["Berdoa & tidur", "🌙"]]
  };
})();
