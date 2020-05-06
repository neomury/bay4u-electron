import { app, Tray, Menu, ipcMain } from 'electron'
import MainWindow from './window/main-window'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null;

function init() {

    mainWindow = MainWindow.create(); // <-- 윈도우 생성하기
    mainWindow.on('closed', () => { // <-- 창닫기 이벤트 처리
        mainWindow = null
    })

    /*notiWindow = new BrowserWindow({ width: 210, height: 60, frame: false, type: "notification" });
    notiWindow.setIgnoreMouseEvents(true);
    notiWindow.setAlwaysOnTop(true);
    notiWindow.setPosition(electron.screen.getPrimaryDisplay().bounds.width - 210, electron.screen.getPrimaryDisplay().bounds.height - 60);
    notiWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/'),
        protocol: 'file:',
        slashes: true
    }));
    notiWindow.isResizable(false);
    notiWindow.hide();*/

    // Renderer 프로세서의 메시지를 수신하고 응답 데이터를 전송합니다.
    ipcMain.on("request-message", (event, args) => {
        console.log(args);
        event.sender.send("response-message", "This is a Server Message.");
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
        createTray()
    }) // <-- createWindow -> init으로 수정

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
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