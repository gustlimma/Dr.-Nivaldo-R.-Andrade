/* Dr. Nivaldo R. Andrade - interações */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ===== WhatsApp do consultório (DDI+DDD+número, só dígitos): troque aqui se necessário ===== */
  var WA_NUMBER = '5511996462513';
  var WA_TEXT = 'Olá! Gostaria de agendar uma consulta com o Dr. Nivaldo.';
  document.querySelectorAll('[data-call]').forEach(function (a) {
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
    a.target = '_blank';
    a.rel = 'noopener';
  });

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
  document.querySelectorAll('.shot img, .card__img img').forEach(function (img) {
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

  /* ===== Especialidades: galeria de trabalhos de cada card =====
     Fotos de cada serviço n (pasta IMG/IMG2): servico{n}-1.jpg, servico{n}-2.jpg, servico{n}-3.jpg, servico{n}-4.jpg */
  var svc = document.getElementById('svc');
  var svcImg = document.getElementById('svcImg');
  var svcPh = document.getElementById('svcPh');
  var svcThumbs = document.getElementById('svcThumbs');
  var svcSlots = [], svcOk = [], svcOrder = [], svcPos = 0, svcToken = 0, svcOpener = null;

  function svcSrcs(n) {
    return [1, 2, 3, 4].map(function (k) { return 'IMG/IMG2/servico' + n + '-' + k + '.jpg'; });
  }
  function probe(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.onload = function () { resolve(true); };
      im.onerror = function () { resolve(false); };
      im.src = src;
    });
  }
  function svcSelect(pos) {
    svcPos = (pos + svcOrder.length) % svcOrder.length;
    var i = svcOrder[svcPos];
    if (svcOk[i]) {
      svcImg.src = svcSlots[i];
      svcImg.alt = document.getElementById('svcTitle').textContent + ' - foto ' + (i + 1);
      svcImg.style.display = 'block';
      svcPh.style.display = 'none';
    } else {
      svcImg.style.display = 'none';
      document.getElementById('svcPhTxt').textContent = svcSlots[i];
      svcPh.style.display = 'flex';
    }
    Array.prototype.forEach.call(svcThumbs.children, function (t, k) { t.classList.toggle('on', k === svcPos); });
    var many = svcOrder.length > 1;
    document.getElementById('svcPrev').style.display = many ? '' : 'none';
    document.getElementById('svcNext').style.display = many ? '' : 'none';
  }
  function openSvc(card, opener) {
    var n = card.getAttribute('data-svc');
    var token = ++svcToken;
    svcOpener = opener;
    document.getElementById('svcTitle').textContent = card.querySelector('h3').textContent;
    document.getElementById('svcDesc').textContent = card.querySelector('p').textContent;
    svcSlots = svcSrcs(n);
    svc.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('svcClose').focus();
    Promise.all(svcSlots.map(probe)).then(function (ok) {
      if (token !== svcToken) return;
      svcOk = ok;
      var any = ok.some(Boolean);
      svcOrder = [];
      ok.forEach(function (v, i) { if (v || !any) svcOrder.push(i); });
      svcThumbs.innerHTML = '';
      svcOrder.forEach(function (i, k) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
        if (ok[i]) { var t = document.createElement('img'); t.src = svcSlots[i]; t.alt = ''; b.appendChild(t); }
        else { b.className = 'empty'; b.textContent = 'Foto ' + (i + 1); }
        b.addEventListener('click', function () { svcSelect(k); });
        svcThumbs.appendChild(b);
      });
      svcSelect(0);
    });
  }
  function closeSvc() {
    svc.hidden = true;
    svcToken++;
    document.body.style.overflow = '';
    if (svcOpener) svcOpener.focus();
  }
  document.querySelectorAll('.card[data-svc]').forEach(function (card) {
    var btn = card.querySelector('[data-open]');
    btn.addEventListener('click', function () { openSvc(card, btn); });
    card.querySelector('.card__img').addEventListener('click', function () { openSvc(card, btn); });
  });
  document.getElementById('svcClose').addEventListener('click', closeSvc);
  document.getElementById('svcPrev').addEventListener('click', function () { svcSelect(svcPos - 1); });
  document.getElementById('svcNext').addEventListener('click', function () { svcSelect(svcPos + 1); });
  svc.addEventListener('click', function (e) { if (e.target === svc) closeSvc(); });
  svc.querySelector('.svc__cta').addEventListener('click', closeSvc);
  document.addEventListener('keydown', function (e) {
    if (svc.hidden) return;
    if (e.key === 'Escape') closeSvc();
    if (e.key === 'ArrowLeft') svcSelect(svcPos - 1);
    if (e.key === 'ArrowRight') svcSelect(svcPos + 1);
  });
})();
