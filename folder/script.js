const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isMusicPlaying = false;

function toggleMusic() {
  if (!isMusicPlaying) {
    music.volume = 1.0;
    music.play().then(() => {
      musicBtn.innerHTML = "🔊 Music On";
      isMusicPlaying = true;
    }).catch(() => {});
  } else {
    music.pause();
    musicBtn.innerHTML = "🔇 Music Off";
    isMusicPlaying = false;
  }
}

const bgBtn = document.getElementById("bgBtn");
let starInterval;

bgBtn.addEventListener("click", toggleStarryBackground);

function toggleStarryBackground() {
  document.body.classList.toggle("starry");
  if (document.body.classList.contains("starry")) {
    createStars();
    bgBtn.innerHTML = "🌌 Background Off";
  } else {
    clearStars();
    bgBtn.innerHTML = "🟢 Background";
  }
}

function createStars() {
  for (let i = 0; i < 150; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.width = star.style.height = Math.random() * 3 + 1 + "px";
    document.body.appendChild(star);
  }

  starInterval = setInterval(() => {
    const shoot = document.createElement("div");
    shoot.className = "shooting-star";
    shoot.style.top = Math.random() * window.innerHeight / 2 + "px";
    shoot.style.left = Math.random() * window.innerWidth + "px";
    shoot.style.height = 2 + Math.random() * 80 + "px";
    shoot.style.animationDuration = 1 + Math.random() * 1.5 + "s";
    document.body.appendChild(shoot);
    setTimeout(() => shoot.remove(), 2000);
  }, 800);
}

function clearStars() {
  document.querySelectorAll(".star, .shooting-star").forEach(e => e.remove());
  clearInterval(starInterval);
}

document.body.addEventListener("click", () => {
  document.body.classList.toggle("love-active");
  releaseLove();
});

function releaseLove() {
  for (let i = 0; i < 25; i++) {
    const heart = document.createElement("div");
    heart.className = "love-heart";
    heart.textContent = ["🌸","🎀","🦩","💕","🌷"][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }
}

function revealLove() {
  document.getElementById("secret").style.opacity = 1;
  createHearts();
}

function createHearts() {
  for (let i = 0; i < 20; i++) {
    const h = document.createElement("div");
    h.innerHTML = "❤️";
    h.style.position = "fixed";
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "0";
    h.style.fontSize = "20px";
    h.style.animation = "rise 5s linear";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 3000);
  }
}

const letterSlider = document.getElementById("letterSlider");
const letterSlides = document.querySelectorAll(".letter-slide");
const letterDots = document.getElementById("letterDots");

let currentLetterIndex = 0;
let typingInProgress = false;

letterSlides.forEach(slide => {
  slide.querySelectorAll("p").forEach(p => {
    p.dataset.text = p.textContent.trim();
    p.textContent = "";
    p._timeout = null;
  });
});

letterSlides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.onclick = () => goToLetterSlide(i);
  letterDots.appendChild(dot);
});

function updateDots() {
  letterDots.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentLetterIndex);
  });
}

function typeParagraph(p) {
  if (p._timeout) clearTimeout(p._timeout);
  typingInProgress = true;
  p.textContent = "";
  let i = 0;

  function type() {
    if (i < p.dataset.text.length) {
      p.textContent += p.dataset.text.charAt(i++);
      p._timeout = setTimeout(type, 40);
    } else {
      typingInProgress = false;
    }
  }
  type();
}

function typeSlide(slide) {
  slide.querySelectorAll("p").forEach(typeParagraph);
}

function goToLetterSlide(index) {
  if (typingInProgress || index < 0 || index >= letterSlides.length) return;
  currentLetterIndex = index;
  letterSlider.style.transform = `translateX(-${index * 100}%)`;
  updateDots();
  typeSlide(letterSlides[index]);
  localStorage.setItem("lastSlide", index);
}

const saved = parseInt(localStorage.getItem("lastSlide"), 10);
goToLetterSlide(!isNaN(saved) ? saved : 0);

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (id === "letter") goToLetterSlide(currentLetterIndex);
}

const sliderWrapper = document.querySelector(".letter-slider-wrapper");
let startX = 0;

sliderWrapper.addEventListener("touchstart", e => startX = e.touches[0].clientX);
sliderWrapper.addEventListener("touchend", e => {
  const diff = startX - e.changedTouches[0].clientX;
  const threshold = sliderWrapper.offsetWidth * 0.15;
  if (diff > threshold) goToLetterSlide(currentLetterIndex + 1);
  if (diff < -threshold) goToLetterSlide(currentLetterIndex - 1);
});

let mouseStart = 0;
sliderWrapper.addEventListener("mousedown", e => mouseStart = e.clientX);
sliderWrapper.addEventListener("mouseup", e => {
  const diff = mouseStart - e.clientX;
  const threshold = sliderWrapper.offsetWidth * 0.15;
  if (diff > threshold) goToLetterSlide(currentLetterIndex + 1);
  if (diff < -threshold) goToLetterSlide(currentLetterIndex - 1);
});


const photoUpload = document.getElementById("photoUpload");
const gallery = document.getElementById("gallery");

window.addEventListener("DOMContentLoaded", () => {
  const savedPhotos = JSON.parse(localStorage.getItem("memoriesPhotos") || "[]");
  savedPhotos.forEach(src => addPhotoToGallery(src));
});

function addPhotoToGallery(src) {
  const container = document.createElement("div");
  container.classList.add("photo-container");

  const img = document.createElement("img");
  img.src = src;
  img.alt = "Memory photo";
  img.classList.add("photo");
  img.width = 250;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-photo");
  deleteBtn.onclick = () => {
    container.remove();
    const photos = Array.from(gallery.querySelectorAll(".photo")).map(p => p.src);
    localStorage.setItem("memoriesPhotos", JSON.stringify(photos));
  };

  container.appendChild(img);
  container.appendChild(deleteBtn);
  gallery.appendChild(container);
}

photoUpload.addEventListener("change", (event) => {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = function(e) {
        const src = e.target.result;
        addPhotoToGallery(src);

        const photos = Array.from(gallery.querySelectorAll(".photo")).map(p => p.src);
        localStorage.setItem("memoriesPhotos", JSON.stringify(photos));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only JPEG images are allowed!");
    }
  }

  photoUpload.value = "";
});
