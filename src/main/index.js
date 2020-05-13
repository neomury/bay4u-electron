import electron from 'electron'
import { app, Tray, Menu, ipcMain, BrowserWindow } from 'electron'
import MainWindow from './window/main-window'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
/*if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}*/

let mainWindow = null;
let notiWindow = null;
let chaMsgList = [];

function init() {

    mainWindow = MainWindow.create(); // <-- 윈도우 생성하기
    mainWindow.maximize(); // 전체화면 
    mainWindow.on('closed', () => { // <-- 창닫기 이벤트 처리
        mainWindow = null;
        notiWindow.close();
    })
    const path = require('path');
    const url = require('url');

    notiWindow = new BrowserWindow({
        width: 320,
        height: 90,
        frame: false,
        type: "notification",
        //resizable: false,
        //parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            // devTools: false
        }
    });
    //notiWindow.setIgnoreMouseEvents(true);
    notiWindow.setAlwaysOnTop(true);
    notiWindow.setPosition(electron.screen.getPrimaryDisplay().bounds.width - 340, electron.screen.getPrimaryDisplay().bounds.height - 150);
    notiWindow.loadURL(url.format({
        pathname: path.join(__dirname, `../renderer/notification/notificationView.html`),
        protocol: 'file:',
        slashes: true
    }));
    //notiWindow.webContents.closeDevTools();
    //notiWindow.setOpacity(0);
    //notiWindow.hide();

    ipcMain.on('msgReceive', (event, data) => {
        console.log('msgReceive : ', data);
        //event.sender.send("response-message", "TEST : " + data.msg);
        if (mainWindow.isFocused() == false) {
            chaMsgList.push(data);
            notiWindow.reload();
            notiWindow.webContents.once('did-finish-load', () => {
                chaMsgList.sort(function(a, b) {
                    return (a.ReqSeq < b.ReqSeq) ? 1 : -1;
                });
                notiWindow.webContents.send("requestMsg", chaMsgList);
                //notiWindow.show();
            });
        }
    });

    ipcMain.on('hideChild', (event, data) => {
        //console.log('data:', data);
        if (data !== null) {
            if (mainWindow.isFocused() == false) {
                mainWindow.setFocusable(true);
                mainWindow.maximize();
                mainWindow.show();
            }
            mainWindow.webContents.send("response-chat", data);
        }
        //notiWindow.hide();
        chaMsgList = [];
    });

    // Renderer 프로세서의 메시지를 수신하고 응답 데이터를 전송합니다.
    ipcMain.on("request-message", (event, args) => {
        console.log(args);
        //event.sender.send("response-message", "This is a Server Message.");
        mainWindow.webContents.send("response-message", "This is a Server Message.");
    });
}

function createTray() {

    //메인 BrowserWindow에서 닫기를 누를시 히든처리가 선행되어야함.
    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
    // 현재 애플리케이션 디렉터리를 기준으로 하려면 `__dirname + '/images/tray.png'` 형식으로 입력해야 합니다.
    const tray = new Tray(__dirname + '/images/car.png');
    tray.on('click', () => {
        //mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        mainWindow.show();
    })
    var contextMenu = Menu.buildFromTemplate([{
        label: `v${app.getVersion()}`
    }, {
        label: 'Close',
        click: function() {
            mainWindow.close();
            app.quit();
            app.exit();
        }
    }])
    tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
        init()
            //createTray()
    }) // <-- createWindow -> init으로 수정

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        app.exit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        init() // <-- createWindow -> init으로 수정
    }
})



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */