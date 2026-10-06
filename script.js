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
