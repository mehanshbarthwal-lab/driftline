import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

import sessionsRouter from "./routes/sessions.js";
import critiqueRouter from "./routes/critique.js";
import chainRouter from "./routes/chain.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing with 50mb limit for base64 image uploads
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes
app.use("/api/sessions", sessionsRouter);
app.use("/api/critique", critiqueRouter);
app.use("/api/chain", chainRouter);

// System Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "Driftline Diagnostic Engine",
    timestamp: new Date().toISOString(),
    ai_vision_configured: Boolean(process.env.OPENROUTER_API_KEY)
  });
});

// Production Static Client Serving
const clientDist = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    // Only route non API requests to index.html
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(clientDist, "index.html"));
    } else {
      res.status(404).json({ error: "Endpoint not found" });
    }
  });
} else {
  // Development mode notice if client is not built yet
  app.get("/", (req, res) => {
    res.send("Driftline API server is running. Build client or run Vite dev server on port 5173.");
  });
}

app.listen(PORT, () => {
  console.log(`[Driftline Server] Running on http://localhost:${PORT}`);
  console.log(`[Driftline Server] Vision AI Engine configured: ${Boolean(process.env.OPENROUTER_API_KEY)}`);
});
