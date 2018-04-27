"use strict";

module.exports = function(detailsNoneAttributes, detailsOneAttributes, detailsTwoAttributes, detailsAllAttributes) {
    let resultArray = [];

    for (let key in arguments) {
        if (arguments[key] !== []) {
            arguments[key].forEach(item => {
                let obj = item.dataValues;
                obj.title = key;
                resultArray.push(obj);
            });
        }
    }
    return resultArray;
};