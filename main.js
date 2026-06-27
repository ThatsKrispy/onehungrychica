/* ============================================
   ONE HUNGRY CHICA — main.js
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector('.mobile-toggle');
  var nav    = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  /* ── Search toggle ── */
  var searchTrigger = document.querySelector('.nav-search');
  var searchBar     = document.querySelector('.search-bar');
  if (searchTrigger && searchBar) {
    searchTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open')) {
        searchBar.querySelector('input').focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!searchBar.contains(e.target) && e.target !== searchTrigger) {
        searchBar.classList.remove('open');
      }
    });
    searchBar.querySelector('input').addEventListener('keydown', function (e) {
      if (e.key === 'Escape') searchBar.classList.remove('open');
    });
  }

  /* ── Recipe category filter (recipes.html) ── */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var raCards    = document.querySelectorAll('.ra-card[data-cat]');
  if (filterBtns.length && raCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var val = btn.dataset.filter;
        raCards.forEach(function (card) {
          if (val === 'all' || card.dataset.cat === val) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Newsletter mock submit ── */
  var subBtn = document.querySelector('.sub-btn');
  if (subBtn) {
    subBtn.addEventListener('click', function () {
      var email = document.querySelector('.nw-email');
      if (email && email.value.includes('@')) {
        subBtn.textContent = 'Subscribed! ✓';
        subBtn.style.background = '#3BBFBF';
        subBtn.style.color = '#fff';
        subBtn.style.borderColor = '#3BBFBF';
        email.value = '';
      } else if (email) {
        email.style.borderColor = '#E88A8A';
        email.placeholder = 'Please enter a valid email';
      }
    });
  }

  /* ── Contact form mock submit ── */
  var cfSubmit = document.querySelector('.cf-submit');
  if (cfSubmit) {
    cfSubmit.addEventListener('click', function () {
      cfSubmit.textContent = 'Message Sent! ✓';
      cfSubmit.style.background = '#2da0a0';
    });
  }

  /* ── Highlight active nav link by current filename ── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a[href]').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

});
