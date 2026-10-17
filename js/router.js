// Hash-based tab routing, so each tab has its own URL (#calculator, #quiz, ...)
// and the browser back/forward buttons work.
import { markVisited } from './progress.js';

const TABS = ['blueprint', 'casestudies', 'calculator', 'workbench', 'quiz'];
const DEFAULT_TAB = TABS[0];

function currentTab() {
  const id = location.hash.slice(1);
  return TABS.includes(id) ? id : DEFAULT_TAB;
}

function showTab(tabId, { scroll = true } = {}) {
  TABS.forEach(id => {
    const isActive = id === tabId;
    document.getElementById('tab-' + id).classList.toggle('active', isActive);
    const btn = document.getElementById('tab-btn-' + id);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    if (isActive) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  markVisited(tabId);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function switchTab(tabId) {
  if (location.hash === '#' + tabId) {
    showTab(tabId);
  } else {
    location.hash = tabId; // triggers hashchange → showTab
  }
}

export function initRouter() {
  window.addEventListener('hashchange', () => showTab(currentTab()));
  showTab(currentTab(), { scroll: false });
}
