import http from "http";
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

const server = http.createServer(app);
export default server;
