import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFile(path.join(root, file), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const required = (object, key, context) => {
  if (!object[key]?.trim()) throw new Error(`Missing ${key} in ${context}`);
  return object[key];
};

function parseMarkdown(markdown) {
  const sections = {};
  let name = '', section, entry;
  for (const line of markdown.replace(/\r/g, '').split('\n')) {
    if (line.startsWith('# ')) { name = line.slice(2).trim(); continue; }
    if (line.startsWith('## ')) {
      const key = line.slice(3).trim();
      if (sections[key]) throw new Error(`Duplicate section: ${key}`);
      section = sections[key] = { fields: {}, paragraphs: [], bullets: [], entries: [] };
      entry = undefined;
      continue;
    }
    if (!line.trim()) continue;
    if (!section) throw new Error('Content must follow a section heading');
    if (line.startsWith('### ')) {
      entry = { title: line.slice(4).trim(), fields: {}, paragraphs: [], bullets: [] };
      section.entries.push(entry);
      continue;
    }
    const target = entry ?? section;
    const field = line.match(/^- ([^:]+): (.+)$/);
    if (field) {
      if (target.fields[field[1]]) throw new Error(`Duplicate field: ${field[1]}`);
      target.fields[field[1]] = field[2].trim();
    } else if (line.startsWith('- ')) target.bullets.push(line.slice(2));
    else target.paragraphs.push(line.trim());
  }
  if (!name) throw new Error('Missing name');
  for (const key of ['Profile','Skills','Experience','Featured work','Additional impact']) {
    if (!sections[key]) throw new Error(`Missing section: ${key}`);
  }
  return { name, sections };
}

const markdown = await read('content/resume.md');
const { name, sections } = parseMarkdown(markdown);
const profile = sections.Profile.fields;
for (const key of ['Title','Location','Email','GitHub','LinkedIn']) required(profile, key, 'Profile');
if (!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(profile.Email)) throw new Error('Invalid contact email');
for (const key of ['GitHub', 'LinkedIn']) {
  if (new URL(profile[key]).protocol !== 'https:') throw new Error(`${key} must use HTTPS`);
}
const featured = sections['Featured work'].entries;
if (featured.length !== 3) throw new Error('Choose exactly three featured projects');
if (!sections.Experience.entries.length) throw new Error('No experience entries');
const e = escape;

function projectVisual(entry) {
  const fields = entry.fields;
  const kind = required(fields, 'Diagram', entry.title);
  const label = e(fields.Result);
  if (kind === 'agent') return `<div class="project-visual"><span class="visual-heading">${label}</span><div class="mini-agent-root"><span aria-hidden="true">✳</span> QA Agent</div><div class="mini-agent-trunk"></div><div class="mini-agent-branches"><span>UI actions</span><span>SSH / portal</span><span>Sub-agents</span></div><p class="visual-caption">Test plan → delegated execution<br>Illustrative workflow</p></div>`;
  if (kind === 'tooling') return `<div class="project-visual"><span class="visual-heading">${label}</span><div class="terminal"><div class="terminal-top"><i></i><i></i><i></i><span>WORKFLOW / ILLUSTRATION</span></div><div class="terminal-code"><span class="terminal-line"><span class="prompt">❯</span> <b>one command</b></span><span class="terminal-line">↳ multi-node execution</span><span class="terminal-line">↳ tenant-specific data</span><span class="terminal-line"><small>Python · Operations · Escalations</small></span><span class="terminal-cursor" aria-hidden="true"></span></div></div></div>`;
  if (kind === 'extension') return `<div class="project-visual"><span class="visual-heading">${label}</span><div class="time-comparison"><div class="before"><small>Before</small><strong>${e(fields.Before)}</strong></div><span class="comparison-arrow" aria-hidden="true">→</span><div><small>After</small><strong>${e(fields.After)}</strong></div></div><p class="visual-caption">Direct configuration uploads<br>from the management platform</p></div>`;
  throw new Error(`Unsupported diagram: ${kind}. Update the renderer before adding it.`);
}

const projects = featured.map((entry, index) => {
  for (const key of ['Company','Category','Stack','Before','After','Result','Diagram']) required(entry.fields, key, entry.title);
  if (!entry.paragraphs.length) throw new Error(`Missing description: ${entry.title}`);
  return `<article class="project"><span class="project-number">0${index + 1}</span><div class="project-copy"><p class="project-category">${e(entry.fields.Company)} / ${e(entry.fields.Category)}</p><h3>${e(entry.title)}</h3><p class="project-description">${e(entry.paragraphs.join(' '))}</p><div class="tags">${entry.fields.Stack.split(',').map(tag => `<span class="tag">${e(tag.trim())}</span>`).join('')}</div></div>${projectVisual(entry)}</article>`;
}).join('\n');

const experience = sections.Experience.entries.map(entry => {
  const role = required(entry.fields, 'Role', entry.title);
  const dates = required(entry.fields, 'Dates', entry.title);
  if (!entry.bullets.length) throw new Error(`No accomplishments: ${entry.title}`);
  const company = entry.title.split(' · ')[0];
  return `<article class="timeline-entry"><p class="timeline-date">${e(dates)}</p><h3>${e(company)}</h3><p class="timeline-role">${e(role)}</p><details><summary>Contributions & impact</summary><ul>${entry.bullets.map(bullet => `<li>${e(bullet)}</li>`).join('')}</ul></details></article>`;
}).join('\n');

const skills = Object.entries(sections.Skills.fields).map(([title, list], index) => `<div class="capability"><span class="capability-index">0${index+1} /</span><h3>${e(title)}</h3><p>${list.split(',').map(item => e(item.trim())).join(' · ')}</p></div>`).join('\n');
const stack = [...new Set(Object.values(sections.Skills.fields).flatMap(value => value.split(',').map(item => item.trim())))];
const strip = ['Python','JavaScript','GitHub Actions','Kubernetes','AWS'].filter(item => stack.includes(item)).map(item => `<span class="stack-name">${e(item)}</span>`).join('');
const values = {
  DESCRIPTION: `${name} — software engineering, agentic QA, developer tooling, and cloud reliability.`,
  NAME: name, LOCATION: profile.Location, EMAIL: profile.Email, GITHUB: profile.GitHub, LINKEDIN: profile.LinkedIn,
};
const htmlValues = { PROJECTS: projects, EXPERIENCE: experience, SKILLS: skills, STACK_STRIP: strip };
const homepage = (await read('src/index.html')).replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
  if (key in htmlValues) return htmlValues[key];
  if (key in values) return e(values[key]);
  throw new Error(`Unknown template key: ${key}`);
});

