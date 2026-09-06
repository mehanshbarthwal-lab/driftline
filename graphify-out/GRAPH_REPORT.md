# Driftline Knowledge Graph Report

Generated context and architectural audit for Driftline visual diagnostic and drift tracking layer.

## Executive Architecture Summary

Driftline is engineered as a unified fullstack creative diagnostic studio. It prevents generative AI users from burning generation credits on blind retries by providing surgical visual diagnosis, high leverage prompt rewrites, multi advisor council cross checking, and physical drift line deflection tracking relative to a pinned anchor attempt.

## God Nodes and Core Junctions

1. **`server/index.js` (Backend Gateway)**
   Serves as the root API server and static client distributor. Configured with a fifty megabyte payload capacity to handle inline base64 image uploads. Hosts routes for sessions, vision critique, and pipeline chain evaluation.

2. **`client/src/App.jsx` (Frontend Studio Director)**
   Orchestrates the three column studio layout, session URL state synchronization, attempt history state, preset scenario switching, and active attempt inspection.

3. **`server/services/llm.js` (Multimodal Vision Engine)**
   Direct interface to OpenRouter multimodal vision models (Gemini Flash, Gemma Vision, Dots Vision). Extracts structured JSON diagnoses without generic filler, provides rewritten prompts targeting the single primary bottleneck, and enforces the strict No Dashes Rule across all output strings. Contains a resilient heuristic fallback reserved solely for upstream network outages or quota exhaustion.

4. **`server/services/council.js` (Multi Advisor Review Council)**
   Implements Karpathy's council pattern adapted for visual creative workflows. Runs three parallel domain specialist evaluations (Spatial and Anatomy, Style and Prompt Fidelity, Perceptual Realism and Artifacts) followed by a Chairman synthesizer call that determines the unified priority and consensus rating.

5. **`server/services/drift.js` (Anchor Drift Engine)**
   Calculates semantic Jaccard distance and stylistic keyword density shifts relative to Attempt 1 (the immutable anchor). Produces pixel deflection coordinates for the dynamic SVG drift line and triggers deep drift check assessments on every third or fourth attempt.

6. **`server/services/chain.js` (Node Chain Disagreement Detector)**
   Analyzes sequential pipeline steps to detect aesthetic contradictions (such as soft watercolor generation followed by aggressive eight k edge sharpening) before credits are spent.

## Architectural Decision Records

* **Decision 1 : Single Service Fullstack Deployment**
  Unified Vite React client build with Express static serving into a single container for Render free tier deployment. Eliminates CORS friction, separate domain handshakes, and dual service cold starts.

* **Decision 2 : Dynamic Bending SVG Drift Line**
  Visualized the iteration history not merely as static cards, but with an authentic SVG cubic bezier spline that physically bends and deflects outward based on the measured drift score of each attempt relative to Attempt 1.

* **Decision 3 : Pinned Anchor Model**
  Attempt 1 is permanently pinned as the artistic baseline. All drift metrics, trajectory deviations, and periodic audits measure variance directly against Attempt 1 rather than just consecutive steps.

* **Decision 4 : Zero Dashes Compliance**
  All UI copy, documentation, badge labels, and AI prompt outputs strictly eliminate dashes, hyphens, en dashes, and em dashes, using colons or natural phrasing instead.

## State and Data Persistence

* **Session Model**: `Session { id, created_at, first_attempt_id, title, attempts: [] }`
* **Attempt Model**: `Attempt { id, session_id, order_index, prompt_text, image_url_or_blob, critique_text, suggested_prompt, impact_estimate, drift_score, drift_note, council_breakdown, consensus, chain_analysis, created_at }`
* **Storage Location**: `server/data/sessions.json` (persisted on disk, safely excluded from git).
