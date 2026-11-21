document.getElementById("year").textContent = new Date().getFullYear();

// Tandai tautan nav yang sedang aktif saat scrolling.
const links = [...document.querySelectorAll('.nav nav a[href^="#"]')];
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
