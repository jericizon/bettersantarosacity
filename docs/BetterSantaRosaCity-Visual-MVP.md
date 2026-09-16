# Better Santa Rosa City — Visual Experience Enhancement

You are enhancing the Better Santa Rosa City MVP.

Read and follow the existing `BetterSantaRosaCity-MVP.md` specification first.

Do NOT replace the existing product architecture or MVP scope.

Your task is to make the website feel significantly more attractive, memorable, local, and polished through:

* real Santa Rosa imagery
* editorial layouts
* subtle animation
* micro-interactions
* map-based visual storytelling
* stronger typography
* better spacing and composition
* carefully controlled color
* local visual identity

The final result should feel like:

> **A modern civic-information publication for Santa Rosa.**

Not:

> a generic government portal
> a startup landing page
> a dashboard template
> a tourism website
> an overly animated marketing site

---

# 1. DESIGN PHILOSOPHY

Use this visual blend:

* 50% modern civic technology
* 20% editorial/data journalism
* 15% Santa Rosa heritage
* 10% local geography/nature
* 5% playful/micro-interaction

The site should feel:

* trustworthy
* modern
* local
* editorial
* informative
* human
* slightly premium
* calm
* data-driven

It should NOT feel:

* corporate-government
* sterile
* overly formal
* childish
* flashy
* crypto/Web3-like
* SaaS-template-like

---

# 2. LOCAL VISUAL IDENTITY

Build the visual language around:

## Rose

Santa Rosa is named after Saint Rose of Lima.

Use an abstract rose motif.

Do NOT use:

* literal clip-art roses
* giant religious imagery
* official city seal as a decorative logo

Possible implementations:

* geometric rose
* line-art rose
* radial SVG pattern
* rose-shaped grid
* subtle rose icon

Use rose primarily as an accent.

---

# 3. CITY MAP AS A DESIGN MOTIF

The Santa Rosa map should become one of the site's signature visual elements.

Use:

* simplified SVG map
* interactive map
* subtle map-line backgrounds
* barangay highlighting
* project locations

Possible hero treatment:

```text
                 Santa Rosa map
                      ↓
              subtle animated lines
                      ↓
        "BETTER SANTA ROSA"
                      ↓
        public information search
```

Do not use an inaccurate decorative map and present it as authoritative geographic data.

If precise barangay boundaries are unavailable, use an abstract/simplified map and clearly distinguish it from the actual interactive geographic map.

---

# 4. IMAGE SOURCING

Prioritize REAL photographs of Santa Rosa.

Preferred source:

Wikimedia Commons

Main collection:

https://commons.wikimedia.org/wiki/Category:Santa_Rosa,_Laguna

Useful subcategories include:

* Buildings in Santa Rosa, Laguna
* Philippine Panorama Project / Santa Rosa, Laguna
* Nuvali
* Enchanted Kingdom
* Santa Rosa Arch
* Santa Rosa Church
* Santa Rosa roads
* Santa Rosa City Hall

Additional image sources may include:

* Unsplash
* Pexels
* official tourism/government sources where reuse permission is clear

Do NOT simply copy images from Google Images.

Do NOT download images from random blogs unless their reuse rights are explicitly clear.

---

# 5. IMAGE LICENSE RULE

Every external image must have a recorded source.

Create:

```text
/data/media.json
```

Example:

```json
{
  "id": "santa-rosa-church-01",
  "file": "/images/santa-rosa-church.jpg",
  "title": "Santa Rosa de Lima Church",
  "source": "Wikimedia Commons",
  "sourceUrl": "https://commons.wikimedia.org/...",
  "author": "AUTHOR NAME",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
  "attributionRequired": true
}
```

If attribution is required, display it appropriately.

Create an image credits page:

```text
/about/media
```

It should list:

* image
* photographer/creator
* source
* license
* source URL

Do not hide required attribution.

---

# 6. IMAGE STRATEGY

Do not fill the website with images just because images are available.

Images should communicate something.

Use approximately:

### Homepage

3–6 meaningful photographs.

### City profile

4–8 photographs.

### Heritage section

2–4 photographs.

### Barangays

