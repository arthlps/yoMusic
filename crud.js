const USER = "arthur";

function getAlbumId() {
  return new URLSearchParams(window.location.search).get("id");
}

function starsStr(n) {
  if (!n) return "☆☆☆☆☆";
  return "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
}

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  const label = document.getElementById("toggle-label");
  if (label) label.textContent = isDark ? "◑ claro" : "◐ escuro";
  localStorage.setItem("ym_theme", isDark ? "dark" : "light");
}

function applyStoredTheme() {
  const saved = localStorage.getItem("ym_theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    const label = document.getElementById("toggle-label");
    if (label) label.textContent = "◑ claro";
  }
}

applyStoredTheme();

function getLikes() {
  return JSON.parse(localStorage.getItem("ym_likes") || "{}");
}

function saveLikes(data) {
  localStorage.setItem("ym_likes", JSON.stringify(data));
}

function updateAllCounters() {
  const reviewCount = Object.keys(getAllReviews()).length;
  const wishlistCount = getWishlist().length;
  const likedCount = Object.keys(getLikes()).filter(
    (k) => getLikes()[k] && k.startsWith("album-like-"),
  ).length;

  const elR = document.getElementById("reviewCount");
  const elW = document.getElementById("wishlistCount");
  const elL = document.getElementById("likedCount");
  if (elR) elR.textContent = reviewCount;
  if (elW) elW.textContent = wishlistCount;
  if (elL) elL.textContent = likedCount;

  const elSR = document.getElementById("statReviews");
  const elSW = document.getElementById("statWishlist");
  const elSL = document.getElementById("statLiked");
  if (elSR) elSR.textContent = reviewCount;
  if (elSW) elSW.textContent = wishlistCount;
  if (elSL) elSL.textContent = likedCount;

  const wLabel = document.getElementById("wishlistCountLabel");
  const lLabel = document.getElementById("likedCountLabel");
  if (wLabel)
    wLabel.textContent =
      wishlistCount + " álbum" + (wishlistCount !== 1 ? "s" : "");
  if (lLabel)
    lLabel.textContent = likedCount + " álbum" + (likedCount !== 1 ? "s" : "");
}

/* function applyProfileImg() {
  const img = localStorage.getItem("ym_profile_img");
  document.querySelectorAll(".profile-init").forEach((el) => {
    if (img) {
      el.innerHTML = `<img src="${img}" alt="perfil"
        style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      if (!el.querySelector("img")) el.textContent = "AR";
    }
  });
} */

/* function setProfileImg(url) {
  localStorage.setItem("ym_profile_img", url);
  applyProfileImg();
} */

/* function removeProfileImg() {
  localStorage.removeItem("ym_profile_img");
  document.querySelectorAll(".profile-init").forEach((el) => {
    el.textContent = "AR";
  });
}
 */
/* function initProfileToggle() {
  document.querySelectorAll(".profile-init").forEach((el) => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => {
      let menu = document.getElementById("profile-menu");
      if (menu) {
        menu.remove();
        return;
      }

      menu = document.createElement("div");
      menu.id = "profile-menu";
      menu.style.cssText = `
        position:fixed;
        top:58px;
        right:20px;
        background:var(--bg-card);
        border:2px solid var(--border);
        font-family:'Courier Prime',monospace;
        font-size:13px;
        color:var(--text);
        z-index:9999;
        min-width:180px;
      `;
      menu.innerHTML = `
        <div style="padding:8px 14px;border-bottom:1px solid var(--border-soft);font-weight:700">
          ${USER}
        </div>
        <div style="padding:8px 14px;cursor:pointer;border-bottom:1px solid var(--border-soft)"
             onmouseenter="this.style.background='var(--accent)';this.style.color='var(--accent-text)'"
             onmouseleave="this.style.background='';this.style.color=''"
             onclick="promptProfileImg()">
          trocar foto
        </div>
        <div style="padding:8px 14px;cursor:pointer"
             onmouseenter="this.style.background='var(--accent)';this.style.color='var(--accent-text)'"
             onmouseleave="this.style.background='';this.style.color=''"
             onclick="removeProfileImg();document.getElementById('profile-menu').remove()">
          remover foto
        </div>`;
      document.body.appendChild(menu); */

