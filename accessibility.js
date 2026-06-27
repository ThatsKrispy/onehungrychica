/* ═══════════════════════════════════════════════════════════════
   ONE HUNGRY CHICA — Accessibility Widget v1.0
   WCAG 2.1 AA · ThatsKrispy Agency
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORE_KEY = 'ohc_a11y_v1';
  const html = document.documentElement;

  /* ── State ── */
  const defaults = {
    fontSize: 100,       // % of base
    highContrast: false,
    darkMode: false,
    invertColors: false,
    readableFont: false,
    underlineLinks: false,
    bigCursor: false,
    focusRing: false,
    pauseAnimations: false,
    readingGuide: false,
    colorTheme: 'default', // default | protanopia | deuteranopia | tritanopia
  };

  let state = { ...defaults };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (saved) state = { ...defaults, ...saved };
    } catch (e) {}
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ── Apply state to DOM ── */
  function apply() {
    /* Font size */
    document.body.style.fontSize = state.fontSize !== 100 ? `${state.fontSize}%` : '';

    /* Boolean classes */
    const modes = {
      'a11y-high-contrast':  state.highContrast,
      'a11y-dark-mode':      state.darkMode,
      'a11y-invert':         state.invertColors,
      'a11y-readable-font':  state.readableFont,
      'a11y-links':          state.underlineLinks,
      'a11y-big-cursor':     state.bigCursor,
      'a11y-focus-ring':     state.focusRing,
      'a11y-no-anim':        state.pauseAnimations,
      'a11y-reading-guide-on': state.readingGuide,
    };
    for (const [cls, on] of Object.entries(modes)) {
      html.classList.toggle(cls, on);
    }

    /* Color blindness filter */
    const filters = {
      protanopia:   'url(#ohc-protanopia)',
      deuteranopia: 'url(#ohc-deuteranopia)',
      tritanopia:   'url(#ohc-tritanopia)',
      default:      '',
    };
    document.body.style.filter = filters[state.colorTheme] || '';

    /* Sync UI toggles */
    syncUI();
    save();
  }

  /* ── Widget HTML ── */
  const WIDGET_HTML = `
<button id="a11y-launcher" aria-label="Open accessibility toolbar" aria-expanded="false" aria-controls="a11y-panel">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 5h-6l-1 5 3 8h-2l-2.5-7h-1L9 20H7l3-8-1-5H3V8h18v-.001z"/>
  </svg>
</button>

<!-- SVG color blindness filters (hidden) -->
<svg id="a11y-svg-filters" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
    <filter id="ohc-protanopia">
      <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="ohc-deuteranopia">
      <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="ohc-tritanopia">
      <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
    </filter>
  </defs>
</svg>

<!-- Reading guide -->
<div class="a11y-reading-guide" id="a11y-guide" aria-hidden="true"></div>

<div id="a11y-panel" role="dialog" aria-modal="false" aria-label="Accessibility options">
  <div class="a11y-header">
    <h2>Accessibility</h2>
    <button class="a11y-close" id="a11y-close" aria-label="Close accessibility toolbar">✕</button>
  </div>
  <div class="a11y-body">

    <p class="a11y-section-label">Text</p>

    <div class="a11y-row">
      <span class="a11y-row-label">
        <svg viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>
        Font Size
      </span>
      <div class="a11y-fontsize">
        <button class="a11y-fontsize-btn" id="a11y-font-down" aria-label="Decrease font size">−</button>
        <span class="a11y-fontsize-val" id="a11y-font-val">100%</span>
        <button class="a11y-fontsize-btn" id="a11y-font-up" aria-label="Increase font size">+</button>
      </div>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-readable">
        <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
        Readable Font
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-readable" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-links">
        <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
        Underline Links
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-links" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <p class="a11y-section-label">Display</p>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-contrast">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>
        High Contrast
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-contrast" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-dark">
        <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        Dark Mode
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-dark" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-invert">
        <svg viewBox="0 0 24 24"><path d="M11 21h2v-2h-2v2zm0-4h2v-2h-2v2zm0-12H9V3H7v2H5v2h2v2h2V7h2V5zm6 0h-2v2h2V5zm0 4h-2v2h2V9zm2-6v2h2V3h-2zm0 8h2V9h-2v2zm-8 10h2v-2h-2v2zm4 0h2v-2h-2v2zM19 3v2h2V3h-2zm0 8h2V9h-2v2zM3 21h8V11H3v10zM5 13h4v6H5v-6z"/></svg>
        Invert Colors
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-invert" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <p class="a11y-section-label">Color Blindness</p>
    <div class="a11y-themes">
      <button class="a11y-theme-btn active" data-theme="default" style="background:#f5f5f5;color:#333;">Default</button>
      <button class="a11y-theme-btn" data-theme="protanopia" style="background:#e8c46a;color:#222;">Protanopia</button>
      <button class="a11y-theme-btn" data-theme="deuteranopia" style="background:#6ab0e8;color:#111;">Deuteranopia</button>
      <button class="a11y-theme-btn" data-theme="tritanopia" style="background:#e86a6a;color:#fff;">Tritanopia</button>
    </div>

    <p class="a11y-section-label">Navigation</p>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-cursor">
        <svg viewBox="0 0 24 24"><path d="M4 0l16 12.279-6.955 1.803 4.584 8.72-1.784.937-4.508-8.570L4 19.795z"/></svg>
        Bigger Cursor
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-cursor" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-focus">
        <svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4h4v-2H5v-2zm14 0v2h-2v2h4v-4h-2zm-14-8V5H5V3H1v4h2zm14-2h2V3h-4v2h2zM12 4c-.55 0-1 .45-1 1v1.05c-2.28.47-4 2.48-4 4.95 0 2.47 1.72 4.48 4 4.95V17c0 .55.45 1 1 1s1-.45 1-1v-1.05c2.28-.47 4-2.48 4-4.95 0-2.47-1.72-4.48-4-4.95V5c0-.55-.45-1-1-1z"/></svg>
        Focus Highlight
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-focus" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-guide">
        <svg viewBox="0 0 24 24"><path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10z"/></svg>
        Reading Guide
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-guide-toggle" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-anim">
        <svg viewBox="0 0 24 24"><path d="M13 2.05V4.07c3.39.49 6 3.39 6 6.93 0 3.21-1.81 6-4.72 7.28L13 17v5l5-3-1.43-1.43A8.994 8.994 0 0 0 19 11c0-4.56-3.24-8.37-7.5-8.95L11 2.05h2zM11 2.05C6.74 2.62 3.5 6.43 3.5 11c0 2.68 1.17 5.09 3 6.77L5 19.25 10 22v-5l-1.28-1.28C7.36 14.67 6.5 12.93 6.5 11c0-3.54 2.61-6.44 6-6.93V2.05z"/></svg>
        Pause Animations
      </label>
      <label class="a11y-toggle"><input type="checkbox" id="a11y-anim" role="switch"><span class="a11y-toggle-slider"></span></label>
    </div>

    <button class="a11y-reset" id="a11y-reset">↺ Reset All Settings</button>
  </div>
  <a href="accessibility-statement.html" class="a11y-statement">View Accessibility Statement →</a>
</div>`;

  /* ── Inject into DOM ── */
  function inject() {
    const wrapper = document.createElement('div');
    wrapper.id = 'a11y-widget';
    wrapper.innerHTML = WIDGET_HTML;
    document.body.appendChild(wrapper);
  }

  /* ── Bind events ── */
  function bindEvents() {
    const launcher = document.getElementById('a11y-launcher');
    const panel    = document.getElementById('a11y-panel');
    const closeBtn = document.getElementById('a11y-close');

    /* Open/close */
    launcher?.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      launcher.setAttribute('aria-expanded', open);
      if (open) closeBtn?.focus();
    });
    closeBtn?.addEventListener('click', () => {
      panel.classList.remove('open');
      launcher.setAttribute('aria-expanded', 'false');
      launcher?.focus();
    });
    /* Close on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel?.classList.contains('open')) {
        panel.classList.remove('open');
        launcher.setAttribute('aria-expanded', 'false');
        launcher?.focus();
      }
    });

    /* Font size */
    document.getElementById('a11y-font-up')?.addEventListener('click', () => {
      if (state.fontSize < 160) { state.fontSize += 10; apply(); }
    });
    document.getElementById('a11y-font-down')?.addEventListener('click', () => {
      if (state.fontSize > 70) { state.fontSize -= 10; apply(); }
    });

    /* Toggle handlers */
    const toggleMap = {
      'a11y-contrast':    'highContrast',
      'a11y-dark':        'darkMode',
      'a11y-invert':      'invertColors',
      'a11y-readable':    'readableFont',
      'a11y-links':       'underlineLinks',
      'a11y-cursor':      'bigCursor',
      'a11y-focus':       'focusRing',
      'a11y-anim':        'pauseAnimations',
      'a11y-guide-toggle':'readingGuide',
    };
    for (const [id, key] of Object.entries(toggleMap)) {
      document.getElementById(id)?.addEventListener('change', function () {
        state[key] = this.checked;
        apply();
      });
    }

    /* Color blindness themes */
    document.querySelectorAll('.a11y-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.colorTheme = btn.dataset.theme;
        apply();
      });
    });

    /* Reset */
    document.getElementById('a11y-reset')?.addEventListener('click', () => {
      state = { ...defaults };
      apply();
    });

    /* Reading guide follows mouse */
    const guide = document.getElementById('a11y-guide');
    document.addEventListener('mousemove', e => {
      if (guide && state.readingGuide) {
        guide.style.top = (e.clientY - 20) + 'px';
      }
    });
  }

  /* ── Sync UI to state ── */
  function syncUI() {
    /* Font size display */
    const val = document.getElementById('a11y-font-val');
    if (val) val.textContent = state.fontSize + '%';

    /* Toggles */
    const toggleMap = {
      'a11y-contrast':    'highContrast',
      'a11y-dark':        'darkMode',
      'a11y-invert':      'invertColors',
      'a11y-readable':    'readableFont',
      'a11y-links':       'underlineLinks',
      'a11y-cursor':      'bigCursor',
      'a11y-focus':       'focusRing',
      'a11y-anim':        'pauseAnimations',
      'a11y-guide-toggle':'readingGuide',
    };
    for (const [id, key] of Object.entries(toggleMap)) {
      const el = document.getElementById(id);
      if (el) el.checked = state[key];
    }

    /* Theme buttons */
    document.querySelectorAll('.a11y-theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === state.colorTheme);
    });
  }

  /* ── Boot ── */
  load();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { inject(); bindEvents(); apply(); });
  } else {
    inject(); bindEvents(); apply();
  }

})();