Only use photographs where useful and properly sourced.

### Projects

Use project-specific photographs only when reliable/source-backed.

### Government directory

Avoid unnecessary portrait scraping.

Use official portraits only when reuse/display is appropriate.

---

# 7. HOMEPAGE HERO

Create a much stronger visual hero.

Recommended composition:

```text
┌──────────────────────────────────────────────┐
│ NAVIGATION                                   │
│                                              │
│ BETTER                                       │
│ SANTA ROSA                                   │
│                                              │
│ Public information about Santa Rosa,         │
│ made easier to find.                         │
│                                              │
│ [ Search Santa Rosa...                  🔍 ] │
│                                              │
│                          ┌───────────────┐   │
│                          │ Santa Rosa    │   │
│                          │ photograph    │   │
│                          │ / city scene  │   │
│                          └───────────────┘   │
│                                              │
│ Independent • Community maintained           │
└──────────────────────────────────────────────┘
```

Use a real local photograph.

Preferred subjects:

1. Santa Rosa city/urban environment
2. Santa Rosa Arch
3. City Hall / central city
4. Laguna/nature
5. distinctive local road/cityscape

Use image treatment:

* subtle grain
* slightly muted saturation
* warm editorial tone
* deep green overlay where necessary
* no excessive filters

Do NOT obscure the photograph so heavily that the location becomes unrecognizable.

---

# 8. HERO IMAGE MOTION

Use very subtle motion.

Possible:

* image scale from `1.00` → `1.03`
* slow background movement
* map lines moving slightly
* rose geometry appearing gradually

Duration:

```text
8–20 seconds
```

Avoid obvious looping animations.

The user should not consciously notice the animation.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled:

* disable parallax
* disable continuous animation
* keep simple fades or no animation

---

# 9. HERO SEARCH ANIMATION

The search box is the primary interaction.

On page load:

```text
Search Santa Rosa...
```

Then optional subtle placeholder rotation:

```text
Search budgets...
Search projects...
Search ordinances...
Search barangays...
Search officials...
```

Do not make the placeholder change too quickly.

Use approximately:

```text
3–4 seconds
```

per phrase.

Do not interfere with typing.

---

# 10. SANTA ROSA TODAY SECTION

Create a visually strong statistics section.

Example:

```text
18
BARANGAYS

5,543
HECTARES

2004
CITYHOOD

3
LAKEFRONT BARANGAYS
```

Animation:

* numbers count up when entering viewport
* duration around 600–900ms
* trigger once
* respect reduced-motion preference

Each number must have a source.

Do not fabricate current statistics.

---

# 11. MAP SECTION

Create:

# Explore Santa Rosa

Subtitle:

> 18 barangays. One city.

Layout:

```text
LEFT
Interactive map

RIGHT
Selected barangay information
```

Hover:

* highlight barangay
* show name

Click:

* open barangay page

Mobile:

```text
Map
↓
Barangay selector
↓
Information
```

Do not force users to interact with a desktop-style map on mobile.

---

# 12. MONEY SECTION

Create a visually editorial financial section.

Headline:

> Where does the city's money go?

Use:

* large number
* clean chart
* short explanation
* source information

Example:

```text
CITY BUDGET

₱X.XB

FY 2026

Personnel      ███████
Services       █████
Capital        ███
Other          ██
```

Charts should animate when entering the viewport.

Do not use dramatic animations.

The animation should reveal information rather than entertain.

---

# 13. PROJECT SECTION

Create:

> Building the city

Use an editorial project grid.

Each project card:

```text
[PHOTO / MAP]

PROJECT NAME

Barangay
Status

₱ amount

View project →
```

Hover:

* image zoom 1.02–1.04
* arrow moves slightly
* card elevation changes subtly

No huge bouncing cards.

---

# 14. HERITAGE SECTION

Create a visual transition between old and new Santa Rosa.

Headline:

> From Bukol to a modern city.

Use:

```text
1792
   ↓
early Santa Rosa
   ↓
agriculture & community
   ↓
industrialization
   ↓
2004
cityhood
   ↓
Santa Rosa today
```

Use historical/local imagery where licensing permits.

