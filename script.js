function getLikes() {
  return JSON.parse(localStorage.getItem("ym_likes") || "{}");
}

function saveLikes(data) {
  localStorage.setItem("ym_likes", JSON.stringify(data));
}

function toggleLike(btn, reviewKey, baseLikes) {
  const likes = getLikes();
  const liked = !likes[reviewKey];
  likes[reviewKey] = liked;
  saveLikes(likes);

  btn.classList.toggle("liked", liked);
  btn.querySelector("span").textContent = liked ? baseLikes + 1 : baseLikes;
}

function applyLike(btn, reviewKey, baseLikes) {
  const liked = getLikes()[reviewKey] || false;
  btn.classList.toggle("liked", liked);
  btn.querySelector("span").textContent = liked ? baseLikes + 1 : baseLikes;
}

function getAllComments() {
  return JSON.parse(localStorage.getItem("ym_comments") || "{}");
}

function saveAllComments(data) {
  localStorage.setItem("ym_comments", JSON.stringify(data));
}

function getComments(reviewKey) {
  return getAllComments()[reviewKey] || [];
}

function addComment(reviewKey, text) {
  const all = getAllComments();
  if (!all[reviewKey]) all[reviewKey] = [];
  all[reviewKey].push({
    text,
    date: new Date().toLocaleDateString("pt-BR"),
  });
  saveAllComments(all);
}

function deleteComment(reviewKey, idx) {
  const all = getAllComments();
  if (!all[reviewKey]) return;
  all[reviewKey].splice(idx, 1);
  saveAllComments(all);
}

function renderComments(reviewKey, container) {
  const comments = getComments(reviewKey);
  container.innerHTML = "";

  if (comments.length === 0) {
    container.innerHTML = `
      <div style="font-family:'Courier Prime',monospace;font-size:12px;
                  color:var(--text-faint);padding:8px 0">
        nenhum comentário ainda.
      </div>`;
    return;
  }

  comments.forEach((c, i) => {
    const div = document.createElement("div");
    div.style.cssText = `
      padding: 8px 0;
      border-bottom: 1px dashed var(--border-dash);
      display: flex;
      gap: 10px;
      align-items: flex-start;
    `;
    div.innerHTML = `
      <div style="flex-grow:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-family:'Courier Prime',monospace;font-weight:700;
                       font-size:12px;color:var(--text)">arthur</span>
          <span style="font-family:'Courier Prime',monospace;font-size:11px;
                       color:var(--text-faint)">${c.date}</span>
        </div>
        <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.5">
          ${c.text}
        </p>
      </div>
      <button onclick="handleDeleteComment('${reviewKey}',${i},this)"
              style="background:none;border:none;cursor:pointer;
                     color:var(--text-faint);font-size:12px;padding:0;
                     flex-shrink:0;transition:color 0.15s"
              onmouseover="this.style.color='#c0392b'"
              onmouseout="this.style.color='var(--text-faint)'">✕</button>`;
    container.appendChild(div);
  });
}

function handleDeleteComment(reviewKey, idx, btn) {
  deleteComment(reviewKey, idx);
  const container = btn
    .closest(".comment-section")
    .querySelector(".comment-list");
  renderComments(reviewKey, container);
  updateCommentCount(reviewKey, btn.closest(".comment-section"));
}

function updateCommentCount(reviewKey, section) {
  const count = getComments(reviewKey).length;
  const counter = section.querySelector(".comment-count");
  if (counter) counter.textContent = `💬 ${count}`;
}

function toggleCommentSection(reviewKey, wrapper) {
  const section = wrapper.querySelector(".comment-section");
  const isOpen = section.style.display === "block";
  section.style.display = isOpen ? "none" : "block";
  if (!isOpen) {
    renderComments(reviewKey, section.querySelector(".comment-list"));
  }
}

function submitComment(reviewKey, textarea, section) {
  const text = textarea.value.trim();
  if (!text) return;
  addComment(reviewKey, text);
  textarea.value = "";
  renderComments(reviewKey, section.querySelector(".comment-list"));
  updateCommentCount(reviewKey, section);

  const card = section.closest(".review-card");
  if (card) {
    const countBtn = card.querySelector(".comment-count");
    if (countBtn) countBtn.textContent = `💬 ${getComments(reviewKey).length}`;
  }
}

