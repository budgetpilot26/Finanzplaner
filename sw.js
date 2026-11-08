// Service Worker: macht die App installierbar und startet sie auch ohne Internet.
// Strategie: erst Netzwerk (damit Änderungen sofort ankommen), sonst gespeicherte Kopie.
var CACHE = "finanzplaner-v2";
var SHELL = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
var HOSTS = ["www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  // Nur eigene Dateien, Firebase-Skripte und Schriften zwischenspeichern, keine Datenbank-Anfragen.
  if (url.origin !== self.location.origin && HOSTS.indexOf(url.hostname) < 0) return;
  e.respondWith(
    fetch(req)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match("index.html"); });
      })
  );
});
