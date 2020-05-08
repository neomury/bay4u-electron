//const { ipcRenderer } = require('electron');
import { ipcRenderer } from 'electron'
ipcRenderer.on("requestMsg", function(event, data) {
    console.log("msgReceive : ", data);
    document.getElementById("msgBox").innerHTML = "<div class='ip'>" + data.sendName + "</div><div class='msg'>" + data.msg + "</div>";
});

setTimeout(() => {
    ipcRenderer.send('hideChild');
}, 3000);