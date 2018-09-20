module.exports = function (startTime, estimationTime) {
    var endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + estimationTime);

    return endTime;
};