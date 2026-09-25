#!/usr/bin/env node
/**
 * jev-stack installer — one command to install the whole Jev toolset,
 * or pick exactly what you need.
 *
 *   npx jev-stack            # interactive menu
 *   npx jev-stack --all      # install everything
 *   npx jev-stack --list     # show components and exit
 *   npx jev-stack --only jev-compact,jev-gate
 *   npx jev-stack --agent codex   # print the copy-paste agent prompt
 *
 * Zero dependencies. Node >= 18.
 */
const { execSync, spawnSync } = require("child_process");
const readline = require("readline");

const COMPONENTS = [
  {
    id: "jev-compact",
    repo: "https://github.com/aleksvega/fast-jev-compaction.git",
    what: "Lossless context compaction + jev-gate (pre-push guardrail) + jev-qa (fast code-error finder) + jev-find (NL file search) + jev-enhancer (prompt improver). Five CLI tools, one repo.",
    why: "Cuts context/token costs up to 10x on long agent sessions and blocks risky pushes.",
    globalBin: true,
  },
  {
    id: "jev-ultrafast",
    repo: "https://github.com/aleksvega/jev-ultrafast.git",
    what: "Browser agent acting in ~0.5s per step via Jev decisions. Headless-capable, runs on your OpenRouter key.",
    why: "Web automation 5-10x faster than LLM-per-step agents.",
    globalBin: false,
  },
  {
    id: "jev-prompt-enhancer",
    repo: "https://github.com/aleksvega/jev-prompt-enhancer.git",
    what: "Automatic Prompt Enhancer for any agent: Jev decides IF a vague user message needs refinement, Mercury rewrites it, Jev fidelity-checks, you approve. Hooks into Claude Code, OpenCode, Hermes.",
    why: "Fewer wrong turns and retries: the model always starts from a clear, complete prompt.",
    globalBin: true,
  },
  {
    id: "jev-skill-router",
    repo: "https://github.com/aleksvega/jev-skill-router.git",
    what: "Skill router + security auditor: ONE cheap decision tells the model WHICH skill to load; scans skill libraries for prompt injection & dangerous commands.",
    why: "Makes multi-skill agents cheap and safe.",
    globalBin: false,
  },
  {
    id: "cdp-browser-launcher",
    repo: "https://github.com/aleksvega/cdp-browser-launcher.git",
    what: "Launch Chrome/Edge for CDP agents in the mode you pick: headless, minimized, or visible. Zero deps.",
    why: "Reliable browser sessions for any CDP-based agent.",
    globalBin: false,
  },
];

const ROUTING = `Routing / API keys:
- Default: tools talk to Jev (typesafe/jev-1.13 via the OpenRouter /api/alpha/decisions
  endpoint) with your OPENROUTER_API_KEY — one cheap decision per step, ~$0.0001-0.0008.
- Direct-mode: every tool also accepts provider-specific keys (OPENAI_API_KEY, etc.) via
  env if you prefer a direct path. Jev stays the default because it is the cheapest
  reliable router; nothing is locked in.
- Deterministic checks (tsc, build, secret-scan) are NEVER replaced by model decisions:
  the Jev layer only decides WHERE to look, not WHETHER code is safe.`;

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: opts.quiet ? "pipe" : "inherit", shell: true, ...opts });
}
function hasGit() {
  return spawnSync("git", ["--version"], { shell: true }).status === 0;
}

function install(c, targetDir) {
  const dir = require("path").join(targetDir, c.id);
  console.log(`\n==> ${c.id}\n    ${c.what}`);
  if (!hasGit()) {
    console.error("git not found — install git first: https://git-scm.com");
    process.exit(1);
  }
  sh(`git clone --depth 1 ${c.repo} "${dir}"`);
  if (c.globalBin) {
    try {
      sh(`npm install -g --prefix "${dir}"`, { cwd: dir, quiet: true });
      console.log(`    installed (global bin available from ${dir})`);
    } catch {
      console.log(`    cloned. Run "npm install" inside ${dir} when you need it.`);
    }
  } else {
    console.log(`    cloned to ${dir}. See its README for usage.`);
  }
}

function prompt(q) {
  return new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, (a) => { rl.close(); res(a.trim().toLowerCase()); });
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const targetDir = process.env.JEV_STACK_DIR || process.cwd();

  if (argv.includes("--list")) {
    for (const c of COMPONENTS) console.log(`- ${c.id}: ${c.what}\n  why: ${c.why}\n  repo: ${c.repo}`);
    console.log(`\n${ROUTING}`);
    return;
  }
  if (argv.includes("--agent") || argv.includes("--prompt")) {
    const root = require("path").join(__dirname, "..");
    console.log(require("fs").readFileSync(require("path").join(root, "AGENT_PROMPT.md"), "utf8"));
    return;
  }

  console.log("jev-stack — Jev-powered agent toolset\n" + "=".repeat(40));
  let picked;
  if (argv.includes("--all")) picked = COMPONENTS.map((c) => c.id);
  else if (argv.includes("--only")) {
    const want = (argv[argv.indexOf("--only") + 1] || "").split(",").map((s) => s.trim());
    picked = COMPONENTS.filter((c) => want.includes(c.id)).map((c) => c.id);
    if (!picked.length) { console.error("No matching components. Use --list."); process.exit(1); }
  } else {
    picked = [];
    for (const c of COMPONENTS) {
      console.log(`\n[${c.id}] ${c.what}\n  Why: ${c.why}`);
      const a = await prompt("  Install? [y/N/a=all/skip rest]: ");
      if (a === "a") { picked = COMPONENTS.map((x) => x.id); break; }
      if (a === "s") break;
      if (a === "y" || a === "yes") picked.push(c.id);
    }
  }
  for (const id of picked) install(COMPONENTS.find((c) => c.id === id), targetDir);
  console.log(`\nDone. Installed: ${picked.join(", ") || "nothing"}\n\n${ROUTING}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
