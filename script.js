// Hero reel: start where the fire comes in (the sequence opens on near-black embers), and a sound toggle.
const reel = document.querySelector('#reel');
const reelSound = document.querySelector('#reelSound');
if (reel) {
  const skipDarkOpening = () => { if (reel.currentTime < 2.2) reel.currentTime = 2.2; };
  if (reel.readyState >= 1) skipDarkOpening(); else reel.addEventListener('loadedmetadata', skipDarkOpening, { once: true });
}
if (reel && reelSound) {
  reelSound.addEventListener('click', () => {
    reel.muted = !reel.muted;
    if (!reel.muted) reel.play();
    reelSound.textContent = reel.muted ? 'Sound off' : 'Sound on';
    reelSound.setAttribute('aria-pressed', String(!reel.muted));
  });
}

// Contact: submit to Formspree without leaving the page; plain POST still works without JS.
const form = document.querySelector('#contactForm');
const status = document.querySelector('#formStatus');
if (form && status) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = 'Thanks — your note is on its way.';
    } catch {
      status.classList.add('error');
      status.textContent = 'That didn’t send. Please try again, or reach me on LinkedIn.';
    } finally {
      button.disabled = false;
    }
  });
}

// Archive: Index (ruled list) or Grid (contact sheet) — the same entries, restyled.
const archive = document.querySelector('main[data-view]');
const toggle = document.querySelector('.view-toggle');
if (archive && toggle) {
  const setView = view => {
    archive.dataset.view = view;
    toggle.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    try { localStorage.setItem('archive-view-v2', view); } catch {}
  };
  toggle.addEventListener('click', e => {
    const b = e.target.closest('button[data-view]');
    if (b) setView(b.dataset.view);
  });
  let saved = null;
  try { saved = localStorage.getItem('archive-view-v2'); } catch {}
  if (saved === 'list' || saved === 'grid') setView(saved);
}

