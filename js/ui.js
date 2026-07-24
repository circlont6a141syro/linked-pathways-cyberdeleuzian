/* ==========================================================================
   ui.js
   Shared vanilla-JS behavior loaded on every page.
   No frameworks, no build step — plain DOM APIs only, so this file can be
   dropped into any page as-is and works with the shared header/nav markup.

   Structure:
     1. Mobile nav toggle
     2. Auto-updating footer year
     3. Cursor-tracking glass sheen on the window
     4. Drifting leaf/dust motes in the background
     5. Optional hover-sound toggle (off by default)
     6. Title-bar icon easter egg
     7. Small init wrapper so everything runs after the DOM is ready

   Motion/sound philosophy: every effect below is decorative, not load-
   bearing — the site works identically with all of them stripped out.
   The startup fade-in and window float live in style.css as pure CSS
   keyframes (not here) specifically so they can't fail into a stuck
   state if this script errors or is blocked. Anything continuous or
   ambient (motes, cursor sheen) is skipped entirely when the visitor's
   OS is set to reduce motion, and sound is opt-in and silent by default.
   ========================================================================== */

/**
 * Wires up the hamburger button (#navToggle) to show/hide the nav menu
 * (#siteNav) on small screens. The actual show/hide styling is handled by
 * the ".open" class in css/style.css — this function only toggles that class.
 */
function initNavToggle() {
  var toggleBtn = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  // Guard clause: if a page is missing these elements, just skip silently
  // instead of throwing — keeps this script safe to reuse everywhere.
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    // Keep the aria-expanded attribute in sync for screen readers
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu automatically when a nav link is clicked (mobile UX nicety)
  nav.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      nav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Fills in the current year in the footer copyright line (#year), so it
 * never needs to be manually updated in the HTML.
 */
function initFooterYear() {
  var yearEl = document.getElementById('year');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

/**
 * A soft highlight on the window's glass sheen drifts toward the cursor.
 * The highlight's position is smoothed (lerped) toward the pointer each
 * frame rather than snapping to it, so it reads as a gentle reflection
 * rather than something tracking the mouse directly.
 */
function initCursorSheen() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var win = document.querySelector('.app-window');
  if (!win || !window.matchMedia('(hover: hover)').matches) return;

  var target = { x: 50, y: 10 };
  var current = { x: 50, y: 10 };
  var raf = null;

  function step() {
    current.x += (target.x - current.x) * 0.06;
    current.y += (target.y - current.y) * 0.06;
    win.style.setProperty('--sheen-x', current.x.toFixed(2) + '%');
    win.style.setProperty('--sheen-y', current.y.toFixed(2) + '%');
    raf = requestAnimationFrame(step);
  }

  win.addEventListener('pointermove', function (event) {
    var rect = win.getBoundingClientRect();
    target.x = ((event.clientX - rect.left) / rect.width) * 100;
    target.y = ((event.clientY - rect.top) / rect.height) * 100;
  });

  raf = requestAnimationFrame(step);
}

/**
 * Scatters a handful of small leaves and dust motes that drift slowly
 * upward behind the window, echoing the botanical-photo theme. Purely
 * decorative and pointer-events:none, so it never intercepts clicks.
 */
function initAmbientMotes() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var field = document.createElement('div');
  field.className = 'ambient-motes';
  field.setAttribute('aria-hidden', 'true');

  var count = window.matchMedia('(max-width: 640px)').matches ? 4 : 7;
  for (var i = 0; i < count; i++) {
    var mote = document.createElement('span');
    var isLeaf = i % 3 !== 0;
    mote.className = 'mote' + (isLeaf ? ' mote-leaf' : ' mote-dust');
    if (isLeaf) {
      mote.innerHTML = '<svg class="aero-icon" aria-hidden="true"><use href="' +
        (document.body.dataset.assetPrefix || '') + 'icons.svg#leaf"></use></svg>';
    }
    var left = Math.random() * 100;
    var duration = 24 + Math.random() * 20;
    var delay = Math.random() * -40;
    var drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
    var size = isLeaf ? (12 + Math.random() * 8).toFixed(0) + 'px' : (3 + Math.random() * 4).toFixed(0) + 'px';
    mote.style.left = left + '%';
    mote.style.setProperty('--mote-duration', duration.toFixed(1) + 's');
    mote.style.setProperty('--mote-delay', delay.toFixed(1) + 's');
    mote.style.setProperty('--mote-drift', drift);
    mote.style.setProperty('--mote-size', size);
    field.appendChild(mote);
  }
  document.body.appendChild(field);
}

/**
 * Hover sounds are silent by default. #soundToggle (a real, focusable
 * button — not hidden from assistive tech like the decorative title-bar
 * dots) flips a small Web Audio blip on for a handful of primary
 * interactive elements. No audio files are used; each blip is synthesized
 * on the fly, so there's nothing to preload or fail to load.
 */
function initSoundToggle() {
  var toggle = document.getElementById('soundToggle');
  if (!toggle) return;

  var STORAGE_KEY = 'meadowos-sound-enabled';
  var enabled = false;
  try { enabled = window.localStorage.getItem(STORAGE_KEY) === 'true'; } catch (err) { /* ignore */ }

  var audioCtx = null;
  function playBlip() {
    if (!enabled) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 720;
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.09);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (err) { /* Web Audio unsupported — fail silently */ }
  }

  function applyState() {
    toggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    toggle.setAttribute('aria-label', enabled ? 'Hover sounds on — click to mute' : 'Hover sounds off — click to enable');
  }
  applyState();

  toggle.addEventListener('click', function () {
    enabled = !enabled;
    try { window.localStorage.setItem(STORAGE_KEY, String(enabled)); } catch (err) { /* ignore */ }
    applyState();
    if (enabled) playBlip();
  });

  var hoverTargets = document.querySelectorAll(
    '.site-nav a, .launch-button, .folder-item, .archive-file, .image-thumb, .social-links a, .reader-close, .preview-controls button'
  );
  hoverTargets.forEach(function (el) {
    el.addEventListener('pointerenter', playBlip);
  });
}

