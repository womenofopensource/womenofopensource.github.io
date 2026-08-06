---
published: false
---

# Adding a speaker profile

Speaker profiles live in this folder (`docs/_speakers/`). Each speaker is one
Markdown file. When you add one, it automatically appears in the
[Speakers Directory](https://womenofopensource.org/speakers/) and gets its own
page at `/speakers/<slug>`.

> **Note:** this `README.md` is not published (`published: false` in its front
> matter), so it never shows up as a speaker or on the site.

## How to add yourself

1. **Create a file** named after the speaker, e.g. `firstname-lastname.md`.
2. **Add the front matter** (the block between the `---` lines) using the
   template below, filling in your details.
3. **Add a photo** to `docs/images/speakers/` and point `featured_image` at it —
   see [`docs/images/speakers/README.md`](../images/speakers/README.md) for size
   and naming guidance.
4. **Write your bio** in Markdown *below* the closing `---`. This becomes the
   "About" section.
5. **Open a pull request.** Once merged, your profile is live.

## Template

Copy this into your new file and edit the values. Remove any optional fields you
don't need (see the table below).

```markdown
---
title: Ada Lovelace                       # browser tab / SEO title (usually same as name)
name: Ada Lovelace                        # display name
slug: ada-lovelace                        # URL: /speakers/ada-lovelace
tagline: Mathematician & the first programmer
description: Ada Lovelace speaks about the history and future of computing.
featured_image: '/images/speakers/ada-lovelace.jpg'
location: United Kingdom                  # country (used for the country filter)
employer: Analytical Engines Ltd          # optional
languages:                                # optional
  - English
  - French
expertise:                                # topics (used for the expertise filter)
  - Computing History
  - Mathematics
  - Algorithms
profiles:                                 # all optional — only those you add are shown
  sessionize: https://sessionize.com/ada
  linkedin: https://linkedin.com/in/ada
  mastodon: https://mastodon.social/@ada
  bluesky: https://bsky.app/profile/ada.example
  twitter: https://twitter.com/ada
  github: https://github.com/ada
  website: https://ada.example
talks:                                    # optional — one entry per talk
  - title: "Notes on the Analytical Engine"
    abstract: "How a general-purpose machine could go beyond calculation. [Read the slides](https://example.com/slides)."
    delivered_at:
      - Some Conference, 2026
hero_image: '/images/speakers/ada-hero.jpg' # optional banner; falls back to a default photo
---

Write your bio here in Markdown. This is the "About" section on your profile
page — a few short paragraphs about who you are and what you speak about.
```

## Field reference

| Field | Required | Where it appears |
|---|---|---|
| `title` | ✅ | Browser tab / SEO `<title>`. Usually the same as `name`. |
| `name` | ✅ | Display name — profile hero heading, "About …", and the directory card. |
| `slug` | ✅ | The page URL: `/speakers/<slug>`. Use lowercase with hyphens. |
| `featured_image` | ✅ | Photo shown on the profile sidebar, the directory card, and as the social‑share image. |
| `tagline` | Recommended | Short one‑line role/description under the name (hero + card). |
| `description` | Recommended | SEO meta description for the profile page. |
| `location` | Recommended | Country. Shown on the hero (📍) and card, and powers the **country filter**. |
| `expertise` | Recommended | List of topics. Shown as tags (sidebar + card) and powers the **expertise filter**. |
| `employer` | Optional | Shown on the hero (💼). Also searchable. Not shown on the card. |
| `languages` | Optional | List. Shown in the sidebar "Languages" box (hidden if omitted). |
| `profiles` | Optional | Social/profile links shown as icons on the hero. Supported keys: `sessionize`, `linkedin`, `mastodon`, `bluesky`, `twitter`, `github`, `website`. Only the ones you add are shown. |
| `talks` | Optional | List of talks in the "Speaking Topics" section. Each has `title`, `abstract`, and optional `delivered_at` (a list of events). |
| `hero_image` | Optional | Banner image behind the hero. Falls back to a default community photo if omitted. |
| *(body text)* | Recommended | Everything below the front matter is your **bio** (the "About" section), written in Markdown. |

## Notes

- **Optional sections are hidden when empty** — e.g. no `languages` means no
  Languages box; no `talks` means no Speaking Topics section.
- **Markdown works in your bio and in talk `abstract`s.** Add links with
  `[link text](https://…)` — descriptive link text (e.g. `[watch the talk](…)`)
  reads better and is more accessible than a bare URL. For security, any raw HTML
  in an abstract is escaped (shown as plain text, not rendered), and bare URLs /
  `<https://…>` autolinks are **not** made clickable — always use the
  `[link text](https://…)` form.
- **`expertise` and `location` values are shared filters** across the directory,
  so reuse existing wording where it fits (e.g. "APIs", "United Kingdom") to keep
  the filter lists tidy.
- **Photos:** keep them reasonably sized and consistent — see
  [`docs/images/speakers/README.md`](../images/speakers/README.md).