// Desk: "loose pages from the desk" is a small sandbox.
// Phones: tap a page to pick it up and look closer.
// Tablets and up: a row of supplies sits in the folder — a tin of pins, a tape dispenser, a pad of sticky notes,
// a rubber stamp and a wastebasket. Pull things off them and drop them on the pages. With a mouse the pages
// themselves can be dragged (they swing from where they're held and slide when thrown); tape holds a page until
// it's pulled hard enough to peel; one pin lets a page turn around it, two hold it still.
const desk = document.querySelector('.desk');
if (desk) {
  const sandbox = true;
  const mouse = matchMedia('(pointer:fine)').matches;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const turn = (x, y, d) => { const a = d * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; };
  const baseTurn = el => { const m = new DOMMatrix(getComputedStyle(el).transform); return Math.atan2(m.b, m.a) * 180 / Math.PI; };
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  let top = 10;

  const help = document.createElement('p');
  help.className = 'vh';
  help.id = 'deskHelp';
  help.textContent = sandbox
    ? 'Press Enter to look closer. Arrow keys move the page; P pins it, T tapes it; press again to undo.'
    : 'Press Enter to look closer.';
  desk.appendChild(help);

  const pages = new Map();
  const adopt = el => {
    pages.set(el, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 });
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-describedby', 'deskHelp');
  };
  const scraps = [...desk.querySelectorAll('.scrap')];
  const originalTape = new Map(scraps.map(el => [el, [...el.querySelectorAll(':scope > .tape')].map(n => n.cloneNode(true))]));
  scraps.forEach((el, i) => { adopt(el); el.style.setProperty('--i', i); });
  const angleOf = el => baseTurn(el) + (pages.get(el)?.r || 0);
  const draw = (el, s) => { el.style.translate = `${s.x}px ${s.y}px`; el.style.rotate = `${s.r}deg`; };
  const raise = el => el.style.setProperty('z-index', ++top, 'important');
  const capture = e => { try { desk.setPointerCapture(e.pointerId); } catch {} };
  const things = (el, kind) => [...el.querySelectorAll(`:scope > .thing-${kind}`)];

  // ---------- look closer ----------
  let looking = null;
  const look = el => {
    if (looking) return;
    const r = el.getBoundingClientRect();
    const img = el.querySelector('img');
    const w = el.offsetWidth, h = el.offsetHeight;
    // as large as the screen allows, but never past the scan's own resolution
    const sharp = img ? img.naturalWidth / img.offsetWidth : 2.4;
    const s = Math.max(1, Math.min(innerWidth * .86 / w, innerHeight * .84 / h, sharp));
    const left = r.left + r.width / 2 - w / 2, top0 = r.top + r.height / 2 - h / 2;
    const layer = document.createElement('div');
    layer.className = 'desk-look desk';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-label', img?.alt || el.querySelector('h3')?.textContent || 'Page');
    layer.tabIndex = -1;
    const copy = el.cloneNode(true);
    copy.removeAttribute('tabindex'); copy.removeAttribute('role'); copy.removeAttribute('aria-describedby');
    copy.classList.add('look-page');
    Object.assign(copy.style, { left: left + 'px', top: top0 + 'px', width: w + 'px', height: h + 'px', translate: 'none', rotate: 'none' });
    layer.append(copy);
    document.body.append(layer);
    const from = `translate(0px,0px) rotate(${angleOf(el)}deg) scale(1)`;
    const to = `translate(${innerWidth / 2 - (left + w / 2)}px,${innerHeight / 2 - (top0 + h / 2)}px) rotate(0deg) scale(${s})`;
    copy.style.transform = to;
    el.style.visibility = 'hidden';
    if (!calm) {
      copy.animate([{ transform: from }, { transform: to }], { duration: 560, easing: 'cubic-bezier(.2,.9,.25,1.04)' });
      layer.animate([{ backgroundColor: 'rgba(23,20,15,0)' }, {}], { duration: 380, easing: 'ease-out' });
    }
    layer.focus();
    const close = () => {
      if (!looking) return;
      looking = null;
      const done = () => { layer.remove(); el.style.visibility = ''; el.focus({ preventScroll: true }); };
      if (calm) return done();
      copy.animate([{ transform: to }, { transform: from }], { duration: 440, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
      layer.animate([{}, { backgroundColor: 'rgba(23,20,15,0)' }], { duration: 440, fill: 'forwards' }).finished.then(done);
    };
    layer.addEventListener('click', close);
    layer.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); } });
    addEventListener('scroll', close, { once: true, passive: true });
    looking = close;
  };

  if (!sandbox) {
    scraps.forEach(el => {
      el.addEventListener('click', () => look(el));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); look(el); } });
    });
  } else {
    desk.classList.add('is-sandbox');

    // ---------- supplies ----------
    // stamp faces: words already on the desk, the hero's ink star, the postcard's postmark
    // four rubber stamps, and an ink pad whose colour changes when it's clicked on its own
    const faces = ['keep', 'delete', 'progress', 'change'];
    const faceArt = { keep: 'KEEP', delete: 'DELETE', progress: 'IN PROGRESS', change: 'CHANGE' };
    const faceLabel = { keep: 'KEEP', delete: 'DELETE', progress: 'IN<br>PROGRESS', change: 'CHANGE' };
    const inks = ['#8f2e1a', '#203a6b', '#2e5a3a', '#5b3a7c', '#1f1d1a'];
    let inkIndex = 0;
    const shelf = document.createElement('div');
    shelf.className = 'desk-supplies';
    shelf.innerHTML = `
      <span class="supply supply-pins" data-supply="pin" aria-hidden="true"><i class="tin-pin pin-oxblood"></i><i class="tin-pin pin-mustard"></i><i class="tin-pin pin-sage"></i><i class="tin-pin pin-ink"></i></span>
      <span class="supply supply-tape" data-supply="tape" aria-hidden="true"><i class="tape-roll"></i><i class="tape-lip"></i></span>
      <span class="supply supply-notes" data-supply="note" aria-hidden="true"></span>
      <span class="supply supply-ink" aria-hidden="true" style="--felt:${inks[0]}"><i class="ink-felt"></i></span>
      <span class="supply-stamps" aria-hidden="true">${faces.map(f => `<span class="supply stamp-pick" data-face="${f}"><i class="stamp-knob"></i><i class="stamp-block"><b class="stamp-face">${faceLabel[f]}</b></i></span>`).join('')}</span>
      <span class="mug-spot" aria-hidden="true"></span>
      <span class="supply supply-bin" aria-hidden="true"><i class="bin-rim"></i><span class="bin-pile"></span><i class="bin-body"></i></span>`;
    desk.appendChild(shelf);
    const bin = shelf.querySelector('.supply-bin');
    const inkPad = shelf.querySelector('.supply-ink');
    const pile = shelf.querySelector('.bin-pile');
    // the coffee mug lives on the folder like everything else; it leaves a ring wherever it's been put down
    const mugSpot = shelf.querySelector('.mug-spot');
    const mug = document.createElement('span');
    mug.className = 'desk-thing thing-mug';
    mug.setAttribute('aria-hidden', 'true');
    mug.innerHTML = '<i class="mug-handle"></i><i class="mug-body"></i><i class="mug-cup"></i><i class="mug-coffee"><b class="mug-crema"></b></i><i class="mug-steam"></i>';
    let coffee = 1;
    const pour = level => { coffee = clamp(level, 0, 1); mug.style.setProperty('--level', coffee.toFixed(2)); mug.classList.toggle('is-empty', coffee <= .02); };
    pour(1);
    const mugHome = () => {
      mugSpot.appendChild(mug);
      mug.classList.add('in-tray');
      mug.style.left = '50%';
      mug.style.top = '50%';
      mug.style.setProperty('--a', '-20deg');
      mug.dataset.home = '1';
      pour(1);                                                   // back on its spot, it's topped up
    };
    mugHome();
    const pinColours = ['oxblood', 'mustard', 'sage', 'ink'];
    let pinCount = 0;

    const make = kind => {
      const n = document.createElement('span');
      n.className = `desk-thing thing-${kind}`;
      n.setAttribute('aria-hidden', 'true');
      if (kind === 'pin') n.classList.add('pin-' + pinColours[pinCount++ % 4]);
      if (kind === 'ring') n.innerHTML = '<i></i>';
      if (kind === 'spill') n.innerHTML = `<i style="border-radius:${[0, 0, 0, 0].map(() => Math.round(rand(35, 65)) + '%').join(' ')} / ${[0, 0, 0, 0].map(() => Math.round(rand(35, 65)) + '%').join(' ')}"></i><b></b><b></b><b></b>`;
      if (kind === 'stamp') n.innerHTML = faceArt[stamp?.face || 'keep'];
      if (kind === 'stamp') n.classList.add('face-' + (stamp?.face || 'keep'));
      n.style.setProperty('--a', (kind === 'pin' ? 0 : kind === 'tape' ? rand(-24, 24) : rand(-12, 12)) + 'deg');
      if (kind === 'ring' || kind === 'spill') n.classList.add('is-ink');
      return n;
    };
    const newNote = () => {
      const n = document.createElement('div');
      n.className = 'scrap scrap-sticky user-note';
      n.style.setProperty('--a', rand(-5, 5) + 'deg');
      n.innerHTML = '<div class="sticky"><p contenteditable="plaintext-only" spellcheck="false" aria-label="Your note"></p></div>';
      desk.appendChild(n);
      adopt(n);
      return n;
    };
    const editNote = n => {
      const p = n.querySelector('[contenteditable]');
      p.focus();
      const sel = getSelection(); sel.selectAllChildren(p); sel.collapseToEnd();
    };

    // put a thing down: on the page under it (in that page's own turned coordinates), or on the folder
    const place = (n, cx, cy, page) => {
      const screenA = parseFloat(n.style.getPropertyValue('--a')) || 0;
      if (page) {
        const r = page.getBoundingClientRect(), a = angleOf(page);
        const [lx, ly] = turn(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2), -a);
        page.appendChild(n);
        n.style.left = page.offsetWidth / 2 + lx + 'px';
        n.style.top = page.offsetHeight / 2 + ly + 'px';
        n.style.setProperty('--a', screenA - a + 'deg');
        page.classList.toggle('is-pinned', things(page, 'pin').length > 0);
        raise(page);
      } else {
        const b = desk.getBoundingClientRect();
        desk.appendChild(n);
        n.style.left = cx - b.left + 'px';
        n.style.top = cy - b.top + 'px';
      }
      if (!calm) n.animate(n.classList.contains('thing-stamp')
        ? [{ scale: 1.6, opacity: 0 }, { scale: .96, opacity: 1 }, { scale: 1 }]
        : [{ scale: 1.35 }, { scale: .94 }, { scale: 1 }], { duration: 280, easing: 'ease-out' });
    };
    const lift = n => {
      // take a thing off whatever it's on, keeping where it is on screen
      const r = n.getBoundingClientRect(), b = desk.getBoundingClientRect();
      const owner = n.parentElement.closest('.scrap');
      n.classList.remove('in-tray');
      const a = (parseFloat(n.style.getPropertyValue('--a')) || 0) + (owner ? angleOf(owner) : 0);
      desk.appendChild(n);
      n.style.left = r.left + r.width / 2 - b.left + 'px';
      n.style.top = r.top + r.height / 2 - b.top + 'px';
      n.style.setProperty('--a', a + 'deg');
      if (owner) owner.classList.toggle('is-pinned', things(owner, 'pin').length > 0);
    };
    // the wastebasket starts empty and fills with whatever gets thrown in
    const wobble = () => bin.animate([{ rotate: '0deg' }, { rotate: '-5deg' }, { rotate: '4deg' }, { rotate: '0deg' }], { duration: 420 });
    const addToPile = (kind, from) => {
      const bit = document.createElement('i');
      bit.className = 'bin-bit bit-' + kind;
      if (from) ['--ball', '--ball-2'].forEach(v => bit.style.setProperty(v, getComputedStyle(from).getPropertyValue(v)));
      if (kind === 'pin') ['--pin', '--hi', '--lo'].forEach(v => bit.style.setProperty(v, getComputedStyle(from).getPropertyValue(v)));
      const level = pile.children.length;
      const h = kind === 'ball' ? 22 : kind === 'pin' ? 7 : 8;
      bit.style.left = 10 + Math.random() * (kind === 'ball' ? 30 : 44) + 'px';
      bit.style.top = 12 - h * .6 - Math.min(level, 10) * 3.2 + 'px';
      bit.style.rotate = rand(-40, 40) + 'deg';
      pile.appendChild(bit);
      if (kind === 'ball' && from && from.classList?.contains('scrap') && !from.classList.contains('user-note')) bit.dataset.real = scraps.indexOf(from);
      if (!calm) bit.animate([{ translate: '0 -26px', opacity: 0 }, { translate: '0 0', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.4,0,1,1)' });
      return bit;
    };
    const throwAway = n => {
      const r = n.getBoundingClientRect(), t = bin.getBoundingClientRect();
      bin.classList.remove('is-open');
      n.classList.add('is-leaving');
      const kind = n.classList.contains('thing-pin') ? 'pin' : n.classList.contains('thing-tape') ? 'tape' : n.classList.contains('thing-stamp') || n.classList.contains('thing-ring') || n.classList.contains('thing-spill') ? null : 'ball';
      const done = () => { if (kind) addToPile(kind, n); n.remove(); wobble(); };
      if (calm) return done();
      n.animate([{ translate: '0 0', scale: 1, opacity: 1 }, { translate: `${t.left + t.width / 2 - (r.left + r.width / 2)}px ${t.top + 8 - (r.top + r.height / 2)}px`, scale: .2, opacity: 0 }],
        { duration: 340, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' }).finished.then(done);
    };
    // a paper ball is thrown in: it arcs through the air and drops into the bin
    const sink = el => {
      const s = pages.get(el);
      moving.delete(el);
      const r = el.getBoundingClientRect(), t = bin.getBoundingClientRect();
      const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + 6 - (r.top + r.height / 2);
      const lift = 60 + Math.hypot(dx, dy) * .35;
      const finish = () => {
        addToPile('ball', el);
        wobble();
        if (el.classList.contains('user-note')) { pages.delete(el); el.remove(); return; }
        el.classList.add('is-binned');
        Object.assign(s, { vx: 0, vy: 0, vr: 0 });
      };
      if (calm) return finish();
      const k = parseFloat(getComputedStyle(el).getPropertyValue('--k')) || .2;
      const frames = [];
      // the arc to the rim, then a short drop inside
      for (let i = 0; i <= 12; i++) {
        const f = i / 12;
        frames.push({ translate: `${s.x + dx * f}px ${s.y + dy * f - 4 * lift * f * (1 - f)}px`, rotate: `${s.r + 540 * f}deg`, scale: `${k * (1 - .35 * f)}`, offset: f * .86 });
      }
      frames.push({ translate: `${s.x + dx}px ${s.y + dy + 18}px`, rotate: `${s.r + 560}deg`, scale: `${k * .5}`, opacity: 0, offset: 1 });
      el.animate(frames, { duration: 560 + Math.hypot(dx, dy) * .5, easing: 'linear', fill: 'forwards' }).finished.then(a => { finish(); el.getAnimations().forEach(x => x.cancel()); });
    };
    // is a throw headed for the bin? follow the ball's slide forward and see if it passes over the basket
    const aimedAtBin = (el, vx, vy) => {
      if (Math.hypot(vx, vy) < 2.5) return false;
      const r = el.getBoundingClientRect(), t = bin.getBoundingClientRect();
      let x = r.left + r.width / 2, y = r.top + r.height / 2;
      const bx = t.left + t.width / 2, by = t.top + t.height / 3;
      for (let i = 0; i < 140 && Math.hypot(vx, vy) > .3; i++) {
        x += vx; y += vy; vx *= .94; vy *= .94;
        if (Math.hypot(x - bx, y - by) < 70) return true;
      }
      return false;
    };
    const pageUnder = (cx, cy, except) => document.elementsFromPoint(cx, cy).find(n => n.classList?.contains('scrap') && n !== except && desk.contains(n));
    const overBin = (cx, cy) => { const t = bin.getBoundingClientRect(); return cx > t.left - 26 && cx < t.right + 26 && cy > t.top - 34 && cy < t.bottom + 10; };
    const peel = el => {
      const tape = things(el, 'tape');
      tape.forEach(n => { n.classList.add('is-peeling'); setTimeout(() => n.remove(), calm ? 0 : 520); });
      el.querySelectorAll(':scope > .tape').forEach(n => { n.classList.add('is-peeling'); setTimeout(() => n.remove(), calm ? 0 : 520); });
    };
    const taped = el => el.querySelector(':scope > .tape:not(.is-peeling), :scope > .thing-tape:not(.is-peeling)');

    // ---------- crumpling: swirl a page round fast enough and it scrunches into a ball ----------
    const turns = path => {
      let sum = 0;
      for (let i = 2; i < path.length; i++) {
        const a = Math.atan2(path[i - 1][1] - path[i - 2][1], path[i - 1][0] - path[i - 2][0]);
        const b = Math.atan2(path[i][1] - path[i - 1][1], path[i][0] - path[i - 1][0]);
        let d = b - a;
        d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        sum += d;
      }
      return Math.abs(sum) / (Math.PI * 2);
    };
    // shaking a page side to side, quickly, folds it into a paper plane
    const shakes = (path, axis = 0) => {
      let flips = 0, dir = 0;
      for (let i = 1; i < path.length; i++) {
        const dx = path[i][axis] - path[i - 1][axis];
        if (Math.abs(dx) < 5) continue;
        const d = Math.sign(dx);
        if (dir && d !== dir) flips++;
        dir = d;
      }
      return flips;
    };
    // origami: a different fold each time (a crane, a boat, a fox, a frog, a butterfly)
    const origami = {
      crane: '<path class="o-back o-flap" d="M44 52 L70 10 L60 50 Z"/><path class="o-face" d="M14 30 L30 34 L44 52 L74 54 L92 40 L84 58 L60 66 L36 64 Z"/><path class="o-light o-flap" d="M44 52 L22 12 L58 54 Z"/><path class="o-line" d="M36 64 L60 66 M44 52 L74 54"/>',
      boat: '<path class="o-back" d="M50 14 L50 62 L26 62 Z"/><path class="o-light" d="M50 14 L74 62 L50 62 Z"/><path class="o-face" d="M8 62 L92 62 L76 82 L24 82 Z"/><path class="o-line" d="M50 14 L50 62 M24 82 L50 62 L76 82"/>',
      fox: '<path class="o-back" d="M14 18 L36 40 L24 52 Z M86 18 L64 40 L76 52 Z"/><path class="o-face" d="M14 18 L50 40 L86 18 L74 54 L50 86 L26 54 Z"/><path class="o-light" d="M26 54 L50 40 L74 54 L50 86 Z"/><circle class="o-ink" cx="38" cy="52" r="2.6"/><circle class="o-ink" cx="62" cy="52" r="2.6"/><path class="o-ink" d="M46 78 L54 78 L50 84 Z"/>',
      frog: '<path class="o-back" d="M18 70 L8 88 L30 80 Z M82 70 L92 88 L70 80 Z"/><path class="o-face" d="M20 74 L30 40 L50 30 L70 40 L80 74 L50 84 Z"/><path class="o-light" d="M30 40 L50 30 L70 40 L50 58 Z"/><circle class="o-light" cx="36" cy="34" r="7"/><circle class="o-light" cx="64" cy="34" r="7"/><circle class="o-ink" cx="36" cy="34" r="2.6"/><circle class="o-ink" cx="64" cy="34" r="2.6"/><path class="o-line" d="M50 58 L50 84 M30 40 L50 58 L70 40"/>',
      swan: '<path class="o-back" d="M30 60 L58 36 L80 56 Z"/><path class="o-face" d="M14 64 L80 56 L88 70 L24 74 Z"/><path class="o-light" d="M30 60 L24 24 L30 18 L36 22 L34 58 Z"/><path class="o-ink" d="M24 24 L16 26 L24 28 Z"/><path class="o-line" d="M30 60 L80 56"/>',
      fish: '<path class="o-face" d="M14 50 L44 28 L74 50 L44 72 Z"/><path class="o-light" d="M44 28 L74 50 L44 50 Z"/><path class="o-back" d="M74 50 L94 32 L90 50 L94 68 Z"/><circle class="o-ink" cx="28" cy="47" r="2.6"/><path class="o-line" d="M14 50 L74 50"/>',
      heart: '<path class="o-face" d="M50 86 L12 48 L18 24 L36 18 L50 32 Z"/><path class="o-light" d="M50 86 L88 48 L82 24 L64 18 L50 32 Z"/><path class="o-back" d="M50 32 L50 86 L36 48 Z"/><path class="o-line" d="M50 32 L50 86"/>',
      star: '<path class="o-face" d="M50 8 L61 38 L94 38 L67 57 L77 90 L50 70 L23 90 L33 57 L6 38 L39 38 Z"/><path class="o-light" d="M50 8 L50 50 L39 38 Z M94 38 L50 50 L61 38 Z M77 90 L50 50 L67 57 Z M23 90 L50 50 L50 70 Z M6 38 L50 50 L33 57 Z"/>',
      cat: '<path class="o-back" d="M20 14 L36 36 L18 44 Z M80 14 L64 36 L82 44 Z"/><path class="o-face" d="M18 44 L20 14 L50 34 L80 14 L82 44 L68 76 L32 76 Z"/><path class="o-light" d="M32 76 L50 34 L68 76 Z"/><circle class="o-ink" cx="37" cy="50" r="2.6"/><circle class="o-ink" cx="63" cy="50" r="2.6"/><path class="o-ink" d="M46 62 L54 62 L50 67 Z"/><path class="o-line" d="M32 64 L18 60 M32 68 L18 70 M68 64 L82 60 M68 68 L82 70"/>',
      whale: '<path class="o-face" d="M8 56 L32 34 L70 38 L84 56 L60 72 L22 70 Z"/><path class="o-light" d="M8 56 L84 56 L60 72 L22 70 Z"/><path class="o-back" d="M84 56 L96 36 L92 54 L98 66 Z"/><circle class="o-ink" cx="26" cy="50" r="2.4"/><path class="o-line" d="M40 30 L40 20 M40 22 L34 16 M40 22 L46 16"/>',
      rabbit: '<path class="o-light" d="M36 44 L28 6 L42 10 L46 42 Z M64 44 L72 6 L58 10 L54 42 Z"/><path class="o-face" d="M26 62 L36 40 L64 40 L74 62 L64 86 L36 86 Z"/><path class="o-back" d="M36 86 L50 66 L64 86 Z"/><circle class="o-ink" cx="41" cy="56" r="2.6"/><circle class="o-ink" cx="59" cy="56" r="2.6"/><path class="o-ink" d="M47 66 L53 66 L50 70 Z"/>',
      tulip: '<path class="o-face" d="M28 18 L50 34 L72 18 L70 52 L50 62 L30 52 Z"/><path class="o-light" d="M50 34 L70 52 L50 62 L30 52 Z"/><path class="o-back" d="M48 62 L52 62 L52 94 L48 94 Z M50 84 L30 70 L48 80 Z"/>',
      butterfly: '<path class="o-face o-flap" d="M50 50 L12 16 L6 50 Z"/><path class="o-face o-flap" d="M50 50 L88 16 L94 50 Z"/><path class="o-light o-flap" d="M50 50 L16 84 L30 56 Z"/><path class="o-light o-flap" d="M50 50 L84 84 L70 56 Z"/><path class="o-back" d="M46 30 L54 30 L52 76 L48 76 Z"/><path class="o-line" d="M50 30 L42 18 M50 30 L58 18"/>'
    };
    let lastFold = '';
    const crumple = (el, form = 'ball') => {
      const s = pages.get(el);
      s.crumpled = true;
      s.form = form;
      if (!el.querySelector(':scope > .crumple-ball')) el.insertAdjacentHTML('beforeend', '<span class="crumple-ball" aria-hidden="true"></span><span class="paper-plane" aria-hidden="true"><svg viewBox="0 0 100 100"><path class="pl-wing" d="M6 24 L96 50 L30 50 Z"/><path class="pl-wing pl-low" d="M6 76 L96 50 L30 50 Z"/><path class="pl-keel" d="M30 50 L96 50 L40 60 Z"/><path class="pl-fold" d="M30 50 L96 50"/></svg></span><span class="paper-origami" aria-hidden="true"></span>');
      el.style.setProperty('--k', ((form === 'plane' ? 110 : form === 'crane' ? 104 : 78) / el.offsetWidth).toFixed(3));
      el.classList.toggle('is-plane', form === 'plane');
      el.classList.toggle('is-crane', form === 'crane');
      if (form === 'crane') {
        const pick = Object.keys(origami).filter(k => k !== lastFold);
        lastFold = pick[Math.floor(Math.random() * pick.length)];
        el.querySelector('.paper-origami').innerHTML = `<svg viewBox="0 0 100 100">${origami[lastFold]}</svg>`;
        el.dataset.fold = lastFold;
      }
      el.classList.add('is-crumpled');
      el.setAttribute('aria-pressed', 'true');
      if (!calm) el.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(.92)' }, { filter: 'brightness(1)' }], { duration: 300 });
    };
    const smooth = el => {
      const s = pages.get(el);
      s.crumpled = false;
      s.form = null;
      s.r = 0;
      el.classList.remove('is-crumpled', 'is-plane', 'is-crane');
      el.removeAttribute('aria-pressed');
      draw(el, s);
      settle(el, s);
    };

    // ---------- the rubber stamp: pick it up, press it down, ink it on the pad ----------
    let stamp = null;
    const carryStamp = (e, slot) => {
      const tool = document.createElement('span');
      tool.className = 'stamp-tool face-' + slot.dataset.face;
      tool.setAttribute('aria-hidden', 'true');
      tool.innerHTML = slot.innerHTML;
      desk.appendChild(tool);
      stamp = { tool, slot, face: slot.dataset.face, ink: 0, colour: null, fresh: true };
      slot.classList.add('is-empty');
      desk.classList.add('is-stamping');
      moveStamp(e);
    };
    // the rack catches a stamp from a generous distance, and lights up when it will
    const rack = shelf.querySelector('.supply-stamps');
    const nearRack = e => { const r = rack.getBoundingClientRect(); return e.clientX > r.left - 36 && e.clientX < r.right + 36 && e.clientY > r.top - 70 && e.clientY < r.bottom + 30; };
    const moveStamp = e => {
      rack.classList.toggle('is-target', nearRack(e) && !e.target.closest?.('.supply-ink'));
      const b = desk.getBoundingClientRect();
      stamp.tool.style.left = e.clientX - b.left + 'px';
      stamp.tool.style.top = e.clientY - b.top + 'px';
    };
    const putStampBack = () => {
      if (!stamp) return;
      stamp.tool.remove();
      stamp.slot.classList.remove('is-empty');
      rack.classList.remove('is-target');
      stamp = null;
      desk.classList.remove('is-stamping');
    };
    const press = e => {
      const tool = stamp.tool;
      tool.classList.remove('is-pressing');
      void tool.offsetWidth;
      tool.classList.add('is-pressing');
      const t = inkPad.getBoundingClientRect();
      if (e.clientX > t.left && e.clientX < t.right && e.clientY > t.top - 10 && e.clientY < t.bottom) {
        // inking up: the rubber takes the pad's colour
        stamp.ink = 1;
        stamp.colour = inks[inkIndex];
        tool.style.setProperty('--rubber', stamp.colour);
        tool.classList.add('is-inked');
        inkPad.animate([{ scale: 1 }, { scale: .95 }, { scale: 1 }], { duration: 260 });
        return;
      }
      if (stamp.ink <= 0) return;                               // a dry stamp leaves nothing
      tool.style.pointerEvents = 'none';
      const page = pageUnder(e.clientX, e.clientY);
      const mark = make('stamp');
      mark.style.color = stamp.colour;
      mark.style.opacity = Math.max(.2, stamp.ink).toFixed(2);
      setTimeout(() => place(mark, e.clientX, e.clientY, page), calm ? 0 : 90);
      stamp.ink = Math.max(0, stamp.ink - .2);
      if (stamp.ink <= 0) tool.classList.remove('is-inked');
    };

    // ---------- clearing the desk: everything added goes in the bin, the pages go back where they were ----------
    const clearDesk = () => {
      putStampBack();
      drag = null;
      wobble();
      mugHome();
      // the clutter goes in…
      desk.querySelectorAll('.desk-thing:not(.thing-mug), .user-note').forEach((n, i) => setTimeout(() => throwAway(n), calm ? 0 : i * 40));
      desk.querySelectorAll('.user-note').forEach(n => pages.delete(n));
      const t = bin.getBoundingClientRect(), bx = t.left + t.width / 2, by = t.top;
      scraps.forEach((el, i) => {
        const s = pages.get(el);
        moving.delete(el);
        el.getAnimations().forEach(a => a.cancel());
        // …and anything real that was thrown away pops back out and flies home
        if (el.classList.contains('is-binned')) {
          pile.querySelectorAll(`[data-real="${i}"]`).forEach(b => b.remove());
          el.classList.remove('is-binned');
          const r = el.getBoundingClientRect();
          const hx = r.left + r.width / 2 - s.x, hy = r.top + r.height / 2 - s.y;   // where home is on screen
          const fx = bx - hx, fy = by - hy;
          Object.assign(s, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 });
          draw(el, s);
          if (!calm) {
            const k = el.style.getPropertyValue('--k') || .2, up = 140 + Math.hypot(fx, fy) * .3;
            const frames = [];
            for (let f = 0; f <= 1.0001; f += 1 / 12) frames.push({ translate: `${fx * (1 - f)}px ${fy * (1 - f) - 4 * up * f * (1 - f)}px`, rotate: `${-480 * (1 - f)}deg`, scale: `${k}` });
            el.animate(frames, { duration: 760, delay: 120 + i * 70, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'backwards' }).finished.then(() => smooth(el));
          } else smooth(el);
        } else if (s.crumpled) smooth(el);
        el.querySelectorAll(':scope > .tape').forEach(n => n.remove());
        originalTape.get(el).forEach(n => el.prepend(n.cloneNode(true)));
        el.classList.remove('is-pinned');
        if (!calm && (s.x || s.y || s.r)) el.animate([{ translate: `${s.x}px ${s.y}px`, rotate: `${s.r}deg` }, { translate: '0px 0px', rotate: '0deg' }], { duration: 650, easing: 'cubic-bezier(.3,1.2,.4,1)' });
        Object.assign(s, { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 });
        draw(el, s);
        el.style.removeProperty('z-index');
      });
    };
    bin.setAttribute('role', 'button');
    bin.setAttribute('tabindex', '0');
    bin.setAttribute('aria-label', 'Tidy the desk');
    bin.removeAttribute('aria-hidden');
    bin.title = 'Tidy the desk';
    bin.addEventListener('click', clearDesk);
    bin.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearDesk(); } });

    // ---------- motion after a throw ----------
    let drag = null, pending = null, ticking = false, hold = null, held = false;
    const moving = new Set();
    const keepIn = (el, s) => {
      const b = desk.getBoundingClientRect(), r = el.getBoundingClientRect(), pad = 8;
      if (r.left < b.left + pad) { s.x += b.left + pad - r.left; s.vx = Math.abs(s.vx) * .4; }
      if (r.right > b.right - pad) { s.x -= r.right - (b.right - pad); s.vx = -Math.abs(s.vx) * .4; }
      if (r.top < b.top + pad) { s.y += b.top + pad - r.top; s.vy = Math.abs(s.vy) * .4; }
      if (r.bottom > b.bottom - pad) { s.y -= r.bottom - (b.bottom - pad); s.vy = -Math.abs(s.vy) * .4; }
    };
    const settle = (el, s) => { draw(el, s); keepIn(el, s); draw(el, s); };
    const tick = () => {
      ticking = false;
      for (const el of moving) {
        if (drag && drag.el === el) continue;
        const s = pages.get(el);
        s.x += s.vx; s.y += s.vy; s.r += s.vr;
        const f = s.form === 'plane' ? .975 : s.crumpled ? .94 : .88;
        s.vx *= f; s.vy *= f; s.vr *= s.crumpled ? .94 : .86;
        if (s.form === 'plane') { s.vr = 0; s.r = Math.atan2(s.vy, s.vx) * 180 / Math.PI + Math.sin(performance.now() / 120) * 4; }
        settle(el, s);
        if (s.crumpled) { const r = el.getBoundingClientRect(); if (overBin(r.left + r.width / 2, r.top + r.height / 2)) { sink(el); continue; } }
        if (Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vr) < .05) moving.delete(el);
      }
      if (moving.size) { ticking = true; requestAnimationFrame(tick); }
    };
    const run = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };
    const nudge = el => el.animate([{ rotate: `${pages.get(el).r}deg` }, { rotate: `${pages.get(el).r - 1.2}deg` }, { rotate: `${pages.get(el).r + 1}deg` }, { rotate: `${pages.get(el).r}deg` }], { duration: 320 });

    const startPage = (e, el, fresh) => {
      const s = pages.get(el), r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (s.crumpled) { s.vx = s.vy = s.vr = 0; }
      drag = {
        el, s, fresh, t0: performance.now(), sx: e.clientX, sy: e.clientY, moved: fresh ? 99 : 0,
        gx: e.clientX - cx, gy: e.clientY - cy, ox: cx - s.x, oy: cy - s.y,
        r0: s.r, x0: s.x, y0: s.y, last: [[e.clientX, e.clientY, performance.now()]],
        taped: !fresh && !!taped(el), path: []
      };
      const pins = things(el, 'pin');
      if (pins.length === 1) {
        const p = pins[0];
        const [px, py] = turn(parseFloat(p.style.left) - el.offsetWidth / 2, parseFloat(p.style.top) - el.offsetHeight / 2, angleOf(el));
        drag.pivot = { x: cx + px, y: cy + py, lx: parseFloat(p.style.left) - el.offsetWidth / 2, ly: parseFloat(p.style.top) - el.offsetHeight / 2 };
        drag.a0 = Math.atan2(e.clientY - drag.pivot.y, e.clientX - drag.pivot.x);
      }
      drag.held = pins.length > 1;
      capture(e);
      raise(el);
      el.classList.add('is-held');
      if (fresh) el.classList.add('is-lifted');
      moving.delete(el);
    };

    desk.addEventListener('pointerdown', e => {
      if (e.button !== 0 || looking) return;
      if (stamp) {
        e.preventDefault();
        if (nearRack(e) && !e.target.closest('.supply-ink')) return putStampBack();
        moveStamp(e);
        stamp.tool.classList.add('is-down');
        return;
      }
      if (e.target.closest('.stamp-pick')) { e.preventDefault(); carryStamp(e, e.target.closest('.stamp-pick')); return; }
      if (e.target.closest('.supply-ink')) {
        e.preventDefault();
        inkIndex = (inkIndex + 1) % inks.length;
        inkPad.style.setProperty('--felt', inks[inkIndex]);
        inkPad.animate([{ scale: 1 }, { scale: 1.06 }, { scale: 1 }], { duration: 240 });
        return;
      }
      const supply = e.target.closest('[data-supply]');
      const thing = e.target.closest('.thing-pin, .thing-tape, .thing-mug');
      const el = e.target.closest('.scrap');
      if (supply) {
        e.preventDefault();
        const kind = supply.dataset.supply;
        supply.animate([{ scale: 1 }, { scale: .94 }, { scale: 1 }], { duration: 220 });
        if (kind === 'note') {
          const n = newNote();
          const b = desk.getBoundingClientRect();
          n.style.left = e.clientX - b.left - n.offsetWidth / 2 + 'px';
          n.style.top = e.clientY - b.top - n.offsetHeight / 2 + 'px';
          startPage(e, n, true);
          return;
        }
        const n = make(kind);
        const b = desk.getBoundingClientRect();
        desk.appendChild(n);
        n.style.left = e.clientX - b.left + 'px';
        n.style.top = e.clientY - b.top + 'px';
        n.classList.add('is-held');
        drag = { thing: n, fromShelf: true };
        capture(e);
        return;
      }
      if (thing) {
        e.preventDefault();
        if (thing === mug && !mug.dataset.home) {
          // picking the mug up leaves a coffee ring where it stood
          const r = mug.getBoundingClientRect(), ring = make('ring');
          ring.style.setProperty('--a', rand(0, 360) + 'deg');
          ring.style.opacity = (rand(.55, .95) * (coffee > .02 ? 1 : .35)).toFixed(2);
          mug.style.visibility = 'hidden';
          const under = pageUnder(r.left + r.width / 2, r.top + r.height / 2);
          mug.style.visibility = '';
          place(ring, r.left + r.width / 2, r.top + r.height / 2, under);
        }
        delete mug.dataset.home;
        lift(thing);
        thing.classList.add('is-held');
        drag = { thing };
        capture(e);
        return;
      }
      if (!el) return;
      // typing in a note: a click places the caret, but pulling the note still moves it
      if (e.target.isContentEditable && document.activeElement === e.target) { pending = { e, el }; return; }
      if (e.pointerType !== 'mouse' && !el.classList.contains('user-note')) {
        // touch: a tap looks closer, a swipe scrolls, press and hold picks the page up
        clearTimeout(hold?.timer);
        hold = { e, el, timer: setTimeout(() => { hold = null; held = true; navigator.vibrate?.(8); startPage(e, el, false); el.classList.add('is-lifted'); }, 380) };
        return;
      }
      e.preventDefault();
      startPage(e, el, false);
    });

    desk.addEventListener('pointermove', e => {
      if (stamp) { moveStamp(e); return; }
      if (hold && Math.hypot(e.clientX - hold.e.clientX, e.clientY - hold.e.clientY) > 10) { clearTimeout(hold.timer); hold = null; }
      if (pending && !drag) {
        if (Math.hypot(e.clientX - pending.e.clientX, e.clientY - pending.e.clientY) < 6) return;
        getSelection().removeAllRanges();
        document.activeElement.blur();
        startPage(pending.e, pending.el, false);
        pending = null;
      }
      if (!drag) return;
      if (drag.thing) {
        const b = desk.getBoundingClientRect();
        drag.thing.style.left = e.clientX - b.left + 'px';
        drag.thing.style.top = e.clientY - b.top + 'px';
        if (drag.thing === mug) {
          const now = performance.now(), last = drag.mugLast || [e.clientX, e.clientY, now - 16];
          const dt = Math.max(8, now - last[2]), vx = (e.clientX - last[0]) / dt, vy = (e.clientY - last[1]) / dt, sp = Math.hypot(vx, vy);
          drag.mugLast = [e.clientX, e.clientY, now];
          mug.style.setProperty('--slosh', clamp(sp * 6, 0, 10).toFixed(1) + 'px');
          mug.style.setProperty('--tilt', Math.atan2(vy, vx) * 180 / Math.PI + 'deg');
          if (sp > 1.9 && coffee > .02 && now - (drag.spilt || 0) > 160) {
            // too fast: a splash lands behind the mug, on whatever is under it
            drag.spilt = now;
            const sx = e.clientX - vx * 26, sy = e.clientY - vy * 26;
            const splash = make('spill');
            splash.style.setProperty('--a', Math.atan2(vy, vx) * 180 / Math.PI + 'deg');
            splash.style.setProperty('--stretch', clamp(sp / 1.6, 1, 2.4).toFixed(2));
            splash.style.setProperty('--size', Math.round(rand(26, 44) * Math.min(1.4, .6 + coffee)) + 'px');
            mug.style.visibility = 'hidden';
            const under = pageUnder(sx, sy);
            mug.style.visibility = '';
            place(splash, sx, sy, under);
            pour(coffee - rand(.14, .24));
            mug.animate([{ rotate: '0deg' }, { rotate: `${vx > 0 ? 6 : -6}deg` }, { rotate: '0deg' }], { duration: 260, composite: 'add' });
          }
        }
        bin.classList.toggle('is-open', overBin(e.clientX, e.clientY));
        return;
      }
      const { el, s } = drag;
      drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));
      if (drag.moved < 4) return;
      if (drag.held) { if (!drag.nudged) { nudge(el); drag.nudged = true; } return; }
      if (el.classList.contains('user-note') || s.crumpled) bin.classList.toggle('is-open', overBin(e.clientX, e.clientY));
      const now = performance.now();
      drag.last.push([e.clientX, e.clientY, now]);
      if (drag.last.length > 5) drag.last.shift();
      if (drag.pivot) {
        // one pin: the page can only turn around it
        let d = (Math.atan2(e.clientY - drag.pivot.y, e.clientX - drag.pivot.x) - drag.a0) * 180 / Math.PI;
        d = ((d + 540) % 360) - 180;
        const dr = clamp(drag.r0 + d, drag.r0 - 40, drag.r0 + 40) - s.r;
        const [qx, qy] = turn(drag.pivot.lx, drag.pivot.ly, angleOf(el));
        const [nx, ny] = turn(qx, qy, dr);
        s.x += qx - nx; s.y += qy - ny; s.r += dr;
        draw(el, s);
        return;
      }
      if (drag.taped) {
        // taped down: the page strains against the tape, then the tape gives
        const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
        if (Math.hypot(dx, dy) < 30) { s.x = drag.x0 + dx * .12; s.y = drag.y0 + dy * .12; draw(el, s); return; }
        drag.taped = false;
        peel(el);
      }
      el.classList.add('is-lifted');
      if (s.crumpled) {
        // a ball just rolls along under the hand
        const [p, q] = drag.last[drag.last.length - 2] || [e.clientX, e.clientY];
        if (s.form === 'plane') { if (Math.hypot(e.clientX - p, e.clientY - q) > 2) s.r = Math.atan2(e.clientY - q, e.clientX - p) * 180 / Math.PI; }
        else if (s.form === 'crane') s.r = clamp((e.clientX - p) * 1.5, -14, 14);
        else s.r += (e.clientX - p) * 1.6;
        s.x = e.clientX - drag.ox; s.y = e.clientY - drag.oy;
        settle(el, s);
        return;
      }
      drag.path.push([e.clientX, e.clientY, now]);
      while (drag.path.length && now - drag.path[0][2] > 1300) drag.path.shift();
      {
        let len = 0;
        for (let i = 1; i < drag.path.length; i++) len += Math.hypot(drag.path[i][0] - drag.path[i - 1][0], drag.path[i][1] - drag.path[i - 1][1]);
        const fold = len > 520 && turns(drag.path) > 1.6 ? 'ball' : len > 360 && shakes(drag.path, 0) >= 5 ? 'plane' : len > 360 && shakes(drag.path, 1) >= 5 ? 'crane' : null;
        if (fold) {
          crumple(el, fold);
          drag.gx = drag.gy = 0;
          s.r = 0;
          s.x = e.clientX - drag.ox; s.y = e.clientY - drag.oy;
          settle(el, s);
          return;
        }
      }
      // the page swings from the point it's held by, as paper does
      const [p, q] = drag.last[drag.last.length - 2] || [e.clientX, e.clientY];
      const vx = e.clientX - p, vy = e.clientY - q;
      const [gx, gy] = turn(drag.gx, drag.gy, s.r - drag.r0);
      s.vr = clamp((s.vr + (gx * vy - gy * vx) / 9000) * .8, -2.5, 2.5);
      s.r = clamp(s.r + s.vr, drag.r0 - 28, drag.r0 + 28);
      const [hx, hy] = turn(drag.gx, drag.gy, s.r - drag.r0);
      s.x = e.clientX - hx - drag.ox;
      s.y = e.clientY - hy - drag.oy;
      settle(el, s);
    });

    const release = e => {
      pending = null;
      if (hold) { clearTimeout(hold.timer); hold = null; }
      if (stamp && stamp.tool.classList.contains('is-down')) {
        stamp.tool.classList.remove('is-down');
        if (stamp.fresh) { stamp.fresh = false; return; }
        press(e);
        return;
      }
      if (stamp) { stamp.fresh = false; return; }
      if (!drag) return;
      const d = drag;
      drag = null;
      bin.classList.remove('is-open');
      if (d.thing) {
        const n = d.thing;
        n.classList.remove('is-held');
        if (n === mug) mug.style.setProperty('--slosh', '0px');
        if (n === mug && overBin(e.clientX, e.clientY)) return mugHome();     // the mug isn't rubbish
        if (overBin(e.clientX, e.clientY)) return throwAway(n);
        n.style.pointerEvents = 'none';
        const page = pageUnder(e.clientX, e.clientY);
        n.style.pointerEvents = '';
        place(n, e.clientX, e.clientY, page);
        return;
      }
      const { el, s } = d;
      el.classList.remove('is-held', 'is-lifted');
      const note = el.classList.contains('user-note');
      if (s.crumpled && d.moved < 4) { smooth(el); return; }
      if (note && overBin(e.clientX, e.clientY)) { pages.delete(el); return throwAway(el); }
      if (s.crumpled && overBin(e.clientX, e.clientY)) return sink(el);
      if (d.fresh || (note && d.moved < 4)) { editNote(el); return; }
      if (d.moved < 4 && performance.now() - d.t0 < 400) { look(el); return; }
      if (d.pivot || d.held || calm) return;
      // a throw: keep the speed the page was moving at, then let it slide to a stop
      const a = d.last[0], b = d.last[d.last.length - 1];
      const dt = Math.max(16, b[2] - a[2]) / 16;
      s.vx = clamp((b[0] - a[0]) / dt, -28, 28);
      s.vy = clamp((b[1] - a[1]) / dt, -28, 28);
      if (s.crumpled) {
        if (aimedAtBin(el, s.vx, s.vy)) return sink(el);
        s.vr = s.form === 'ball' ? s.vx * 1.4 : 0;
        if (s.form === 'crane') s.r = 0;
        if (s.form === 'plane') { s.vx *= 1.25; s.vy *= 1.25; }
      }
      moving.add(el);
      run();
    };
    addEventListener('keydown', e => { if (stamp && e.key === 'Escape') putStampBack(); });
    desk.addEventListener('contextmenu', e => { if (stamp) { e.preventDefault(); putStampBack(); } });
    desk.addEventListener('pointerup', release);
    desk.addEventListener('pointercancel', e => { if (!drag) release(e); });
    desk.addEventListener('touchmove', e => { if (drag || held) e.preventDefault(); }, { passive: false });
    desk.addEventListener('touchend', () => setTimeout(() => { held = false; }, 350));

    // touch: a tap on one of the pages looks closer
    desk.addEventListener('click', e => {
      if (mouse) return;
      if (held) return;                                         // the end of a press-and-hold isn't a tap
      const el = e.target.closest('.scrap');
      if (!el || el.classList.contains('user-note') || e.target.closest('.desk-thing') || stamp) return;
      pages.get(el).crumpled ? smooth(el) : look(el);
    });

    // keyboard: Enter looks closer, arrows move, P pins, T tapes (press again to take it off)
    desk.addEventListener('keydown', e => {
      if (stamp && e.key === 'Escape') { putStampBack(); return; }
      if (e.target.isContentEditable) { if (e.key === 'Escape') e.target.blur(); return; }
      const el = e.target.closest('.scrap');
      if (!el || e.target !== el) return;
      const s = pages.get(el), r = el.getBoundingClientRect();
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.classList.contains('user-note') ? editNote(el) : look(el); return; }
      if (e.key === 'p' || e.key === 'P' || e.key === 't' || e.key === 'T') {
        const kind = e.key.toLowerCase() === 'p' ? 'pin' : 'tape';
        const had = things(el, kind);
        if (had.length) { had.forEach(n => n.remove()); el.classList.toggle('is-pinned', things(el, 'pin').length > 0); return; }
        place(make(kind), r.left + r.width / 2, r.top + 12, el);
        return;
      }
      const step = e.shiftKey ? 40 : 12;
      const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (!mv) return;
      e.preventDefault();
      if (things(el, 'pin').length) { nudge(el); return; }
      peel(el);
      s.x += mv[0]; s.y += mv[1];
      raise(el);
      settle(el, s);
    });
  }

  // The pages are set down one after another the first time the folder comes into view.
  if (!calm) {
    desk.classList.add('is-waiting');
    new IntersectionObserver((entries, io) => {
      if (!entries[0].isIntersecting) return;
      desk.classList.replace('is-waiting', 'is-set');
      setTimeout(() => desk.classList.remove('is-set'), 700 + scraps.length * 70);
      io.disconnect();
    }, { threshold: .2 }).observe(desk);
  }
}
