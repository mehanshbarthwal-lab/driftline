# Graph Report - .  (2026-09-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 151 nodes · 211 edges · 10 communities
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 1.0)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `be11bb4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- removeDashes
- package.json
- critique.js
- App.jsx
- client/package.json
- devDependencies
- Express Server Gateway
- .oxlintrc.json
- keywords

## God Nodes (most connected - your core abstractions)
1. `removeDashes()` - 12 edges
2. `react` - 9 edges
3. `keywords` - 8 edges
4. `calculateDrift()` - 6 edges
5. `scripts` - 5 edges
6. `scripts` - 5 edges
7. `runCouncilPipeline()` - 5 edges
8. `runVisionCritique()` - 5 edges
9. `saveToDisk()` - 5 edges
10. `createSession()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `detectChainConflicts()` --calls--> `removeDashes()`  [EXTRACTED]
  server/services/chain.js → server/services/llm.js
- `runChairmanSynthesis()` --calls--> `removeDashes()`  [EXTRACTED]
  server/services/council.js → server/services/llm.js
- `parseAdvisorJson()` --calls--> `removeDashes()`  [EXTRACTED]
  server/services/council.js → server/services/llm.js
- `runHeuristicCouncil()` --calls--> `removeDashes()`  [EXTRACTED]
  server/services/council.js → server/services/llm.js
- `calculateDrift()` --calls--> `removeDashes()`  [EXTRACTED]
  server/services/drift.js → server/services/llm.js

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "removeDashes"
Cohesion: 0.16
Nodes (20): router, CONFLICT_PAIRS, detectChainConflicts(), ADVISORS, extractJson(), parseAdvisorJson(), runChairmanSynthesis(), runCouncilPipeline() (+12 more)

### Community 1 - "package.json"
Cohesion: 0.09
Nodes (22): cors, dotenv, express, author, dependencies, cors, dotenv, express (+14 more)

### Community 2 - "critique.js"
Cohesion: 0.16
Nodes (18): app, clientDist, __dirname, __filename, router, router, addAttempt(), clearSession() (+10 more)

### Community 3 - "App.jsx"
Cohesion: 0.19
Nodes (9): App(), ChainDetector(), CouncilReview(), CritiqueInput(), CurrentCritique(), Header(), MemoryTrail(), SAMPLE_SCENARIOS (+1 more)

### Community 4 - "client/package.json"
Cohesion: 0.12
Nodes (16): dependencies, lucide-react, react, react-dom, name, private, scripts, build (+8 more)

### Community 5 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, oxlint, tailwindcss, @tailwindcss/vite, @types/react, @types/react-dom, vite, @vitejs/plugin-react (+7 more)

### Community 6 - "Express Server Gateway"
Cohesion: 0.17
Nodes (12): Studio Master Component, Chain Disagreement Alert, Council Review Breakdown, Attempt Input and Dropzone, Diagnosis and Action Deck, Memory Trail and Drift Line, Express Server Gateway, Node Chain Conflict Detector (+4 more)

### Community 7 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 8 - "keywords"
Cohesion: 0.25
Nodes (8): keywords, ai, council, creative-workflow, diagnosis, diffusion, prompt-engineering, vision

## Knowledge Gaps
- **57 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `react` connect `App.jsx` to `.oxlintrc.json`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `package.json`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `Express Server Gateway` (e.g. with `Studio Master Component` and `Node Chain Conflict Detector`) actually correct?**
  _`Express Server Gateway` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._