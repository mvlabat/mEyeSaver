const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipcMain = electron.ipcMain;

const path = require('path');
const url = require('url');

// Let electron reloads by itself when webpack watches changes in ./src/
if (process.env.ELECTRON_START_URL) {
    require('electron-reload')(__dirname, {
        electron: require('${__dirname}/../../node_modules/electron')
    });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 400, height: 250, frame: false});

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, './build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    // and load the index.html of the src.
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your src supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    mainWindow.setAlwaysOnTop(true);
    const screen = electron.screen.getPrimaryDisplay();

    const appIcon = new Tray(path.join(__dirname, './mEyeSaver16.png'));

    const headerItem = {label: 'Working...', type: 'normal', enabled: false};
    const longItem = {label: '    00:00:00', type: 'normal', enabled: true};
    const shortItem = {label: '    00:00:00', type: 'normal', enabled: true};

    const initializeLongRest = () => {
        mainWindow.webContents.send('initialize-long-rest');
    };

    const initializeShortRest = () => {
        mainWindow.webContents.send('initialize-short-rest');
    };

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Initialize long rest', type: 'normal', click: initializeLongRest },
        { label: 'Initialize short rest', type: 'normal', click: initializeShortRest }
    ]);

    // Call this again for Linux because we modified the context menu
    appIcon.setContextMenu(contextMenu);

    ipcMain.on('update-timer', function(event, {isResting, longTimerString, shortTimerString}) {
        // console.log(isResting);
        // console.log(longTimerString);
        // console.log(shortTimerString);
        // contextMenu.items[0].label = isResting ? 'Resting...' : 'Working...';
        // contextMenu.items[3].label = '    ' + longTimerString;
        // contextMenu.items[6].label = '    ' + shortTimerString;
        // appIcon.setContextMenu(contextMenu);
    });

    ipcMain.on('show-window', function() {
        mainWindow.show();
    });

    ipcMain.on('hide-window', function() {
        mainWindow.hide();
    });

    mainWindow.hide();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the src when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your src's specific main process
// code. You can also put them in separate files and require them here.
