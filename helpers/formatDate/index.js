"use strict";

module.exports = function formatDate(date) {
    var date = new Date(date);
    var array = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ];

    var res = array.map(item => {
        if (item < 10) item = "0" + item;
        return item;
    });

    return res[0] + '.' + res[1] + '.' + res[2] + ' ' + res[3] + ':' + res[4] + ':' + res[5];
};