# Copy-paste prompt for coding agents (Codex, Claude Code, OpenCode, …)

Paste the block below into your agent. It will explain each tool, ask what you need,
and install only that. Safe to re-run.

---

You are helping me set up the **jev-stack** agent toolset (MIT, by aleksvega).
It is a set of Jev-powered CLI/browser tools. Jev = an ultra-cheap decision model
(typesafe/jev-1.13 via OpenRouter /api/alpha/decisions, needs OPENROUTER_API_KEY,
~$0.0001–0.0008 per decision). Deterministic checks (builds, secret scans) always
take priority over model decisions.

The components are:

1. **fast-jev-compaction** — https://github.com/aleksvega/fast-jev-compaction
   Five CLIs: jev-compact (lossless context compaction before /compact or /new),
   hermes-compact, jev-gate (blocks risky git pushes: secrets, syntax, breaking changes),
   jev-qa (finds real code errors in a diff in seconds), jev-find (search a repo by
   natural-language question).
   Best for: anyone running long agent sessions on a budget.

2. **jev-ultrafast** — https://github.com/aleksvega/jev-ultrafast
   Browser agent, ~0.5s per action via Jev decisions, headless mode, works on my
   OpenRouter key. Best for: web automation, testing, scraping without LLM-per-step cost.

3. **jev-skill-router** — https://github.com/aleksvega/jev-skill-router
   One cheap decision tells the agent WHICH skill to load; audits skill libraries for
   prompt injection and dangerous commands. Best for: agents with many skills/plugins.

4. **cdp-browser-launcher** — https://github.com/aleksvega/cdp-browser-launcher
   Launch Chrome/Edge for CDP agents in headless/minimized/visible mode, zero deps.
   Best for: reliable browser sessions for agents.

Your job:
- Ask me, one question at a time, in my language, in plain words: what do I use agents
  for, and which of the 4 components fit? Explain trade-offs briefly. Do NOT sell
  everything — recommend only what matches my answer.
- For each component I approve: `git clone --depth 1 <repo>` into ./jev-stack/<id>,
  then show me the 2–3 commands I'll actually use, and run a smoke test if possible
  (skip anything needing API keys until I provide them via env — never ask me to paste
  secrets into chat).
- Remind me at the end: `export OPENROUTER_API_KEY=...` is needed for Jev routing, and
  each tool works with direct provider keys too if I prefer.
- If git or node is missing, tell me exactly how to install them for my OS.
