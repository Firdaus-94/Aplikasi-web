const CACHE_NAME = "asep-music-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/icons/icon192.png",
  "/icons/icon512.png"
];

// install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// fetch (ambil dari cache dulu)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // cegah auto popup
  deferredPrompt = e;

  // tampilkan tombol
  installBtn.style.display = "block";
});

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
