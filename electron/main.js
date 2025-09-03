import {
    app,
    BrowserWindow
} from 'electron'

import {
    dirname,
    join
} from 'path';
import {
    fileURLToPath
} from 'url';

import {
    fork
} from 'child_process';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // nodeIntegration: false, // Mantén false por seguridad
            // contextIsolation: true, // Mantén true por seguridad
            // enableRemoteModule: false, // Opcional
            // webSecurity: true, 
            // allowRunningInsecureContent: true, // <--- necesario si usas file:// + fetch
        },
    })

    const indexPath = join(__dirname, '../dist/index.html');
    win.loadFile(indexPath);
}

app.whenReady().then(() => {
    createWindow()
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});