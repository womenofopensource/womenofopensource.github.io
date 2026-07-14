# Speaker Profile Images

This directory contains profile photos for speakers in the directory.

## Image Requirements

- **Format:** JPG or PNG
- **Naming:** Use the speaker's slug (e.g., `ruth-cheesley.jpg`)
- **Dimensions:** Square images work best (recommended: 600x600px minimum)
- **File size:** Keep under 500KB for optimal page load performance

## Current Speakers

The following speaker images are in use:
- ruth-cheesley.jpg
- lorna-jane-mitchell.jpg

## Adding New Speakers

When adding a new speaker:
1. Add their profile image to this directory
2. Use the format: `firstname-lastname.jpg`
3. Reference it in the speaker's markdown file: `featured_image: '/images/speakers/firstname-lastname.jpg'`

## Hero Images

Speaker profile pages can optionally use a custom hero background image:

- **Profile Image (`featured_image`):** Displays in the sidebar and is used for the speaker card. This is required.
- **Hero Image (`hero_image`):** Optional custom background for the speaker's profile page header. If not specified, the site's default hero image will be used.

### Adding a Custom Hero Image

To use a custom hero image for a speaker's profile page:

1. Add the hero image to an appropriate directory (e.g., `/images/speakers/` or `/images/demo/`)
2. Add the `hero_image` field to the speaker's frontmatter:

```yaml
---
title: Speaker Name
featured_image: '/images/speakers/speaker-name.jpg'
hero_image: '/images/speakers/speaker-name-hero.jpg'
# ... other fields
---
```

**Hero Image Requirements:**
- **Format:** JPG or PNG
- **Dimensions:** Wide landscape format (recommended: 1920x1080px or similar)
- **File size:** Keep under 1MB for optimal performance
- **Design:** Choose images that work well with dark overlay and white text