Possible design:

```text
IMAGE ───────────── TIMELINE
```

Then invert the layout on alternating sections.

This should feel like a magazine feature rather than a Wikipedia page.

---

# 15. IMAGE COLLAGE

Create one signature editorial image collage.

Potential composition:

```text
┌──────────────────┐
│ Church           │
│                  ├───────────────┐
│                  │ City / Road    │
└──────────────────┤               │
                   │               │
                   ├───────────────┘
                   │ Laguna / nature
                   └───────────────
```

Possible subjects:

* Santa Rosa Church
* Santa Rosa Arch
* City Hall
* road/urban environment
* Laguna/nature
* Nuvali
* heritage structure

Keep the collage asymmetrical and editorial.

Avoid Pinterest-style random image grids.

---

# 16. TYPOGRAPHY

Use strong hierarchy.

Example:

```text
BETTER SANTA ROSA
```

Small uppercase label.

Then:

```text
Public information,
made easier to find.
```

Large editorial heading.

Body:

Modern readable sans-serif.

Optional serif:

Use Source Serif 4 only for:

* historical sections
* editorial pull quotes
* major storytelling headings

Do not use serif everywhere.

---

# 17. SECTION TRANSITIONS

Avoid simply stacking:

```text
white
white
white
white
```

Use controlled visual transitions:

```text
Hero
↓
warm parchment
↓
white data section
↓
deep green project section
↓
Laguna-blue map section
↓
heritage parchment
↓
white sources section
```

Use the existing palette.

Do not turn the website into a rainbow.

---

# 18. MOTION SYSTEM

Use one consistent motion language.

### Fast

Buttons:

```text
150–200ms
```

### Normal

Cards:

```text
200–300ms
```

### Editorial

Section reveal:

```text
400–700ms
```

### Large visual

Hero/map:

```text
800–1200ms
```

Use:

```text
ease-out
```

preferably.

Avoid:

* bounce
* elastic
* excessive rotation
* spinning
* continuous floating cards
* distracting particle effects

---

# 19. SCROLL REVEALS

Use IntersectionObserver or an existing lightweight Nuxt/Vue solution.

Recommended:

```text
opacity 0 → 1
translateY 20px → 0
```

Duration:

```text
500–700ms
```

Stagger:

```text
50–100ms
```

Do not animate every tiny element.

Animate sections and meaningful content groups.

---

# 20. NAVIGATION

Desktop:

Make the navigation clean and slightly transparent/solid depending on section.

On scroll:

```text
Hero navigation
↓
compact sticky navigation
```

Transition:

```text
height
background
shadow
```

Mobile:

Use a clean slide-down menu.

Do not use an enormous full-screen animated menu unless it improves usability.

---

# 21. SEARCH EXPERIENCE

Search should feel like the site's signature feature.

When focused:

* slightly enlarge search field
* add subtle shadow
* show recent/popular categories if available
* show keyboard hint:

```text
⌘ K
```

or:

```text
Ctrl K
```

Support keyboard shortcut.

Search results should animate minimally.

Pagefind remains the underlying search engine.

Do NOT replace Pagefind with a backend search service.

---

# 22. SOURCE UI

Make source attribution beautiful.

Instead of:

```text
Source: City Government
```

Use:

```text
SOURCE
City Government of Santa Rosa
Last verified Aug 20, 2026
View original →
```

Possible small source bar at bottom of cards.

This reinforces trust.

---

# 23. FOOTER

Footer should include:

```text
BETTER SANTA ROSA

Independent public-information project.

Not affiliated with the City Government
of Santa Rosa, Laguna.

Explore
Government
Money
Projects
Laws
Services
Data

Sources
Methodology
Media Credits
Report an Error

Official City Website →
```

The disclaimer should be clearly visible.

---

# 24. IMAGE PERFORMANCE

This is extremely important.

Do NOT sacrifice performance for visual design.

For every image:

* use responsive formats
* prefer AVIF/WebP
* resize images
* lazy-load below-the-fold images
* preload only the hero image
* provide width/height
* avoid layout shift
* use appropriate object-fit
* use responsive `srcset`

