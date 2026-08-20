# React Build Day

A one-day beginner hackathon where small teams build and demo a simple interactive React app — with an AI-powered judging pipeline for instructors.

## What is this?

React Build Day is a structured event for learners who are new to React. Teams of 4–5 people pick a project idea, build it together using core React fundamentals, and present a short demo at the end of the day. (JSD13: up to 50 learners in 10 teams.)

This repo serves two audiences:

- **Participants** — guides, project options, and a GitHub workflow for the build day itself
- **Instructors** — an AI-powered pipeline that scores team repos, generates awards, and produces a shareable results webpage

## Guides

| Document | Audience | Description |
|---|---|---|
| [Learner Guide](react-build-day-learner-guide.md) | Participants | Project options, build process, GitHub workflow, and React reminders |
| [Judge Guide](react-build-day-ai-judge.md) | Instructors | Scoring rubric, evaluation criteria, and award categories |
| [Judging Pipeline](react-build-day-judging-steps.md) | Instructors | How to score teams, generate awards, and build the results webpage |

## For participants

Each team chooses one of five starting ideas:

- **Shopping List** — add, mark, and delete items
- **Flashcard Quiz** — flip through questions and reveal answers
- **Mini E-Commerce Cart** — browse products and manage a cart
- **Mood Tracker** — log moods with notes and view history
- **Task Board** — move tasks through To Do, Doing, and Done

Teams are encouraged to customise the theme, design, and features. Every project must include at least 3 components, 1 `useState`, 2 event handlers, 1 `.map()` render, and 1 conditional render. **Every team member must design and integrate at least one component that uses the app's shared state**, and teams collaborate in a single shared repo with a `CONTRIBUTIONS.md` ownership table.

Scaffold a new React app with Vite:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Then read the [Learner Guide](react-build-day-learner-guide.md) for the step-by-step build process and GitHub workflow.

## For instructors

After the event, the judging pipeline scores each team's GitHub repo against the rubric, generates a ranked awards report, and builds a self-contained results webpage — all in three commands:

```bash
node judge.js teams.csv       # score each team → reports/*.md
node awards.js                # rank teams + assign 9 awards → awards.md
node generate-results.js      # build results webpage → results.html
```

Defaults to the **Claude Code CLI**, with **Codex CLI** as an automatic backup and the **Anthropic API** as an optional mode (`--mode codex` / `--mode api`). A `GITHUB_TOKEN` is required so the pipeline can read commit history for contribution scoring. See [Judging Pipeline](react-build-day-judging-steps.md) for setup and full usage.

## How scoring works

Projects are evaluated out of 100 points across eight criteria: app functionality (15), component structure (15), state and event handling (15), dynamic rendering (10), UI clarity (10), **team contribution (15)**, **folder structure & naming conventions (10)**, and demo explanation (10).

The **team contribution** score is derived deterministically from the repo's git history — every member is expected to appear with meaningful commits and own at least one integrated component (cross-checked against `CONTRIBUTIONS.md`). Workload need not be equal; the score rewards participation and coverage, not volume. Up to 10 bonus points are available for stretch features, creativity, or exceptional teamwork. Nine named awards are assigned across categories like Best Use of React State, Most Creative Concept, and Best Debugging Comeback.

See the [Judge Guide](react-build-day-ai-judge.md) for the full rubric.