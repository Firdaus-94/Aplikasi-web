const CACHE_NAME = "asep-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icons/icon192.png",
  "/icons/icon512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("Install belum tersedia");
    return;
  }

  deferredPrompt.prompt();

  const choiceResult = await deferredPrompt.userChoice;

  if (choiceResult.outcome === "accepted") {
    console.log("User install app");
  } else {
    console.log("User batal install");
  }

  deferredPrompt = null;
});
