Folder map (V43)
  index.html            home page
  archive.html          the catalogue of everything
  styles.css, script.js one stylesheet, one script, shared by every page
  work/                 one page per case study (work/hold.html, work/deerfall.html, …)
  assets/
    home/               home-page-only images: hero paper scraps, Avatar backdrop, About photo
    art/                finished artworks (archive thumbnails, home album, hero prints)
    projects/<page>/    everything a case study shows; folder name = the page's file name
    thumbs/<page>.jpg   one 4:3 thumbnail per case study, used on home + archive
    media/              the demo reel
    textures/           paper, canvas, sticky-note textures used by styles.css
  _originals/           full-size sources — never upload this folder
    ap-art/             AP 2-D Art and Design portfolio (PDF + SI process folders)
    old-portfolio/      downloads from addisonmarlies.myportfolio.com
    <project>/          source files per project (c4d, deerfall, playa-bowls, spud, psyche-inspired, books)
    previous-site/      every earlier version, incl. the v31 "all in" exploration
    unused/             assets no page uses any more (kept, not deleted)

Adding a case study: make work/<name>.html (copy a page in work/), put its images in
assets/projects/<name>/, make assets/thumbs/<name>.jpg (4:3), then add it to archive.html
(and to Selected work in index.html if it's design work). Paths inside work/ pages start with ../

ADDISON PORTFOLIO — V25 (edit-down rebuild)

Direction
- Real work is the texture: Midnight Mass frames/cuts, PooPrint photos and sketches, scanned paper.
- No stock photography, no decorative props (tape, paperclips, film strips), no fake handwriting font,
  no custom cursor / parallax / wobbling headings.
- Case studies are built from the project decks, in Addison's own words.
- Projects without material are set in type ("Case study in progress" / "Coming soon"), never faked.
- Contact is form-only (Formspree) on purpose; no email address is published.

V26 — handmade layer (home page)
- Warm earthy palette: sage, terracotta, mustard, blush, kraft, forest on cream.
- Torn-edge colour bands (SVG masks), torn paper blocks, masking tape, white-bordered prints.
- Pen annotations in "Nothing You Could Do", using Addison's own lines from the v23 site
  (one per section). Scan real handwriting later and these can become images of your own hand.
- Everything lives in the "Handmade layer" section of styles.css; bands recolour content by
  redefining --ink / --muted / --line / --paper / --hand.

V27 — fragments of art & story
- Hero "paper" blocks are torn crops of Addison's paintings (assets/art/frag-*.jpg:
  Wheat Field sky + wheat, Make Our Mark wall, The Lovers drapery). Recrop from
  _originals/old-portfolio/ to change them.
