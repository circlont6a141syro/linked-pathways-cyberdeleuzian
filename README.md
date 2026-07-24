# Your Name's Homepage

A period-accurate personal homepage: every element on every page is
pixel-positioned with `position: absolute; left: Npx; top: Npx`, the
way pages actually got built with old WYSIWYG editors (FrontPage,
Dreamweaver) in the late '90s/early 2000s. There is no grid, no
flexbox, and no responsive design — resizing the window will make
things overlap. That's intentional, not a bug.

## Structure

```
/
├── index.html      Homepage
├── writing.html     All six writing pieces, jump-linked from the top
├── gallery.html      Picture list (swap in real <img> tags whenever you have photos)
├── about.html          Bio + contact links
└── img/
    ├── background.jpg     Background photo (fixed, tiled behind everything)
    ├── banner-welcome.gif   Header banner
    ├── banner-nav.gif         Nav bar — a single image with 4 image-map regions
    ├── banner-promo.gif        "Best viewed at..." banner
    ├── banner-construction.gif   Under-construction badge
    └── banner-thanks.gif           Footer banner
```

No CSS file — colors and fonts are set with old-school HTML attributes
(`bgcolor`, `text`, `link`, `<font color>`) directly in each page, same
as the era this is imitating.

## How the navigation works

`banner-nav.gif` is one image with four visual "buttons" drawn into it.
A `<map>`/`<area>` block over the image makes each quarter of it
clickable — that's the actual old technique for image-based nav bars,
not a modern CSS button.

## Extending the site

- **New writing piece:** copy one of the pixel-positioned `<table>`
  blocks in `writing.html`, give it a new `<a name="...">` anchor, bump
  its `top:` value below the last one, and add a matching link to the
  jump-list near the top of the page.
- **New gallery item:** copy one of the boxes in `gallery.html` and
  adjust its `left`/`top`. Once you have a real photo, swap the text
  block for an `<img>` tag.
- **Moving anything:** just change its `left:`/`top:` pixel values.
  There's no layout system to fight — but nothing will reflow around
  it either, so leave room.

## About the earlier versions

This site has been through a few identities: a Windows-Vista-style
"app window" simulation, then a loud maximalist neon re-theme, then a
simple modern Neocities-style page. This version trades all of that
for the real, specific technique of an authentic 2000s personal
homepage — absolute pixel positioning and image-map banners included.
