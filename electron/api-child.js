import server from "./server/index.js";

function shutdown() {
  console.log("[child] shutdown solicitado");
  server.close(() => {
    // logger.logWithContext("info", "Servidor Express cerrado", {}, "api-child");
    console.log("Servidor Express cerrado");
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 1500);
}

server.listen(0, "127.0.0.1", () => {
  const addr = server.address();
  const port = typeof addr === "string" ? null : addr.port;
  console.log(`Express en http://127.0.0.1:${port}`);
  if (process.send && port) {
    process.send({ type: "ready", port });
  }
});
process.on("message", (msg) => {
  if (msg?.type === "shutdown") shutdown();
});
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (err) => {
  console.error("Excepción no manejada en api-child", { stack: err.stack });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada en api-child", { reason, promise });
});
