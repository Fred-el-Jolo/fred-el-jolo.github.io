// Restore persisted preferences
['dark-theme', 'light-theme', 'dys-font', 'eco-mode'].forEach(cls => {
  if (localStorage.getItem(cls) === '1') document.body.classList.add(cls);
  if (localStorage.getItem(cls) === '0') document.body.classList.remove(cls);
});

// Theme toggle: system → dark → light → system
const themeButton = document.getElementById('switch-theme');
themeButton?.addEventListener('click', () => {
  const body = document.body;
  if (body.classList.contains('dark-theme')) {
    body.classList.replace('dark-theme', 'light-theme');
    localStorage.setItem('dark-theme', '0');
    localStorage.setItem('light-theme', '1');
  } else if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    localStorage.setItem('light-theme', '0');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('dark-theme', '1');
  }
});

const fontButton = document.getElementById('switch-font');
fontButton?.addEventListener('click', () => {
  const on = document.body.classList.toggle('dys-font');
  localStorage.setItem('dys-font', on ? '1' : '0');
});

const ecoModeButton = document.getElementById('switch-eco-mode');
ecoModeButton?.addEventListener('click', () => {
  const on = document.body.classList.toggle('eco-mode');
  localStorage.setItem('eco-mode', on ? '1' : '0');
});

// Tag filter (index page only)
const filterBar = document.getElementById('tag-filter');
if (filterBar) {
  const articles = Array.from(document.querySelectorAll('main article[data-tags]'));
  let activeTag = null;

  function applyFilter(tag) {
    activeTag = (tag === 'all' || !tag) ? null : tag;
    filterBar.querySelectorAll('[data-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === (activeTag ?? 'all'));
    });
    articles.forEach(article => {
      const tags = article.dataset.tags.split(' ');
      article.hidden = activeTag !== null && !tags.includes(activeTag);
    });
  }

  // Activate tag from URL param on load
  const urlTag = new URLSearchParams(location.search).get('tag');
  if (urlTag) applyFilter(urlTag);

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    applyFilter(btn.dataset.filter === activeTag ? null : btn.dataset.filter);
  });
}

// Copy buttons for code blocks
document.querySelectorAll('pre > code').forEach(block => {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'Copy';
  btn.setAttribute('aria-label', 'Copy code to clipboard');
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(block.innerText).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
  block.parentElement.appendChild(btn);
});

// Reading time — post pages only
const postBody = document.querySelector('.post-body');
const readingTimeEl = document.querySelector('.reading-time');
if (postBody && readingTimeEl) {
  const words = postBody.innerText.trim().split(/\s+/).length;
  readingTimeEl.textContent = `${Math.max(1, Math.round(words / 200))} min`;
}
