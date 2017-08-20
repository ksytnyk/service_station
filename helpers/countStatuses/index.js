const status = require('../../constants/status');

module.exports = function (data) {
    let processing = 0,
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
            case status.CANCELED: {
                canceled++;
                break;
            }
        }
    });

    return [pending, processing, done, canceled];
};