const $ = (selector) => document.querySelector(selector);

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

function playerCard(player) {
  return `
    <div class="col-sm-6 col-lg-3">
      <article class="card-legend h-100">
        <div class="player-img-wrap">
          <img
            class="player-img"
            src="${player.image}"
            alt="${esc(player.name)}"
            loading="lazy"
            onerror="this.onerror=null;this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#26364b,#111925)'"
          >
        </div>
        <div class="body d-flex flex-column">
          <div class="kicker">
            ${esc(player.position)} • ${esc(player.era)}
          </div>
          <h3>${esc(player.name)}</h3>
          <div class="muted small mb-3">${esc(player.nickname)}</div>
          <div>
            <span class="tag">${player.titles}× CAMPEÃO</span>
            <span class="tag">${player.mvp}× MVP</span>
          </div>
          <button
            type="button"
            class="btn btn-gold btn-sm mt-auto align-self-start mt-3"
            onclick="showPlayer('${esc(player.id)}')"
          >
            VER PERFIL ↗
          </button>
        </div>
      </article>
    </div>
  `;
}

function showPlayer(id) {
  const player = legends.find(
    (item) => String(item.id) === String(id),
  );

  if (!player) {
    console.error("Jogador não encontrado:", id);
    return;
  }

  const title = $("#profileTitle");
  const content = $("#profileContent");
  const modalElement = $("#profileModal");

  if (!title || !content || !modalElement) {
    console.error("Elementos do perfil não encontrados nesta página.");
    return;
  }

  title.textContent = player.name;
  content.innerHTML = `
    <div class="row g-4">
      <div class="col-md-5">
        <img
          src="${player.image}"
          class="w-100 rounded"
          style="height:330px;object-fit:cover;object-position:top"
          alt="${esc(player.name)}"
          onerror="this.onerror=null;this.style.display='none'"
        >
        <h3 class="mt-3">${esc(player.nickname)}</h3>
        <p class="muted">${esc(player.bio)}</p>
        <a
          class="btn btn-outline-light btn-sm"
          href="${player.source}"
          target="_blank"
          rel="noopener"
        >
          Ver origem da imagem
        </a>
      </div>

      <div class="col-md-7">
        <div class="kicker">FICHA BIOGRÁFICA</div>
        <p><b>Universidade:</b> ${esc(player.college)}</p>
        <p><b>Draft:</b> ${esc(player.draft)}</p>
        <p><b>Equipes:</b> ${esc(player.teams)}</p>
        <p><b>Posição:</b> ${esc(player.position)}</p>
        <p><b>Impacto cultural:</b> ${esc(player.impact)}</p>

        <hr class="border-secondary">
        <div class="kicker">CONQUISTAS</div>
        <div class="row g-2 text-center mt-1">
          <div class="col-4">
            <div class="panel p-2">
              <div class="stat">${player.titles}</div>
              <small class="muted">TÍTULOS</small>
            </div>
          </div>
          <div class="col-4">
            <div class="panel p-2">
              <div class="stat">${player.mvp}</div>
              <small class="muted">MVP</small>
            </div>
          </div>
          <div class="col-4">
            <div class="panel p-2">
              <div class="stat">${player.allstar}</div>
              <small class="muted">ALL-STAR</small>
            </div>
          </div>
        </div>

        <div class="kicker mt-4">MÉDIAS DE CARREIRA</div>
        <div class="row mt-2">
          <div class="col-4">PTS <b>${player.ppg}</b></div>
          <div class="col-4">REB <b>${player.rpg}</b></div>
          <div class="col-4">AST <b>${player.apg}</b></div>
          <div class="col-6 mt-2">FG% <b>${player.fg}%</b></div>
          <div class="col-6 mt-2">3P% <b>${player.three}%</b></div>
        </div>

        <p class="muted small mt-3">
          Camiseta aposentada: ${esc(player.retired)}
        </p>
        <a
          class="btn btn-gold btn-sm mt-2"
          target="_blank"
          rel="noopener"
          href="https://www.youtube.com/results?search_query=${encodeURIComponent(player.name + " NBA highlights")}"
        >
          VER MELHORES MOMENTOS ↗
        </a>
      </div>
    </div>
  `;

  if (window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  } else {
    modalElement.style.display = "block";
    modalElement.classList.add("show");
    modalElement.removeAttribute("aria-hidden");
    modalElement.setAttribute("aria-modal", "true");
    modalElement.setAttribute("role", "dialog");
    document.body.classList.add("modal-open");

    if (!document.querySelector(".profile-fallback-backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.className =
        "modal-backdrop fade show profile-fallback-backdrop";
      backdrop.addEventListener("click", hidePlayer);
      document.body.appendChild(backdrop);
    }
  }
}

function hidePlayer() {
  const modal = $("#profileModal");
  if (!modal) return;

  if (window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(modal).hide();
  } else {
    modal.classList.remove("show");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    document.body.classList.remove("modal-open");
    document.querySelector(".profile-fallback-backdrop")?.remove();
  }
}

document.addEventListener("click", (event) => {
  if (event.target.closest('#profileModal [data-bs-dismiss="modal"]')) {
    hidePlayer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hidePlayer();
});

function setupNav() {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

setupNav();
