import './style.scss';
const { ipcRenderer } = require('electron');
const moment = require('moment');
function pad(num) {
    let s = num + '';
    while (s.length < 2) s = "0" + s;
    return s;
}

function timerString(time) {
    if (time < 0) {
        time = Math.abs(time);
    }
    const hours = Math.floor(time / 60 / 60);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 60);
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

let longTimerString = timerString(0);
let shortTimerString = timerString(0);
let longRestStartDate;
let shortRestStartDate;
let restEndDate = moment();
let isResting = false;
let isLongRest = false;

const domTimer = document.getElementById('timer');

setInterval(() => {
    ipcRenderer.send('update-timer', { isResting, longTimerString, shortTimerString });
    domTimer.innerHTML = timerString(restEndDate.diff(moment(), 'seconds'));
    checkTimers();
}, 50);

function initializeTimers() {
    longRestStartDate = moment().add(60, 'm');
    shortRestStartDate = moment().add(10, 'm');
}

function startLongRest() {
    longRestStartDate = moment();
    checkTimers();
}

function startShortRest() {
    shortRestStartDate = moment();
    checkTimers();
}

function checkTimers() {
    if (isResting) {
        if (moment().diff(restEndDate) > 0) {
            document.getElementById('timer').classList.add('complete');
        }
        return;
    }

    if (moment().diff(longRestStartDate) > 0) {
        restEndDate = moment().add(10, 'm');
        isResting = true;
        isLongRest = true;
        ipcRenderer.send('show-window');
    } else if (moment().diff(shortRestStartDate) > 0) {
        restEndDate = moment().add(20, 's');
        isResting = true;
        isLongRest = false;
        ipcRenderer.send('show-window');
    }
}

ipcRenderer.on('initialize-long-rest', function() {
    startLongRest();
});

ipcRenderer.on('initialize-short-rest', function() {
    startShortRest();
});

document.getElementById('postpone-button').onclick = function() {
    if (isLongRest) {
        longRestStartDate = moment().add(5, 'm');
    } else {
        shortRestStartDate = moment().add(5, 'm');
    }
    isResting = false;
    ipcRenderer.send('hide-window');
    document.getElementById('timer').classList.remove('complete');
};

document.getElementById('return-button').onclick = function() {
    if (isLongRest) {
        initializeTimers();
    } else {
        shortRestStartDate = moment().add(10, 'm');
    }
    isResting = false;
    ipcRenderer.send('hide-window');
    document.getElementById('timer').classList.remove('complete');
};

initializeTimers();
