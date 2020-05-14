import { nativeImage } from "electron";

const path = require("path");

class CommonUtil {
    static icon(size) {
        let iconname = "bay4u.png";
        // iconname = process.platform === "darwin" ? "icon.icns" : iconname;
        iconname = process.platform === "win32" ? "bay4u.ico" : iconname;
        const iconPath = path.join(__dirname, "..", "..", "..", "static", iconname);

        if (process.platform === "darwin") {
            let icon = nativeImage.createFromPath(iconPath);
            if (size && size > 0) {
                icon = icon.resize({ width: size, height: size });
            }
            return icon;
        }
        return iconPath;
    }
}

export default CommonUtil;