/*  // fecha ao clicar fora
      setTimeout(() => {
        document.addEventListener("click", function handler(e) {
          if (!menu.contains(e.target) && !el.contains(e.target)) {
            menu.remove();
            document.removeEventListener("click", handler);
          }
        });
      }, 10);
    });
  });
} */

function promptProfileImg() {
  const url = prompt("Cole a URL da sua foto de perfil:");
  if (url && url.trim()) setProfileImg(url.trim());
  const menu = document.getElementById("profile-menu");
  if (menu) menu.remove();
}

let pickedScore = 0;

function setPickedScore(val) {
  pickedScore = val;
  document.querySelectorAll("#starPicker span").forEach((s) => {
    s.classList.toggle("filled", parseInt(s.dataset.v) <= val);
  });
}

function initStarPicker() {
  const stars = document.querySelectorAll("#starPicker span");
  if (!stars.length) return;
  stars.forEach((star) => {
    star.addEventListener("mouseover", () => {
      const v = parseInt(star.dataset.v);
      stars.forEach((s) =>
        s.classList.toggle("filled", parseInt(s.dataset.v) <= v),
      );
    });
    star.addEventListener("mouseout", () => {
      stars.forEach((s) =>
        s.classList.toggle("filled", parseInt(s.dataset.v) <= pickedScore),
      );
    });
    star.addEventListener("click", () =>
      setPickedScore(parseInt(star.dataset.v)),
    );
  });
}

function getAllReviews() {
  return JSON.parse(localStorage.getItem("ym_reviews") || "{}");
}

function saveAllReviews(data) {
  localStorage.setItem("ym_reviews", JSON.stringify(data));
}

function getReview(albumId) {
  return getAllReviews()[albumId] || null;
}

function saveReview() {
  const albumId = getAlbumId();
  const text = document.getElementById("reviewText").value.trim();

  if (!pickedScore) {
    toast("seleciona pelo menos 1 estrela!");
    return;
  }
  if (!text) {
    toast("escreve algo na review!");
    return;
  }

  const reviews = getAllReviews();
  reviews[albumId] = {
    score: pickedScore,
    text,
    date: new Date().toLocaleDateString("pt-BR"),
  };

  saveAllReviews(reviews);
  toast("review salva!");
  renderReviewSection();
  updateAllCounters();
}

function deleteReview() {
  const albumId = getAlbumId();
  const reviews = getAllReviews();
  delete reviews[albumId];
  saveAllReviews(reviews);
  toast("review removida.");
  renderReviewSection();
  updateAllCounters();
}

function showEditForm() {
  const review = getReview(getAlbumId());
  const display = document.getElementById("reviewDisplay");
  const form = document.getElementById("reviewForm");
  if (!display || !form) return;
  display.style.display = "none";
  form.style.display = "block";
  if (review) {
    setPickedScore(review.score);
    document.getElementById("reviewText").value = review.text;
  }
}

function renderReviewSection() {
  const albumId = getAlbumId();
  const review = getReview(albumId);
  const display = document.getElementById("reviewDisplay");
  const form = document.getElementById("reviewForm");
  if (!display || !form) return;

  if (review) {
    document.getElementById("reviewDisplayScore").textContent =
      starsStr(review.score) + "  " + review.score + ".0";
    document.getElementById("reviewDisplayText").textContent =
      '"' + review.text + '"';
    document.getElementById("reviewDisplayDate").textContent = review.date;
    display.style.display = "block";
    form.style.display = "none";
  } else {
    display.style.display = "none";
    form.style.display = "block";
    pickedScore = 0;
    const ta = document.getElementById("reviewText");
    if (ta) ta.value = "";
    document
      .querySelectorAll("#starPicker span")
      .forEach((s) => s.classList.remove("filled"));
  }
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("ym_wishlist") || "[]");
}

function saveWishlist(list) {
  localStorage.setItem("ym_wishlist", JSON.stringify(list));
}

function isInWishlist(albumId) {
  return getWishlist().includes(String(albumId));
}

