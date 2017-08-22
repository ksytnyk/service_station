module.exports = function (startTime, estimationTime) {
    var endTime = new Date(startTime);

    return endTime.setHours(endTime.getHours() + estimationTime);
};