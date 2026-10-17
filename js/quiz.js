// Trade-Off Arena tab: scenario quiz with explanations. Answers persist across visits.
import { quizData } from './data/quiz.js';
import { load, save } from './storage.js';
import { setQuizCorrect } from './progress.js';

// Question index → chosen option index.
let answers = load('quiz', {});

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = quizData.map((item, qIdx) => `
    <div class="card">
      <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.85rem; color:var(--text-primary);">${item.q}</div>
      <div>
        ${item.options.map((opt, oIdx) => `
          <button class="quiz-option" id="q-${qIdx}-opt-${oIdx}" data-action="answerQuiz" data-args="${qIdx}, ${oIdx}">
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-blue);">${String.fromCharCode(65 + oIdx)}.</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="quiz-exp-${qIdx}" style="display:none; margin-top:0.75rem; padding:0.75rem; border-radius:var(--radius-sm); background:var(--bg-secondary); font-size:0.82rem; color:var(--text-secondary); border-left:3px solid var(--accent-blue);"></div>
    </div>
  `).join('');
  Object.entries(answers).forEach(([qIdx, oIdx]) => revealAnswer(Number(qIdx), oIdx));
  updateScore();
}

function revealAnswer(qIdx, oIdx) {
  const item = quizData[qIdx];
  if (!item) return;
  const isCorrect = oIdx === item.answer;
  item.options.forEach((_, idx) => {
    const btn = document.getElementById(`q-${qIdx}-opt-${idx}`);
    btn.disabled = true;
    if (idx === item.answer) btn.classList.add('correct');
    else if (idx === oIdx && !isCorrect) btn.classList.add('wrong');
  });
  const exp = document.getElementById(`quiz-exp-${qIdx}`);
  exp.style.display = 'block';
  exp.innerHTML = `<strong style="color:${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">${isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong> ${item.explanation}`;
}

function updateScore() {
  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(([q, o]) => quizData[q]?.answer === o).length;
  document.getElementById('quiz-score-badge').textContent = answered
    ? `Score: ${correct} / ${quizData.length} Correct (${answered} Answered)`
    : `Score: 0 / ${quizData.length} Answered`;
  setQuizCorrect(correct);
}

export function answerQuiz(qIdx, oIdx) {
  if (qIdx in answers) return;
  answers[qIdx] = oIdx;
  save('quiz', answers);
  revealAnswer(qIdx, oIdx);
  updateScore();
}

export function resetQuiz() {
  answers = {};
  save('quiz', answers);
  renderQuiz();
}

export function initQuiz() {
  renderQuiz();
}
