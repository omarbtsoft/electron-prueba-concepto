import http from "http";
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  console.log("Peticion a /api/health", {
    data: 12,
    name: "test",
  });
  res.json({ ok: true, ts: Date.now() });
});

app.get("/api/crash", (req, res) => {
  const a = 2;
  a = 3;
});

const server = http.createServer(app);
export default server;
