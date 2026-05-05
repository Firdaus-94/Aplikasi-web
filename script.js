<script>
// ===============================
// 🎵 ELEMENT
// ===============================
const audio = document.getElementById("bg-music");
const title = document.getElementById("music-title");
const cover = document.getElementById("music-cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");

// ===============================
// 🎵 PLAYLIST DEFAULT
// ===============================
let playlist = [
  {
    title: "SoundHelix 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/200?1"
  },
  {
    title: "SoundHelix 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/200?2"
  }
];

let current = 0;

// ===============================
// 🎵 LOAD MUSIC
// ===============================
function loadMusic(index){
  const song = playlist[index];

  // support API + local
  const src = song.audio || song.src;
  const titleText = song.name || song.title;
  const artist = song.artist_name || "";
  const img = song.image || song.cover;

  if(!src){
    alert("Lagu tidak memiliki audio");
    return;
  }

  audio.src = src;
  title.innerText = artist ? `${titleText} - ${artist}` : titleText;
  cover.src = img;

  audio.play().catch(()=>{});

  playBtn.innerText = "⏸";

  renderPlaylist();
}

// ===============================
// ▶ PLAY / PAUSE
// ===============================
function toggleMusic(){
  if(audio.paused){
    audio.play();
    playBtn.innerText = "⏸";
  }else{
    audio.pause();
    playBtn.innerText = "▶";
  }
}

// ===============================
// ⏭ NEXT
// ===============================
function nextMusic(){
  current = (current + 1) % playlist.length;
  loadMusic(current);
}

// ===============================
// ⏮ PREV
// ===============================
function prevMusic(){
  current = (current - 1 + playlist.length) % playlist.length;
  loadMusic(current);
}

// ===============================
// 🎧 PLAY DARI PLAYLIST
// ===============================
function playFromPlaylist(index){
  current = index;
  loadMusic(current);
}

// ===============================
// 🔥 RENDER PLAYLIST UI
// ===============================
function renderPlaylist(){
  const container = document.getElementById("playlist");
  container.innerHTML = "";

  playlist.forEach((song, i) => {

    const titleText = (song.name || song.title || "Unknown")
  .substring(0, 25);
    const img = song.image || song.cover;

    container.innerHTML += `
      <div class="song-card ${i === current ? 'active' : ''}" onclick="playFromPlaylist(${i})">
        <img src="${img}">
        <p>${titleText}</p>
      </div>
    `;
  });
}

