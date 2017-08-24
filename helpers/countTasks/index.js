const countStatuses = require('../../helpers/countStatuses');

module.exports = function (users, tasks) {

    var usersObj = {};
    users.map(item => {
        if (usersObj[item.id] === undefined) {
            usersObj[item.id] = item.dataValues;
            usersObj[item.id].task = {
                cost: 0,
                statuses: [0, 0, 0, 0, 0]
            };
        }
    });

    var tasksObj = {};
    tasks.map(item => {
        if (tasksObj[item.dataValues.planedExecutorID] === undefined) {
            tasksObj[item.dataValues.planedExecutorID] = {};
            tasksObj[item.dataValues.planedExecutorID].cost = item.dataValues.cost;
            tasksObj[item.dataValues.planedExecutorID].statuses = countStatuses([item.dataValues], true);
        } else {
            tasksObj[item.dataValues.planedExecutorID].cost += item.dataValues.cost;
            var statuses = countStatuses([item.dataValues], true);

            for (var i = 0; i < statuses.length; i++) {
                tasksObj[item.dataValues.planedExecutorID].statuses[i] += statuses[i];
            }
        }
    });

    for (var key in tasksObj) {
        usersObj[key].task = tasksObj[key];
    }

    var resultArr = [];
    for (var key in usersObj) {
        resultArr.push(usersObj[key]);
    }

    return resultArr;
};