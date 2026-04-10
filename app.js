/**
 * app.js — Blog-Logik für limadaev.de
 *
 * Erkennt automatisch ob index.html oder post.html geladen ist
 * und rendert entsprechend Feed oder Einzelartikel.
 */

/* ─── KATEGORIE-LABELS ─── */
const CAT_LABEL = {
  bjj: "BJJ",
  sap: "SAP / Tech",
  ifrs9: "IFRS9",
  mindset: "Mindset",
};

/* ─── HILFSFUNKTIONEN ─── */
function catBadge(cat) {
  return `<span class="post-cat cat-${cat}">${CAT_LABEL[cat] ?? cat}</span>`;
}

function postUrl(id) {
  return `post.html?id=${id}`;
}

/* ─── FEED RENDERN (index.html) ─── */
function renderFeed(filter = "all") {
  const container = document.getElementById("feed");
  if (!container) return;

  const posts =
    filter === "all" ? POSTS : POSTS.filter((p) => p.category === filter);

  if (posts.length === 0) {
    container.innerHTML = `<p class="feed-empty">Keine Artikel in dieser Kategorie.</p>`;
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
    <a href="${postUrl(post.id)}" class="post-card" data-cat="${post.category}">
      <div class="post-card-body">
        <div class="post-card-meta">
          ${catBadge(post.category)}
          <span class="post-date">${post.date}</span>
          <span class="post-readtime">${post.readTime} Min.</span>
        </div>
        <h2 class="post-card-title">${post.title}</h2>
        <p class="post-card-excerpt">${post.excerpt}</p>
        <span class="post-card-cta">
          Lesen
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </a>
  `,
    )
    .join("");
}

/* ─── FILTER-BUTTONS ─── */
function initFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderFeed(btn.dataset.cat);
    });
  });
}

/* ─── EINZELARTIKEL RENDERN (post.html) ─── */
function renderPost() {
  const container = document.getElementById("post-content");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const post = POSTS.find((p) => p.id === id);

  if (!post) {
    container.innerHTML = `
      <div style="text-align:center;padding:80px 24px">
        <p style="color:var(--text-muted);font-size:15px;margin-bottom:20px">Artikel nicht gefunden.</p>
        <a href="index.html" style="color:var(--accent);font-weight:600;text-decoration:none">← Zurück zum Blog</a>
      </div>`;
    return;
  }

  // Seitentitel setzen
  document.title = `${post.title} – Lom-Ali Imadaev`;
  const descEl = document.getElementById("page-desc");
  if (descEl) descEl.setAttribute("content", post.excerpt);

  container.innerHTML = `
    <header class="post-header">
      ${catBadge(post.category)}
      <h1 class="post-title">${post.title}</h1>
      <div class="post-meta-row">
        <span class="post-date">${post.date}</span>
        <span>·</span>
        <span class="post-readtime">${post.readTime} Min. Lesezeit</span>
      </div>
    </header>

    <div class="post-divider"></div>

    <div class="post-body">
      ${post.content}
    </div>
  `;

  renderMorePosts(post.id, post.category);
}

/* ─── WEITERE ARTIKEL ─── */
function renderMorePosts(currentId, currentCat) {
  const container = document.getElementById("more-posts");
  if (!container) return;

  // Selbe Kategorie zuerst, dann andere, max. 3
  const others = POSTS.filter((p) => p.id !== currentId)
    .sort((a, b) => (b.category === currentCat) - (a.category === currentCat))
    .slice(0, 3);

  if (!others.length) return;

  container.innerHTML = `
    <p class="more-posts-title">Weitere Artikel</p>
    <div class="more-posts-grid">
      ${others
        .map(
          (p) => `
        <a href="${postUrl(p.id)}" class="post-card" data-cat="${p.category}">
          <div class="post-card-body">
            <div class="post-card-meta">
              ${catBadge(p.category)}
              <span class="post-date">${p.date}</span>
              <span class="post-readtime">${p.readTime} Min.</span>
            </div>
            <h3 class="post-card-title">${p.title}</h3>
            <p class="post-card-excerpt">${p.excerpt}</p>
          </div>
        </a>
      `,
        )
        .join("")}
    </div>
  `;
}

/* ─── INIT ─── */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("feed")) {
    // Feed-Seite
    renderFeed();
    initFilter();
  } else if (document.getElementById("post-content")) {
    // Einzelartikel-Seite
    renderPost();
  }
});

// Blog Post 1:

const POSTS = [
  {
    id: "mein-neuer-artikel", // → URL: post.html?id=mein-neuer-artikel
    title: "Muay Thai ist schlecht für MMA",
    excerpt: "Kicks sind nicht Energieeffizient",
    category: "bjj", // bjj | sap | mindset
    date: "10. April 2026",
    readTime: 4, // geschätzte Lesezeit in Minuten
    content: `
      <p>Absatz </p>

      <h2>Kicks sind nicht Energieeffizient.</h2>
      <p>

Muay Thai ist schlecht für MMA. Der Grund sind die Kicks.

Kicks haben ein sehr hohes Risiko im Verhältnis zum Ertrag.

Kicks sind nicht energieeffizient. Wenn zwei Kämpfer am Ende ihrer Kräfte sind, boxen sie nur noch.

Wenn Kicks landen, verursachen sie einen hohen Schaden, doch wenn nicht, eröffnen sie sehr viel Raum und Zeit für Gegenangriffe.
 
Kicks zwingen die Stabilität im Stand aufzugeben. Das eröffnet Möglichkeiten für den Gegner.

Im Muay Thai werden auch Meidbewegungen wie im Boxen gemieden, weil sie mit Kicks bestraft werden könnten, doch die fehlende Beweglichkeit des Kopfes aus der Schlaglinie macht umso angreifbar für Fausthiebe.

Hinzu kommt, dass Medienbewegungen auch Beinarbeit trainieren und voraussetzen, was beim Muay Thai im Verhältnis zum Boxen weniger ausgeprägt ist. 

Beweglichkeit ist besonders wichtig im MMA, weil die Deckung mit den MMA-Handschuhen keinen ausreichenden Schutz bietet.

Vor allem erhöhen Kicks das Risiko, niedergerungen zu werden. Darum wird im MMA im Verhältnis zu Muay Thai deutlich weniger gekickt als geboxt. Ich würde schätzen, dass der Anteil an Kicks im Muay Thai bei 50% und im MMA bei ca. 15% liegt.

Wie siehst du aus? Schreibs in den Kommentarem. Folge mir für mehr Kampfsportinhalte.

      
      
      </p>

      <blockquote>Never Pull Guard</blockquote>

    `,
  },
];
