// Entry point: wires `data-action` buttons to their handlers and initialises each tab.
//
// Markup declares behaviour as e.g. <button data-action="runBookingSim" data-args="naive">.
// `data-args` is a comma-separated list; numeric values are passed as numbers.
import { initRouter, switchTab } from './router.js';
import { initBlueprint, showPyramidDetail, selectFrameworkStep } from './blueprint.js';
import {
  selectCaseStudy, toggleSpotifyScale, simulateSpotifyFlow, inspectNode, runBookingSim, runWhatsappSim,
} from './case-studies.js';
import { initCalculator, loadCalcPreset } from './calculator.js';
import {
  initWorkbench, toggleTimer, resetTimer, resetWorkbenchNotes, exportWorkbenchNotes,
} from './workbench.js';
import { initQuiz, answerQuiz, resetQuiz } from './quiz.js';
import { clearAll } from './storage.js';

function resetProgress() {
  if (!confirm('Clear saved notes, quiz answers, checklist and calculator inputs?')) return;
  clearAll();
  location.hash = '';
  location.reload();
}

const actions = {
  switchTab,
  showPyramidDetail,
  selectFrameworkStep,
  selectCaseStudy,
  toggleSpotifyScale,
  simulateSpotifyFlow,
  inspectNode,
  runBookingSim,
  runWhatsappSim,
  loadCalcPreset,
  toggleTimer,
  resetTimer,
  resetWorkbenchNotes,
  exportWorkbenchNotes,
  answerQuiz,
  resetQuiz,
  resetProgress,
};

function parseArgs(raw) {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).map(s => (/^-?\d+(\.\d+)?$/.test(s) ? Number(s) : s));
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const handler = actions[el.dataset.action];
  if (!handler) {
    console.warn('Unknown action:', el.dataset.action);
    return;
  }
  handler(...parseArgs(el.dataset.args));
});

// Clickable architecture nodes are <div>s; make them keyboard-accessible too.
document.querySelectorAll('div[data-action]').forEach(el => {
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});

initBlueprint();
initCalculator();
initWorkbench();
initQuiz();
initRouter();
