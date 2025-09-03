import server from "./server/index.js";

function shutdown() {
  console.log("[child] shutdown solicitado");
  server.close(() => {
    console.log("[child] servidor cerrado");
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 1500);
}

server.listen(0, "127.0.0.1", () => {
  const addr = server.address();
  const port = typeof addr === "string" ? null : addr.port;
  console.log(`[child] Express en http://127.0.0.1:${port}`);
  if (process.send && port) {
    process.send({ type: "ready", port });
  }
});
process.on("message", (msg) => {
  if (msg?.type === "shutdown") shutdown();
});
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
