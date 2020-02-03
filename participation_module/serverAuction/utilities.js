exports.initStartTime = (date, time) => {
    let timeArr = time.split(':');
    return Date.parse(date) + parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000 - 3 * 60 * 60 * 1000;
};

exports.initEndTime = (startTime, duration) => {
    let timeArr = duration.split(':');
    return startTime + parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000;
};

exports.initInSecHoursTime = (pauseTime) => {
    let timeArr = pauseTime.split(':');
    return parseInt(timeArr[0]) * 60 * 1000 + parseInt(timeArr[1]) * 1000;
};