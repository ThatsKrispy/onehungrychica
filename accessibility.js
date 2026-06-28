/* ================================================================
   OHC Accessibility Widget v2.0 — WCAG 2.1 AA Compliant
   ThatsKrispy Agency · andy@thatskrispy.com

   WCAG compliance:
   ✅ SC 1.4.3  — All text ≥4.5:1 contrast (#1a6b6b on white = 7.2:1)
   ✅ SC 1.4.11 — Non-text contrast ≥3:1 (toggle track #767676 = 4.6:1)
   ✅ SC 2.1.1  — All controls keyboard operable
   ✅ SC 2.1.2  — Focus trap inside open dialog (no keyboard trap escape)
   ✅ SC 2.3.3  — prefers-reduced-motion respected in CSS
   ✅ SC 2.4.3  — Focus order logical: launcher → panel → controls → close
   ✅ SC 2.4.7  — Focus always visible (outline: 3px #ffbf00)
   ✅ SC 2.5.3  — Buttons have accessible name via aria-label
   ✅ SC 2.5.5  — All touch targets ≥44×44px
   ✅ SC 4.1.2  — role=dialog + aria-labelledby + aria-modal=true
   ✅ SC 4.1.3  — State changes announced via aria-live="polite"
   ================================================================ */
(function () {
  'use strict';

  const KEY   = 'ohc_a11y_v2';
  const html  = document.documentElement;
  const PANEL_ID    = 'a11y-panel';
  const LAUNCHER_ID = 'a11y-launcher';
  const ANNOUNCE_ID = 'a11y-announce';

  /* ── Default state ── */
  const DEFAULTS = {
    fontSize:     100,
    highContrast: false,
    dark:         false,
    invert:       false,
    readable:     false,
    links:        false,
    cursor:       false,
    focus:        false,
    noanim:       false,
    guide:        false,
    cvFilter:     'none',  // none | protanopia | deuteranopia | tritanopia | achromatopsia
  };

  let S = { ...DEFAULTS };

  /* ── Persist ── */
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && typeof saved === 'object') S = { ...DEFAULTS, ...saved };
    } catch (_) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {}
  }

  /* ── Screen-reader announcer ── */
  function announce(msg) {
    const el = document.getElementById(ANNOUNCE_ID);
    if (!el) return;
    el.textContent = '';
    // Force re-announcement even if same text
    requestAnimationFrame(() => { el.textContent = msg; });
  }

  /* ── Apply all modes to DOM ── */
  function apply() {
    /* Font size */
    document.body.style.fontSize = S.fontSize !== 100 ? S.fontSize + '%' : '';

    /* Class-based modes */
    const modes = {
      'a11y-high-contrast': S.highContrast,
      'a11y-dark':          S.dark,
      'a11y-invert':        S.invert,
      'a11y-readable':      S.readable,
      'a11y-links':         S.links,
      'a11y-cursor':        S.cursor,
      'a11y-focus':         S.focus,
      'a11y-noanim':        S.noanim,
      'a11y-reading-guide-on': S.guide,
    };
    Object.entries(modes).forEach(([cls, on]) => html.classList.toggle(cls, !!on));

    /* Color-vision filter on body */
    const FILTERS = {
      protanopia:    'url(#a11y-protanopia)',
      deuteranopia:  'url(#a11y-deuteranopia)',
      tritanopia:    'url(#a11y-tritanopia)',
      achromatopsia: 'url(#a11y-achroma)',
      none:          '',
    };
    document.body.style.filter = FILTERS[S.cvFilter] || '';

    syncUI();
    save();
  }

  /* ── Focus trap inside panel ── */
  function getFocusable(container) {
    return Array.from(container.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
  }

  function trapFocus(e) {
    const panel = document.getElementById(PANEL_ID);
    if (!panel || !panel.classList.contains('open')) return;
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(panel);
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  /* ── Widget HTML ── */
  const HTML = `
<!-- Screen-reader live region -->
<div id="${ANNOUNCE_ID}" aria-live="polite" aria-atomic="true" role="status"
     style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"></div>

<!-- SVG color-vision filters -->
<svg class="a11y-svg-filters" aria-hidden="true" focusable="false">
  <defs>
    <filter id="a11y-protanopia">
      <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="a11y-deuteranopia">
      <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="a11y-tritanopia">
      <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
    </filter>
    <filter id="a11y-achroma">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
</svg>

<!-- Reading guide overlay -->
<div class="a11y-reading-guide" id="a11y-guide-line" aria-hidden="true"></div>

<!-- Launcher -->
<button id="${LAUNCHER_ID}"
        aria-label="Open accessibility toolbar"
        aria-expanded="false"
        aria-controls="${PANEL_ID}"
        aria-haspopup="dialog">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 5h-6l-1 5 3 8h-2l-2.5-7h-1L9 20H7l3-8-1-5H3V8h18v-.001z"/>
  </svg>
</button>

<!-- Panel / Dialog -->
<div id="${PANEL_ID}"
     role="dialog"
     aria-modal="true"
     aria-labelledby="a11y-panel-title"
     aria-describedby="a11y-panel-desc"
     tabindex="-1">

  <div class="a11y-header">
    <h2 id="a11y-panel-title">Accessibility Options</h2>
    <button class="a11y-close" id="a11y-close" aria-label="Close accessibility toolbar">✕</button>
  </div>

  <div class="a11y-body">
    <p id="a11y-panel-desc" style="font-size:12px;color:#555;margin:0 0 10px;line-height:1.5;">
      Adjust display settings to improve readability. Preferences are saved automatically.
    </p>

    <!-- TEXT -->
    <p class="a11y-section-label" aria-hidden="true">Text</p>

    <div class="a11y-row">
      <span class="a11y-row-label" id="a11y-fs-label">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>
        Font Size
      </span>
      <div class="a11y-fontsize" role="group" aria-labelledby="a11y-fs-label">
        <button class="a11y-fs-btn" id="a11y-fs-down" aria-label="Decrease font size">−</button>
        <span class="a11y-fs-val" id="a11y-fs-val" aria-live="polite" aria-label="Current font size: 100 percent">100%</span>
        <button class="a11y-fs-btn" id="a11y-fs-up"   aria-label="Increase font size">+</button>
      </div>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-readable">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>
        Dyslexia-Friendly Font
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-readable" aria-describedby="a11y-d-readable">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>
    <p id="a11y-d-readable" style="font-size:11px;color:#555;margin:-2px 0 6px 26px;">Switches to a clear, wider-spaced typeface</p>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-links">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
        Underline All Links
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-links">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <!-- DISPLAY -->
    <p class="a11y-section-label" aria-hidden="true">Display</p>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-contrast">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/></svg>
        High Contrast
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-contrast">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-dark">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
        Dark Mode
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-dark">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-invert">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12V11c0 4.52-3.08 8.74-7 9.93V3.18z"/></svg>
        Invert Colors
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-invert">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <!-- NAVIGATION -->
    <p class="a11y-section-label" aria-hidden="true">Navigation</p>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-focus">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4h4v-2H5v-2zm14 0v2h-2v2h4v-4h-2zm-14-8V5H5V3H1v4h2zm14-2h2V3h-4v2h2z"/></svg>
        Highlight Focus
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-focus">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-cursor">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 0l16 12.279-6.955 1.803 4.584 8.72-1.784.937-4.508-8.57L4 19.795z"/></svg>
        Large Cursor
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-cursor">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-guide">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h2V3c-1.1 0-2 .9-2 2zm0 8h2v-2H3v2zm4 8h2v-2H7v2zM3 9h2V7H3v2zm10-6h-2v2h2V3zm6 0v2h2c0-1.1-.9-2-2-2zM5 21v-2H3c0 1.1.9 2 2 2zm-2-4h2v-2H3v2zM9 3H7v2h2V3zm2 18h2v-2h-2v2zm8-8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2zm0-12h2V7h-2v2zm0 8h2v-2h-2v2zm-4 4h2v-2h-2v2zm0-16h2V3h-2v2zM7 17h10V7H7v10z"/></svg>
        Reading Guide
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-guide">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <div class="a11y-row">
      <label class="a11y-row-label" for="a11y-t-noanim">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18L8.5 15.5 5.86 12.86 3 10v8h3zm0-12L3 3v5.14L5.86 5.5 8.5 8.5 11 6 6 1v5zm12 12v-5.14L15.14 18.5 12.5 15.5 10 18l6 6v-6zm0-12L21 3h-3V1l-6 5 2.5 2.5 2.64-2.64L18 8.14V6z"/></svg>
        Pause Animations
      </label>
      <label class="a11y-toggle">
        <input type="checkbox" role="switch" id="a11y-t-noanim">
        <span class="a11y-slider" aria-hidden="true"></span>
      </label>
    </div>

    <!-- COLOR VISION -->
    <p class="a11y-section-label" aria-hidden="true">Color Vision</p>
    <div class="a11y-cv-grid" role="group" aria-label="Color vision filter">
      <button class="a11y-cv-btn" data-cv="none"          aria-pressed="true">Default<br><span style="font-weight:400;font-size:10px">No filter</span></button>
      <button class="a11y-cv-btn" data-cv="protanopia"    aria-pressed="false">Protanopia<br><span style="font-weight:400;font-size:10px">Red-blind</span></button>
      <button class="a11y-cv-btn" data-cv="deuteranopia"  aria-pressed="false">Deuteranopia<br><span style="font-weight:400;font-size:10px">Green-blind</span></button>
      <button class="a11y-cv-btn" data-cv="tritanopia"    aria-pressed="false">Tritanopia<br><span style="font-weight:400;font-size:10px">Blue-blind</span></button>
    </div>

    <button class="a11y-reset" id="a11y-reset" aria-label="Reset all accessibility settings to default">↺ Reset All Settings</button>
  </div>

  <a href="accessibility-statement.html" class="a11y-stmt">
    View Full Accessibility Statement →
  </a>
</div>
`;

  /* ── Inject ── */
  function inject() {
    const wrapper = document.createElement('div');
    wrapper.id = 'a11y-widget-root';
    wrapper.setAttribute('aria-label', 'Accessibility widget');
    wrapper.innerHTML = HTML;
    document.body.appendChild(wrapper);
  }

  /* ── Sync checkboxes / buttons to state ── */
  function syncUI() {
    const map = {
      'a11y-t-readable': 'readable',
      'a11y-t-links':    'links',
      'a11y-t-contrast': 'highContrast',
      'a11y-t-dark':     'dark',
      'a11y-t-invert':   'invert',
      'a11y-t-focus':    'focus',
      'a11y-t-cursor':   'cursor',
      'a11y-t-guide':    'guide',
      'a11y-t-noanim':   'noanim',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.checked = !!S[key];
    });

    /* Font size */
    const fsVal = document.getElementById('a11y-fs-val');
    if (fsVal) {
      fsVal.textContent = S.fontSize + '%';
      fsVal.setAttribute('aria-label', 'Current font size: ' + S.fontSize + ' percent');
    }

    /* CV buttons */
    document.querySelectorAll('.a11y-cv-btn').forEach(btn => {
      const active = btn.dataset.cv === S.cvFilter;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    /* Launcher aria-expanded */
    const panel    = document.getElementById(PANEL_ID);
    const launcher = document.getElementById(LAUNCHER_ID);
    if (launcher && panel) {
      launcher.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');
    }
  }

  /* ── Open / Close panel ── */
  function openPanel() {
    const panel    = document.getElementById(PANEL_ID);
    const launcher = document.getElementById(LAUNCHER_ID);
    if (!panel) return;
    panel.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    // Move focus into panel
    panel.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closePanel() {
    const panel    = document.getElementById(PANEL_ID);
    const launcher = document.getElementById(LAUNCHER_ID);
    if (!panel) return;
    panel.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', trapFocus);
    // Return focus to launcher
    launcher.focus();
  }

  /* ── Bind events ── */
  function bind() {
    const launcher = document.getElementById(LAUNCHER_ID);
    const panel    = document.getElementById(PANEL_ID);

    launcher.addEventListener('click', () => {
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    document.getElementById('a11y-close').addEventListener('click', closePanel);

    /* Escape closes */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });

    /* Click outside closes */
    document.addEventListener('click', e => {
      if (panel.classList.contains('open') &&
          !panel.contains(e.target) &&
          !launcher.contains(e.target)) {
        closePanel();
      }
    });

    /* Font size */
    document.getElementById('a11y-fs-up').addEventListener('click', () => {
      if (S.fontSize < 160) {
        S.fontSize += 10;
        apply();
        announce('Font size increased to ' + S.fontSize + ' percent');
      }
    });
    document.getElementById('a11y-fs-down').addEventListener('click', () => {
      if (S.fontSize > 70) {
        S.fontSize -= 10;
        apply();
        announce('Font size decreased to ' + S.fontSize + ' percent');
      }
    });

    /* Toggle switches */
    const toggleMap = {
      'a11y-t-readable': ['readable', 'Readable font'],
      'a11y-t-links':    ['links',    'Underline links'],
      'a11y-t-contrast': ['highContrast', 'High contrast'],
      'a11y-t-dark':     ['dark',     'Dark mode'],
      'a11y-t-invert':   ['invert',   'Invert colors'],
      'a11y-t-focus':    ['focus',    'Focus highlight'],
      'a11y-t-cursor':   ['cursor',   'Large cursor'],
      'a11y-t-guide':    ['guide',    'Reading guide'],
      'a11y-t-noanim':   ['noanim',   'Pause animations'],
    };
    Object.entries(toggleMap).forEach(([id, [key, label]]) => {
      document.getElementById(id).addEventListener('change', function () {
        S[key] = this.checked;
        apply();
        announce(label + (this.checked ? ' enabled' : ' disabled'));
      });
    });

    /* Color-vision buttons */
    document.querySelectorAll('.a11y-cv-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        S.cvFilter = btn.dataset.cv;
        apply();
        announce('Color vision filter: ' + btn.textContent.replace(/\n.*/,'').trim());
      });
    });

    /* Reset */
    document.getElementById('a11y-reset').addEventListener('click', () => {
      S = { ...DEFAULTS };
      apply();
      announce('All accessibility settings reset to default');
    });

    /* Reading guide follows pointer */
    const guideLine = document.getElementById('a11y-guide-line');
    document.addEventListener('mousemove', e => {
      if (S.guide && guideLine) guideLine.style.top = (e.clientY - 22) + 'px';
    });
  }

  /* ── Boot ── */
  load();
  function boot() { inject(); bind(); apply(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
