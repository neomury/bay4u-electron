import electron from 'electron'
import { app, ipcMain } from 'electron'
import MainWindow from './window/main-window'
import NotiWindow from './window/noti-window'
import AppUpdater from './shared/appUpdate';
import createMainMenu from './window/main-menu'
import SystemTray from './window/tray-component'
import CommonUtils from "./shared/common-utils";
//import { autoUpdater } from 'electron-updater'
//import colors from 'vuetify/lib/util/colors';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

let mainWindow = null;
let notiWindow = null;
let chaMsgList = [];

function init() {

    mainWindow = MainWindow.create(); // <-- 윈도우 생성하기
    mainWindow.maximize(); // 전체화면 
    mainWindow.on('closed', () => { // <-- 창닫기 이벤트 처리
        mainWindow = null;
        notiWindow.close();
    });

    mainWindow.on('maximize', (event) => {
        if (notiWindow.isVisible() === true) {
            notiWindow.hide();
            chaMsgList = [];
        }
    });

    // 메인 메뉴 생성하기
    createMainMenu(mainWindow);

    // 시스템 트레이 생성하기
    SystemTray.init(mainWindow);

    // 알림창 생성
    notiWindow = NotiWindow.create();

    // 알림창 최소화 시 최근 채팅으로 이동
    notiWindow.on('minimize', (event) => {
        if (mainWindow.isFocused() == false) {
            var list = CommonUtils.arrayGroupBy(chaMsgList, function(item) {
                return [item.docId];
            });

            var chatItem = list[0];
            if (list.length > 1) {
                chatItem = chatItem[0];
            } else {
                chatItem = chaMsgList[0];
            }

            mainWindow.setFocusable(true);
            mainWindow.maximize();
            mainWindow.show();
            mainWindow.webContents.send("response-chat", chatItem);
            notiWindow.hide();
            chaMsgList = [];
        }
    });


    ipcMain.on('msgReceive', (event, data) => {
        console.log('msgReceive : ', data);
        //console.log('isVisible : ', mainWindow.isVisible());
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
        if (data !== null) {
            if (mainWindow.isFocused() == false) {
                mainWindow.setFocusable(true);
                mainWindow.maximize();
                mainWindow.show();
            }
            mainWindow.webContents.send("response-chat", data);
        } else {
            notiWindow.hide();
        }
        chaMsgList = [];
    });

    // Renderer 프로세서의 메시지를 수신하고 응답 데이터를 전송합니다.
    ipcMain.on("request-message", (event, args) => {
        console.log(args);
        event.sender.send("response-message", "This is a Server Message.");
        //mainWindow.webContents.send("response-message", "This is a Server Message.");
    });

    // 업데이트 처리
    AppUpdater.init(mainWindow);
    //if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates();
    //autoUpdater.checkForUpdates();
}
/*autoUpdater.on('update-downloaded', () => {
    console.log('update-downloaded')
    autoUpdater.quitAndInstall()
})*/

app.on('ready', () => {
    init()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        app.exit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        init();
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