// ===============================
// 🔍 SEARCH MUSIC (API JAMENDO)
// ===============================
async function searchMusic(){
  const query = document.getElementById("searchMusic").value;

  if(!query) return alert("Masukkan nama lagu");

  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=b8796d64&format=json&limit=10&search=${query}`;

  try{
    const res = await fetch(url);
    const data = await res.json();

    if(!data.results || data.results.length === 0){
      alert("Lagu tidak ditemukan");
      return;
    }

    playlist = data.results;
    current = 0;

    loadMusic(current);

  }catch(err){
    console.log(err);
    alert("Gagal ambil lagu dari API");
  }
}

// ===============================
// 🎚 PROGRESS BAR UPDATE
// ===============================
audio.addEventListener("timeupdate", () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

// ===============================
// 🎚 SEEK (GESER LAGU)
// ===============================
progress.addEventListener("input", () => {
  if(audio.duration){
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

// ===============================
// 🔁 AUTO NEXT SAAT LAGU SELESAI
// ===============================
audio.addEventListener("ended", () => {
  nextMusic();
});


// ===============================
// 🚀 INIT
// ===============================
window.onload = () => {
  renderPlaylist();
  loadMusic(current);
};

/* MENU */
function toggleMenu(){
  document.querySelector(".nav-menu").classList.toggle("active");
}
window.addEventListener("scroll", () => {
  document.querySelector(".navbar")
    .classList.toggle("scrolled", window.scrollY > 50);
});
const toggle = document.getElementById("themeToggle");

// load dari localStorage
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "dark");
    toggle.textContent = "🌙";
  }
});

/* REVEAL */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".reveal").forEach(el=>{
  observer.observe(el);
});

/* TYPING */
const words = ["Web Developer 🚀","UI Designer 🎨"];
let i=0,j=0,text="",del=false;

function type(){
  const el=document.querySelector(".typing");

  if(!del){
    text=words[i].substring(0,j++);
  }else{
    text=words[i].substring(0,j--);
  }

  el.innerHTML=text;

  if(!del && j===words[i].length){
    del=true;
    setTimeout(type,1000);
    return;
  }

  if(del && j===0){
    del=false;
    i=(i+1)%words.length;
  }

  setTimeout(type,del?50:100);
}
type();

/* PARTICLES */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");

canvas.width=innerWidth;
canvas.height=innerHeight;

let p=[];

for(let i=0;i<50;i++){
  p.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2,
    d:Math.random()*1
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  p.forEach(pt=>{
    ctx.beginPath();
    ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);
    ctx.fillStyle="#00ffc3";
    ctx.fill();

    pt.y+=pt.d;
    if(pt.y>canvas.height){
      pt.y=0;
      pt.x=Math.random()*canvas.width;
    }
  });
}

setInterval(draw,30);

const skillBars = document.querySelectorAll(".bar span");

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.width = entry.target.getAttribute("style").replace("width:", "");
    }
  });
});
// 🔔 simulasi notif masuk
setInterval(()=>{
  const notif = document.getElementById("waNotif");

  let count = parseInt(notif.innerText);
  count++;

  notif.innerText = count;

}, 8000); // tiap 8 detik nambah

function kirimWA(){
  alert("Menghubungkan ke WhatsApp...");
  let nama = document.getElementById("nama").value || "User";
  let pesan = document.getElementById("pesan").value || "Saya tertarik dengan jasa Anda";

  let text = `Halo Asep Developer
Nama: ${nama}
Pesan: ${pesan}`;

  let url = "https://wa.me/6285770959440?text=" + encodeURIComponent(text);

  window.open(url, "_blank");
}

cards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -(y / rect.height - 0.5) * 15;
    const rotateY = (x / rect.width - 0.5) * 15;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0)";
  });
});

document.addEventListener("mousemove", e => {
  const trail = document.createElement("div");
  trail.className = "trail";

  trail.style.left = e.clientX + "px";
  trail.style.top = e.clientY + "px";

  document.body.appendChild(trail);

  setTimeout(() => trail.remove(), 500);
});
const matrix = document.getElementById("matrix");
const ctx2 = matrix.getContext("2d");

matrix.width = window.innerWidth;
matrix.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;
const columns = matrix.width / fontSize;

const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx2.fillStyle = "rgba(0,0,0,0.05)";
  ctx2.fillRect(0, 0, matrix.width, matrix.height);

  ctx2.fillStyle = "#00ffcc";
  ctx2.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx2.fillText(text, i * fontSize, y * fontSize);

    if (y * fontSize > matrix.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  });
}

setInterval(drawMatrix, 35);

const clickSound = document.getElementById("clickSound");

document.addEventListener("click", () => {
  clickSound.currentTime = 0;
  clickSound.play();
});
// 🔥 popup otomatis muncul
const texts = [
  "👋 Butuh bantuan?",
  "💬 Chat kami sekarang!",
  "🔥 Ada yang bisa kami bantu?",
  "🚀 Konsultasi gratis!"
];

setInterval(()=>{
  const popup = document.getElementById("wa-popup");
  popup.innerText = texts[Math.floor(Math.random()*texts.length)];

  popup.classList.add("show");

  setTimeout(()=>{
    popup.classList.remove("show");
  }, 4000);

}, 15000);

// ==============================
// 💤 DETEKSI USER IDLE
// ==============================
let idleTime = 0;
const idleLimit = 10; // detik (ubah sesuai kebutuhan)

// reset kalau user gerak
function resetIdle(){
  idleTime = 0;
}

// event user aktif
["mousemove","keydown","scroll","click","touchstart"].forEach(evt=>{
  document.addEventListener(evt, resetIdle);
});

// hitung idle tiap detik
setInterval(()=>{
  idleTime++;

  if(idleTime === idleLimit){
    showPopupIdle();
  }

},1000);

// ==============================
// 🔥 TAMPILKAN POPUP
// ==============================
function showPopupIdle(){
  const popup = document.getElementById("wa-popup");

  if(!popup) return;

  popup.innerText = "👀 Masih di sana? Butuh bantuan?";
  popup.classList.add("show");

  setTimeout(()=>{
    popup.classList.remove("show");
  }, 5000);
}
// ⬇️ TAMBAH DI JS
window.addEventListener("scroll", ()=>{
  let scroll = window.scrollY;
  let height = document.body.scrollHeight - window.innerHeight;
  let progress = (scroll / height) * 100;

  document.getElementById("progress-bar").style.width = progress + "%";
});
// ⬇️ TAMBAH
document.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("mousemove", e=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;

    btn.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
  });

  btn.addEventListener("mouseleave", ()=>{
    btn.style.transform = "translate(0,0)";
  });
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// sembunyikan tombol awal
installBtn.style.display = "none";

// tangkap event install
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  console.log("Install prompt siap");
  installBtn.style.display = "block";
});

// klik tombol
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) {
    alert("Install belum tersedia");
    return;
  }

  deferredPrompt.prompt();

  const result = await deferredPrompt.userChoice;

  console.log("Hasil:", result.outcome);

  if (result.outcome === "accepted") {
    console.log("User install app");
  } else {
    console.log("User batal install");
  }

  deferredPrompt = null;
});

// register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("Service Worker aktif"))
      .catch(err => console.log("SW error:", err));
  });
}
</script>
