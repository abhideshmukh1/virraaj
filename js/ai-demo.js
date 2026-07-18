/* =========================================================
   VIRRAAJ AI Demo – Interactive JavaScript
   ========================================================= */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Menu Recommendation Engine Demo ─────────────────── */

  // Dish database keyed by preference tags
  const dishes = [
    { name: 'Burrata Chaat',           prefs: ['vegetarian', 'light', 'mild'],      score: 95 },
    { name: 'Dahi Kebab',              prefs: ['vegetarian', 'mild'],               score: 92 },
    { name: 'Dal Makhani Risotto',     prefs: ['vegetarian', 'indulgent'],          score: 88 },
    { name: 'Paneer Royale',           prefs: ['vegetarian', 'spicy', 'indulgent'], score: 90 },
    { name: 'Mango Soufflé',           prefs: ['vegetarian', 'light', 'mild'],      score: 87 },
    { name: 'Scallop Tikka',           prefs: ['seafood', 'spicy', 'light'],        score: 96 },
    { name: 'Wild Sea Bass',           prefs: ['seafood', 'mild', 'light'],         score: 93 },
    { name: 'Lamb Rogan Josh Wellington', prefs: ['indulgent', 'spicy'],            score: 97 },
    { name: 'Foie Gras Keema',         prefs: ['indulgent'],                        score: 94 },
    { name: 'Mulligatawny Velouté',    prefs: ['mild', 'light'],                    score: 85 },
  ];

  const selectedPrefs = new Set();

  // Toggle pref tags
  $$('.pref-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const pref = tag.dataset.pref;
      if (selectedPrefs.has(pref)) {
        selectedPrefs.delete(pref);
        tag.classList.remove('selected');
        tag.setAttribute('aria-pressed', 'false');
      } else {
        selectedPrefs.add(pref);
        tag.classList.add('selected');
        tag.setAttribute('aria-pressed', 'true');
      }
    });
  });

  function recommend() {
    const results = $('#rec-results');
    if (!results) return;
    results.innerHTML = '';

    let ranked;
    if (selectedPrefs.size === 0) {
      // If no preference, return top-scored overall
      ranked = [...dishes].sort((a, b) => b.score - a.score).slice(0, 4);
    } else {
      ranked = dishes
        .map(d => {
          const matches = d.prefs.filter(p => selectedPrefs.has(p)).length;
          return { ...d, matches };
        })
        .filter(d => d.matches > 0)
        .sort((a, b) => b.matches - a.matches || b.score - a.score)
        .slice(0, 4);
    }

    if (ranked.length === 0) {
      results.innerHTML = '<p style="font-size:0.85rem;color:var(--color-text-muted);">No dishes matched your preferences. Try a different combination!</p>';
      return;
    }

    ranked.forEach((dish, i) => {
      const item = document.createElement('div');
      item.className = 'rec-item';
      item.setAttribute('role', 'listitem');

      const matchPct = selectedPrefs.size > 0
        ? Math.round((dish.matches / selectedPrefs.size) * 100)
        : dish.score;

      item.innerHTML = `
        <span class="rec-item-name">${dish.name}</span>
        <span class="rec-item-score">Match ${matchPct}%</span>
      `;
      results.appendChild(item);

      // Staggered reveal animation
      setTimeout(() => item.classList.add('visible'), i * 120 + 60);
    });
  }

  $('#rec-btn')?.addEventListener('click', recommend);

  /* ── Sentiment Analysis Demo ──────────────────────────── */

  const sentimentResult = $('#sentiment-result');
  const barPos  = $('#bar-pos');
  const barNeu  = $('#bar-neu');
  const barNeg  = $('#bar-neg');
  const pctPos  = $('#pct-pos');
  const pctNeu  = $('#pct-neu');
  const pctNeg  = $('#pct-neg');
  const summary = $('#sentiment-summary');

  $$('.review-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      // Mark active
      $$('.review-sample').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const pos = parseInt(btn.dataset.pos, 10);
      const neu = parseInt(btn.dataset.neu, 10);
      const neg = parseInt(btn.dataset.neg, 10);
      const sum = btn.dataset.summary;

      // Reset bars first
      if (barPos) { barPos.style.width = '0'; }
      if (barNeu) { barNeu.style.width = '0'; }
      if (barNeg) { barNeg.style.width = '0'; }

      sentimentResult?.classList.add('show');

      // Animate bars after a brief reset
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (barPos) { barPos.style.width = `${pos}%`; }
          if (barNeu) { barNeu.style.width = `${neu}%`; }
          if (barNeg) { barNeg.style.width = `${neg}%`; }
          if (pctPos) { pctPos.textContent = `${pos}%`; }
          if (pctNeu) { pctNeu.textContent = `${neu}%`; }
          if (pctNeg) { pctNeg.textContent = `${neg}%`; }
          if (summary) { summary.textContent = `AI insight: ${sum}`; }
        });
      });
    });
  });

  /* ── Scroll-reveal (shared with main.js but re-init for this page's cards) ── */
  if ('IntersectionObserver' in window) {
    const els = $$('.uc-card, .timeline-item, .demo-panel, .arch-layer');
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }

})();
