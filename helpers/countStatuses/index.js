const status = require('../../constants/status');
const dataType = require('../../constants/dataType');

module.exports = function (data, type) {

    let processing = 0,
        hold = 0,
        canceled = 0,
        done = 0,
        pending = 0;

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

    if (type === dataType.TASK) {
        return [pending, processing, done, hold, canceled];
    } else if (type === dataType.REQUEST) {
        return [pending, processing, done, canceled];
    }
};