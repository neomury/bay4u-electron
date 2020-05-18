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

    static arrayGroupBy(array, f) {
        var groups = {};
        array.forEach(function(o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function(group) {
            return groups[group];
        })
    }
}

export default CommonUtil;