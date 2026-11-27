document.getElementById("year").textContent = new Date().getFullYear();

// Tandai tautan nav yang sedang aktif saat scrolling.
const links = [...document.querySelectorAll('#menu a[href^="#"]:not(.nav-cta)')];
const targets = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && targets.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("aktif", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  targets.forEach((t) => observer.observe(t));
}

// Menu mobile
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
if (btn && menu) {
  const set = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  };
  btn.addEventListener("click", () => set(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
}

// Tab "Intip isi"
const tabs = [...document.querySelectorAll(".tab")];
const show = (tab) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
};
tabs.forEach((t, i) => {
  t.addEventListener("click", () => show(t));
  t.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const n = tabs[(i + d + tabs.length) % tabs.length];
    show(n); n.focus();
  });
});
if (tabs.length) show(tabs[0]);

// Lightbox halaman contoh
const lb = document.getElementById("lb");
if (lb && typeof lb.showModal === "function") {
  const img = document.getElementById("lb-img");
  const cap = document.getElementById("lb-cap");
  let list = [], idx = 0, opener = null;
  const render = () => {
    const b = list[idx];
    img.src = b.querySelector("img").src;
    img.alt = b.querySelector("img").alt;
    cap.textContent = b.dataset.cap + "  (" + (idx + 1) + "/" + list.length + ")";
  };
  const step = (d) => { idx = (idx + d + list.length) % list.length; render(); };
  document.querySelectorAll(".pg").forEach((b) => {
    b.addEventListener("click", () => {
      list = [...b.closest(".pages").querySelectorAll(".pg")];
      idx = list.indexOf(b); opener = b; render(); lb.showModal();
    });
  });
  document.getElementById("lb-prev").addEventListener("click", () => step(-1));
  document.getElementById("lb-next").addEventListener("click", () => step(1));
  document.getElementById("lb-close").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-in")) lb.close(); });
  lb.addEventListener("close", () => opener && opener.focus());
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}
