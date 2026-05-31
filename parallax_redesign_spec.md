# Portfolio Redesign Spec: Parallax Veste Coburg + Readability Upgrade
**Target:** `index.html` / `style.css` / `script.js`  
**Owner:** Minh Hieu Nguyen (scrypzt)  
**Goal:** Replace static Veste Coburg image with a 3-layer scroll + mouse parallax scene. Improve typography hierarchy. Remove projects section cleanly.

---

## 1. Color Palette (use these exact values, no deviation)

```css
--color-bg:        #0a0a0f;   /* near-black base */
--color-surface:   #111118;   /* card/section bg */
--color-border:    #1e1e2e;   /* subtle borders */
--color-text:      #e2e2e8;   /* body text */
--color-muted:     #6b6b80;   /* secondary/meta text */
--color-accent:    #7c6af7;   /* purple accent — matches existing terminal cursor */
--color-accent2:   #4fd1c5;   /* teal highlight for tags/badges */

/* Parallax sky gradient (top → bottom of #city-divider) */
--sky-top:    #0d0d1a;
--sky-mid:    #1a1025;
--sky-bottom: #2d1b3d;
```

---

## 2. Typography

**Load via Google Fonts (add to `<head>` before existing styles):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
```

**Apply these exact rules in `style.css`:**
```css
/* Remove any universal font-weight: 700 from :root or body */
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
}

h1, h2 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; letter-spacing: 0.04em; }
h3, h4  { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; }
p, li, span { font-weight: 400; }
.tag, .badge { font-weight: 500; font-size: 0.75rem; }
.meta, .date, .location { font-weight: 400; color: var(--color-muted); font-size: 0.85rem; }
```

---

## 3. Remove Projects Section (`#s2`)

### `index.html`
- Delete the entire element with `id="s2"` and all its children.
- Do not leave an empty `<section>` or placeholder comment.

### `style.css`
- Delete all CSS rules that reference `#s2`, `.project-card`, `.project-grid`, or any projects-specific class.

### `script.js`
- Find the `revealBody` transitions array (currently `['s1', 's2', 's3']`).
- Change to `['s1', 's3']`.
- Delete any translation strings, terminal commands, or data objects referencing projects (`projekt`, `projekte`, `project`).
- Search for any `document.getElementById('s2')` or `querySelector('#s2')` calls and remove them.

---

## 4. Parallax Scene: `#city-divider`

### 4a. HTML Structure (replace existing `#city-divider` contents)
```html
<div id="city-divider" aria-hidden="true">
  <div class="parallax-layer parallax-bg">
    <!-- Pure CSS sky gradient + star dots via ::before pseudo -->
  </div>
  <div class="parallax-layer parallax-middle">
    <img src="assets/veste-coburg.png" alt="" draggable="false">
    <!-- Use existing Veste Coburg photo, NOT a generated blob -->
    <!-- If SVG silhouette preferred: provide actual SVG path data, do not auto-generate -->
  </div>
  <div class="parallax-layer parallax-fg">
    <!-- CSS-only dark hill silhouette using clip-path polygon -->
  </div>
</div>
```

### 4b. CSS for `#city-divider`
```css
#city-divider {
  position: relative;
  width: 100%;
  height: 420px;          /* fixed height, not vh — avoids mobile jump */
  overflow: hidden;
  perspective: 1000px;
  background: linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 55%, var(--sky-bottom) 100%);
}

.parallax-layer {
  position: absolute;
  inset: 0;
  will-change: transform;  /* GPU compositing — do not omit */
}

/* Sky: star dots via box-shadow on ::before, no canvas, no JS */
.parallax-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  /* Generate 40–60 star dots using box-shadow with random positions */
  /* Use pixel values only, e.g.: box-shadow: 120px 40px 0 1px rgba(255,255,255,0.6), ... */
  opacity: 0.5;
}

/* Castle image layer */
.parallax-middle img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 700px;
  object-fit: contain;
  filter: brightness(0.7) contrast(1.1);  /* darken to blend with night sky */
  user-select: none;
  pointer-events: none;
}

/* Foreground hill silhouette */
.parallax-fg {
  background: var(--color-bg);
  clip-path: polygon(
    0% 100%, 0% 65%, 5% 60%, 12% 55%, 20% 52%,
    30% 58%, 40% 50%, 50% 54%, 60% 48%, 70% 53%,
    80% 58%, 90% 55%, 100% 60%, 100% 100%
  );
}
```

### 4c. JavaScript — Parallax Logic

**Scroll-based parallax (speeds are intentional, do not change ratios):**
```javascript
// Parallax scroll speeds
const PARALLAX_SPEEDS = {
  bg:     0.08,   // sky barely moves
  middle: 0.25,   // castle moves at medium speed
  fg:     0.55    // foreground moves fastest
};

const layerBg     = document.querySelector('.parallax-bg');
const layerMiddle = document.querySelector('.parallax-middle');
const layerFg     = document.querySelector('.parallax-fg');
const divider     = document.getElementById('city-divider');

let ticking = false;  // requestAnimationFrame throttle — required

function updateParallax() {
  const rect   = divider.getBoundingClientRect();
  const offset = -rect.top;  // positive when scrolled past

  layerBg.style.transform     = `translateY(${offset * PARALLAX_SPEEDS.bg}px)`;
  layerMiddle.style.transform = `translateY(${offset * PARALLAX_SPEEDS.middle}px)`;
  layerFg.style.transform     = `translateY(${offset * PARALLAX_SPEEDS.fg}px)`;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });
```

**Mouse-move 3D tilt (desktop only, max ±12deg):**
```javascript
const MAX_TILT = 12;  // degrees — do not exceed, looks unstable above 15

divider.addEventListener('mousemove', (e) => {
  const rect   = divider.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 to +1
  const dy     = (e.clientY - cy) / (rect.height / 2);  // -1 to +1

  const tiltX  = -dy * MAX_TILT;
  const tiltY  =  dx * MAX_TILT;

  // Apply tilt only to middle layer for subtle depth, not entire container
  layerMiddle.style.transform =
    `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

divider.addEventListener('mouseleave', () => {
  // Smoothly reset — transition must be set in CSS
  layerMiddle.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});
```

**Add to CSS for smooth mouse reset:**
```css
.parallax-middle {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
/* Override transition during scroll (set via JS class toggle) */
.parallax-middle.is-scrolling {
  transition: none;
}
```

---

## 5. Mobile & Accessibility

```css
/* Disable parallax on mobile — performance + no mouse events */
@media (max-width: 768px) {
  #city-divider {
    height: 260px;
    perspective: none;
  }
  .parallax-layer {
    will-change: auto;
    transform: none !important;
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .parallax-layer {
    will-change: auto;
    transform: none !important;
    transition: none !important;
  }
}
```

---

## 6. Checklist Before Shipping

- [ ] Console shows zero JS errors with `#s2` removed
- [ ] Scroll parallax: bg moves slowest, fg fastest — visually verify
- [ ] Mouse tilt: does NOT exceed 12deg in any direction
- [ ] `.parallax-middle` transition resets smoothly on `mouseleave`
- [ ] Mobile: `#city-divider` is static, no janky transforms
- [ ] `prefers-reduced-motion` disables all animation
- [ ] Font renders correctly: Bebas Neue for headings, Plus Jakarta Sans for body
- [ ] No `font-weight: 700` applied globally to body text
- [ ] All projects references purged from HTML, CSS, and JS
