import { ipcMain, app } from 'electron'
import { autoUpdater, UpdateInfo, VersionInfo, UpdateCheckResult } from "electron-updater"

const path = require("path");
if (process.env.NODE_ENV !== 'production') {

    //개발환경일경우 설정파일이 없어서 오류 index.js와 같은 폴더에 앱업데이트 설정을 넣어둬 해결
    autoUpdater.updateConfigPath = path.join(__dirname, '../dev-appUpdate.yml');
}

export default (() => {
    class AppUpdater {
        constructor(window) {
            this.window = window;

            const log = require("electron-log")
            log.transports.file.level = "debug"

            autoUpdater.logger = log

            log.info("AutoUpdater config : " + autoUpdater.updateConfigPath);

            this.bindEvents();

            // autoUpdater.checkForUpdates()
            // autoUpdater.checkForUpdatesAndNotify()
            // autoUpdater.logger.transports.file.level = "info"
        }

        bindEvents() {
            // 사용자가 업데이트 확인을 요청했을 경우
            ipcMain.on("update-check-now", (event, data) => {
                console.log("update-check-now..................." + JSON.stringify(data))
                let { download } = data;
                download = (typeof download === "undefined") ? true : download;
                console.log("update-check-now..................." + download)
                autoUpdater.autoDownload = download;
                // try {
                autoUpdater.checkForUpdates();
                // } catch(error) {
                //     log.error(error);
                // }
            });
            // 사용자가 업데이트 파일의 다운로드 요청했을 경우
            ipcMain.on("update-download-now", (event, data) => {
                // console.log("update-download-now...................")
                // try {
                autoUpdater.downloadUpdate();
                // } catch(error) {
                //     log.error(error);
                // }
            });
            // 사용자가 업데이트 지금 설치를 요청했을 경우
            ipcMain.on("update-and-install-now", (event, data) => {
                // console.log("update-and-install-now...................")
                // try {
                autoUpdater.quitAndInstall();
                // } catch(error) {
                //     log.error(error);
                // }
            });
            // 사용자가 프로그램 종료를 요청했을 경우
            ipcMain.on("update-quit-now", (event, data) => {
                // console.log("update-quit-now...................")
                app.isQuiting = true;
                app.quit();
                app.exit();
            });
            // 사용자가 업데이트 나중에 하기를 했을 경우
            ipcMain.on("update-quit-later", (event, data) => {
                // console.log("update-quit-later...................")
                // autoUpdater.checkForUpdates();
            });

            const _this = this;
            // 업데이트 여부 확인 시작
            autoUpdater.on('checking-for-update', function() {
                    // console.log('Checking-for-update')
                    _this.window.webContents.send('updater-message', { type: 'checking-for-update' })
                })
                // 업데이트가 없음
            autoUpdater.on('update-not-available', function() {
                    // console.log('update-not-available')
                    _this.window.webContents.send('updater-message', { type: 'update-not-available' })
                })
                // 업데이트가 있음
            autoUpdater.on('update-available', function(info) {
                    // console.log('A new update is available, ' + JSON.stringify(info))
                    _this.window.webContents.send('updater-message', { type: 'update-available', info })
                })
                // 업데이트 다운로드 진행중
            autoUpdater.on('download-progress', function(progress) {
                    // console.log('download-progress... ' + JSON.stringify(progress))
                    _this.window.webContents.send('updater-message', { type: 'download-progress', progress })
                })
                // 업데이트 파일 다운로드가 완료됨
            autoUpdater.on('update-downloaded', function(info) {
                    // console.log('update-downloaded, ' + JSON.stringify(info))
                    _this.window.webContents.send('updater-message', { type: 'update-downloaded', info })
                })
                // 오류가 발생하였음
            autoUpdater.on('error', function(error) {
                // console.log('error')
                console.error(error)
                log.error(error);
                _this.window.webContents.send('updater-message', { type: 'update-error', error })
            })
        }
    }

    return {
        init(window) {
            if (!AppUpdater.instance) {
                AppUpdater.instance = new AppUpdater(window);
            }
            return AppUpdater.instance;
        }
    };
})();