"use strict";
const detailsFactory = require('../../helpers/detailsFactory');
const Models = {};
const detailTypes = require('../../constants/detailType');

//getModels
Models.Detail = require('../Detail');
Models.TaskDetail = require('./index');
Models.Task = require('../Task');
Models.Request = require('../Request');
Models.TransportType = require('../TransportType');
Models.TransportMarkk = require('../TransportMarkk');
Models.TransportModel = require('../TransportModel');

//Relations
Models.TaskDetail.belongsTo(Models.Task, {foreignKey: 'taskID'});
Models.TaskDetail.belongsTo(Models.Detail, {foreignKey: 'detailID'});
Models.Detail.hasMany(Models.TaskDetail, {foreignKey: 'detailID'});
Models.Detail.belongsTo(Models.TransportType, {foreignKey: 'transportTypeID', as: 'transportType'});
Models.Detail.belongsTo(Models.TransportMarkk, {foreignKey: 'transportMarkkID', as: 'transportMarkk'});
Models.Detail.belongsTo(Models.TransportModel, {foreignKey: 'transportModelID', as: 'transportModel'});

//Creating in DB
Models.Detail.sync();
Models.TaskDetail.sync();

//setMethods

// --- TaskDetail Model ---

Models.TaskDetail.deleteTaskDetail = (array) => {
    return new Promise((resolve, reject) => {
        Models.TaskDetail
            .destroy({
                where: {
                    id: array
                }
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
};

Models.TaskDetail.createTaskDetail = (taskID, array) => {
    return new Promise((resolve, reject) => {
        array.forEach(item => {
            item.taskID = taskID
        });
        Models.TaskDetail
            .bulkCreate(array)
            .then(result => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    })
};

Models.TaskDetail.getTaskDetail = (taskID) => {
    return new Promise((resolve, reject) => {
        Models.TaskDetail
            .findAll({
                where: {
                    taskID: taskID
                },
                include: {
                    model: Models.Detail
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    })
};

// --- Detail Model ---
Models.Detail.getAll = () => {
    return new Promise((resolve, reject) => {
        Models.Detail
            .findAll({
                include: [
                    {
                        model: Models.TransportType,
                        as: 'transportType'
                    },
                    {
                        model: Models.TransportMarkk,
                        as: 'transportMarkk'
                    },
                    {
                        model: Models.TransportModel,
                        as: 'transportModel'
                    }
                ]
            })
            .then(Detail => {
                resolve(Detail);
            })
            .catch((err) => {
                reject(err);
            })
    })
};

Models.Detail.createDetail = function (detail) {
    return new Promise((resolve, reject) => {

        let search = {
            detailName: detail.detailName,
            transportTypeID: null,
            transportMarkkID: null,
            transportModelID: null
        };

        if (detail.typeOfCar !== 'default' && detail.typeOfCar) {
            search.transportTypeID = +detail.typeOfCar;
            detail.transportTypeID = +detail.typeOfCar;
        }
        else {
            delete detail.transportTypeID;
        }

        if (detail.carModel !== 'default' && detail.carModel) {
            search.transportModelID = +detail.carModel;
            detail.transportModelID = +detail.carModel;
        }
        else {
            delete detail.transportModelID;
        }

        if (detail.carMarkk !== 'default' && detail.carMarkk) {
            search.transportMarkkID = +detail.carMarkk;
            detail.transportMarkkID = +detail.carMarkk;
        }
        else {
            delete detail.transportMarkkID;
        }

        Models.Detail
            .findAll({
                where: search
            })
            .then(result => {

                if (result.length === 0 && detail.typeID) {
                    Models.Detail
                        .build(detail)
                        .save()
                        .then(detail => {
                            resolve({
                                detail: [detail],
                                hasResult: true
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                } else {
                    resolve({
                        detail: result,
                        hasResult: false
                    });
                }
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

Models.Detail.getDetailID = function (detailID) {
    return new Promise((resolve, reject) => {
        Models.Detail
            .findAll({
                where: {
                    id: detailID
                },
                include: [
                    {
                        model: Models.TransportType,
                        as: 'transportType'
                    },
                    {
                        model: Models.TransportMarkk,
                        as: 'transportMarkk'
                    },
                    {
                        model: Models.TransportModel,
                        as: 'transportModel'
                    }
                ]
            })
            .then(detail => {
                resolve(detail);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

Models.Detail.updateDetail = function (detailID, params) {

    if (params.typeOfCar !== 'default' && params.typeOfCar) {
        params.transportTypeID = +params.typeOfCar;
    }
    else {
        params.transportTypeID = null;
    }

    if (params.carModel !== 'default' && params.carModel) {
        params.transportModelID = +params.carModel;
    }
    else {
        params.transportModelID = null;
    }

    if (params.carMarkk !== 'default' && params.carMarkk) {
        params.transportMarkkID = +params.carMarkk;
    }
    else {
        params.transportMarkkID = null;
    }

    return new Promise((resolve, reject) => {
        Models.Detail
            .update(
                params,
                {
                    where: {
                        id: detailID
                    }
                })
            .then(() => {
                Models.Detail
                    .getDetailID(detailID)
                    .then(detail => {
                        resolve(detail);
                    })
                    .catch(err => {
                        console.warn(err);
                        reject(err);
                    });
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Models.TaskDetail.updateDetailType = function (array) {
    return new Promise((resolve, reject) => {

        if (array.length > 0) {
            array.forEach((item, index) => {
                Models.TaskDetail
                    .update(
                        item
                        , {
                            where: {
                                id: item.id
                            }
                        })
                    .then(() => {
                        if (index === (array.length - 1))
                            resolve();
                    })
                    .catch(err => {
                        console.warn(err);
                        reject(err);
                    });
            });
        }
        else {
            resolve();
        }
    });
};

Models.TaskDetail.updateDetailTypeStatus = function (taskID) {
    return new Promise((resolve, reject) => {

                Models.TaskDetail
                    .update(
                        {
                            detailType: detailTypes.DEFAULT
                        }
                        , {
                            where: {
                                taskID: taskID,
                                detailType: detailTypes.MISSING
                            }
                        })
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        console.warn(err);
                        reject(err);
                    });
    });
};

Models.Detail.deleteDetail = function (detailID) {
    return new Promise((resolve, reject) => {
        Models.Detail
            .destroy({
                where: {
                    id: detailID
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Models.Detail.getDetailsByCarAttributes = function (typeOfCar, carMarkk, carModel) {
    return new Promise((resolve, reject) => {
        Models.Detail
            .findAll({
                where: {
                    transportTypeID: null,
                    transportMarkkID: null,
                    transportModelID: null
                },
                include: [
                    {
                        model: Models.TransportType,
                        as: 'transportType'
                    },
                    {
                        model: Models.TransportMarkk,
                        as: 'transportMarkk'
                    },
                    {
                        model: Models.TransportModel,
                        as: 'transportModel'
                    }
                ]
            })
            .then(detailsNoneAttributes => {
                Models.Detail
                    .findAll({
                        where: {
                            transportTypeID: typeOfCar,
                            transportMarkkID: null,
                            transportModelID: null
                        },
                        include: [
                            {
                                model: Models.TransportType,
                                as: 'transportType'
                            },
                            {
                                model: Models.TransportMarkk,
                                as: 'transportMarkk'
                            },
                            {
                                model: Models.TransportModel,
                                as: 'transportModel'
                            }
                        ]
                    })
                    .then(detailsOneAttributes => {
                        Models.Detail
                            .findAll({
                                where: {
                                    transportTypeID: typeOfCar,
                                    transportMarkkID: carMarkk,
                                    transportModelID: null
                                },
                                include: [
                                    {
                                        model: Models.TransportType,
                                        as: 'transportType'
                                    },
                                    {
                                        model: Models.TransportMarkk,
                                        as: 'transportMarkk'
                                    },
                                    {
                                        model: Models.TransportModel,
                                        as: 'transportModel'
                                    }
                                ]
                            })
                            .then(detailsTwoAttributes => {
                                Models.Detail
                                    .findAll({
                                        where: {
                                            transportTypeID: typeOfCar,
                                            transportMarkkID: carMarkk,
                                            transportModelID: carModel
                                        },
                                        include: [
                                            {
                                                model: Models.TransportType,
                                                as: 'transportType'
                                            },
                                            {
                                                model: Models.TransportMarkk,
                                                as: 'transportMarkk'
                                            },
                                            {
                                                model: Models.TransportModel,
                                                as: 'transportModel'
                                            }
                                        ]
                                    })
                                    .then(detailsAllAttributes => {
                                        let result = detailsFactory(detailsNoneAttributes, detailsOneAttributes, detailsTwoAttributes, detailsAllAttributes);

                                        resolve(result);
                                    })
                                    .catch(error => {
                                        console.warn(error);
                                        reject(error);
                                    });
                            })
                            .catch(error => {
                                console.warn(error);
                                reject(error);
                            });
                    })
                    .catch(error => {
                        console.warn(error);
                        reject(error);
                    });
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

module.exports = Models;