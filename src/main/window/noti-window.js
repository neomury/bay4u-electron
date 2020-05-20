import electron from 'electron'
import { BrowserWindow } from 'electron'
import CommonUtils from "../shared/common-utils";

class NotiWindow {
    constructor() {
        /**
         * Initial window options
         */
        const path = require('path');
        const url = require('url');
        const appicon = CommonUtils.icon(64);

        let window = new BrowserWindow({
            width: 320,
            height: 90,
            frame: false,
            type: "notification",
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                devTools: false
            },
            icon: appicon
        })

        if (process.env.NODE_ENV === 'development') {
            window.loadURL(url.format({
                pathname: path.join(__dirname, `../../renderer/notification/notificationView.html`),
                protocol: 'file:',
                slashes: true
            }));
        } else {
            window.loadURL(`file://${__dirname}/notificationView.html`);
        }

        window.setAlwaysOnTop(true);
        window.setPosition(electron.screen.getPrimaryDisplay().bounds.width - 340, electron.screen.getPrimaryDisplay().bounds.height - 150);

        window.webContents.closeDevTools();
        //window.setSkipTaskbar(true);
        window.setOpacity(0);
        window.hide();

        window.on('show', (event) => {
            window.flashFrame(true);
        });

        this.notiWindow = window;
    }

    get() {
        return this.notiWindow;
    }

    static create() {
        return new NotiWindow().get();
    }
}

export default NotiWindow;