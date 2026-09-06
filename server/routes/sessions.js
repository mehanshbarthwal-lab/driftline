import { Router } from "express";
import { createSession, getSession, listSessions, clearSession } from "../services/storage.js";

const router = Router();

router.post("/", (req, res) => {
  const { customId } = req.body || {};
  const session = createSession(customId);
  res.json({ success: true, session });
});

router.get("/", (req, res) => {
  const sessions = listSessions();
  res.json({ success: true, sessions });
});

router.get("/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    // Auto provision session if requested ID is not found
    const newSession = createSession(req.params.id);
    return res.json({ success: true, session: newSession, created: true });
  }
  res.json({ success: true, session });
});

router.delete("/:id", (req, res) => {
  const deleted = clearSession(req.params.id);
  res.json({ success: true, deleted });
});

export default router;
