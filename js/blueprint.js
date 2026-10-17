// Blueprint tab: senior-engineer pyramid and the 5-step framework explorer.
import { frameworkSteps } from './data/framework.js';
import { pyramidTiers } from './data/content.js';

export function showPyramidDetail(tier) {
  document.getElementById('pyramid-detail-box').innerHTML = pyramidTiers[tier];
}

export function selectFrameworkStep(idx) {
  document.querySelectorAll('.step-tab').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
  const step = frameworkSteps[idx];
  const panel = document.getElementById('framework-detail-panel');
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
      <h3 style="font-size:1.2rem; font-weight:700;">${step.title}</h3>
      <span class="badge badge-blue">${step.badge}</span>
    </div>
    <p style="color:var(--text-secondary); font-size:0.92rem; margin-bottom:1rem;">${step.summary}</p>
    <ul style="padding-left:1.25rem; color:var(--text-primary); font-size:0.88rem; line-height:1.75;">
      ${step.bullets.map(b => `<li style="margin-bottom:0.35rem;">${b}</li>`).join('')}
    </ul>
    <div class="quote-box">
      <div><strong>Interviewer Check-In Script:</strong> <em>"${step.quote}"</em></div>
      <button class="btn btn-secondary" data-copy-script>Copy Script</button>
    </div>
  `;
  panel.querySelector('[data-copy-script]').addEventListener('click', async e => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(step.quote);
      btn.textContent = 'Copied!';
    } catch {
      btn.textContent = 'Copy failed';
    }
    setTimeout(() => { btn.textContent = 'Copy Script'; }, 1500);
  });
}

export function initBlueprint() {
  selectFrameworkStep(0);
}
