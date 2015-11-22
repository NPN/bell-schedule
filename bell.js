var schedule = [,[[490,540,"1st Period"],[545,600,"2nd Period"],[600,610,"Brunch"],[615,665,"3rd Period"],[670,720,"4th Period"],[720,765,"Lunch"],[770,820,"5th Period"],[825,875,"6th Period"],[880,930,"7th Period"]],[[490,535,"1st Period"],[540,590,"2nd Period"],[590,600,"Brunch"],[605,650,"3rd Period"],[655,685,"Tutorial"],[690,735,"4th Period"],[735,780,"Lunch"],[785,830,"5th Period"],[835,880,"6th Period"],[885,930,"7th Period"]],[[530,625,"2nd Period"],[625,640,"Brunch"],[645,735,"4th Period"],[735,780,"Lunch"],[785,875,"6th Period"]],[[490,585,"1st Period"],[585,600,"Brunch"],[605,695,"3rd Period"],[695,740,"Lunch"],[745,835,"5th Period"],[840,930,"7th Period"]],[[490,540,"1st Period"],[545,600,"2nd Period"],[600,610,"Brunch"],[615,665,"3rd Period"],[670,720,"4th Period"],[720,765,"Lunch"],[770,820,"5th Period"],[825,875,"6th Period"],[880,930,"7th Period"]]];

var currentPeriod, periodElem, textElem, progressBar, progressBarLen;

if (document.readyState == "complete") {
    initialize();
}
else {
    document.addEventListener("DOMContentLoaded", initialize);
}

function initialize() {
    periodElem = document.getElementById("period");
    textElem = document.getElementsByTagName("text")[0];

    progressBar = document.getElementById("red");
    progressBarLen = progressBar.getTotalLength();
    progressBar.style.strokeDasharray = progressBarLen + " " + progressBarLen;

    tick();
}

function tick() {
    var time = getMinuteTime(),
        day = schedule[new Date().getDay()];

    if (day && time >= day[0][0] && time < day[day.length-1][1]) {
        var period = getPeriod(time, day);

        periodElem.textContent = period[2];
        document.title = textElem.textContent = createTimeLeftString(period[1]);

        currentPeriod = period;
    }
    else {
        periodElem.textContent = document.title = "No School";
        textElem.textContent = "";

        currentPeriod = null;
    }
    requestAnimationFrame(updateProgressBar);
    setTimeout(tick, 1000 - (Date.now() % 1000));
}

function createTimeLeftString(time) {
    var secondsLeft = -secSinceMinTime(time),
        h = Math.floor(secondsLeft / 3600),
        m = Math.floor((secondsLeft % 3600) / 60),
        s = secondsLeft % 60;

    m = (m < 10 ? "0" : "") + m;
    s = (s < 10 ? "0" : "") + s;

    if (h > 0) {
        return h + ":" + m + ":" + s;
    }
    else if (m > 0) {
        return m + ":" + s;
    }
    return "00:" + s;
}

function getPeriod(time, day) {
    for (var i = 0; i < day.length; i++) {
        if (time >= day[i][0] && time < day[i][1]) {
            return day[i];
        }
        else if (i < day.length - 1 && time >= day[i][1] && time < day[i+1][0]) {
            return [day[i][1], day[i+1][0], "Passing Period"];
        }
    }
}

function updateProgressBar() {
    if (!currentPeriod) {
        progressBar.style.strokeDashoffset = progressBarLen;
    }
    else {
        progressBar.style.strokeDashoffset =
            progressBarLen * (1 - percentPeriodElapsed(currentPeriod));
    }
}

function getMinuteTime() {
    var date = new Date();
    return date.getHours() * 60 + date.getMinutes();
}

function percentPeriodElapsed(period) {
    var secondsInPeriod = 60 * (period[1] - period[0]);
    return secSinceMinTime(period[0]) / secondsInPeriod;
}

function secSinceMinTime(time) {
    return 60 * (getMinuteTime() - time) + new Date().getSeconds();
}
