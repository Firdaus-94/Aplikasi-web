let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("Install belum tersedia");
    return;
  }

  deferredPrompt.prompt();

  const choiceResult = await deferredPrompt.userChoice;

  console.log(choiceResult.outcome);

  deferredPrompt = null;
});

// register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
