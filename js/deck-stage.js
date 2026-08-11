/* aesthetecoding.io — <deck-stage> custom element
   Navigation shell for slide-format articles (css/deck.css owns all visual styling).
   Contract: children are <section class="slide" data-label="…" [data-speaker-notes="…"]>.
   - Slides are authored at a fixed design size (1920×1080 by default, via `width`/`height`
     attributes) and the whole canvas is scaled uniformly with transform: scale() to fit the
     viewport, letterboxed — keeps fixed-px type/spacing correct at any viewport size.
   - Arrow keys / Space / Home / End / number keys navigate; tapping the left/right edge of the
     stage on touch devices goes prev/next (ignoring taps on interactive slide content); the left
     rail (data-label) jumps directly.
   - [data-deck-page] spans inside a slide are auto-filled with "N / total".
   - location.hash ("#3") deep-links to a slide and stays in sync while navigating.
   - Slides are hidden via visibility/opacity, not display:none, so embedded state (video/audio
     playback, form inputs, iframes) survives navigation instead of unmounting.
   - Dispatches a `slidechange` CustomEvent on itself on every navigation (including initial
     mount): { index, previousIndex, total, slide, previousSlide, reason }.
   - Print (Cmd/Ctrl+P → Save as PDF): css/deck.css's @media print resets the canvas transform
     and shows every slide stacked, one per page — this element does no extra work for that path.
   Speaker notes (data-speaker-notes) are stored on each slide for a future presenter view; there
   is no presenter UI yet. */
