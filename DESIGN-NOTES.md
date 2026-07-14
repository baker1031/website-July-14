# Baker 1031 Property Exchange — design and implementation notes

This project is a fresh-start static prototype. Do not import or reuse existing production data unless it is intentionally supplied and approved for the specific work. Current offering and content examples are placeholders or user-supplied prototype data.

## Shared visual system

- Font: Proxima Nova first, with Avenir Next/Avenir/Helvetica/Arial fallbacks.
- Primary blue: `#4c8eff`.
- Navy ink/deep background: `#1c283b`.
- Light surface/page neutral: `#f4f4f5`.
- Page background: white.
- Keep letter spacing normal for primary page titles. Avoid tight negative tracking on H1/H2 text.
- Use medium-weight headings with generous line height and readable body copy.
- Eyebrow and kicker labels use regular weight (`400`); letter spacing and uppercase styling provide hierarchy instead of bolding.
- Use modest borders, 6–8px corner radii, blue focus/interactive states, and restrained shadows.

## Shared page chrome

- The header is sticky on every page.
- The connected header navigation is: Investments, Content, and Learning Hub.
- `navigation.js` is the single source for shared navigation markup and active-page state.
- `footer.js` is the single source for shared footer markup.
- Pages contain lightweight mount points for those scripts so the pattern works when the HTML files are opened directly from disk.
- The Content landing page is `content.html`.
- The Learning Hub is `learning-hub.html`.
- The property catalog is `property-exchange-cards.html`.
- Offering detail pages use `investment-offering.html?offering=<offering-key>`.
- Breadcrumbs should remain present and should link back to the relevant parent page.
- `styles.css` is the shared stylesheet for tokens, global type defaults, common chrome, breadcrumbs, footer, and responsive navigation. Keep page-specific layout rules in the owning HTML file unless a rule is genuinely shared; this prevents the catalog grid, offering detail template, and Learning Hub reader from inheriting incompatible layout rules.

## Content landing page

- `content.html` is the directory for the content section.
- It currently presents seven areas: Investment Education, 1031 Exchange Strategies, Calculators, Sponsor Profiles, Glossary, FAQ, and Property Types.
- Each area links into the Learning Hub with a content-type query and article hash.
- Keep area descriptions concise and user-facing; use the cards to explain what is available, not to reproduce every article.

## Learning Hub

- `learning-hub.html` uses a left rail and a full-width article reader.
- Desktop: the rail is sticky and the article area fills the remaining width.
- Smaller screens: the rail collapses into a Browse learning topics control rather than wrapping into a crowded column.
- Content-type filters currently include All content, Investment Education, 1031 Exchange Strategies, Calculators, Sponsor Profiles, Glossary, FAQ, and Property Types.
- Topic filters remain separate from content-type filters.
- Content-type URLs use `?type=<encoded type>#<article-id>` so landing-page cards can open the correct filtered view.
- Articles, tools, and resources should include:
  - a visible author block;
  - a rectangular author photo or clearly labeled photo placeholder;
  - a short bio, labeled email, labeled phone, and link to the full bio;
  - content type and placeholder status in the metadata;
  - an item-specific disclosure section;
  - a clear distinction between educational content, planning tools, and investment-offering content.
- Author contact details and photos must not be invented. Use clearly labeled placeholders until approved information is supplied.
- Placeholder articles must remain clearly labeled until approved content replaces them.

## Property catalog

- `property-exchange-cards.html` is a full-width, responsive catalog.
- Cards are clickable as a whole and should retain a maximum readable width. Empty space is preferable to cards expanding beyond comfortable reading size.
- Cards load additional offerings on scroll instead of using pagination.
- Keep property image heights consistent across cards.
- Card attributes currently include property photo, investment name, Year 1 yield, LTV, availability status, cap rate equivalent, sponsor logo, and property type.
- Do not repeat property type or sponsor name when the sponsor logo/property label already communicates it.
- Sponsor logos may have different intrinsic widths, but the logo area should have a controlled maximum height and preserve aspect ratio.
- Availability pills have no status dot, use the card radius, and should remain visually secondary to the property name.
- Favorite stars use the blue color scheme and are wired to the shared bookmark state.
- Recommended offerings may show the `Baker 1031 Recommended For You` ribbon overlapping the lower edge of the image.
- Filters are compact uniform controls that open drawers/popovers. Yield, cap rate, and LTV support min/max entry and sliders. Other filters are multi-select. State uses full state names.
- Default ordering is New, Coming Soon, Available, Limited, Closed, then alphabetical within status.
- Catalog tabs include All Investments, Bookmarks, Delaware Statutory Trust, Opportunity Zone Fund, and REIT. Mineral Royalties belong in the DST bucket.
- Bookmarks support remove/restore history and comparison. Bookmark history and comparison controls should only appear inside the Bookmarks view.

## Offering detail page

- `investment-offering.html` is the detail template for mapped offering records. Keep the supplied field mapping stable; do not splice or move source fields when the page is eventually connected to live data.
- The page includes a return-to-listings action, bookmark/save action, offering-document jump action, sticky header, and a bottom sticky table of contents that collapses on smaller screens.
- The investment professional card belongs under the property photo and is not included in the table of contents.
- Offering documents should be presented as direct client-facing download links; do not display gated labels or repeat the investment name in every row.
- Financial forecast should show all ten years in a horizontal table on wide screens and a vertical table on tighter screens. Forecast bars must use actual values, not equal-height placeholders.
- Plan for shorter holds, post-hold years, zero-coupon offerings, undisclosed yields, and all-cash/no-loan offerings.
- Pros, Cons, and Analysis are stacked vertically. Benchmark cards appear above them, use light green/grey/orange status treatments, and put the status in the upper-right corner.
- Do not show source data on the client-facing page.
- Show the private REIT/721 section only when the offering has a Mandatory or Optional 721 Exchange status.
- Keep dynamic FAQ questions specific to the offering, structure, property type, leverage, cash flow, 721 status, documents, and benchmarks.

## Responsive behavior

- Prefer grid reflow and controlled max widths over horizontal overflow.
- On smaller screens, collapse filters, table-of-contents links, and Learning Hub rails into controls.
- Keep cards and content areas usable between desktop and mobile widths, not only at named breakpoints.
- When a horizontal financial table is too wide, switch to a vertical year/metric layout.
- Preserve readable padding and avoid title, tooltip, status, and benchmark overlaps.

## Content and compliance guardrails

- Placeholder content must be labeled as placeholder content.
- Educational pages are not investment, tax, or legal advice.
- Tax-adjusted yield, cap rate equivalent, growth rate, 1031, and 721 explanations should include plain-language context and avoid individualized conclusions.
- Do not invent sponsor contact details, professional names, photos, offering facts, or document access permissions.
