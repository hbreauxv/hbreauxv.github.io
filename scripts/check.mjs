import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
for (const name of ['index.html','resume.html']) {
  const html = await readFile(path.join(root, name), 'utf8');
  assert(!/\{\{[A-Z_]+\}\}/.test(html), `${name}: unresolved template`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate element IDs`);
  for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (target.startsWith('#') && target.length > 1) assert(ids.includes(target.slice(1)), `Broken anchor: ${target}`);
    else if (target.startsWith('./')) await access(path.join(root, target));
    else assert(!target.startsWith('/'), `Absolute local path breaks GitHub project hosting: ${target}`);
  }
  assert(!/\bGo\b/.test(html), `${name}: Go should not be highlighted`);
  assert(!/573-1883|83686/.test(html), `${name}: private contact fields`);
  assert(html.includes('Agentic QA Agent'), `${name}: missing new accomplishment`);
}
const homepage = await readFile(path.join(root, 'index.html'), 'utf8');
const markdown = await readFile(path.join(root, 'resume.md'), 'utf8');
const selectedSection = markdown.split('## Featured work')[1].split('\n## ')[0];
const selectedTitles = [...selectedSection.matchAll(/^### (.+)$/gm)].map(match => match[1].trim());
assert.equal(selectedTitles.length, 3, 'Expected three selected projects in Markdown');
assert.equal((homepage.match(/class="project"/g) ?? []).length, selectedTitles.length, 'Featured project count differs from Markdown');
const escaped = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const renderedTitles = [...homepage.matchAll(/<h3>(.*?)<\/h3>/g)].map(match => match[1]);
assert.deepEqual(renderedTitles.slice(0, selectedTitles.length), selectedTitles.map(escaped), 'Featured order differs from approved Markdown selection');
for (const name of ['app.js','resume.js']) {
  const source = await readFile(path.join(root, name), 'utf8');
  const html = await readFile(path.join(root, name === 'app.js' ? 'index.html' : 'resume.html'), 'utf8');
  for (const [, id] of source.matchAll(/getElementById\('([^']+)'\)/g)) assert(html.includes(`id="${id}"`), `Missing JS target: ${id}`);
}
console.log('Checks passed: links/assets, content constraints, featured order, template output, and interaction targets.');