function buildReviewCard(r, a, reviewKey) {
  const commentCount = getComments(reviewKey).length;

  const div = document.createElement("div");
  div.className = "review-card";
  div.innerHTML = `
    <div class="d-flex gap-3">
      <div class="review-thumb" style="background:${a.color}">
        <img src="${a.img}" alt="${a.title}" onerror="this.style.display='none'">
      </div>
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between mb-1">
          <span class="review-user">${r.user}</span>
          <span class="review-time">${r.time}</span>
        </div>
        <div style="font-size:11px;color:var(--text-faint);
                    font-family:'Courier Prime',monospace;margin-bottom:6px">
          ${r.album} — ${r.artist}
        </div>
        <p class="review-text">${r.text}</p>

        <!-- LIKE + COMMENT BUTTONS -->
        <div class="d-flex gap-2 mt-2 align-items-center">
          <button class="like-btn"
                  onclick="toggleLike(this, '${reviewKey}', ${r.likes})">
            ♥ <span>${r.likes}</span>
          </button>
          <button class="like-btn comment-count"
                  onclick="toggleCommentSection('${reviewKey}', this.closest('.review-card'))">
            💬 ${commentCount}
          </button>
        </div>

        <!-- COMMENT SECTION (hidden by default) -->
        <div class="comment-section" style="display:none;margin-top:14px">

          <!-- INPUT -->
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <textarea
              placeholder="comentar como arthur..."
              rows="2"
              style="flex:1;border:2px solid var(--border);border-radius:0;
                     background:var(--search-bg);font-family:'Courier Prime',monospace;
                     font-size:12px;color:var(--text);padding:6px 8px;resize:none;
                     transition:background 0.25s,border-color 0.25s,color 0.25s"
              onfocus="this.style.borderColor='var(--accent)'"
              onblur="this.style.borderColor='var(--border)'"
            ></textarea>
            <button
              style="background:var(--text);color:var(--bg);border:2px solid var(--border);
                     font-family:'Courier Prime',monospace;font-weight:700;font-size:12px;
                     padding:0 14px;cursor:pointer;transition:background 0.15s,color 0.15s;
                     align-self:flex-end"
              onmouseover="this.style.background='var(--accent)';this.style.color='var(--accent-text)'"
              onmouseleave="this.style.background='var(--text)';this.style.color='var(--bg)'"
              onclick="submitComment(
                '${reviewKey}',
                this.previousElementSibling,
                this.closest('.comment-section')
              )">
              enviar
            </button>
          </div>

          <!-- LIST -->
          <div class="comment-list"></div>
        </div>

      </div>
    </div>`;

  const likeBtn = div.querySelector(".like-btn");
  applyLike(likeBtn, reviewKey, r.likes);

  return div;
}

fetch("object.json")
  .then((res) => res.json())
  .then((dados) => {
    const music = dados.music;

    const heroGrid = document.getElementById("heroGrid");
    if (heroGrid) {
      heroGrid.innerHTML = "";
      const heroIndices = [0, 1, 4, 3, 2];
      const colClasses = ["col-6", "col-6", "col-4", "col-4", "col-4"];
      heroIndices.forEach((idx, i) => {
        const a = music[idx];
        const col = document.createElement("div");
        col.className = colClasses[i];
        col.innerHTML = `
          <div class="album-cover" style="background:${a.color}">
            <img src="${a.img}" alt="${a.title}" loading="lazy"
                 onerror="this.style.display='none'">                           
            <div class="album-rating">${a.rating}</div>
          </div>`;
        heroGrid.appendChild(col);
      });
    }

    if (document.getElementById("popularGrid")) {
      renderAlbumGrid(music, music);
    }

    const filterBar = document.getElementById("genreFilterBar");
    if (filterBar && dados.genres) {
      const usedGenres = dados.genres.filter((g) =>
        music.some((a) => (a.genre || "").toLowerCase() === g.toLowerCase()),
      );
      usedGenres.forEach((g) => {
        const btn = document.createElement("button");
        btn.className = "genre-pill";
        btn.textContent = g;
        btn.onclick = () => filterGenre(btn, g);
        filterBar.appendChild(btn);
      });
    }

    const reviewsList = document.getElementById("reviewsList");
    if (reviewsList && dados.comments) {
      dados.comments.forEach((r, i) => {
        const a = music[r.idx];
        const reviewKey = `review-${i}`;
        const card = buildReviewCard(r, a, reviewKey);
        reviewsList.appendChild(card);
      });
    }

    const trendingList = document.getElementById("trendingList");
    if (trendingList && dados.trending) {
      trendingList.innerHTML = "";
      dados.trending.forEach((t, i) => {
        const a = music[t.idx];
        const div = document.createElement("div");
        div.className = "trending-row";
        div.innerHTML = `
          <span class="t-num">0${i + 1}</span>
          <div class="t-cover" style="background:${a.color}">
            <img src="${a.img}" alt="${a.title}" onerror="this.style.display='none'">
          </div>
          <div class="flex-grow-1 overflow-hidden">
            <div class="t-title">${t.title}</div>
            <div class="t-artist">${t.artist}</div>
          </div>
          <span class="t-score">${t.score}</span>`;
        trendingList.appendChild(div);
      });
    }

    const genreList = document.getElementById("genreList");
    if (genreList && dados.genres) {
      dados.genres.forEach((g) => {
        const btn = document.createElement("button");
        btn.className = "genre-pill";
        btn.textContent = g;
        btn.onclick = () => {
          document
            .querySelectorAll("#genreList .genre-pill")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          filterGenre(null, g);
        };
        genreList.appendChild(btn);
      });
    }

    const reviewCount = document.getElementById("reviewCount");
    const wishlistCount = document.getElementById("wishlistCount");
    const likedCount = document.getElementById("likedCount");
    if (reviewCount)
      reviewCount.textContent = Object.keys(getAllReviews()).length;
    if (wishlistCount) wishlistCount.textContent = getWishlist().length;
    if (likedCount)
      likedCount.textContent = Object.keys(getLikes()).filter(
        (k) => getLikes()[k] && k.startsWith("album-like-"),
      ).length;

    renderSavedReviews(dados.music);

    window._allMusic = music;
  });

