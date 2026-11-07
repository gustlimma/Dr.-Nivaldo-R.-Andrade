/* Dr. Nivaldo R. Andrade - interações */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ===== Telefone do consultório: troque aqui se necessário ===== */
  var PHONE = '+551146522957';
  document.querySelectorAll('[data-call]').forEach(function (a) { a.href = 'tel:' + PHONE; });

  /* ===== Menu mobile ===== */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function toggleMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function () {
    toggleMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  /* ===== Cabeçalho ao rolar ===== */
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== FAQ expansível ===== */
  document.querySelectorAll('.acc__b').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.acc__b').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = null;
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
      }
    });
  });

  /* ===== Animações de entrada ===== */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ===== Galeria: mostra o espaço reservado se a foto ainda não existir ===== */
  document.querySelectorAll('.shot img').forEach(function (img) {
    function empty() { img.parentElement.classList.add('is-empty'); }
    img.addEventListener('error', empty);
    if (img.complete && img.naturalWidth === 0) empty();
  });

  /* ===== Galeria: zoom ao clicar na foto ===== */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var current = 0;
  function visibleShots() { return shots.filter(function (s) { return !s.classList.contains('is-empty'); }); }
  function show(i) {
    var list = visibleShots();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var img = list[current].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
  }
  function openLb(shot) {
    var list = visibleShots();
    show(list.indexOf(shot));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  shots.forEach(function (shot) {
    shot.addEventListener('click', function () { if (!shot.classList.contains('is-empty')) openLb(shot); });
    shot.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && !shot.classList.contains('is-empty')) { e.preventDefault(); openLb(shot); }
    });
  });
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
