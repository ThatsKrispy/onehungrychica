/* One Hungry Chica — main.js v3.0 */

/* ── MOBILE NAV ── */
const toggle = document.querySelector('.mobile-toggle');
const nav = document.getElementById('siteNav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? '✕' : '☰';
  });
}

/* ── SEARCH BAR ── */
const searchTrigger = document.querySelector('.nav-search');
const searchBar = document.querySelector('.search-bar');
if (searchTrigger && searchBar) {
  searchTrigger.addEventListener('click', () => {
    const open = searchBar.classList.toggle('open');
    if (open) searchBar.querySelector('input').focus();
  });
  searchBar.querySelector('button')?.addEventListener('click', () => {
    const q = searchBar.querySelector('input')?.value?.trim();
    if (q) window.location.href = `recipes.html?q=${encodeURIComponent(q)}`;
  });
}

/* ── RECIPE FILTER (recipes.html) ── */
const filterBtns = document.querySelectorAll('.filter-tag');
const cards = document.querySelectorAll('.ra-card');
if (filterBtns.length && cards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
  // URL param support
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    const q = params.get('q').toLowerCase();
    cards.forEach(card => {
      const title = card.querySelector('.ra-card-title')?.textContent?.toLowerCase() || '';
      card.style.display = title.includes(q) ? '' : 'none';
    });
  }
}

/* ── COOKIE CONSENT ── */
(function() {
  const CONSENT_KEY = 'ohc_consent_v1';
  const banner = document.getElementById('ohc-consent');
  const modal  = document.getElementById('ohc-consent-modal');
  if (!banner) return;

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch(e) { return null; }
  }
  function saveConsent(prefs) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({...prefs, ts: Date.now()})); } catch(e) {}
  }
  function applyConsent(prefs) {
    // Fire GA only if analytics accepted
    if (prefs.analytics && typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
    }
    banner.classList.remove('show');
    banner.setAttribute('aria-hidden', 'true');
  }
  function closeBanner() { banner.classList.remove('show'); }

  // Show banner if no consent stored
  const existing = getConsent();
  if (!existing) {
    setTimeout(() => { banner.classList.add('show'); banner.removeAttribute('aria-hidden'); }, 800);
  } else {
    applyConsent(existing);
  }

  // Accept all
  document.getElementById('consent-accept-all')?.addEventListener('click', () => {
    const prefs = { essential: true, analytics: true };
    saveConsent(prefs);
    applyConsent(prefs);
  });

  // Decline non-essential
  document.getElementById('consent-decline')?.addEventListener('click', () => {
    const prefs = { essential: true, analytics: false };
    saveConsent(prefs);
    applyConsent(prefs);
    closeBanner();
  });

  // Open settings modal
  document.getElementById('consent-settings-btn')?.addEventListener('click', () => {
    if (modal) { modal.classList.add('open'); modal.querySelector('button')?.focus(); }
  });

  // Close modal on backdrop click
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  // Accept all in modal
  document.getElementById('consent-modal-accept-all')?.addEventListener('click', () => {
    const prefs = { essential: true, analytics: true };
    saveConsent(prefs);
    applyConsent(prefs);
    modal.classList.remove('open');
  });

  // Save preferences in modal
  document.getElementById('consent-modal-save')?.addEventListener('click', () => {
    const analyticsToggle = document.getElementById('toggle-analytics');
    const prefs = { essential: true, analytics: analyticsToggle?.checked || false };
    saveConsent(prefs);
    applyConsent(prefs);
    modal.classList.remove('open');
  });
})();

/* ── NEWSLETTER FORM ── */
document.querySelectorAll('.sub-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.newsletter-widget')?.querySelector('input[type="email"]');
    if (!input?.value?.includes('@')) {
      input?.focus();
      return;
    }
    btn.textContent = 'Subscribed! 🎉';
    btn.disabled = true;
    if (input) input.value = '';
  });
});

/* ── CONTACT FORM ── */
document.querySelector('.cf-submit')?.addEventListener('click', e => {
  const btn = e.currentTarget;
  const form = btn.closest('.contact-form');
  const subject = form?.querySelector('#cf-subject')?.value?.trim();
  const email   = form?.querySelector('#cf-email')?.value?.trim();
  const msg     = form?.querySelector('#cf-message')?.value?.trim();
  if (!subject || !email || !msg) { alert('Please fill in all required fields.'); return; }
  btn.textContent = 'Message Sent! ✓';
  btn.disabled = true;
  btn.style.background = '#5a9;';
});