function renderAlbumGrid(musicToShow, allMusic) {
  const popularGrid = document.getElementById("popularGrid");
  if (!popularGrid) return;
  popularGrid.innerHTML = "";

  if (musicToShow.length === 0) {
    popularGrid.innerHTML = `
      <div class="col-12">
        <p style="font-family:'Courier Prime',monospace;font-size:14px;color:var(--text-muted)">
          nenhum álbum neste gênero ainda.
        </p>
      </div>`;
    return;
  }

  musicToShow.forEach((a) => {
    const idx = allMusic.indexOf(a);
    const albumKey = `album-like-${idx}`;
    const isLiked = getLikes()[albumKey] || false;
    const inWish = isInWishlist(String(idx));

    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="album-card-wrap">
        <div class="album-cover" style="background:${a.color}">
          <img src="${a.img}" alt="${a.title}" loading="lazy"
               onerror="this.style.display='none'">
          <div class="album-rating">${a.rating}</div>

          <!-- HOVER OVERLAY -->
          <div class="card-overlay">
            <button class="card-action-btn ${isLiked ? "active" : ""}"
                    title="curtir"
                    onclick="toggleAlbumLike(this, '${albumKey}', event)">
              ${isLiked ? "♥" : "♡"}
            </button>
            <a class="card-action-btn" href="album.html?id=${idx}#review"
               title="avaliar" onclick="event.stopPropagation()">
              ✎
            </a>
            <button class="card-action-btn ${inWish ? "active" : ""}"
                    title="${inWish ? "remover da lista" : "quero ouvir"}"
                    onclick="toggleAlbumWish(this, '${idx}', event)">
              ${inWish ? "★" : "☆"}
            </button>
          </div>
        </div>
        <a href="album.html?id=${idx}" style="text-decoration:none;color:inherit">
          <div class="album-title">${a.title}</div>
          <div class="album-artist">${a.artist}</div>
        </a>
      </div>`;
    popularGrid.appendChild(col);
  });
}

function toggleAlbumLike(btn, albumKey, e) {
  e.preventDefault();
  e.stopPropagation();
  const likes = getLikes();
  const liked = !likes[albumKey];
  likes[albumKey] = liked;
  saveLikes(likes);
  btn.classList.toggle("active", liked);
  btn.textContent = liked ? "♥" : "♡";
  updateAllCounters();
  showCardToast(liked ? "curtido!" : "curtida removida.");
}

function toggleAlbumWish(btn, idx, e) {
  e.preventDefault();
  e.stopPropagation();
  let list = getWishlist();
  const inList = list.includes(String(idx));
  if (inList) {
    list = list.filter((id) => id !== String(idx));
  } else {
    list.push(String(idx));
  }
  saveWishlist(list);
  const nowIn = list.includes(String(idx));
  btn.classList.toggle("active", nowIn);
  btn.textContent = nowIn ? "★" : "☆";
  btn.title = nowIn ? "remover da lista" : "quero ouvir";
  updateAllCounters();
  showCardToast(nowIn ? "adicionado à lista!" : "removido da lista.");
}

function showCardToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

function filterGenre(btn, genre) {
  document
    .querySelectorAll("#genreFilterBar .genre-pill")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const all = window._allMusic || [];

  if (genre === "todos") {
    renderAlbumGrid(all, all);
  } else {
    const filtered = all.filter(
      (a) => (a.genre || "").toLowerCase() === genre.toLowerCase(),
    );
    renderAlbumGrid(filtered, all);
  }
}

function handleSearch(term) {
  const overlay = document.getElementById("searchResults");
  const grid = document.getElementById("searchGrid");
  const empty = document.getElementById("searchEmpty");
  const termLabel = document.getElementById("searchTerm");
  const mainContent = document.getElementById("mainContent");
  const statsRow = document.getElementById("statsRow");
  const mainGrid = document.getElementById("mainGrid");

  if (!term || term.trim().length < 2) {
    if (overlay) overlay.style.display = "none";
    if (mainContent) mainContent.style.display = "";
    if (statsRow) statsRow.style.display = "";
    if (mainGrid) mainGrid.style.display = "";
    return;
  }

  if (mainContent) mainContent.style.display = "none";
  if (statsRow) statsRow.style.display = "none";
  if (mainGrid) mainGrid.style.display = "none";
  if (overlay) overlay.style.display = "block";

  const q = term.trim().toLowerCase();
  if (termLabel) termLabel.textContent = term.trim();

  const all = window._allMusic || [];
  const results = all.filter(
    (a) =>
      a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q),
  );

  if (grid) grid.innerHTML = "";
  if (empty) empty.style.display = "none";

  if (results.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }

  results.forEach((a) => {
    const idx = all.indexOf(a);
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <a href="album.html?id=${idx}" style="text-decoration:none;color:inherit">
        <div class="album-cover" style="background:${a.color}">
          <img src="${a.img}" alt="${a.title}" loading="lazy"
               onerror="this.style.display='none'">
          <div class="album-rating">${a.rating}</div>
        </div>
        <div class="album-title">${a.title}</div>
        <div class="album-artist">${a.artist}</div>
      </a>`;
    if (grid) grid.appendChild(col);
  });
}

