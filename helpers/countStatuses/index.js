const status = require('../../constants/status');

module.exports = function (data, countTasks) {
    let pending = 0,
        processing = 0,
        done = 0,
        hold = 0,
        canceled = 0;

    data.forEach(item => {

        switch (item.status) {
            case status.PENDING: {
                pending++;
                break;
            }
            case status.PROCESSING: {
                processing++;
                break;
            }
            case status.DONE: {
                done++;
                break;
            }
            case status.HOLD: {
                hold++;
                break;
            }
            case status.CANCELED: {
                canceled++;
                break;
            }
        }
    });

    if (countTasks) {
        return [pending, processing, done, hold , canceled];
    }

    return [pending, processing, done, canceled];
};