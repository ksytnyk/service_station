module.exports = function (startTime, estimationTime) {
    var endTime = new Date(startTime);

    endTime.setHours(endTime.getHours() + estimationTime);

    return endTime;
};