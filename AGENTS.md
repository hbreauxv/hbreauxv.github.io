# Harvey Breaux portfolio

## Content authority

`content/resume.md` is the source of truth for public professional facts. Use only the supplied résumé and Harvey's explicit corrections. Do not research or feature his old GitHub projects. Link to his GitHub profile only. Highlight JavaScript, not Go. Do not infer proficiency levels or new achievements.

Do not invent metrics, job dates, credentials, testimonials, availability, customer endorsements, proprietary implementation details, or live operational data. Preserve approximate qualifiers such as `~`. Work examples are descriptions of employment accomplishments, not public repositories or working product demos. The homepage system diagram is explicitly illustrative.

Publish city/state, email, GitHub, and LinkedIn. Omit phone number and ZIP code unless Harvey explicitly requests them. The current résumé says Alkira is February 2022–Present; change that only with new information from Harvey.

## Updating the résumé

1. Update `content/resume.md`, preserving its heading and field conventions. `##` headings are section names; `###` headings introduce experience or featured-work entries. Metadata lines use `- Key: value`. Experience accomplishments use ordinary `- ` bullets. Paragraphs describe profiles and featured work.
2. Keep featured-work descriptions and metrics consistent with Experience when either changes. Only feature accomplishments supported by the résumé. When new accomplishments are added or the portfolio emphasis changes, propose an ordered top three to Harvey with a brief rationale for each, and get his selection before changing the featured lineup or lead project. Preserve the existing selection while awaiting a response. Do not hard-code a preferred project or permanent ordering in these instructions. The `Featured work` section in the Markdown records the current approved selection and its order. Add or remove complete `###` entries as necessary. Diagram values currently supported by the renderer are `agent`, `tooling`, and `extension`; extend the renderer before introducing another value.
3. Run `npm run build` and `npm run check`. The build regenerates `dist/index.html`, `dist/resume.html`, and the downloadable Markdown, using escaped content. Do not edit generated files in `dist`.
4. Preview with `npm run dev`. Review desktop/mobile layout, keyboard navigation, featured-work details, diagram tabs, résumé, and contact links when browser tools are available. Report any verification limitations.

## Implementation

This is a dependency-free static site with a Node 22+ build script. Keep its output portable to GitHub Pages, including project-subdirectory hosting. `src/index.html` controls layout; `src/styles.css` controls design; `src/app.js` supplies progressive enhancement. Content remains readable and links work without JavaScript. Honor reduced motion; use semantic HTML and accessible controls.

`AGENTS.md` guides an agent when one runs; it does not schedule an agent. Routine content updates need only a build, not agent-generated rewrites. The GitHub Actions workflow deploys on pushes to `main` after the owner enables Pages with GitHub Actions. Do not claim the site is published until a deployment has actually succeeded. Do not create a remote repository or publish publicly without an explicit publishing request.
