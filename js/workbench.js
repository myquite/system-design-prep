// Mock Interview Workbench tab: pacing timer, 5-step notes (saved per prompt),
// self-evaluation rubric and Markdown export.
import { workbenchPrompts } from './data/workbench-prompts.js';
import { load, save } from './storage.js';
import { setRubricChecked } from './progress.js';

const NOTE_FIELDS = { s1: 'wb-step1', s2: 'wb-step2', s3: 'wb-step3', s4: 'wb-step4' };

// ---- Timer ----

let totalSeconds = 3600;
let remainingSeconds = 3600;
let timerInterval = null;

function updateTimerUI() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  document.getElementById('wb-timer').textContent =
    String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

  // Phase boundaries scale with the session length (they were written for 60 minutes).
  const elapsedFraction = (totalSeconds - remainingSeconds) / totalSeconds;
  const elapsedMins = elapsedFraction * 60;
  const phaseEl = document.getElementById('wb-current-phase');
  const hintEl = document.getElementById('wb-phase-hint');

  if (elapsedMins < 10) {
    phaseEl.textContent = 'Step 1: Clarify Functional & Non-Functional Requirements (0–10m)';
    hintEl.textContent = 'Ask clarifying questions, lock in scope, and calculate back-of-the-envelope storage.';
  } else if (elapsedMins < 28) {
    phaseEl.textContent = 'Step 2: Data Model, Storage Choice & REST API Contracts (10–28m)';
    hintEl.textContent = 'Define database schema, indexes, SQL vs NoSQL/Blob trade-offs, and core API endpoints.';
  } else if (elapsedMins < 45) {
    phaseEl.textContent = 'Step 3: High-Level Architecture & Read/Write Workflows (28–45m)';
    hintEl.textContent = 'Draw the baseline components and walk the interviewer through end-to-end read and write requests.';
  } else if (elapsedMins < 55) {
    phaseEl.textContent = 'Step 4: Scale, Bottlenecks, Failure Modes & Monitoring (45–55m)';
    hintEl.textContent = 'Multiply users 100x: add CDN, Redis, Read Replicas, Kafka, Multi-AZ failover, and alerting.';
  } else {
    phaseEl.textContent = 'Step 5: Wrap-Up, Trade-Offs & Extensions (55–60m)';
    hintEl.textContent = 'Summarize the trade-offs of your design decisions and how you would extend the system next.';
  }
  if (totalSeconds !== 3600) {
    phaseEl.textContent = phaseEl.textContent.replace(/\s\([^)]*\)$/, ` (scaled to ${totalSeconds / 60}m)`);
  }
}

export function toggleTimer() {
  const btn = document.getElementById('wb-start-btn');
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    btn.textContent = 'Resume Timer';
  } else if (remainingSeconds > 0) {
    btn.textContent = 'Pause Timer';
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerUI();
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.textContent = 'Time Complete';
      }
    }, 1000);
  }
}

export function resetTimer(minutes) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  document.getElementById('wb-start-btn').textContent = 'Start Timer';
  updateTimerUI();
}

// ---- Notes ----

function promptSelect() {
  return document.getElementById('wb-prompt-select');
}

function showSaveStatus(ok) {
  document.getElementById('wb-save-status').textContent = ok ? 'Saved Locally' : 'Not Saved (storage blocked)';
}

function fillNotes(notes) {
  Object.entries(NOTE_FIELDS).forEach(([key, id]) => {
    document.getElementById(id).value = notes[key] ?? '';
  });
}

function saveNotes() {
  const notes = Object.fromEntries(
    Object.entries(NOTE_FIELDS).map(([key, id]) => [key, document.getElementById(id).value])
  );
  const all = load('notes', {});
  all[promptSelect().value] = notes;
  showSaveStatus(save('notes', all));
}

// Saved notes for the selected prompt win; otherwise start from the prompt's template.
function loadWorkbenchPrompt() {
  const prompt = promptSelect().value;
  save('prompt', prompt);
  fillNotes(load('notes', {})[prompt] ?? workbenchPrompts[prompt]);
}

export function resetWorkbenchNotes() {
  const prompt = promptSelect().value;
  fillNotes(workbenchPrompts[prompt]);
  saveNotes();
}

export function exportWorkbenchNotes() {
  const promptName = promptSelect().selectedOptions[0].text;
  const md = `# System Design Interview Prep Notes — ${promptName}\n\n` +
    `## Step 1: Requirements & Capacity Estimations\n${document.getElementById('wb-step1').value}\n\n` +
    `## Step 2: Data Model, Storage & API Contracts\n${document.getElementById('wb-step2').value}\n\n` +
    `## Step 3: High-Level Architecture & Read/Write Flows\n${document.getElementById('wb-step3').value}\n\n` +
    `## Step 4 & 5: Scale, Bottlenecks, Reliability & Trade-Offs\n${document.getElementById('wb-step4').value}\n`;
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system_design_notes_${promptSelect().value}.md`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ---- Rubric ----

function updateRubricScore() {
  const checks = [...document.querySelectorAll('.wb-check')];
  const count = checks.filter(c => c.checked).length;
  save('rubric', checks.map(c => c.checked));
  document.getElementById('wb-rubric-score').textContent = `${count} / ${checks.length} Checked`;
  setRubricChecked(count);
}

export function initWorkbench() {
  const select = promptSelect();
  const savedPrompt = load('prompt', null);
  if (savedPrompt && workbenchPrompts[savedPrompt]) select.value = savedPrompt;
  select.addEventListener('change', loadWorkbenchPrompt);
  loadWorkbenchPrompt();

  let saveTimeout;
  Object.values(NOTE_FIELDS).forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveNotes, 400);
    });
  });

  const savedRubric = load('rubric', []);
  document.querySelectorAll('.wb-check').forEach((c, i) => {
    c.checked = Boolean(savedRubric[i]);
    c.addEventListener('change', updateRubricScore);
  });
  updateRubricScore();
  updateTimerUI();
}
