import { app, Tray, Menu } from 'electron';
import CommonUtils from "../shared/common-utils";

let tray;
export default (() => {
    class TrayManager {
        constructor(win) {
            this.win = win;

            const trayicon = CommonUtils.icon(16);

            tray = new Tray(trayicon);
            const menu = Menu.buildFromTemplate([
                /* {
                                           label: "bay4u 보기",
                                            click: () => {
                                                this.win.show();
                                            }
                                        },
                                        {
                                            type: "separator"
                                        },*/
                {
                    label: "종료",
                    click: () => {
                        this.win.close();
                        app.exit();
                        app.quit();
                    }
                }
            ]);
            tray.setToolTip("Bay4u");
            tray.setContextMenu(menu);

            tray.on('click', () => {
                this.win.maximize();
                this.win.show();
            });

            /*tray.on("double-click", () => {
                this.win.show();
            });*/
        }
    }

    return {
        init(win) {
            if (!TrayManager.instance) {
                if (!win) {
                    throw new Error("윈도우 객체의 인스턴스가 필요합니다.");
                }
                TrayManager.instance = new TrayManager(win);
            }
            return TrayManager.instance;
        }
    };
})();