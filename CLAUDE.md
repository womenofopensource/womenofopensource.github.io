# Women of Open Source — Project Guide

Source for the [Women of Open Source website](https://womenofopensource.org/), a
Jekyll site hosted on GitHub Pages.

- **Repo:** `womenofopensource/womenofopensource.github.io`
- **Branches:** work happens on short-lived branches off `main`; `main` auto-deploys to
  production via GitHub Pages (legacy build from `main` / `/docs`). The `new-theme` branch
  (PR #9) has been merged and is deprecated.
- **PR workflow:** every PR gets an automatic GitHub Copilot review — wait for it, address
  its findings, and re-request the review before merging.
- **The entire Jekyll site lives in `docs/`.** Run all Jekyll commands from `docs/`.

## Tech stack

- **`github-pages` gem** (in `docs/Gemfile`) — matches the GitHub Pages production build
  exactly: Jekyll **3.10.0**, github-pages **232**, kramdown **2.4** (GFM input), Rouge.
- Ruby **3.3.4** (pinned via `docs/.ruby-version`), Bundler **2.x**.
- Plugins are provided by the github-pages gem: `jekyll-paginate`, `jekyll-sitemap`.
- SCSS in `_sass/`, compiled compressed.

## Local development

Prerequisites: **Ruby 3.3.4** (via a version manager such as rbenv; `docs/.ruby-version`
pins it) and a **UTF-8 locale** (`export LANG=en_US.UTF-8`). Without UTF-8, local Sass
builds fail on the github-pages default theme's non-ASCII characters; GitHub's build
servers are UTF-8 already, so this only affects local builds.

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

- **Theme license** (`docs/_LICENSE.md`): ✅ resolved — team decided use-not-redistribute is fine (2026-08).
- **Formspree dashboard:** hCaptcha Account Secret — ✅ done (2026-08).
- **hCaptcha dashboard:** allowed domains added — ✅ done (2026-08).
- **Contact form:** ✅ fully working — verified end-to-end (Formspree + hCaptcha + `/thanks/`
  redirect) with a live test submission (2026-08).
- **Partner content:** `_partners/2024-07-15-partner-1.md` ("Tech Innovators Inc.") is an
  intentional `published: false` template — replace with a real partner when one signs on,
  then the unused `docs/images/demo/` folder can be removed.
- **Hero images:** published pages currently share one interim photo (`photo-soocon.jpg`);
  swap in page-specific images when available.

## Notes

- Claude Code may be launched from the parent folder `local.womenofopensource.org/`; the git
  repo and project root is the `womenofopensource.github.io/` subfolder. For the smoothest
  experience, launch Claude from inside `womenofopensource.github.io/`.
- The initial new-theme rework was done with GitHub Copilot (SEO/security/accessibility
  audit, contact form, keyboard-accessible speaker filters, jQuery 3.7.1 upgrade).
