import { app, BrowserWindow, ipcMain } from "electron";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { fork } from "child_process";
import logger from "./logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win = null;
let apiChild = null;
let apiPort = null;
let isQuitting = false;

function forkApiChild() {
  const childPath = join(__dirname, "api-child.js");
  apiChild = fork(childPath, [], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
    env: { ...process.env, ELECTRON: "1" },
  });

  apiChild.stdout?.on("data", (d) =>
    logger.logWithContext("info", d.toString().trim(), {}, "api-child")
  );
  apiChild.stderr?.on("data", (d) =>
    logger.logWithContext("error", d.toString().trim(), {}, "api-child")
  );

  // Handshake: esperamos el puerto del servidor Express
  apiChild.on("message", (msg) => {
    if (msg?.type === "ready" && typeof msg.port === "number") {
      apiPort = msg.port;
      if (win) {
        win.webContents.send("api-port-ready", apiPort);
      }
    }
  });

  apiChild.on("exit", (code, signal) => {
    logger.logWithContext(
      "warn",
      "Proceso hijo salió",
      { code, signal },
      "api-child"
    );
    apiChild = null;
    apiPort = null;
    if (!isQuitting) {
      setTimeout(() => {
        logger.logWithContext(
          "info",
          "Reiniciando proceso hijo…",
          {},
          "api-child"
        );
        forkApiChild();
      }, 1000);
    }
  });
}

const createWindow = async () => {
  forkApiChild();
  logger.logWithContext("info", "Electron start", {}, "main");
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, "preload.js"),
    },
  });
  const indexPath = join(__dirname, "../dist/index.html");
  win.loadFile(indexPath);
  ipcMain.handle("get-api-port", () => apiPort);
};

function shutdownApiChild() {
  if (apiChild && apiChild.connected) {
    apiChild.send({ type: "shutdown" });
  }
}
app.whenReady().then(() => {
  createWindow();
});

app.on("before-quit", () => {
  isQuitting = true;
  shutdownApiChild();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

process.on("uncaughtException", (err) => {
  logger.logWithContext(
    "error",
    "Unhandled exception in main",
    { stack: err.stack },
    "main"
  );
});
