"use strict";

module.exports = function (taskTypesNoneAttributes, taskTypesOneAttributes, taskTypesTwoAttributes, taskTypesAllAttributes) {
    var resultArray = [];

    for (var key in arguments) {
        if (arguments[key] !== []) {
            arguments[key].forEach(item => {
                var obj = item.dataValues;
                obj.title = key;
                resultArray.push(obj);
            });
        }
    }

    return resultArray;
};