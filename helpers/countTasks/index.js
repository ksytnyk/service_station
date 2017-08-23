module.exports = function (users, tasks) {

    var usersObj = {};
    users.map(item => {
        if (usersObj[item.id] === undefined) {
            usersObj[item.id] = item.dataValues;
            usersObj[item.id].task = {
                cost: 0,
                ready: 0
            };
        }
    });

    var tasksObj = {};
    tasks.map(item => {
        if (tasksObj[item.dataValues.planedExecutorID] === undefined) {
            tasksObj[item.dataValues.planedExecutorID] = {};
            tasksObj[item.dataValues.planedExecutorID].cost = item.dataValues.cost;
            if (item.dataValues.status === 3) {
                tasksObj[item.dataValues.planedExecutorID].ready = 1;
            } else {
                tasksObj[item.dataValues.planedExecutorID].ready = 0;
            }
        } else {
            tasksObj[item.dataValues.planedExecutorID].cost += item.dataValues.cost;
            if (item.dataValues.status === 3) {
                tasksObj[item.dataValues.planedExecutorID].ready += 1;
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