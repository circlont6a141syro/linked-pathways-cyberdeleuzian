# Personal Website

A static personal website built with plain HTML5, CSS3, and vanilla
JavaScript — no frameworks, no build step. Designed to be pushed straight
to a GitHub repository and served with **GitHub Pages**.

## Structure

```
/
├── index.html         Homepage (hero banner + featured content)
├── writing.html        List of writing pieces, links into /writing
├── gallery.html         Image gallery grid, images live in /gallery
├── about.html            Bio page
├── css/
│   └── style.css        Single global stylesheet (variables at the top)
├── js/
│   └── ui.js               Shared vanilla JS (mobile nav, footer year, etc.)
├── img/
│   ├── background.jpg   Hero background image
│   └── icons/                Small site icons/avatars
├── writing/
│   └── sample-post.html  Template for an individual writing piece
└── gallery/
    └── photo-01.jpg       Example gallery image
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo settings, go to **Pages** and set the source to the
   `main` branch, root folder (`/`).
3. Your site will be live at `https://<username>.github.io/<repo>/`.

No build tools, bundlers, or `node_modules` are required — GitHub Pages
serves the files exactly as committed.

## Extending the site

- **New writing piece:** copy `writing/sample-post.html`, rename it, edit
  the content, then add a link to it in the list inside `writing.html`.
- **New gallery image:** drop the image file into `/gallery`, then add a
  new `<figure>` block in `gallery.html`.
- **New page:** copy an existing top-level page (e.g. `about.html`), keep
  the shared `<header>`/`<footer>` markup so navigation stays consistent,
  and add a link to it in the `<nav>` block on every page.
- **Styling:** all colors, fonts, and spacing are controlled by the CSS
  variables at the top of `css/style.css` — change them there to re-theme
  the whole site at once.
- **Behavior:** add new small functions to `js/ui.js` and call them from
  `initSite()`, following the pattern already used for the mobile nav
  toggle and footer year.