(function () {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const INTERACTIVE_SEL = 'a[href], button, input, select, textarea, [role="button"], [contenteditable]:not([contenteditable="false" i])';

  class DeckStage extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;

      this.slides = Array.from(this.querySelectorAll(':scope > section.slide'));
      if (!this.slides.length) return;

      this.designWidth = parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
      this.designHeight = parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;

      this._buildCanvas();
      this._buildChrome();
      this._paginate();
      this._fit();

      const fromHash = this._indexFromHash();
      this._show(fromHash > -1 ? fromHash : 0, { replace: true, reason: 'init' });

      this._onKeydown = this._onKeydown.bind(this);
      this._onHashChange = this._onHashChange.bind(this);
      this._onResize = this._fit.bind(this);
      document.addEventListener('keydown', this._onKeydown);
      window.addEventListener('hashchange', this._onHashChange);
      window.addEventListener('resize', this._onResize);
    }

    disconnectedCallback() {
      document.removeEventListener('keydown', this._onKeydown);
      window.removeEventListener('hashchange', this._onHashChange);
      window.removeEventListener('resize', this._onResize);
    }

    _buildCanvas() {
      const canvas = document.createElement('div');
      canvas.className = 'deck-canvas';
      canvas.style.setProperty('--deck-w', `${this.designWidth}px`);
      canvas.style.setProperty('--deck-h', `${this.designHeight}px`);
      this.slides.forEach(slide => canvas.appendChild(slide));
      this.appendChild(canvas);
      this.canvas = canvas;

      canvas.addEventListener('click', (e) => this._onCanvasTap(e));
    }

    _buildChrome() {
      const rail = document.createElement('nav');
      rail.className = 'deck-rail';
      rail.setAttribute('aria-label', 'Slides');
      this.slides.forEach((slide, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span>${slide.dataset.label || `Slide ${i + 1}`}</span>`;
        btn.addEventListener('click', () => { this._show(i, { reason: 'click' }); this._closeRail(); });
        rail.appendChild(btn);
      });
      this.appendChild(rail);
      this.rail = rail;

      const railToggle = document.createElement('button');
      railToggle.type = 'button';
      railToggle.className = 'deck-toggle-rail';
      railToggle.setAttribute('aria-label', 'Toggle slide list');
      railToggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>';
      railToggle.addEventListener('click', () => rail.classList.toggle('is-open'));
      this.appendChild(railToggle);

      const topRight = document.createElement('div');
      topRight.className = 'deck-topright';

      const themeToggle = document.createElement('button');
      themeToggle.type = 'button';
      themeToggle.className = 'deck-theme-toggle';
      themeToggle.setAttribute('aria-label', 'Toggle light / dark theme');
      themeToggle.innerHTML =
        '<svg class="ic-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>' +
        '<svg class="ic-moon" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"></path></svg>';
      themeToggle.addEventListener('click', () => this._toggleTheme());
      topRight.appendChild(themeToggle);

      const back = document.createElement('a');
      back.className = 'deck-back';
      back.href = this.getAttribute('data-back-href') || '/';
      back.textContent = '← back to site';
      topRight.appendChild(back);

      this.appendChild(topRight);

      const prev = document.createElement('button');
      prev.type = 'button';
      prev.className = 'deck-arrow deck-arrow--prev';
      prev.setAttribute('aria-label', 'Previous slide');
      prev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      prev.addEventListener('click', () => this._show(this.current - 1, { reason: 'click' }));
      this.appendChild(prev);

      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'deck-arrow deck-arrow--next';
      next.setAttribute('aria-label', 'Next slide');
      next.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      next.addEventListener('click', () => this._show(this.current + 1, { reason: 'click' }));
      this.appendChild(next);

      this.prevBtn = prev;
      this.nextBtn = next;
    }

    _paginate() {
      const total = this.slides.length;
      this.slides.forEach((slide, i) => {
        slide.querySelectorAll('[data-deck-page]').forEach(el => {
          el.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        });
      });
    }

    _fit() {
      if (!this.canvas) return;
      const s = Math.min(window.innerWidth / this.designWidth, window.innerHeight / this.designHeight);
      this.canvas.style.transform = `translate(-50%, -50%) scale(${s})`;
    }

    _indexFromHash() {
      const n = parseInt(location.hash.replace('#', ''), 10);
      return Number.isFinite(n) && n >= 1 && n <= this.slides.length ? n - 1 : -1;
    }

    _show(index, opts) {
      opts = opts || {};
      const total = this.slides.length;
      if (index < 0 || index >= total) return;
      const previousIndex = this.current ?? -1;
      const previousSlide = previousIndex > -1 ? this.slides[previousIndex] : null;
      this.current = index;

      this.slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      this.rail.querySelectorAll('button').forEach((btn, i) => btn.classList.toggle('is-current', i === index));
      this.prevBtn.toggleAttribute('disabled', index === 0);
      this.nextBtn.toggleAttribute('disabled', index === total - 1);

      const hash = `#${index + 1}`;
      if (opts.replace) history.replaceState(null, '', hash);
      else if (location.hash !== hash) history.pushState(null, '', hash);

      this.dispatchEvent(new CustomEvent('slidechange', {
        bubbles: true,
        detail: { index, previousIndex, total, slide: this.slides[index], previousSlide, reason: opts.reason || 'api' },
      }));
    }

    _closeRail() { this.rail.classList.remove('is-open'); }

    _toggleTheme() {
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('acx-theme', next); } catch (e) {}
    }

    _onHashChange() {
      const i = this._indexFromHash();
      if (i > -1 && i !== this.current) this._show(i, { replace: true, reason: 'api' });
    }

    _onKeydown(e) {
      if (e.target.closest('input, textarea, [contenteditable]')) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); this._show(this.current + 1, { reason: 'keyboard' }); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); this._show(this.current - 1, { reason: 'keyboard' }); }
      else if (e.key === 'Home') { e.preventDefault(); this._show(0, { reason: 'keyboard' }); }
      else if (e.key === 'End') { e.preventDefault(); this._show(this.slides.length - 1, { reason: 'keyboard' }); }
      else if (e.key === 'Escape') { this._closeRail(); }
      else if (/^[1-9]$/.test(e.key)) { const i = parseInt(e.key, 10) - 1; if (i < this.slides.length) this._show(i, { reason: 'keyboard' }); }
    }

    _onCanvasTap(e) {
      if (!matchMedia('(pointer: coarse)').matches) return;
      if (e.target.closest(INTERACTIVE_SEL)) return;
      const rect = this.canvas.getBoundingClientRect();
      const half = (e.clientX - rect.left) / rect.width;
      this._show(this.current + (half < 0.5 ? -1 : 1), { reason: 'tap' });
    }
  }

  customElements.define('deck-stage', DeckStage);
})();
