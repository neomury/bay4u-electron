import { app, Menu, BrowserWindow, dialog, clipboard } from "electron";

const path = require("path");
const isMac = process.platform === 'darwin'

function createMainMenu(window) {
    const template = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                // { type : "separator" },
                {
                    label: "종료",
                    click: () => {
                        app.isQuiting = true;
                        app.exit();
                        app.quit();
                    }
                }
            ],
        }
    ];

    const appMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(appMenu);
}

export default createMainMenu;