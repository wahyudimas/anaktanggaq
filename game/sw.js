// Cache sederhana agar game bisa dimainkan offline setelah dibuka sekali.
const V = "atq-game-v1", FILES = ["./", "index.html", "game.css", "config.js", "content.js", "core.js", "acts.js", "app.js", "manifest.webmanifest"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(V).then((x) => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request)));
});
