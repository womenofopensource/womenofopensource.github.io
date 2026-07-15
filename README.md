# Women of Open Source

Welcome! This repository holds the source code for the [Women of Open Source website](https://womenofopensource.org/), a community platform supporting women who contribute to open source projects.

## Overview

The site is built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/). It uses Markdown for content and includes collections for speakers, partners, and blog posts.

## Contributing

We welcome contributions! Whether you're fixing a typo, improving documentation, or adding new features, your help is appreciated.

### Quick Start for Contributors

1. **Fork and Clone**
   
   First, fork this repository to your own GitHub account by clicking the "Fork" button at the top of this page.
   
   Then clone your fork to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/womenofopensource.github.io.git
   cd womenofopensource.github.io
   ```

2. **Install Dependencies**
   
   You'll need Ruby (version 2.7 or higher) and Bundler 1.x installed on your system.
   
   - **macOS**: Ruby comes pre-installed, but you may want to use a version manager like [rbenv](https://github.com/rbenv/rbenv)
   - **Linux**: Install via your package manager (e.g., `sudo apt install ruby-full`)
   - **Windows**: Use [RubyInstaller](https://rubyinstaller.org/)
   
   Install Bundler 1.17.2 (required by this project):
   ```bash
   gem install bundler -v 1.17.2
   ```
   
   Navigate to the docs folder and install project dependencies:
   ```bash
   cd docs
   bundle install
   ```
   
   **Note on Ruby Versions:** This project currently uses pinned Jekyll versions for Ruby 2.6 compatibility. If you're using Ruby 2.7 or higher, you can switch to the `github-pages` gem in `docs/Gemfile` for better parity with GitHub Pages production environment (see comments in Gemfile for instructions).

3. **Run Locally**
   
   Start the Jekyll development server:
   ```bash
   bundle exec jekyll serve --livereload
   ```
   
   Open your browser and visit: **http://127.0.0.1:4000**
   
   The site will automatically reload when you make changes to files (thanks to the `--livereload` flag).

4. **Make Your Changes**
   
   Create a new branch for your work:
   ```bash
   git checkout -b descriptive-branch-name
   ```
   
   Make your changes, test them locally, then commit:
   ```bash
   git add .
   git commit -m "Brief description of your changes"
   ```

5. **Submit a Pull Request**
   
   Push your branch to your fork on GitHub:
   ```bash
   git push origin descriptive-branch-name
   ```
   
   Go to the [original repository](https://github.com/womenofopensource/womenofopensource.github.io) and you'll see a prompt to create a pull request from your branch. Click "Compare & pull request" and provide:
   
   - A clear title describing what you've changed
   - A description of the changes and why they're needed
   - Any relevant issue numbers (e.g., "Fixes #123")
   
   We'll review your pull request and provide feedback or merge it!

## Project Structure

All website files are in the `docs/` folder:

```
docs/
├── _config.yml           # Jekyll configuration
├── _data/                # Data files
│   └── settings.yml      # Site-wide settings
├── _includes/            # Reusable HTML components
├── _layouts/             # Page templates
│   ├── default.html      # Base layout
│   ├── page.html         # Standard pages
│   ├── post.html         # Blog posts
│   ├── speaker.html      # Individual speaker profiles
│   └── partner.html      # Individual partner profiles
├── _posts/               # Blog posts (YYYY-MM-DD-title.md)
├── _speakers/            # Speaker directory entries
├── _partners/            # Partner/sponsor profiles
├── _sass/                # SCSS stylesheets
├── about.md              # About page
├── application.md        # Application form
├── contact.md            # Contact page
├── index.html            # Homepage
├── speakers/             # Speakers directory page
│   └── index.html
└── partners/             # Partners directory page
    └── index.html
```

### Key Files

- **_config.yml**: Site configuration, collections, and defaults. Changes here require a server restart.
- **_data/settings.yml**: Contact form settings and other site-wide data
- **_sass/**: SCSS files organized by component (use responsive mixins for mobile-first design)

## Content Guidelines

### Adding Content

**Blog Posts**: Create a new file in `_posts/` named `YYYY-MM-DD-title.md`

**Speakers**: Add profiles to `_speakers/` with frontmatter for name, location, expertise, etc.

**Partners**: Add profiles to `_partners/` with company details and testimonials

### Frontmatter

Each Markdown file starts with YAML frontmatter between `---` markers:

```yaml
---
title: Page Title
description: Meta description for SEO
featured_image: /images/path-to-image.jpg
---

Your content here...
```

## Development Tips

- **Live Reload**: Use `--livereload` flag for automatic browser refresh
- **Config Changes**: Restart the server after modifying `_config.yml`
- **Styles**: SCSS files are in `_sass/` and compile automatically
- **Collections**: Changes to `_config.yml` collections require a restart

## Troubleshooting

**Port already in use?**
```bash
lsof -i :4000
kill -9 [PID]
```

**Bundle issues?**
```bash
bundle update
bundle install
```

**Build errors?**
Check for YAML syntax errors in frontmatter (especially quotes and indentation).

## Code of Conduct

Please note that this project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.

## Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Connect with us through our main community channels

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

Thank you for contributing to Women of Open Source! 💜

