import { Router } from "express";
import { detectChainConflicts } from "../services/chain.js";

const router = Router();

router.post("/analyze", (req, res) => {
  const { nodes = [] } = req.body || {};
  const result = detectChainConflicts(nodes);
  res.json({ success: true, result });
});

export default router;
