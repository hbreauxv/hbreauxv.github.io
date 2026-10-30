const views = {
  agent: {
    input: 'QA test plan', overline: 'ORCHESTRATE & DELEGATE', core: 'Agentic QA Agent',
    outputs: [['UI actions', 'Playwright MCP'], ['System access', 'SSH / portal'], ['Individual tests', 'Sub-agents']],
    caption: 'Individual tests delegated. Long-running context kept focused.',
    label: 'Illustrative diagram of a QA agent delegating a test plan to sub-agents',
  },
  tooling: {
    input: 'One command', overline: 'SIMPLIFY OPERATIONS', core: 'Python CLI',
    outputs: [['Multi-node', 'Command execution'], ['Tenant data', 'Data gathering'], ['Team workflows', 'Ops / Escalations']],
    caption: 'Multi-node execution and tenant data, brought into one command.',
    label: 'Illustrative diagram of a Python CLI supporting operational workflows',
  },
  cloud: {
    input: 'Scheduled workflow', overline: 'AUTOMATE EXPOSURE SCANNING', core: 'GitHub Actions + Masscan',
    outputs: [['AWS', 'Public-facing IPs'], ['Azure', 'Public-facing IPs'], ['GCP', 'Public-facing IPs']],
    caption: 'Exposure scanning across approximately 10,000 public-facing IPs.',
    label: 'Illustrative diagram of scheduled exposure scanning across three cloud environments',
  },
};

const tabs = [...document.querySelectorAll('[data-mode]')];
function selectTab(tab) {
  const view = views[tab.dataset.mode];
  for (const item of tabs) {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  }
  for (const key of ['input', 'overline', 'core', 'caption']) {
    document.getElementById(`diagram-${key}`).textContent = view[key];
  }
  view.outputs.forEach(([title, detail], index) => {
    document.getElementById(`diagram-output-${index + 1}`).textContent = title;
    document.getElementById(`diagram-detail-${index + 1}`).textContent = detail;
  });
  document.querySelector('.diagram').setAttribute('aria-label', view.label);
  document.getElementById('system-description').setAttribute('aria-labelledby', tab.id);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    selectTab(tabs[next]);
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.project, .timeline-entry, .capability').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}

const navLinks = [...document.querySelectorAll('.site-header nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const link = navLinks.find(item => item.hash === `#${entry.target.id}`);
      if (link) {
        if (entry.isIntersecting) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-10% 0px -65% 0px' });
  document.querySelectorAll('#work, #experience, #contact').forEach(section => observer.observe(section));
}