- New "Art & writing" wall (#art): rows are justified by aspect ratio (--r on each item
  = width/height) so pieces share a height, then hung slightly off-true. Story fragments:
  Incarnate index card (titles from its table of contents, set on the card's 28px rules)
  and a Sixteen for Psyche mission note (from Addison's own project description).
- Band order: cream hero → sage work → blush about → cream art → kraft desk → forest contact.
- Archive now lists the paintings, posters and poetry collections; artworks sit whole on a mat.

V28 — one archive, edited down
- Art lives in the archive with everything else; the home page's separate art wall is gone.
  Home now ends Selected Work with a fanned stack of paintings that opens the archive.
- Archive is a book: table of contents + chapters I. Design & motion, II. Art, III. Writing
  ("writing" and "editorial" merged), IV. On the desk (in-progress work).
- Two views: Wall (salon-hung prints) and Index (numbered checklist with print thumbnails).
  The index is built by script.js from data-entry attributes on each wall piece — to add a
  piece, add it to the wall with data-title / data-year / data-kind / data-detail (and
  data-href if it has a page). The chosen view is remembered per visitor.
- Removed: discipline filters, the extra "Art" nav item, duplicate archive links.
- styles.css rewritten as one ordered system (tokens → materials → layout → home → wall →
  archive → case studies → responsive). Case-study sections use large italic numerals;
  scanned sketches are taped prints; every page ends in the forest band + footer.

V30 — collected details (from the moodboard; no new copy)
- Hero: demo reel as a strip of film (sprocket holes), a warm amber glow, three small sparkles,
  a pen underline under the role. Headings get hand-drawn underlines.
- Typewriter layer: IBM Plex Mono for metadata/labels (captions, case meta, archive index).
- Selected work: in-progress case studies are clipped manila folders; fan prints are dated.
- About: Face the Light in a gilded oval frame.
- Still making: a WORKING FILES folder, paperclips, IN PROGRESS / KEEP stamps, the original
  "From the notebook" quote card, a REFERENCE / 09.26 slide mount — all wording from the v23 site.
- Contact: the same form as a postcard (message side / address side, stamp + postmark).
- Case studies: process steps numbered by hand.
- Previous version: _originals/previous-site/v28-archive-views/.

V55 — Art → Still making transition
- The Art band's cool wash (#a8938a) warms over its last ~520px through #ae9785 to a toasted kraft
  (--warm #b49c7a), so the kraft band's torn edge meets a related warm tone; the edge gets a soft shadow.

V54 — a colour per case study
- Every case study = flat --paper colour + canvas-grain.png on top (body[class*="theme-"] rules), so
  any colour carries the texture; the header tints to match. --grain sets texture strength.
- Colours taken from each work: PooPrint sand #e7dcc9 · Playa Bowls aqua #d8e9e5 · Deerfall sage
  #a9b09c (its style-guide ground) · Spud navy #33324e (deck) · Onward peach #f2dfcb · Specimen stone
  #dcdad5 · Incarnate lavender-grey #e5e3ee · Avatar snow #dde4e8 · Hold teal #d3e4e4 · Make Our
  Mark ochre-rose #efd8cf · Mental Obscurity oxblood #2b1816 · Hear graphite paper #e8e6e1.
  Midnight Mass, Cinema 4D, A Design for Discovery, Sixteen for Psyche keep their dark grounds.
- Muted label greys re-tuned per page; all text ≥ 4.5:1 (large ≥ 3:1).

V53 — canvas texture everywhere
- Dark case studies (Midnight Mass, Cinema 4D Ident, A Design for Discovery, Sixteen for Psyche) now
  carry the same canvas weave as the light pages via assets/textures/canvas-grain.png — the canvas
  turned into transparent light/dark specks (.claude/tools/grain.swift, gain 3), laid over the page
  colour so the colour stays put. Tune strength with --grain (default .8). Light pages use the body canvas as before.
- Hero: a blank ruled index card between the cast card and the Playa Bowls print.

V52 — hero, right side filled + more breathing room
- A Playa Bowls Kiosk print sits below the cast card, tucked behind the reel (both hidden < 1200px).
- The collage has a left margin (up to 80px), so it no longer crowds the hero text.

V51 — hero, pushed
- Balance: the Midnight Mass cast card mirrors Deerfall on the opposite diagonal (hidden < 1200px).
- Materials: prints get a faint sheen + layered lift shadows; translucent tape; the kraft scrap has
  fibre texture and a torn white edge; the pen note is larger and sits on the kraft.

V50 — hero recomposed for hierarchy
- Three pieces with real scale contrast: the demo reel (largest, focal), Hold as one big print
  overlapping it (links to its case study), the Deerfall poster as a small accent peeking above Hold.
  A torn kraft scrap grounds the left; the pen note sits on it, arrow to the reel. One ink asterisk.
- Dropped from the hero: PooPrint, the Midnight Mass cast card, Animal Playing Cards, crop marks.

V49 — hero, edited down
- One torn kraft sheet (no folder), two aligned columns either side of the reel, slight tilts only,
  crop marks at the corners, print captions as small mono labels, one paperclip, one asterisk.
  The pen note sits small, bottom right (hidden below 1240px wide).

V48 — hero as a scrapbook spread
- Right side of the hero rebuilt after the moodboard (field-notes scrapbook, case-file spread):
  torn kraft sheet under the left prints, manila folder with a tab under the right prints,
  taped/paper-clipped white-border prints, the “turn the sound on” note on a torn ruled scrap,
  ink doodles (asterisk, flower, squiggle). Demo reel stays the centrepiece; left side unchanged.
- Removed: amber glow, sparkles, painted paper fragments (frag-sky/hands/shore → _originals/unused).

V47 — contrast fixes
- Drop caps use the page accent on dark themes (was a fixed oxblood; invisible on Sixteen for Psyche).
- Sixteen for Psyche: light poem cards get their own darker amber (#8a5512) for refrains and captions;
  poem titles are small mono labels like the rest of the site. Incarnate’s muted grey darkened.
- All text on the dark case studies + Incarnate checked at ≥ 4.5:1 (large numerals ≥ 3:1).
- Preview server now lives in .claude/nocache_server.py (the scratchpad copy was cleared).

V46 — art chapter edit
- II. Art opens with the NASA Psyche works (Onward to Psyche, A Design for Discovery, Specimen),
  then the AP case studies; Face the Light. and Scratch the Itch. sit together (they are a pair).
- Sic Infit, Sketch and Restless removed from the archive; their images are in _originals/unused/.

V45 — one tag vocabulary
- Discipline (archive column, first part of every case-study label, first part of home card lines):
  Motion design · Brand identity · UX/UI design · Interaction design · Painting · Illustration ·
  Drawing · Sculpture · Poetry · In progress.
- Second part = medium (Digital, Pastel, Charcoal, Mixed media) or form (Title sequence, Book …),
  then the series if any (Triptych, NASA Psyche Inspired, Self-portrait, Fan art).
  Mediums confirmed from the old portfolio’s “Material(s)” lines.
- Hold and Make Our Mark now include their old-portfolio descriptions.

V44 — showcase order, no archive dates, plain titles
- Works are ordered as a showcase, not by date: archive chapters, Selected work (Midnight Mass,
  Deerfall, Playa Bowls Kiosk, PooPrint) and the home Art prints (case studies first).
- The archive shows no years (Index or Grid); years stay in each case study's Year field.
- Acronyms spelled out: The Legend of Zelda, RIT · New Media Design/Interactive (was NMDE),
  Advanced Placement, Works Progress Administration (WPA), first-person, Deaf/hard of hearing, Cinema 4D.

V43 — art case studies, the full art archive, tidy folders
- Five art case studies built from the AP portfolio (sketchbook, studies, progress, final), copy only
  from Addison's AP written evidence / work notes and old-portfolio descriptions:
  work/avatar.html, hold.html, make-our-mark.html, mental-obscurity.html, hear.html (theme-art).
  Chain: … Specimen → Avatar → Hold → Make Our Mark → Mental Obscurity → Hear → Sixteen for Psyche.
- Archive II. Art now has every piece from the old portfolio's Art page (18), except Wheat Field
  with Cypresses — removed everywhere as a master copy. Hero scraps re-cut from Avatar.
- Home album: Mental Obscurity added; Hold, Make Our Mark, Mental Obscurity link to their case studies;
  Art header links Avatar and Hear too.
- Folders reorganised (see the folder map at the top).

V42 — one information block for every case study
- Every case-hero uses the same four fields, same order: Year · Role · Context · Made with
  (Role = what Addison did, plus collaborators; "—" where the fact isn't known yet).
- Links/references sit in one .case-links row beneath it (process document, Figma prototype,
  PDF, NASA feature, ISBN). The old boxed .credit is gone.
- Work-specific details moved into the body where they already lived (formats, structure,
  themes, format/size).

V41 — Deerfall
- deerfall.html (theme-deerfall: midnight-sky ink, forest green, rusty orange): ongoing short-film
  identity; Addison is Director of Media. Key art, moodboard, logo/icon and type exploration, style
  guide, merch mockups, casting call (rendered from _originals/deerfall/Casting_Call.pdf).
- Selected work: Deerfall replaces the Cinema 4D Ident card (Cinema 4D stays in the archive).
- Archive: Deerfall moved from "On the desk" to I. Design & motion.

V40 — Spud, Cinema 4D Ident
- spud.html (theme-spud): the tamagotchi, NMDE 203, Spring 2025. Archive only (not in Selected work).
  All copy from the deck; sketches, environment studies and screens cropped out of the slides
  (originals in _originals/spud/); the live Figma prototype is embedded.
- The Cinema 4D case study is now "Cinema 4D Ident" (dek: Start Simple. Go Anywhere.).
- Animal Playing Cards removed from the archive (still in the home hero collage).
- Chain: … Cinema 4D Ident → Spud → Onward to Psyche → …

V39 — Selected work is design work only
- Selected work (2 × 2): Midnight Mass, PooPrint, Playa Bowls Kiosk, Start Simple. Go Anywhere.
  (the Cinema 4D ident, renamed from "Cinema 4D Brand Ident"; file is still cinema-4d.html).
- The Psyche artworks link from the Art header on the home page; the books from the writing
  cluster; everything is in the archive.

V38 — every case study the same, Psyche works as their own case studies
- Selected work = all nine case studies, one identical card each, 3 × 3 (2 cols tablet, 1 phone):
  Midnight Mass, PooPrint, Playa Bowls Kiosk, Cinema 4D, Onward to Psyche, A Design for Discovery,
  Specimen (16 Psyche), Sixteen for Psyche, Incarnate. Deerfall / Identity Studies live in the archive
  ("On the desk") until they have imagery.
- assets/thumbs/<page>.jpg: one hand-cropped 4:3 thumbnail per case study, used on home + archive.
  Midnight Mass is the 1920px fire frame from the 16:9 cut, letterboxed so the hands aren't cropped.
- psyche-inspired.html retired (copy in _originals/previous-site/). New: onward-to-psyche.html
  (theme-onward), design-for-discovery.html (theme-discovery), specimen.html (theme-specimen) —
  text verbatim from the NASA gallery reflections, with sketches, moodboards and in-progress
  images. Process originals renamed in _originals/psyche-inspired/process/.
- Onward to Psyche final is now the 4050 × 6000 NASA download (was 691px).
- Archive: Onward to Psyche and A Design for Discovery moved to II. Art.
- Incarnate cover replaced with the higher-fidelity mockup (1030 × 1526).
- Chain: … Cinema 4D → Onward to Psyche → A Design for Discovery → Specimen → Sixteen for Psyche → Incarnate → …

V37 — Cinema 4D, an even Selected work grid, a real archive
- cinema-4d.html (body.theme-c4d, dark violet): with Kiera Szuba, NMDE 305 P2. Copy is the deck's own
  Product / Brand slides; moodboard, sketches, storyboard, style frames, final board, the 16:9 / 1:1 /
  9:16 cuts (15 s each, with sound), out-of-house mockups. Sources in _originals/c4d/.
- Home Selected work: Midnight Mass is a full-width feature, then pairs. Every title sits directly
  under its image (number above the title, no side-by-side cards, prints hung straight).
  The underline now runs the width of "Selected work", just under it.
- Archive is a catalogue: numbered entries per chapter (no., thumbnail, title, discipline, year,
  link), Index by default, Grid = uniform contact sheet. Entries are plain HTML in archive.html;
  script.js only switches the view. Old wall version: _originals/previous-site/archive-v36-wall.html.
- Chain: … Playa Bowls Kiosk → Cinema 4D Brand Ident → Psyche Inspired → …

V36 — Playa Bowls Kiosk
- playa-bowls-kiosk.html (body.theme-playa, teal + pink): overview, goals, workflow diagrams,
  styleguide (12 of the 23 slides), the 3-minute animated prototype, process-document link.
  All copy is from the Adobe Portfolio project page (addisonmarlies.myportfolio.com/playa-bowls-kiosk).
- Home: Selected work 03, a wide card mirrored against Psyche Inspired (.work-card.wide.flip).
- Media: the portfolio's own 1024px slides (largest it serves); prototype.mp4 re-encoded at 900 kbps
  (30 MB → 14 MB, native 830×576); cover/welcome stills taken from the 1920px prototype GIF.
  Everything downloaded is in _originals/playa-bowls/.
- .shots = captioned screenshot grid; a lone last item centres itself.
- Chain: PooPrint → Playa Bowls Kiosk → Psyche Inspired.

V35 — books + NASA Psyche Inspired
- Three new case studies, all text taken verbatim from Addison's books, PDFs and NASA reflections:
  psyche-inspired.html  (umbrella: Onward to Psyche, A Design for Discovery, Specimen, Sixteen for Psyche)
  sixteen-for-psyche.html (structure / forms, section openers, four poem excerpts, book pages)
  incarnate.html        (foreword, four sections with openers + intros, four poem excerpts)
- Themes: body.theme-psyche (deep navy, amber) and body.theme-incarnate (ink, periwinkle).
  Poems use .poem / .poem-lines (line breaks preserved) / .refrain; see the "Books" block in styles.css.
- Home: Psyche Inspired is a wide card (03) in Selected work; the writing cluster now shows both
  book covers, each linking to its case study. Archive links all three.
- Next-project chain: Midnight Mass → PooPrint → Psyche Inspired → Sixteen for Psyche → Incarnate
  → Deerfall → Identity Studies → Midnight Mass.
- Credit line links to psyche.ssl.berkeley.edu/psyche-inspired-addison-mayhew/.
- Sources: _originals/books/ (both PDFs), _originals/psyche-inspired/ (NASA page images).

V34 — Art band backdrop is "Avatar"
- assets/art/avatar-backdrop.jpg (2400px from the 3840px original; -sm 1200px for phones).
  Shown 880px tall (cover) so the reaching hands sit in the gap between prints and poetry;
  2.5px blur, light cream veil, fades into a wash sampled from the painting's bottom edge.
- Art prints are paintings/digital art only: Wheat Field, The Lovers, Face the Light., Touch,
  Make Our Mark, Hold, Mono. About pairs the charcoal "Self" with a photo of Addison.

V33 — three typefaces
- Cormorant Garamond (headlines + all reading text), IBM Plex Mono (labels, metadata, nav,
  buttons; --sans now aliases --mono), Nothing You Could Do (pen notes). Inter and Pinyon
  Script removed; script flourishes are Cormorant italic.

V32 — About + Art brought in from v31 (live)
- About is the story page: lace edge, Hold snapshot + gilded oval, script kicker, pull quote,
  two justified columns with a drop cap.
- Art is the painted band: Wheat Field backdrop (assets/art/wheat-field-backdrop.jpg, 1920px —
  the largest the old portfolio has), capped so it never upscales past its resolution and
  fading into a sampled wheat-gold wash; phones use the 1000px file. Album of dated prints,
  Incarnate card, Sixteen for Psyche cover + note. Replaces the fanned teaser.
- Limited pieces from v31's intro/contact: the role in Pinyon Script; the postcard now lies
  on a wax-sealed envelope.

V31 — "all in" exploration (separate; the live site above is unchanged)
- v31-all-in/index.html is an alternate homepage built from the full moodboard: velvet + gilded
  reel hero, lace edge + oval portrait About, evidence-board Selected work with a contents index,
  a Midnight Mass process strip (1 · 2 · 3 · final), a painted Art band with an album of prints,
  a field-notes scrapbook, and a postcard on a wax-sealed envelope. Own styles.css/script.js;
  shares ../assets and links to the existing case studies and archive. No new copy.

Files
- styles.css   One stylesheet: tokens → base → header → home → case studies → archive → responsive.
               Project pages opt into a theme via <body class="theme-midnight"> / "theme-pooprint".
- script.js    Reel sound toggle, archive filter + grid/list, contact form (stays on page; honeypot _gotcha).
- assets/      Web-ready media only. _originals/ holds full-size sources — don't upload it.
               assets/art/ = pieces from the older Adobe Portfolio (addisonmarlies.myportfolio.com)
               used in the hero; originals in _originals/old-portfolio/.

Adding a case study (Deerfall, Identity Studies, …)
- Copy the structure of pooprint.html: .case-hero, optional .case-cover, numbered .case-section blocks
  (h2 + .prose + figures with captions). Replace the "Still being written up" section.
- On index.html, swap the .pending block for an <img> and remove class "is-pending" from the card.
- In archive.html, swap the .pending block for an <img> and add an href.

Before publishing
1. Hero title and tagline are unchanged on purpose — rewrite when ready (index.html, .hero-intro).
2. Midnight Mass: confirm "Role: Designer / Animator" (carried over from the previous version).
3. Deerfall / Identity Studies: confirm the overview copy is yours (carried over from the previous version).
4. Set og:image in each page's <head> to an absolute URL (https://yourdomain/...) once the domain is live.
5. Confirm the Formspree endpoint belongs to your account.

Media notes
- Browsers decode some AVIF exports as fully transparent (seen with PooPrint finished-04 and
  Midnight Mass process-01/-04). Those are served as JPEG instead; check new AVIFs render before using them.
- Videos were re-encoded to 540p with macOS AVFoundation (16:9 cut 14 MB → 4.6 MB; 9:16 reel 12 MB → 2 MB).

Serve the folder with any local web server (e.g. python3 -m http.server) to preview.

V56 — "From the desk" now shows four pencil sketches from the Week Five "Before language — Hold" sketchbook
(Comfort, Dependence, Absence, Restraint), each captioned with the question from its page. They replace the
PooPrint ideation/size sketches, the Midnight Mass storyboard and the reference slide, which already appear
in their case studies. Crops: assets/home/hold-*.jpg; page renders and the Contradiction crop are in
_originals/hold-week-five/.
  The desk folder is now a tighter overlapping pile on screens wider than 1000px (see the
  "desk on wide screens" block in styles.css); tablet and phone layouts are unchanged.
  The archive's "On the desk" chapter (in-progress placeholders) was removed; the archive now has three
  chapters and 23 entries. work/identity-studies.html still exists and is linked only from Deerfall.

Publishing — the site is the GitHub repo addi-mars/portfolio, served by GitHub Pages at
https://addi-mars.github.io/portfolio/. Commit and push to main (GitHub Desktop works) and the live site
updates within a couple of minutes. Source files (_originals/) and local preview tools (.claude/) are kept out
of the repo by .gitignore; the originals live in ~/addison-portfolio-v23/_originals/.

V57 — Case-study page colours pushed richer and tied to each piece (sea-blue Avatar, teal Hold, terracotta
Make Our Mark, bone Hear, apricot Onward, aqua Playa, oat PooPrint, forget-me-not Incarnate, moss Deerfall);
Specimen is now dark charcoal with copper. Every themed page gets a soft light falloff from the top
(radial gradient, --glow) under the canvas grain. Pen-note colours darkened where contrast was low.
