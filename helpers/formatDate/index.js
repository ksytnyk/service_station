"use strict";

module.exports = function formatDate(date) {

    let day = date.getDate(), year = date.getFullYear(), month;

    if ((date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1);
    } else {
        month = date.getMonth() + 1;
    }

    return year + '.' + month + '.' + day + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};