function clearSearch() {
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  handleSearch("");
}
function starsStr(n) {
  if (!n) return "☆☆☆☆☆";
  return "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
}

fetch("object.json")
  .then((r) => r.json())
  .then((dados) => {
    const music = dados.music;
    const reviews = getAllReviews();
    const wishlist = getWishlist();
    const allLikes = getLikes();
    const likedIds = Object.keys(allLikes).filter(
      (k) => allLikes[k] && k.startsWith("album-like-"),
    );

    document.getElementById("statReviews").textContent =
      Object.keys(reviews).length;
    document.getElementById("statWishlist").textContent = wishlist.length;
    document.getElementById("statLiked").textContent = likedIds.length;
    document.getElementById("wishlistCountLabel").textContent =
      wishlist.length + " álbum" + (wishlist.length !== 1 ? "s" : "");
    document.getElementById("likedCountLabel").textContent =
      likedIds.length + " álbum" + (likedIds.length !== 1 ? "s" : "");
    wishlist.length + " álbum" + (wishlist.length !== 1 ? "s" : "");

    const reviewsContainer = document.getElementById("profileReviews");
    const reviewKeys = Object.keys(reviews);

    if (reviewKeys.length === 0) {
      reviewsContainer.innerHTML =
        '<div class="empty-state">você ainda não avaliou nenhum álbum.</div>';
    } else {
      reviewsContainer.innerHTML = "";
      reviewKeys.forEach((albumId) => {
        const review = reviews[albumId];
        const album = music[albumId];
        if (!album) return;

        const div = document.createElement("div");
        div.className = "review-card";
        div.innerHTML = `
                <div class="d-flex gap-3">
                  <div class="review-thumb" style="background:${album.color}">
                    <img src="${album.img}" alt="${album.title}" onerror="this.style.display='none'">
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between mb-1">
                      <strong style="font-family:'Courier Prime',monospace;font-size:13px;color:var(--text)">${album.title}</strong>
                      <span class="review-time">${review.date}</span>
                    </div>
                    <div style="font-size:11px;color:var(--text-faint);font-family:'Courier Prime',monospace;margin-bottom:6px">
                      ${album.artist}
                    </div>
                    <div class="review-stars mb-1">${starsStr(review.score)}</div>
                    <p class="review-text">${review.text}</p>
                    <div class="d-flex gap-2 mt-2">
                      <a href="album.html?id=${albumId}" class="action-btn">editar</a>
                      <button class="action-btn danger" onclick="deleteReviewFromProfile('${albumId}', this)">remover</button>
                    </div>
                  </div>
                </div>`;
        reviewsContainer.appendChild(div);
      });
    }

    const wishlistContainer = document.getElementById("profileWishlist");
    if (wishlist.length === 0) {
      wishlistContainer.innerHTML =
        '<div class="empty-state">sua lista está vazia.</div>';
    } else {
      wishlistContainer.innerHTML = "";
      wishlist.forEach((albumId) => {
        const album = music[albumId];
        if (!album) return;

        const div = document.createElement("div");
        div.className = "wishlist-item";
        div.id = `wish-${albumId}`;
        div.innerHTML = `
                <div class="wishlist-thumb" style="background:${album.color}">
                  <img src="${album.img}" alt="${album.title}" onerror="this.style.display='none'">
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)">
                    ${album.title}
                  </div>
                  <div style="font-size:11px;color:var(--text-faint);font-family:'Courier Prime',monospace">${album.artist}</div>
                </div>
                <a href="album.html?id=${albumId}" class="action-btn" style="flex-shrink:0">ver</a>
                <button class="remove-btn" onclick="removeFromWishlistProfile('${albumId}')">✕</button>`;
        wishlistContainer.appendChild(div);
      });
    }

    const likedContainer = document.getElementById("profileLiked");
    if (likedIds.length === 0) {
      likedContainer.innerHTML =
        '<div class="empty-state">você ainda não curtiu nenhum álbum.</div>';
    } else {
      likedContainer.innerHTML = "";
      likedIds.forEach((key) => {
        const albumId = key.replace("album-like-", "");
        const album = music[albumId];
        if (!album) return;

        const div = document.createElement("div");
        div.className = "wishlist-item";
        div.id = `liked-${albumId}`;
        div.innerHTML = `
                <div class="wishlist-thumb" style="background:${album.color}">
                  <img src="${album.img}" alt="${album.title}" onerror="this.style.display='none'">
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)">
                    ${album.title}
                  </div>
                  <div style="font-size:11px;color:var(--text-faint);font-family:'Courier Prime',monospace">${album.artist}</div>
                </div>
                <a href="album.html?id=${albumId}" class="action-btn" style="flex-shrink:0">ver</a>
                <button class="remove-btn" onclick="removeLikedProfile('${albumId}', '${key}')">✕</button>`;
        likedContainer.appendChild(div);
      });
    }
  });

