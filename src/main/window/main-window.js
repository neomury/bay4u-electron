import { app, BrowserWindow } from 'electron'
import CommonUtils from "../shared/common-utils";

const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`

class MainWindow {
    constructor() {
        /**
         * Initial window options
         */
        const appicon = CommonUtils.icon(64);
        const appVersion = app.getVersion();

        let window = new BrowserWindow({
            height: 800,
            width: 1600,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                backgroundThrottling: false
            },
            icon: appicon,
            title: "수입부품 견적 시스템(" + appVersion + ")"
        })
        window.loadURL(winURL)
            // window.on('closed', () => {
            //   window = null
            // })
            //window.webContents.closeDevTools();
            //window.removeMenu();

        // 최소화 시 메인창 히든처리
        window.on('minimize', (event) => {
            event.preventDefault();
            window.hide();
            event.returnValue = false;
        });

        window.on('page-title-updated', (evt) => {
            evt.preventDefault();
        });

        // 닫기 시 메인창 히든 처리
        window.on('close', (event) => {
            event.preventDefault();
            window.hide();
            event.returnValue = false;
        });

        this.mainWindow = window;
    }

    get() {
        return this.mainWindow;
    }

    static create() {
        return new MainWindow().get();
    }
}

export default MainWindow;