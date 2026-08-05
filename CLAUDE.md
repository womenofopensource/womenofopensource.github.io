# Women of Open Source — Project Guide

Source for the [Women of Open Source website](https://womenofopensource.org/), a
Jekyll site hosted on GitHub Pages.

- **Repo:** `womenofopensource/womenofopensource.github.io`
- **Active branch:** `new-theme` (PR #9) — the new-theme rework, not yet merged to `main`
- **The entire Jekyll site lives in `docs/`.** Run all Jekyll commands from `docs/`.

## Tech stack

- Jekyll **3.8.5** (pinned in `docs/Gemfile` for Ruby 2.6 compatibility — NOT the `github-pages` gem)
- Ruby **2.6.10**, Bundler **1.17.2** (Gemfile.lock requires 1.17.2 specifically)
- Plugins: `jekyll-paginate`, `jekyll-sitemap`
- Markdown: kramdown (GFM input), Rouge syntax highlighting
- SCSS in `_sass/`, compiled compressed

> Switching to Ruby 2.7+ would allow using the `github-pages` gem for closer
> production parity — see the commented instructions in `docs/Gemfile`. Not done yet.

## Local development

The site is served under a custom local domain (mapped in `/etc/hosts` →
`127.0.0.1 local.womenofopensource.org`).

```bash
cd docs
bundle install                              # first time only
bundle exec jekyll serve --port 4000        # http://local.womenofopensource.org:4000
```

- `bundle exec jekyll build` → outputs to `docs/_site/` (git-ignored)
- Restart the server after editing `_config.yml` (collections/defaults are cached)
- Add `--livereload` for auto-refresh on file changes

## Directory layout (all under `docs/`)

- `_config.yml` — Jekyll config, collections, permalinks, defaults
- `_data/settings.yml` — site-wide settings incl. contact-form config
- `_layouts/` — `default`, `page`, `post`, `speaker`, `partner`
- `_includes/` — reusable partials (`header`, `footer`, `socials`, `contact-form`)
- `_posts/` — news/blog posts, `YYYY-MM-DD-title.md` → `/news/:slug`
- `_speakers/` — speaker profiles → `/speakers/:slug`
- `_partners/` — partner/sponsor profiles → `/partners/:slug`
- `_sass/` — SCSS (mobile-first; use responsive mixins)
- `speakers/index.html`, `news/index.html`, `partners/index.html` — directory/listing pages
- `js/personal.js` — site JS **source**. The site loads the minified `js/personal-min.js`
  (like `plugins-min.js`), so after editing `personal.js` you MUST regenerate the minified file:
  `cd docs && npx terser js/personal.js -c -m -o js/personal-min.js`
- Top-level pages: `about.md`, `contact.md`, `application.md`, `thanks.md`, `code-of-conduct.md`, `404.html`

Layouts are applied automatically per collection via `defaults` in `_config.yml`.

## Conventions

- Content is Markdown with YAML frontmatter (`title`, `description`, `featured_image`, plus
  per-collection fields like speaker name/location/expertise).
- Use `relative_url` filters on internal links/assets so `baseurl` is respected.
- In layouts use `{{ content }}` (not `{{ page.content }}`).
- Pagination only works from the site root — listing pages use `site.posts`, not `paginator.posts`.
- News listing is paginated: `paginate: 6`, path `/news/page:num/`.

## Integrations

- **Contact form** → Formspree endpoint + hCaptcha, configured in `docs/_data/settings.yml`
  (`form_action`, `hcaptcha_sitekey`, `confirmation_url: /thanks/`). hCaptcha script and CSP
  allowances are in `_layouts/default.html`.
- **SEO/security:** CSP meta tag in `default.html`, `robots.txt` + generated `sitemap.xml`
  (URLs use `https://womenofopensource.org`, no `www`), `.well-known/security.txt`.

## Outstanding / known TODOs

- **Theme license** (`docs/_LICENSE.md`): awaiting theme creator's permission to host on GitHub. *(still open)*
- **Formspree dashboard:** hCaptcha Account Secret — ✅ done (2026-08).
- **hCaptcha dashboard:** allowed domains added — ✅ done (2026-08).
- **Contact form:** backend fully configured; do a manual end-to-end test submission (an
  automated one can't solve the hCaptcha challenge and would send a real email).
- **Partner content:** `_partners/2024-07-15-partner-1.md` ("Tech Innovators Inc.") is an
  intentional `published: false` template — replace with a real partner when one signs on,
  then the unused `docs/images/demo/` folder can be removed.
- **Hero images:** published pages currently share one interim photo (`photo-soocon.jpg`);
  swap in page-specific images when available.

## Notes

- Claude Code may be launched from the parent folder `local.womenofopensource.org/`; the git
  repo and project root is the `womenofopensource.github.io/` subfolder. For the smoothest
  experience, launch Claude from inside `womenofopensource.github.io/`.
- Prior work on this branch was done with GitHub Copilot (SEO/security/accessibility audit,
  contact form, keyboard-accessible speaker filters, jQuery 3.7.1 upgrade).