const resumeExperience = sections.Experience.entries.map(entry => `<section class="job"><div class="job-heading"><h3>${e(entry.title.split(' · ')[0])}</h3><span>${e(entry.fields.Dates)}</span></div><p class="role">${e(entry.fields.Role)}</p><ul>${entry.bullets.map(bullet => `<li>${e(bullet)}</li>`).join('')}</ul></section>`).join('');
const resume = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(name)} — Résumé</title><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./resume.css"></head><body><nav aria-label="Résumé actions"><a href="./index.html">← Portfolio</a><div><a href="./resume.md" download="Harvey-Breaux-Resume.md">Download Markdown</a><button type="button" id="print-resume">Print / Save PDF</button></div></nav><main><header><h1>${e(name)}</h1><p class="title">${e(profile.Title)}</p><p>${e(profile.Location)} · <a href="mailto:${e(profile.Email)}">${e(profile.Email)}</a></p><p><a href="${e(profile.GitHub)}">GitHub</a> · <a href="${e(profile.LinkedIn)}">LinkedIn</a></p></header><h2>Profile</h2><p>${e(sections.Profile.paragraphs.join(' '))}</p><h2>Skills</h2><div class="skills">${Object.entries(sections.Skills.fields).map(([title, list]) => `<p><strong>${e(title)}:</strong> ${e(list)}</p>`).join('')}</div><h2>Experience</h2>${resumeExperience}</main><script src="./resume.js" defer></script></body></html>`;

await mkdir(path.join(root, 'dist'), { recursive: true });
await Promise.all([
  writeFile(path.join(root, 'dist/index.html'), homepage),
  writeFile(path.join(root, 'dist/resume.html'), resume),
  writeFile(path.join(root, 'dist/resume.md'), markdown),
  writeFile(path.join(root, 'dist/.nojekyll'), ''),
  ...['styles.css','app.js','resume.css','resume.js','favicon.svg'].map(file => copyFile(path.join(root, 'src', file), path.join(root, 'dist', file))),
]);
console.log(`Built portfolio: ${featured.length} featured projects, ${sections.Experience.entries.length} experience entries. Output: dist/`);
