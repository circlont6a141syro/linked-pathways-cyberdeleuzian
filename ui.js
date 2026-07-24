/* ==========================================================================
   ui.js
   Shared vanilla-JS behavior loaded on every page.
   No frameworks, no build step — plain DOM APIs only, so this file can be
   dropped into any page as-is and works with the shared header/nav markup.

   Structure:
     1. Mobile nav toggle
     2. Auto-updating footer year
     3. Small init wrapper so everything runs after the DOM is ready
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
 * Entry point. Add new init___() function calls here as the site grows
 * (e.g. a future initGalleryLightbox() or initSearch()) — each feature
 * gets its own small function so the file stays easy to navigate.
 */
function initSite() {
  initNavToggle();
  initFooterYear();
}

// Run once the DOM is parsed. Using DOMContentLoaded (rather than putting
// this script tag in <head>) means we don't need "defer" and it's safe
// regardless of where the <script> tag is placed in the HTML.
document.addEventListener('DOMContentLoaded', initSite);
