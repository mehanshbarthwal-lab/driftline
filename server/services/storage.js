import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "..", "data", "sessions.json");

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory cache synced with disk
let sessions = {};

function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      sessions = JSON.parse(raw);
    } else {
      sessions = {};
      saveToDisk();
    }
  } catch (error) {
    console.error("Failed to load sessions from disk:", error.message);
    sessions = {};
  }
}

function saveToDisk() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sessions, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to persist sessions to disk:", error.message);
  }
}

// Initialize on boot
loadFromDisk();

export function createSession(customId = null) {
  const id = customId || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const session = {
    id,
    created_at: new Date().toISOString(),
    first_attempt_id: null,
    title: "New Creative Iteration",
    attempts: []
  };
  sessions[id] = session;
  saveToDisk();
  return session;
}

export function getSession(id) {
  if (!sessions[id]) {
    // Attempt reload if written by another process
    loadFromDisk();
  }
  return sessions[id] || null;
}

export function listSessions() {
  return Object.values(sessions).map(s => ({
    id: s.id,
    created_at: s.created_at,
    title: s.title,
    attempt_count: s.attempts.length,
    anchor_prompt: s.attempts[0]?.prompt_text || null
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function addAttempt(sessionId, attemptData) {
  let session = getSession(sessionId);
  if (!session) {
    session = createSession(sessionId);
  }

  const orderIndex = session.attempts.length + 1;
  const attemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const attempt = {
    id: attemptId,
    session_id: sessionId,
    order_index: orderIndex,
    prompt_text: attemptData.prompt_text || "",
    image_url_or_blob: attemptData.image_url_or_blob || "",
    critique_text: attemptData.critique_text || "",
    suggested_prompt: attemptData.suggested_prompt || "",
    impact_estimate: attemptData.impact_estimate || "medium",
    drift_score: typeof attemptData.drift_score === "number" ? attemptData.drift_score : 0,
    drift_note: attemptData.drift_note || null,
    council_breakdown: attemptData.council_breakdown || null,
    consensus: attemptData.consensus || null,
    chain_analysis: attemptData.chain_analysis || null,
    created_at: new Date().toISOString()
  };

  // Pin Attempt 1 as the immutable anchor
  if (orderIndex === 1) {
    session.first_attempt_id = attemptId;
    if (attempt.prompt_text) {
      // Create concise title without dashes
      session.title = attempt.prompt_text.slice(0, 38).trim();
    }
  }

  session.attempts.push(attempt);
  saveToDisk();
  return { session, attempt };
}

export function clearSession(sessionId) {
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    saveToDisk();
    return true;
  }
  return false;
}
