

# 📅 Student Class Schedule Maker

A modern, accessible, SEO-optimized weekly class schedule builder for high school and college students. Data is stored locally in the browser — no sign-up needed.

---

## Pages & Structure

### Landing / Home Page
- Hero section explaining the tool with a clear call-to-action ("Create Your Schedule")
- Brief feature highlights (free, no sign-up, export & share)
- SEO-optimized with meta tags, semantic HTML, and structured content

### Schedule Builder Page
- **Weekly grid view** (Monday–Friday or Monday–Sunday toggle) with time slots along the Y-axis
- **Add Class form**: class name, instructor (optional), location (optional), day(s), start/end time, and color picker
- Classes appear as **color-coded blocks** on the grid
- Edit or delete classes by clicking on them
- **Conflict detection** — visual warning if two classes overlap

---

## Key Features

### Color-Coded Classes
- Automatic color assignment with option to customize per class
- High-contrast colors that meet WCAG accessibility standards

### Export & Share
- **Export as PNG image** for saving or printing
- **Export as PDF** for a clean printable schedule
- **Shareable link** via URL encoding the schedule data (no backend needed)

### Local Storage Persistence
- Schedule auto-saves to browser localStorage
- Option to clear/reset and start fresh

---

## Accessibility
- Full keyboard navigation for the grid and forms
- ARIA labels on all interactive elements
- Sufficient color contrast with text labels on all blocks (not relying on color alone)
- Screen-reader friendly table markup for the grid

## SEO
- Semantic HTML (`<main>`, `<section>`, `<h1>`–`<h3>`)
- Meta title, description, and Open Graph tags
- Fast-loading, client-rendered SPA with meaningful content on the landing page

---

## Design
- Clean, modern UI with a light/dark mode toggle
- Responsive — works well on desktop and mobile
- Smooth animations for adding/removing classes