function toggleWishlist() {
  const albumId = String(getAlbumId());
  let list = getWishlist();

  if (isInWishlist(albumId)) {
    list = list.filter((id) => id !== albumId);
    toast("removido da lista.");
  } else {
    list.push(albumId);
    toast("adicionado à lista!");
  }

  saveWishlist(list);
  renderWishlistBtns();
  updateAllCounters();
}

function renderWishlistBtns() {
  const inList = isInWishlist(getAlbumId());
  const label = inList ? "♥ na minha lista" : "♡ quero ouvir";

  ["wishlistBtn", "wishlistBtn2"].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.textContent = label;
    btn.classList.toggle("active", inList);
  });
}

function renderSavedReviews(musicData) {
  const container = document.getElementById("reviewsList");
  if (!container) return;

  container
    .querySelectorAll(".review-card.user-saved")
    .forEach((el) => el.remove());

  const allReviews = getAllReviews();
  const keys = Object.keys(allReviews);
  if (!keys.length) return;

  keys.forEach((albumId) => {
    const review = allReviews[albumId];
    const album = musicData[albumId];
    if (!album) return;

    const div = document.createElement("div");
    div.className = "review-card user-saved";
    div.innerHTML = `
      <div class="d-flex gap-3">
        <div class="review-thumb" style="background:${album.color}">
          <img src="${album.img}" alt="${album.title}" onerror="this.style.display='none'">
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between mb-1">
            <span class="review-user">${USER}</span>
            <span class="review-time">${review.date}</span>
          </div>
          <div style="font-size:11px;color:var(--text-faint);font-family:'Courier Prime',monospace;margin-bottom:6px">
            ${album.title} — ${album.artist}
          </div>
          <div class="review-stars mb-1">${starsStr(review.score)}</div>
          <p class="review-text">${review.text}</p>
          <div class="d-flex gap-2 mt-2">
            <a href="album.html?id=${albumId}" class="like-btn">editar review →</a>
          </div>
        </div>
      </div>`;
    container.prepend(div);
  });
}

function initAlbumPage() {
  if (!document.getElementById("albumTitle")) return;

  const albumId = getAlbumId();
  if (albumId === null) return;

  fetch("object.json")
    .then((r) => r.json())
    .then((dados) => {
      const album = dados.music[albumId];
      if (!album) return;

      document.title = `Yo Music — ${album.title}`;

      document.getElementById("albumTitle").textContent = album.title;
      document.getElementById("albumArtist").textContent = album.artist;
      document.getElementById("albumYear").textContent = album.year;
      document.getElementById("albumSource").src = album.source;
      const cover = document.getElementById("albumCover");
      cover.src = album.img;
      cover.alt = album.title;
      cover.onerror = function () {
        this.style.display = "none";
      };

      const sideArtist = document.getElementById("sideArtist");
      const sideYear = document.getElementById("sideYear");
      if (sideArtist) sideArtist.textContent = album.artist;
      if (sideYear) sideYear.textContent = album.year;

      renderAlbumLikeBtn();
    });

  initStarPicker();
  renderReviewSection();
  renderWishlistBtns();
  initProfileToggle();
  applyProfileImg();
}

function initIndexPage() {
  if (!document.getElementById("popularGrid")) return;
  initProfileToggle();
  applyProfileImg();
}

initAlbumPage();
initIndexPage();
function getAlbumLikeKey() {
  return "album-like-" + getAlbumId();
}

function renderAlbumLikeBtn() {
  const btn = document.getElementById("albumLikeBtn");
  if (!btn) return;
  const liked = getLikes()[getAlbumLikeKey()] || false;
  btn.textContent = liked ? "♥ curtido" : "♡ curtir este álbum";
  btn.classList.toggle("active", liked);
}

function toggleAlbumLikePage() {
  const key = getAlbumLikeKey();
  const likes = getLikes();
  const liked = !likes[key];
  likes[key] = liked;
  saveLikes(likes);
  renderAlbumLikeBtn();
  updateAllCounters();
  const el = document.getElementById("toast");
  if (el) {
    el.textContent = liked ? "curtido!" : "curtida removida.";
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2000);
  }
}

document.addEventListener("DOMContentLoaded", renderAlbumLikeBtn);
