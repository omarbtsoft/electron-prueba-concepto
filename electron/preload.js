import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("nativeAPI", {
  onApiPortReady: (cb) => {
    const listener = (_e, port) => cb(port);
    ipcRenderer.on("api-port-ready", listener);
    return () => ipcRenderer.removeListener("api-port-ready", listener);
  },
  getApiPort: () => ipcRenderer.invoke("get-api-port"),
});
