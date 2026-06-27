/* ============================================================
   NOVA INSTITUTE OF DIGITAL EXCELLENCE — script.js
   ============================================================ */

'use strict';

// ---------- Page Loader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hide');
  }, 1700);
});

// ---------- Scroll Progress ----------
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

// ---------- Navbar Scroll ----------
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---------- Active Nav Link ----------
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const observerOptions = { rootMargin: '-40% 0px -55% 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, observerOptions);
sections.forEach(s => observer.observe(s));



// ---------- Counter Animation ----------
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;
  const suffix = el.dataset.suffix || '';
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ---------- Testimonial Slider ----------
const track  = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let autoSlide;
function goTo(idx) {
  current = (idx + slides.length) % slides.length;
  if (track) track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}
function startAuto() { autoSlide = setInterval(() => goTo(current + 1), 5000); }
function stopAuto()  { clearInterval(autoSlide); }

document.querySelector('.prev-btn')?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
document.querySelector('.next-btn')?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
startAuto();

// ---------- FAQ Accordion ----------
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = '0px';
    });
    // toggle clicked
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ---------- Form Validation ----------
const form = document.getElementById('admission-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'f-name',    msg: 'name-err',   check: v => v.trim().length >= 2 },
      { id: 'f-email',   msg: 'email-err',  check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'f-phone',   msg: 'phone-err',  check: v => /^[6-9]\d{9}$/.test(v.trim()) },
      { id: 'f-course',  msg: 'course-err', check: v => v !== '' },
      { id: 'f-message', msg: 'msg-err',    check: v => v.trim().length >= 10 },
    ];

    fields.forEach(({ id, msg, check }) => {
      const input = document.getElementById(id);
      const err   = document.getElementById(msg);
      if (!input || !err) return;
      const ok = check(input.value);
      input.classList.toggle('error', !ok);
      err.classList.toggle('show', !ok);
      if (!ok) valid = false;
    });

    if (valid) {
      form.style.display = 'none';
      document.getElementById('form-success').classList.add('show');
    }
  });

  // Live clear errors
  form.querySelectorAll('.form-control-nova').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errId = input.id.replace('f-', '') + '-err';
      document.getElementById(errId)?.classList.remove('show');
    });
  });
}

// ---------- Back to Top ----------
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backBtn?.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Smooth Scroll for anchors ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav
      const toggler = document.querySelector('.navbar-collapse');
      if (toggler?.classList.contains('show')) {
        document.querySelector('.navbar-toggler')?.click();
      }
    }
  });
});

// ---------- AOS Init ----------
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
}

// ---------- Card hover tilt (subtle) ----------
document.querySelectorAll('.program-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease, box-shadow .3s ease';
  });
});