function deleteReviewFromProfile(albumId, btn) {
  const reviews = getAllReviews();
  delete reviews[albumId];
  saveAllReviews(reviews);
  btn.closest(".review-card").remove();
  updateAllCounters();
  if (Object.keys(getAllReviews()).length === 0)
    document.getElementById("profileReviews").innerHTML =
      '<div class="empty-state">você ainda não avaliou nenhum álbum.</div>';
  toast("review removida.");
}

function removeFromWishlistProfile(albumId) {
  let list = getWishlist().filter((id) => id !== String(albumId));
  saveWishlist(list);
  const el = document.getElementById(`wish-${albumId}`);
  if (el) el.remove();
  updateAllCounters();
  if (list.length === 0)
    document.getElementById("profileWishlist").innerHTML =
      '<div class="empty-state">sua lista está vazia.</div>';
  toast("removido da lista.");
}

function removeLikedProfile(albumId, likeKey) {
  const likes = getLikes();
  delete likes[likeKey];
  saveLikes(likes);
  const el = document.getElementById(`liked-${albumId}`);
  if (el) el.remove();
  updateAllCounters();
  const remaining = Object.keys(getLikes()).filter(
    (k) => getLikes()[k] && k.startsWith("album-like-"),
  ).length;
  if (remaining === 0)
    document.getElementById("profileLiked").innerHTML =
      '<div class="empty-state">você ainda não curtiu nenhum álbum.</div>';
  toast("curtida removida.");
}
