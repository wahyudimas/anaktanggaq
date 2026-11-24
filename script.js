document.getElementById("year").textContent = new Date().getFullYear();

// Tandai tautan nav yang sedang aktif saat scrolling.
const links = [...document.querySelectorAll('.nav nav a[href^="#"]:not(.nav-cta)')];
const targets = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && targets.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            "aktif",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  targets.forEach((target) => observer.observe(target));
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

// Muncul halus saat di-scroll (konten tetap terlihat tanpa JS)
if ("IntersectionObserver" in window) {
  const els = document.querySelectorAll(".section .wrap > *, .line-card, .steps li");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}