Do not ship 5–10 MB camera originals.

Create optimized versions.

---

# 25. IMAGE STORAGE

For MVP, prefer:

```text
public/images/
```

for a small number of optimized local assets.

If the collection becomes large:

consider:

```text
Cloudflare R2
```

but do NOT introduce R2 merely because it exists.

Keep MVP simple.

---

# 26. IMAGE CREDIT SYSTEM

Create a reusable component:

```text
MediaCredit
```

Possible UI:

```text
Photo: Author Name
Wikimedia Commons · CC BY-SA 4.0
```

On image hover/click if appropriate:

```text
View source →
```

Also maintain:

```text
/about/media
```

with complete attribution.

---

# 27. PHOTOGRAPHIC STYLE

Prefer photographs that show:

* people in public spaces
* streets
* architecture
* greenery
* transportation
* local landmarks
* city life

Avoid relying only on:

* empty government buildings
* generic skylines
* stock businesspeople
* generic Philippine flags
* generic smiling families

The site should feel like a living city.

---

# 28. LOCAL STORYTELLING

Whenever possible, connect visual content to information.

Example:

Instead of:

```text
[pretty church photo]
```

Use:

```text
HERITAGE

Santa Rosa de Lima Church

One of the city's historic landmarks.

Explore Santa Rosa's history →
```

Image + context = meaningful content.

---

# 29. DO NOT COPY THE OFFICIAL CITY WEBSITE

Do not reproduce its visual identity.

Do not:

* copy its layout
* copy its branding
* reproduce its seal as the Better Santa Rosa logo
* imply affiliation
* scrape entire pages verbatim

Better Santa Rosa should clearly have its own identity.

---

# 30. ACCESSIBILITY

All animations must support:

```css
prefers-reduced-motion
```

All images:

```text
meaningful alt text
```

Decorative images:

```text
alt=""
```

Do not put critical information only inside images.

Text must remain readable over images.

Maintain WCAG-conscious contrast.

---

# 31. PERFORMANCE BUDGET

The visual upgrade must not destroy performance.

Target:

```text
Lighthouse Performance: 90+
LCP: < 2.5s
CLS: < 0.1
INP: < 200ms
```

Do not load:

* large animation libraries
* heavy 3D engines
* unnecessary video
* giant image galleries

Prefer:

```text
CSS
SVG
IntersectionObserver
native browser APIs
```

over heavy libraries.

---

# 32. FINAL VISUAL TEST

Before considering the visual implementation complete, ask:

### At first glance:

> Does this immediately feel like Santa Rosa?

### After 5 seconds:

> Does this look different from a government portal?

### After scrolling:

> Does the design tell a story?

### When viewing data:

> Does the design make the information easier to understand?

### When viewing sources:

> Does the site feel trustworthy?

### On mobile:

> Is it still beautiful and easy to use?

If the answer is no, iterate.

---

# 33. FINAL CREATIVE DIRECTION

The finished website should communicate:

> **A city with old roots, rapid growth, and a lot of public information worth understanding.**

Use:

**real Santa Rosa photography + maps + editorial typography + data visualization + subtle motion**

to create a civic website that feels genuinely local.

The goal is not to make the website flashy.

The goal is to make people want to **explore the information**.

---

# 34. IMPLEMENTATION PRIORITY

Implement in this order:

### Phase A — Foundation

1. Typography
2. Color system
3. spacing system
4. image system
5. motion system
6. reusable components

### Phase B — Homepage

7. hero
8. hero image
9. search
10. city statistics
11. map
12. budget section
13. project section
14. heritage section
15. source section

### Phase C — Content pages

16. city profile
17. barangays
18. government
19. money
20. projects
21. laws
22. services
23. sources

### Phase D — Polish

24. responsive behavior
25. accessibility
26. reduced motion
27. image optimization
28. SEO
29. Lighthouse
30. visual QA

Do not move to Phase D until the visual hierarchy and core homepage are strong.

---

# FINAL RULE

Do not make the website “fancy.”

Make it **beautiful because the information is presented beautifully**.

Every animation, image, color, and interaction must support:

**discover → understand → verify.**
