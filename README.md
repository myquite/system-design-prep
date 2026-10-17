# SysDesign Senior Prep Studio

An interactive study companion for system design interviews, based on
[Design Software Systems Like a Senior Engineer](https://www.youtube.com/watch?v=soTfFFIQQ8U)
(freeCodeCamp / Hayk Simonyan).

**Tabs**

1. **5×5 Blueprint**: interview formats, the 5 scoring dimensions, and the 5-step framework with check-in scripts.
2. **Production Case Studies**: Spotify, Booking.com and WhatsApp architecture simulators.
3. **Capacity Calculator**: back-of-the-envelope storage estimates with presets.
4. **Mock Interview Workbench**: phase-aware timer, per-prompt notes, self-evaluation rubric, Markdown export.
5. **Trade-Off Arena & Quiz**: scenario questions with explanations.

Notes, quiz answers, checklist and calculator inputs are saved in your browser's localStorage.
Each tab has its own URL (`#blueprint`, `#casestudies`, `#calculator`, `#workbench`, `#quiz`).

## Run locally

Plain HTML/CSS/ES modules, with no build step. Modules don't load from `file://`, so serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Layout

```
index.html              page markup (buttons declare behaviour via data-action / data-args)
css/styles.css          all styles
js/main.js              entry point: action dispatch + init
js/router.js            hash-based tab routing
js/progress.js          readiness score
js/storage.js           guarded localStorage helpers
js/blueprint.js         pyramid + framework explorer
js/case-studies.js      Spotify / Booking.com / WhatsApp simulators
js/calculator.js        capacity estimator
js/workbench.js         timer, notes, rubric, export
js/quiz.js              quiz
js/data/                study content (framework steps, quiz, prompts, presets)
```

To add a quiz question, append to `js/data/quiz.js`; to add a workbench prompt, add it to
`js/data/workbench-prompts.js` and an `<option>` in `index.html`.

## Deployment

Served by GitHub Pages from the `main` branch root (`.nojekyll` disables Jekyll processing).
