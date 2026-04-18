---
project_name: 'ThanatosJun Portfolio'
user_name: 'Thanatos'
date: '2026-04-17'
sections_completed: ['technology_stack', 'language_rules', 'architecture', 'code_style', 'workflow', 'critical_rules']
existing_patterns_found: 10
---

# Project Context for AI Agents

_Critical rules and patterns for implementing code in this project. Focuses on unobvious details agents might otherwise miss._

---

## Technology Stack & Versions

- **HTML5** — single page (`index.html`), `lang="zh-Hant"`
- **CSS3** — custom properties only, no preprocessor, no framework
- **JavaScript ES6+** — vanilla, no TypeScript, no bundler, no npm/package.json
- **Browser APIs**: Canvas 2D, Fetch API, IntersectionObserver, Web Audio API
- **Google Fonts CDN**: Noto Sans TC (300/400/700) + Zen Maru Gothic (400/700)
- **Hosting**: GitHub Pages — auto-deploy on push to `main`, no CI/CD, no build step
- **Dev server**: `python -m http.server 8000` (required — `file://` breaks `fetch()`)

---

## Architecture: Data-Driven Single Page

All visible content is **JSON → JS → DOM**. HTML sections are empty containers filled at runtime.

| File | Role |
|---|---|
| `index.html` | Shell only — empty `<div>` containers per section |
| `data/projects.json` | `{ projects: [...], videos: [...] }` |
| `data/poems.json` | Array of poem objects with `stanzas[]` |
| `data/about.json` | `{ tagline, interests: [{ icon, label }] }` |
| `css/style.css` | CSS variable theming via `:root` |
| `js/main.js` | All logic — Canvas, loaders, event handlers |

---

## Critical Implementation Rules

### Content Architecture

- **NEVER hard-code content in HTML.** All user-visible text/images go in `data/*.json` → loaded by JS.
- To add/update content: edit the relevant JSON file only, no HTML changes needed.
- `data/projects.json` root has two keys: `projects` (array) and `videos` (array) — don't flatten this structure.

### JavaScript Initialization Lifecycle

DOMContentLoaded fires all init/load functions in this order:
```
initStarfield → initMusicPlayer → initMusicOverlay → initSmoothScroll → initNavbarScroll
→ loadAbout → loadProjects → loadVideos → loadPoems
```

**Critical**: `initScrollAnimations()` and `initSlideshows()` are called **inside** `loadProjects().then()` — they depend on DOM nodes that don't exist until the fetch resolves. Never call them at top-level.

**Critical**: `initVideoMusicToggle()` is called **inside** `loadVideos().then()` for the same reason.

### CSS Variable System

All colors **must** reference `:root` variables — never use raw hex values in new rules:

```css
--bg-deep: #0a0a1a      /* page background */
--bg-mid: #0f0f2d
--bg-card: #16163a      /* card backgrounds */
--accent-purple: #6c5ce7
--accent-blue: #74b9ff
--accent-pink: #fd79a8
--text-primary: #e8e8f0
--text-secondary: #a0a0c0
--text-muted: #6a6a90
--glow-purple: rgba(108, 92, 231, 0.4)
--glow-blue: rgba(116, 185, 255, 0.3)
--font-jp: 'Zen Maru Gothic', 'Noto Sans TC', sans-serif
--font-main: 'Noto Sans TC', 'Zen Maru Gothic', sans-serif
--transition: 0.3s ease
```

### z-index Layering

- `#starfield` (Canvas): `z-index: 0`, `position: fixed`, `pointer-events: none`
- All content sections: `z-index: 1`, `position: relative`
- Navbar: `z-index: 100`
- Music overlay: `z-index: 200`

### Naming Conventions

- **CSS classes**: kebab-case (`.project-card`, `.card-image`, `.poem-body`)
- **JS functions**: camelCase, prefixed with `init` (setup/bind) or `load` (fetch+DOM)
- **Files**: kebab-case (`style.css`, `main.js`, `about.json`)
- **Section titles**: always dual-language — `<span class="title-jp">` + `<span class="title-en">`

### Scroll Animation Pattern

Cards start hidden via CSS (`opacity: 0; transform: translateY(30px)`), become visible when IntersectionObserver fires `.visible` class. New card-type elements must include this initial hidden state or they'll appear without animation.

### Image Handling

- Single image: `{ images: [{ src, alt }] }` → plain `<div class="card-image"><img>`
- Multiple images: `{ images: [...] }` (length > 1) → `<div class="card-slideshow">` with `.slide` / `.slide.active` classes; interval 3000ms
- Placeholder (no images): `{ placeholder: "emoji" }` → `<div class="card-image-placeholder">`
- Always use `loading="lazy"` on card images

### Music System

- `isMusicPlaying` is a module-level boolean in `main.js` — shared across `initMusicPlayer`, `initMusicOverlay`, `initVideoMusicToggle`
- Music overlay appears on load and removes itself on first click — created dynamically in JS, not in HTML
- Audio volume is always set to `0.3` before playing

---

## Development Workflow

- Push to `main` → GitHub Pages auto-deploys (usually < 1 min)
- No linting, no tests, no CI
- Always test with `python -m http.server 8000`, never `file://`
- Images go in `images/`, audio in `audio/`, video in `video/`

---

## Anti-Patterns to Avoid

- ❌ Adding `<script src="...">` for external JS libraries — zero external JS dependencies
- ❌ Using `innerHTML` on sections directly — always go through the `load*()` functions
- ❌ Hard-coding colors as hex in CSS — use CSS variables
- ❌ Calling `initScrollAnimations()` before `loadProjects()` resolves
- ❌ Opening `index.html` with `file://` and wondering why content is missing
- ❌ Adding a build step or `package.json` — this is intentionally build-free
