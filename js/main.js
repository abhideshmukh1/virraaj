/* =========================================================
   VIRRAAJ – Main JavaScript
   ========================================================= */

(function () {
  'use strict';

  /* ── Helpers ────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Sticky navbar ──────────────────────────────────── */
  const navbar = $('#navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu toggle ─────────────────────────────── */
  const navToggle = $('#nav-toggle');
  const navMenu   = $('#nav-menu');

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle?.focus();
    }
  });

  /* ── Menu tabs ──────────────────────────────────────── */
  const tabs   = $$('.menu-tab');
  const panels = $$('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');

      // Update tabs
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      // Update panels
      panels.forEach(panel => {
        const show = panel.id === targetId;
        panel.classList.toggle('active', show);
        panel.hidden = !show;
      });
    });

    // Keyboard: left/right arrow navigation between tabs
    tab.addEventListener('keydown', e => {
      const idx = tabs.indexOf(tab);
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      if (e.key === 'ArrowLeft')  next = tabs[(idx - 1 + tabs.length) % tabs.length];
      if (next) { next.focus(); next.click(); }
    });
  });

  /* ── Reservation form ───────────────────────────────── */
  const form    = $('#reservation-form');
  const success = $('#form-success');
  const error   = $('#form-error');

  // Set minimum date to today
  const dateInput = $('#res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    error.hidden  = true;
    success.hidden = true;

    const required = $$('[required]', form);
    const invalid  = required.filter(el => !el.value.trim());

    if (invalid.length > 0) {
      error.hidden = false;
      invalid[0].focus();
      error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Simulate async submission (prototype — replace with real API call)
    const btn = $('[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = 'Confirming…';

    setTimeout(() => {
      success.hidden = false;
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Confirm Reservation';
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });

  /* ── AI Chat concierge ──────────────────────────────── */
  const launcher    = $('#ai-chat-launcher');
  const chatWindow  = $('#ai-chat-window');
  const closeBtn    = $('#ai-chat-close');
  const chatInput   = $('#ai-chat-input');
  const sendBtn     = $('#ai-chat-send');
  const chatBody    = $('#ai-chat-body');

  // Canned AI responses (prototype — replace with real LLM/API call)
  const responses = {
    reservation: [
      "I'd be happy to help with a reservation! Please scroll to the <a href='#reservations'>Reserve a Table</a> section, or call us on <strong>+91 22 6123 4567</strong>. We're open Tue–Sun for lunch and dinner. 🙏",
    ],
    menu: [
      "Our menu celebrates India's culinary heritage with a modern twist. Highlights include our <strong>7-course Tasting Menu</strong> (₹4,800 per person) and à la carte options like the <strong>Scallop Tikka</strong> and <strong>Lamb Rogan Josh Wellington</strong>. Would you like a recommendation based on your preferences?",
    ],
    veg: [
      "Absolutely! We have wonderful vegetarian options — from <strong>Burrata Chaat</strong> and <strong>Dahi Kebab</strong> starters to the <strong>Dal Makhani Risotto</strong> and <strong>Paneer Royale</strong> mains. All vegetarian dishes are marked with a V on our menu. 🌿",
    ],
    allergy: [
      "Your safety is our priority. Please mention any allergies or dietary requirements in the <em>Special Occasion / Dietary Notes</em> field when booking, and our chef's team will ensure a safe and delightful experience. You can also call us to speak with our team directly.",
    ],
    hours: [
      "<strong>Opening Hours:</strong><br/>Tue–Thu: Lunch 12:00–15:00, Dinner 19:00–23:00<br/>Fri–Sat: Lunch 12:00–15:30, Dinner 19:00–23:30<br/>Sun: Brunch 11:00–15:00<br/>Mon: Closed 🙏",
    ],
    location: [
      "We're located at <strong>42, Empress Road, Bandra West, Mumbai 400050</strong>. We're about 10 minutes from Bandra railway station. Valet parking is available.",
    ],
    default: [
      "That's a wonderful question! For the most accurate answer, please contact our team at <a href='mailto:reservations@virraaj.in'>reservations@virraaj.in</a> or call <a href='tel:+912261234567'>+91 22 6123 4567</a>. We'd love to assist you personally. 🙏",
      "Thank you for reaching out! Our team would be delighted to help. You can email us at <a href='mailto:reservations@virraaj.in'>reservations@virraaj.in</a> or call <a href='tel:+912261234567'>+91 22 6123 4567</a>.",
    ],
  };

  let defaultResponseIndex = 0;

  function getResponse(message) {
    const lower = message.toLowerCase();
    if (/reserv|book|table|seat/.test(lower))          return responses.reservation[0];
    if (/veg|vegetar|vegan|plant/.test(lower))         return responses.veg[0];
    if (/allerg|gluten|nut|dairy|intoleran/.test(lower)) return responses.allergy[0];
    if (/menu|dish|food|eat|course|tasting/.test(lower)) return responses.menu[0];
    if (/hour|open|time|when/.test(lower))              return responses.hours[0];
    if (/location|address|where|find|parking/.test(lower)) return responses.location[0];
    const def = responses.default[defaultResponseIndex % responses.default.length];
    defaultResponseIndex++;
    return def;
  }

  function appendMessage(html, role) {
    const div = document.createElement('div');
    div.className = `ai-message ai-message--${role}`;
    div.innerHTML = html;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return div;
  }

  function showTyping() {
    const dot = document.createElement('div');
    dot.className = 'ai-message ai-message--bot ai-message--typing';
    dot.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(dot);
    chatBody.scrollTop = chatBody.scrollHeight;
    return dot;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    sendBtn.disabled = true;

    const typing = showTyping();
    const delay  = 800 + Math.random() * 600;

    setTimeout(() => {
      typing.remove();
      appendMessage(getResponse(text), 'bot');
      chatInput.disabled = false;
      sendBtn.disabled  = false;
      chatInput.focus();
    }, delay);
  }

  launcher?.addEventListener('click', () => {
    chatWindow.hidden = false;
    chatInput?.focus();
    launcher.setAttribute('aria-expanded', 'true');
  });

  closeBtn?.addEventListener('click', () => {
    chatWindow.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  });

  sendBtn?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Trap focus inside chat window when open
  chatWindow?.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = $$('button, input, a[href]', chatWindow);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ── Scroll-reveal animation ────────────────────────── */
  if ('IntersectionObserver' in window) {
    const revealEls = $$('.event-card, .stat, .course, .dish, .gallery-item, .uc-card, .timeline-item');

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

})();
