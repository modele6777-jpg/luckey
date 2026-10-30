# Oracle historical decks — v1.4.610

## Money Rule picture cards — v1.4.631

The Grimaud scans stay the artwork. Each of the 78 faces is the inner illustration only, scaled to fill a tarot card the way the healing, miracle, and growth decks already do. A shared ink border, index, and Korean title plate (the names the reading already uses) replace the wide cream margin and French captions. No new illustration was generated. Saved 21-card Pussey readings still use `oracle-decks/money/`.


All four current oracle modes now use **complete 78-card decks** (22 major + 14 in each of four suits).

| Mode | Current deck | Cards |
| --- | --- | ---: |
| Healing | Rider–Waite–Smith 1909, Roses & Lilies | 78 |
| Miracle | Jacques Viéville, c.1650, BnF btv1b10510963k | 78 |
| Growth | Jean Dodal, c.1701, BnF majors plus B/C/D/E minor scans | 78 |
| Money Rule | Grand Etteilla I, B. P. Grimaud, BnF btv1b10543181f | 78 |

The original Wirth deck has only 22 majors; do not invent 56 minors or mix unrelated images and call it an original full deck. Its 22 images and the prior H. Pussey selection of 21 are retained for saved readings. `getOracleReadingDeck` resolves old Wirth follow-ups to that same old pool. Current cards have edition-specific deck IDs (`miracle_vieville`, `money_grimaud`) and routes, so old records keep their original edition.

**Grimaud scan order audit:** pages are not in card-number order. Odd scan fronts 1–60 map to printed cards 1–60; scans 61–70 map to cards 69–78; scans 71 and 72 are plain card backs and are excluded; scans 73–80 map to cards 61–68. Every printed number 1–78 occurs exactly once. The original page, `sourceScan`, and `printedNumber` are recorded. Card 49 is the cup ace, 63 the sword ace, 67 the coin page, 68 the coin ten, and 78 Folie. OCR was checked against a visual contact sheet before assignment.

Viéville numbering is **VII Justice, VIII Chariot, IX Strength, XI Hermit**, mapped by meaning to standard interpretation IDs. Other majors and all minor suits/ranks are mapped by meaning. Artwork descriptions from Waite are not reused as assertions about the other historical images. Minor suit interpretations and Money Rule hints are modern app adaptations, not quotations from antique guidebooks.

Assets are optimized at up to 320px width, WebP quality 55 for mobile/PC card sizes. There are 312 current fronts and 43 legacy fronts. Every file has a Commons source page, original URL, and checked public-domain mark in `src/data/oracleDeckAssets.json`. No artwork was generated or redrawn. Full-deck tests verify all suit counts, image files, metadata, numbering and legacy compatibility.

Current additional sources:
- https://commons.wikimedia.org/wiki/Category:Vi%C3%A9ville_tarot
- https://commons.wikimedia.org/wiki/Category:Jeu_de_tarot_divinatoire_dit_%22Grand_Etteilla%22_ou_%22tarot_%C3%A9gyptien%22_-_jeu_de_cartes,_estampe_-_btv1b10543181f

The Worker embeds all images. Package only `.openai/hosting.json` and `dist/server/`, then verify the embedded image routes byte-for-byte before publication.

---

## Previous selection — v1.4.609

These are reproductions of existing historical artworks, not generated illustrations. The assignment to healing, ACIM, growth, or Money Rule is a modern application choice, not a claim that the historic artists created decks for these practices.

| Mode | Edition / selection | Cards | Rationale |
| --- | --- | ---: | --- |
| Healing | Rider–Waite–Smith, 1909, Roses & Lilies | 78 | Narrative scenes for emotional reflection |
| Miracle | Oswald Wirth, 1889, BnF scans | 22 major | Symbolic introspection and perspective change |
| Growth | Jean Dodal, c.1701, M00–M21 BnF scans | 22 major | Choice, agency, balance, change |
| Money Rule | Grand Etteilla I, H. Pussey, c.1890, 01–21 | 21 selected major cards | Historical divinatory imagery, interpreted as money habits |

Each image's Commons file page, original asset URL, public-domain mark, creator and source filename are in `src/data/oracleDeckAssets.json`. Imageinfo/extmetadata was checked for every downloaded file; any file not marked public domain was rejected. The art was downloaded and resized to 420px-wide WebP (quality 74); low-resolution duplicates and an upside-down Dodal Death scan were excluded. No imagery was generated, redrawn or recolored. A full historical Etteilla deck contains more cards; this is explicitly a 21-card selection, not a complete deck.

Dodal/Wirth Justice VIII maps by **meaning** to `major_11`; Strength XI maps to `major_8`. Other major archetypes map by meaning to existing interpretation IDs. Etteilla has its **own** `etteilla_1`–`etteilla_21` IDs, translated titles, keywords and modern practical reading hints. It is not relabeled as a Waite deck. Reading hints are application-authored reflections, not quotations from historical guidebooks. Reverse orientation is a modern reflective reading, not an assertion of canonical Etteilla reversed meanings.

Card objects retain `deckId`, `imageUrl`, `sourceUrl`, and the source title through wheel selection, result, zoom, sharing, follow-up cards and saved sessions. The three main modes use their selected deck for text toss and further draws. Older saved Waite readings retain their old objects/images and use the old Waite pool for follow-ups; they are never silently re-skinned.

Sources:
- https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)
- https://commons.wikimedia.org/wiki/Category:Oswald_Wirth_tarot_deck
- https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_-_Jean_Dodal
- https://commons.wikimedia.org/wiki/Category:Etteilla_I_tarot_deck

Sites packaging: all assets are embedded (gzip/base64) in the generated Worker by `scripts/build-sites.mjs`. Package `.openai/hosting.json` and `dist/server/` only, avoiding a second copy of the images already embedded in that Worker. Verify embedded paths before packaging. This changes no runtime behavior or asset route.