/**
 * A quiet easter egg: click the small decorative title-bar icon five
 * times and a few leaves puff out. Doesn't affect layout, doesn't nag —
 * most visitors will never notice it's clickable, which is the point.
 */
function initTitleBarEasterEgg() {
  var icon = document.querySelector('.title-bar-icon');
  if (!icon) return;

  icon.style.cursor = 'pointer';
  var clicks = 0;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  icon.addEventListener('click', function () {
    clicks++;
    if (clicks < 5) return;
    clicks = 0;
    if (reduced) return;

    for (var i = 0; i < 6; i++) {
      var leaf = document.createElement('span');
      leaf.className = 'egg-leaf';
      leaf.innerHTML = '<svg class="aero-icon" aria-hidden="true"><use href="' +
        (document.body.dataset.assetPrefix || '') + 'icons.svg#leaf"></use></svg>';
      var angle = (i / 6) * 360 + Math.random() * 20;
      var distance = 40 + Math.random() * 30;
      leaf.style.setProperty('--egg-x', (Math.cos(angle * Math.PI / 180) * distance).toFixed(0) + 'px');
      leaf.style.setProperty('--egg-y', (Math.sin(angle * Math.PI / 180) * distance).toFixed(0) + 'px');
      icon.appendChild(leaf);
      /* eslint-disable no-loop-func */
      (function (el) {
        setTimeout(function () { el.remove(); }, 900);
      }(leaf));
    }
  });
}

/**
 * Entry point. Add new init___() function calls here as the site grows
 * (e.g. a future initGalleryLightbox() or initSearch()) — each feature
 * gets its own small function so the file stays easy to navigate.
 */
function initSite() {
  initNavToggle();
  initFooterYear();
  initCursorSheen();
  initAmbientMotes();
  initSoundToggle();
  initTitleBarEasterEgg();
}

// Run once the DOM is parsed. Using DOMContentLoaded (rather than putting
// this script tag in <head>) means we don't need "defer" and it's safe
// regardless of where the <script> tag is placed in the HTML.
document.addEventListener('DOMContentLoaded', initSite);
