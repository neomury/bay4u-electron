const { ipcRenderer } = require('electron');
//import { ipcRenderer } from 'electron'
ipcRenderer.on("requestMsg", function(event, data) {
    alert("requestMsg start");
    console.log("msgReceive : ", data);

    var chatDataList = data;
    var carno, popupInfo, btnClose, popupMsg, moveQt;
    var chatItem;
    if (chatDataList.length > 1) {

        var list = arrayGroupBy(chatDataList, function(item) {
            return [item.docId];
        });

        if (list.length > 1) {
            // 여러개 견적 일 경우
            chatItem = list[0];

            popupInfo = document.getElementById("popupInfo");
            popupInfo.innerHTML = "<div class='sendName'>" + chatItem[0].sendName + "</div><div class='carno'> 외 " + list.length + "개 견적 알림</div><div class ='close' id='btnClose'>X</div>";

            btnClose = document.getElementById("btnClose");
            btnClose.addEventListener('click', function() {
                goChat(null);
            });

            popupMsg = document.getElementById("popupMsg");
            popupMsg.innerHTML = "<div class = 'msg'> " + chatDataList.length + "개의 메시지가 있습니다.</div>";

            moveQt = document.getElementById("moveqt");
            moveQt.innerHTML = "<div class='link-qt'>채팅으로 이동!!</div>";
            moveQt.addEventListener('click', function() {
                goChat(chatItem[0]);
            });

        } else {
            // 같은견적 여러 메시지
            chatItem = list[0];
            console.log('chatItem:', chatItem[0]);
            carno = chatItem[0].qtInfo.CarNo;
            carno = carno.replace(/[*]empty[*]/gi, "미상차량");

            popupInfo = document.getElementById("popupInfo");
            popupInfo.innerHTML = "<div class='sendName'>" + chatItem[0].sendName + "</div><div class='carno'> (" + carno + ") 메지시 도착</div><div class ='close' id='btnClose'>X</div>";

            btnClose = document.getElementById("btnClose");
            btnClose.addEventListener('click', function() {
                goChat(null);
            });

            popupMsg = document.getElementById("popupMsg");
            popupMsg.innerHTML = "<div class = 'msg'> " + chatItem.length + "개의 메시지가 있습니다.</div>";

            moveQt = document.getElementById("moveqt");
            moveQt.innerHTML = "<div class='link-qt'>채팅으로 이동!!</div>";
            moveQt.addEventListener('click', function() {
                goChat(chatItem[0]);
            });
        }

    } else {
        carno = chatDataList[0].qtInfo.CarNo;
        carno = carno.replace(/[*]empty[*]/gi, "미상차량");

        popupInfo = document.getElementById("popupInfo");
        popupInfo.innerHTML = "<div class='sendName'>" + chatDataList[0].sendName + "</div><div class='carno'> (" + carno + ") 메지시 도착</div><div class ='close' id='btnClose'>X</div>";

        btnClose = document.getElementById("btnClose");
        btnClose.addEventListener('click', function() {
            goChat(null);
        });

        popupMsg = document.getElementById("popupMsg");
        popupMsg.innerHTML = "<div class = 'msg'> " + chatDataList[0].msg + "</div>";

        moveQt = document.getElementById("moveqt");
        moveQt.innerHTML = "<div class='link-qt'>채팅으로 이동!!</div>";
        moveQt.addEventListener('click', function() {
            goChat(chatDataList[0]);
        });
    }
    fadeWindowIn(remote.getCurrentWindow(), 0.1, 10);
});

/*setTimeout(() => {
    ipcRenderer.send('hideChild');
}, 3000);*/

function goChat(val) {
    fadeWindowOut(remote.getCurrentWindow(), 0.1, 10);
    ipcRenderer.send('hideChild', val);
}

function arrayGroupBy(array, f) {
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


const remote = require('electron').remote

const fadeWindowOut = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {
    let opacity = _window.getOpacity();
    const interval = setInterval(() => {
        if (opacity <= 0) window.clearInterval(interval);
        _window.setOpacity(opacity);
        opacity -= step;
    }, fadeEveryXSeconds);
    _window.hide();
    return interval;
}

const fadeWindowIn = (
    _window,
    step = 0.1,
    fadeEveryXSeconds = 10
) => {
    let opacity = _window.getOpacity();
    const interval = setInterval(() => {
        if (opacity >= 1) window.clearInterval(interval);
        _window.setOpacity(opacity);
        opacity += step;
    }, fadeEveryXSeconds);
    _window.show();
    return interval;
}