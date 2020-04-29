import { Tray, Menu } from 'electron';
class AppTray {
    constructor() {
        const tray = new Tray(path.join(__static, "favicon08.ico"));
        tray.on('click', () => {
            //mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
            this.mainWindow.show();
        })
        var contextMenu = Menu.buildFromTemplate([{
            label: `v${app.getVersion()}`
        }, {
            label: 'Close',
            click: function() {
                this.mainWindow.close();
                app.quit();
                app.exit();
            }
        }])
        tray.setContextMenu(contextMenu)
    }
    get() {
        return this.tray;
    }

    static create() {
        return new AppTray().get();
    }
}
export default AppTray;