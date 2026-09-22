# jev-stack

**One command to install (or hand-pick) the whole Jev-powered agent toolset.**

```bash
npx jev-stack            # interactive menu — explains every component, install what you want
npx jev-stack --all      # install everything
npx jev-stack --list     # just look
npx jev-stack --only jev-compact,jev-ultrafast
```

Don't like the CLI? Copy the prompt from [`AGENT_PROMPT.md`](AGENT_PROMPT.md) into Codex /
Claude Code / any coding agent — it will walk you through the set, explain every piece in
plain language, and install what you choose.

## The set (click for each repo)

| Component | What it does | Why you want it |
|---|---|---|
| [fast-jev-compaction](https://github.com/aleksvega/fast-jev-compaction) | **jev-compact** lossless context compaction, **hermes-compact**, **jev-gate** pre-push guardrail, **jev-qa** fast code-error finder, **jev-find** natural-language file search | Long agent sessions stop eating your context; risky pushes get blocked before CI |
| [jev-ultrafast](https://github.com/aleksvega/jev-ultrafast) | Browser agent acting in **~0.5s per step** via Jev decisions; headless mode; your own OpenRouter key | Web automation 5–10× faster than LLM-per-step agents |
| [jev-skill-router](https://github.com/aleksvega/jev-skill-router) | ONE cheap decision per request tells the agent **which skill to load**; scans skill libraries for prompt injection & dangerous commands | Multi-skill agents become cheap and safe |
| [cdp-browser-launcher](https://github.com/aleksvega/cdp-browser-launcher) | Launch Chrome/Edge for CDP agents: headless / minimized / visible, zero deps | Reliable browser sessions for any CDP agent |

## Routing: Jev by default, your keys if you prefer

- **Default** — tools call Jev (`typesafe/jev-1.13` via OpenRouter `/api/alpha/decisions`)
  with your `OPENROUTER_API_KEY`: one tiny decision per step, ~$0.0001–0.0008. That is the
  cheapest reliable router we measured.
- **Direct mode** — every tool also honors provider keys (`OPENAI_API_KEY`, …) via env.
  Nothing is locked in.
- **Hard rule** — deterministic checks (`tsc`, builds, secret scans) are never replaced by
  a model decision. The Jev layer decides *where to look*, never *whether code is safe*.

## Why this exists (comparison)

- vs **full-LLM agent loops**: Jev decisions replace "think with a frontier model" on
  routing/triage/UI steps — same reliability on classification tasks, ~100× cheaper per step.
- vs **hand-rolled prompts**: these are production tools used daily in a real product
  (GEO-Auditor / Citedkit), with documented lessons (score schemas, fail-safes, caps).
- vs **framework lock-in**: zero dependencies in the installer, plain git clones, each
  component works standalone.

## License

MIT
