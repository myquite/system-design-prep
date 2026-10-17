// Readiness score shown in the top bar: tabs visited + quiz correct + rubric checked.
import { load, save } from './storage.js';

const visitedSections = new Set(load('visited', ['blueprint']));
let quizCorrectCount = 0;
let rubricCheckedCount = 0;

function render() {
  const tabScore = visitedSections.size * 8; // up to 40%
  const quizScore = Math.min(35, quizCorrectCount * 4.5); // up to 35%
  const rubricScore = Math.min(25, rubricCheckedCount * 2.5); // up to 25%
  const total = Math.min(100, Math.round(tabScore + quizScore + rubricScore));
  document.getElementById('mastery-pct').textContent = total + '%';
  document.getElementById('mastery-bar').style.width = total + '%';
}

export function markVisited(tabId) {
  visitedSections.add(tabId);
  save('visited', [...visitedSections]);
  render();
}

export function setQuizCorrect(count) {
  quizCorrectCount = count;
  render();
}

export function setRubricChecked(count) {
  rubricCheckedCount = count;
  render();
}
