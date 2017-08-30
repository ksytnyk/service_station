$(document).ready(function () {

    $('#create_task').on('click', function () {
        $('#requestIDForTask').val($("#update_request").attr("request-id"));

        if (window.location.pathname.includes('create-request')) {

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-types',
                type: 'post',
                data: {
                    carMarkk: $('#markk').val(),
                    carModel: $('#model').val()
                },
                success: function (data) {

                    $('#task-type-select').find('option').remove();

                    $.each(data.taskTypes, function (i, item) {

                        $('#task-type-select').append($('<option>', {
                            value: item.id,
                            text: item.typeName,
                            taskTypeID: item.typeName,
                            id: 'taskTypeID' + item.id
                        }));
                    });
                    setDefaultTaskNameOnCreateTask();
                    setDefaultAssignedUserOnCreateTask();
                }
            });
        } else {
            setDefaultTaskNameOnCreateTask();
            setDefaultAssignedUserOnCreateTask();
        }
    });

    $('#change-status-update-task').on('click', function () {
        $('#update-form-task-status').val(1);
    });

    $('#change-status-cancel-task').on('click', function () {
        $('#update-form-task-status').val(5);
    });

    $('.create-assign-task-button').on('click', function () {
        $('.create-assign-task-button').addClass('hidden');
        $('.create-assign-task-select').removeClass("hidden");
    });

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        var dataArr = $('#createTaskForm').serializeArray();

        if (dataArr[1].value === '') {
        var taskTypeID = $('#taskTypeID' + $('.task-type-select').serializeArray()[0].value).attr('taskTypeID');
        dataArr[2].value = taskTypeID;
            dataArr[1].value = dataArr[2].value;
        }

        $.ajax({
            url: getRole(window.location.pathname) + '/create-task',
            type: 'post',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Додавання задачі пройшло успішно.');

                setDefaultAssignedUserOnCreateTask();
                setDefaultTaskNameOnCreateTask();

                var executorNameSurname = $('#option' + data.result.planedExecutorID).attr('executorFullName');
                var assignedNameSurname = $('#optionAE' + data.result.assignedUserID).attr('assignedUserFullName');

                $("#tasks-table").append('' +
                    '<tr id="idx-task-' + data.result.id + '">' +
                    '<th class="tac" style="background-color: #fff;">' +
                    data.result.id +
                    '</th>' +
                    '<td class="vat" style="position: relative; padding-top: 40px;">' +
                    changeStatus(data.result.status) +
                    '<p><strong>Назва задачі: </strong>' + data.result.name + '</p>' +
                    '<p><strong>Виконавець: </strong>' + executorNameSurname + '</p>' +
                    '<p><strong>Доручити задачу: </strong>' + assignedNameSurname + '</p>' +
                    '<p><strong>Вартість: </strong>' + data.result.cost + ' грн</p>' +
                    '<p><strong>Час виконання: </strong>' + data.result.estimationTime + ' год</p>' +
                    '<p><strong>Час початку: </strong>' + formatDate(data.result.startTime) + '</p>' +
                    '<p><strong>Кінцевий час: </strong>' + formatDate(data.result.endTime) + '</p>' +
                    '</td>' +
                    '<td class="vat">' +
                    '<p><strong>Опис задачі: </strong>' + data.result.description + '</p>' +
                    '<p class="bt"><strong>Запчастини: </strong>' + data.result.parts + '</p>' +
                    '<p><strong>Запчастини кліента: </strong>' + data.result.customerParts + '</p>' +
                    '<p><strong>Відсутні запчастини: </strong>' + data.result.needBuyParts + '</p>' +
                    '<p class="bt"><strong>Коментар: </strong>' + data.result.comment + '</p>' +
                    '</td>' +
                    '<td class="tac">' +
                    '<a class="update-task modal-window-link"' +
                    ' title="Редагувати задачу"' +
                    ' data-toggle="modal"' +
                    ' data-id="' + data.result.id + '"' +
                    ' data-request-id="' + data.result.requestID + '"' +
                    ' data-task-description="' + data.result.description + '"' +
                    ' data-task-name="' + data.result.name + '"' +
                    ' data-task-assigned-user="' + data.result.assignedUserID + '"' +
                    ' data-task-planed-executor="' + data.result.planedExecutorID + '"' +
                    ' data-task-cost="' + data.result.cost + '"' +
                    ' data-task-estimation-time="' + data.result.estimationTime + '"' +
                    ' data-task-start-time="' + formatDate(data.result.startTime) + '"' +
                    ' data-task-end-time="' + formatDate(data.result.endTime) + '"' +
                    ' data-task-parts="' + data.result.parts + '"' +
                    ' data-task-customer-parts="' + data.result.customerParts + '"' +
                    ' data-task-need-buy-parts="' + data.result.needBuyParts + '"' +
                    ' data-task-comment="' + data.result.comment + '"' +
                    ' data-target="#updateTaskFormModal"' +
                    ' style=""> ' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/> ' +
                    '</a> ' +
                    '<a href="#" class="delete-task modal-window-link" title="Видалити задачу" data-toggle="modal" data-current="' + getIdRole(window.location.pathname) + '" data-id="' + data.result.id + '"' +
                    ' data-target="#deleteTaskFormModal">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/>' +
                    '</a>' +
                    '</td>' +
                    '</tr>');

                headerFix();
                deleteTaskOnClick();
                clearModalAddTask();
                updateTaskOnClick();

            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });

    $('#taskCancelAddButton').on('click', function () {
        clearModalAddTask();
    });

    $('.update-assign-task-button').on('click', function () {
        setOpenTaskNameOnUpdateTask();
    });

    $('.task-update-button').on('click', function () {

        $('#updateTaskFormModal').modal('toggle');


        var dataArr = $('#update-form-task').serializeArray();

        if (getRole(window.location.pathname) !== '/executor' && getRole(window.location.pathname) !== '/store-keeper') {

            if (dataArr[3].value === '') {
            var taskTypeID = $('#updateTaskTypeID' + $('.update-form-task-type-select').serializeArray()[0].value).attr('updateTaskTypeID');
            dataArr[4].value = taskTypeID;
                dataArr[3].value = dataArr[4].value;
            }
        }

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task/' + $('#update-form-task-id').val(),
            type: 'put',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Оновлення задачі пройшло успішно.');

                $('.update-form-task-type-input').addClass("hidden");
                $('#update_new_task .select2').removeClass("hidden");

                var idx = "#idx-task-" + data.task.id;
                var idr = "#idr-cost-" + data.requestID;

                $(idx).empty();
                $(idr).empty();

                if (getRole(window.location.pathname) !== "/executor" && getRole(window.location.pathname) !== "/store-keeper") {
                    var executorNameSurname = $('#option' + dataArr[5].value).attr('executorFullName');
                    var assignedNameSurname = $('#optionAE' + dataArr[6].value).attr('assignedUserFullName');
                }

                var newTask, newTask1 = '', newTask2, newCost;

                newTask = '' +
                    '<th class="tac bb" style="background-color:#fff;">' +
                    data.task.id +
                    '</th>' +
                    '<td class="vat bb' + disableFields(data.task.status) + '" style="position: relative; padding-top: 40px;">' +
                    changeStatus(data.task.status) +
                    '<p><strong>Назва задачі: </strong>' + data.task.name + '</p>' +
                    '<p class="executor_name_surname"><strong>Виконавець: </strong>' + executorNameSurname + '</p> ' +
                    '<p class="assigned_name_surname"><strong>Доручити задачу: </strong>' + assignedNameSurname + '</p>' +
                    '<p><strong>Вартість: </strong>' + data.task.cost + ' грн</p>' +
                    '<p><strong>Час виконання: </strong>' + data.task.estimationTime + ' год</p>' +
                    '<p><strong>Час початку: </strong>' + formatDate(data.task.startTime) + '</p> ' +
                    '<p><strong>Кінцевий час: </strong>' + formatDate(data.task.endTime) + '</p> ' +
                    '</td>' +
                    '<td class="vat bb' + disableFields(data.task.status) + '"> ' +
                    '<p><strong>Опис задачі: </strong>' + data.task.description + '</p> ' +
                    '<p class="bt"><strong>Запчастини: </strong>' + data.task.parts + '</p> ' +
                    '<p><strong>Запчастини клієнта: </strong>' + data.task.customerParts + '</p> ' +
                    '<p><strong>Відсутні запчастини: </strong>' + data.task.needBuyParts + '</p> ' +
                    '<p class="bt"><strong>Коментар: </strong>' + data.task.comment + '</p> ' +
                    '</td>';

                if (getRole(window.location.pathname) === "/executor") {
                    if (data.task.status === 1) {
                        newTask1 = '' +
                            '<td class="tac">' +
                            '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                            '<input type="hidden" value="2" name="status">' +
                            '<button class="status btn btn-primary" type="submit">Почати задачу</button>' +
                            '</td>';
                    } else {
                        newTask1 = '' +
                            '<td class="tac">' +
                            '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                            '<input type="hidden" value="4" name="status">' +
                            '<button class="status btn btn-danger" type="submit">Відсутні запчастини</button>' +
                            '</form>' +
                            '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                            '<input type="hidden" value="3" name="status">' +
                            '<button class="status btn btn-success" type="submit">Закінчити задачу</button>' +
                            '</form>' +
                            '</td>';
                    }
                }
                if (getRole(window.location.pathname) === '/store-keeper') {
                    newTask1 = '' +
                        '<td class="tac">' +
                            '<form action="/store-keeper/set-status/' + data.task.id + '" method="POST">' +
                                '<input type="hidden" value="4" name="status"/>' +
                                '<button class="btn btn-danger status" type="submit">Зупинити</button>' +
                            '</form>' +
                            '<form action="/store-keeper/set-status/' + data.task.id + '" method="POST">' +
                                '<input type="hidden" value="1" name="status"/>' +
                                '<input type="hidden" value="' + data.task.planedExecutorID + '" name="assignedUserID"/>' +
                                '<button class="btn btn-warning status" type="submit">Підтвердити</button>' +
                            '</form>' +
                        '</td>'
                }
                newTask2 = '' +
                    '<td class="tac bb"> ' +
                    '<a class="update-task modal-window-link"' +
                    ' title="Редагувати задачу"' +
                    ' data-toggle="modal"' +
                    ' data-id="' + data.task.id + '"' +
                    ' data-request-id="' + data.task.requestID + '"' +
                    ' data-task-description="' + data.task.description + '"' +
                    ' data-task-name="' + data.task.name + '"' +
                    ' data-task-assigned-user="' + data.task.assignedUserID + '"' +
                    ' data-task-planed-executor="' + data.task.planedExecutorID + '"' +
                    ' data-task-cost="' + data.task.cost + '"' +
                    ' data-task-estimation-time="' + data.task.estimationTime + '"' +
                    ' data-task-start-time="' + formatDate(data.task.startTime) + '"' +
                    ' data-task-end-time="' + formatDate(data.task.endTime) + '"' +
                    ' data-task-parts="' + data.task.parts + '"' +
                    ' data-task-customer-parts="' + data.task.customerParts + '"' +
                    ' data-task-need-buy-parts="' + data.task.needBuyParts + '"' +
                    ' data-task-comment="' + data.task.comment + '"' +
                    ' data-target="#updateTaskFormModal"' +
                    ' style=""> ' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/> ' +
                    '</a> ' +
                    '<a href="#"' +
                    ' class="delete-task modal-window-link"' +
                    ' title="Видалити задачу" data-toggle="modal"' +
                    ' data-current="' + getIdRole(window.location.pathname) + '" data-id="' + data.task.id + '"' +
                    ' data-request-id="' + data.task.requestID + '"' +
                    ' data-task-old-cost="' + data.task.cost + '"' +
                    ' data-target="#deleteTaskFormModal"' +
                    ' style=""> ' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/> ' +
                    '</a>' +
                    '</td>';

                newCost = '<strong>Вартість: </strong>' + data.newCost + ' грн';

                $(idx).append(newTask + newTask1 + newTask2);
                $(idr).append(newCost);

                deleteTaskOnClick();
                clearModalAddTask();
                updateTaskOnClick();
            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });

    $('#delete-button').on('click', function () {

        var taskID = $(this).attr('task-id');

        var data = {
            requestID: $(this).attr('request-id'),
            taskOldCost: $(this).attr('task-old-cost')
        };

        $('#deleteTaskFormModal').modal('hide');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task/' + taskID,
            type: 'delete',
            data: data,
            success: function (data) {
                showSuccessAlert('Видалення задачі пройшло успішно.');

                var idx = "#idx-task-" + data.id;
                var idr = "#idr-cost-" + data.requestID;

                $(idx).remove();
                $(idr).empty();

                var newCost = '<strong>Вартість: </strong>' + data.newCost + ' грн';

                $(idr).append(newCost);
            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });

    deleteTaskOnClick();
    updateTaskOnClick();
});

function clearModalAddTask() {
    $('.create-form-task').val('');
}

function updateTaskOnClick() {
    $('.update-task').on('click', function () {

        setOpenTaskNameOnUpdateTask();

        if (window.location.pathname.includes('create-request') || window.location.pathname.includes('requests')) {

            var dataArr;
            var This = this;

            if (window.location.pathname.includes('create-request')) {
                dataArr = {
                    carMarkk: $('#markk').val(),
                    carModel: $('#model').val()
                };
            } else if (window.location.pathname.includes('requests')) {
                dataArr = {
                    carMarkk: $('#markk').attr('attr-name'),
                    carModel: $('#model').attr('attr-name')
                };
            }

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-types',
                type: 'post',
                data: dataArr,
                success: function (data) {
                    $('#update-form-task-type-select').find('option').remove();

                    data.taskTypes.forEach(item => {
                        $('#update-form-task-type-select').append($('<option>', {
                            value: item.id,
                            text: item.typeName,
                            updateTaskTypeID: item.typeName,
                            id: 'updateTaskTypeID' + item.id
                        }));
                    });

                    $('#update-form-task-type-select').val('');

                    isFirstUpdateClick = true;
                    var taskName = $(This).data('task-name');
                    var taskTypeID = $("option[updateTaskTypeID='" + taskName + "']").val();

                    $('#update-form-task-type-select').val(taskTypeID).change();
                    $('#update-form-task-old-cost').val($(This).data('task-cost'));
                    $('#update-form-task-cost').val($(This).data('task-cost'));

                }
            });

        } else {
            isFirstUpdateClick = true;
            var taskName = $(this).data('task-name');
            var taskTypeID = $("option[updateTaskTypeID='" + taskName + "']").val();

            $('#update-form-task-type-select').val(taskTypeID).change();
            $('#update-form-task-old-cost').val($(this).data('task-cost'));
            $('#update-form-task-cost').val($(this).data('task-cost'));
        }

        $('#update-form-task-id').val($(this).data('id'));
        $('#update-form-request-id').val($(this).data('request-id'));
        $('#update-form-task-assigned-user').val($(this).data('task-assigned-user')).change();
        $('#update-form-task-description').val($(this).data('task-description'));
        $('#update-form-task-planed-executor').val($(this).data('task-planed-executor')).change();
        $('#update-form-task-estimation-time').val($(this).data('task-estimation-time'));
        $('#update-form-task-start-time').val($(this).data('task-start-time'));
        $('#update-form-task-end-time').val($(this).data('task-end-time'));
        $('#update-form-task-parts').val($(this).data('task-parts'));
        $('#update-form-task-customer-parts').val($(this).data('task-customer-parts'));
        $('#update-form-task-need-buy-parts').val($(this).data('task-need-buy-parts'));
        $('#update-form-task-status').val($(this).data('task-status'));
        $('#update-form-task-comment').val($(this).data('task-comment'));
    });
}

function deleteTaskOnClick() {
    $('.delete-task').on('click', function () {
        $('#delete-button').attr('task-id', ($(this).data('id')));
        $('#delete-button').attr('request-id', ($(this).data('request-id')));
        $('#delete-button').attr('task-old-cost', ($(this).data('task-old-cost')));
        $('#delete-task-id').html($(this).data('id'));
    });
}

function getIdRole(pathname) {
    if (pathname.includes('admin')) {
        return 1;
    } else {
        return 2;
    }
}

function formatDate(date) {
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
}

//====================== function change class for status ==============================================================

function changeStatus(data) {
    var newStatus = "";
    switch (data) {
        case 1: {
            newStatus = '<span class="status-task status-bgc-pending"><strong>Задача в очікуванні</strong></span>';
            break;
        }
        case 2: {
            newStatus = '<span class="status-task status-bgc-processing"><strong>Задача виконується</strong></span>';
            break;
        }
        case 3: {
            newStatus = '<span class="status-task status-bgc-done"><strong>Задачу виконано</strong></span>';
            break;
        }
        case 4: {
            newStatus = '<span class="status-task status-bgc-hold"><strong>Задачу зупинено</strong></span>';
            break;
        }
        case 5: {
            newStatus = '<span class="status-task status-bgc-canceled"><strong>Задачу анульовано</strong></span>';
            break;
        }
    }
    return newStatus;
}

function disableFields(data) {
    if (data === 5) {
        return ' disable-task';
    }
    return '';
}

function setDefaultTaskNameOnCreateTask() {
    $('.task-type-select').val('').change();
    $('#create_new_task .select2').removeClass("hidden");
    $('.task-type-input').addClass("hidden");
    $('#create_new_task .input-group').removeClass("hidden");
}

function setDefaultAssignedUserOnCreateTask() {
    $('.create-assign-task-button').removeClass('hidden');
    $('.create-assign-task-select').addClass("hidden");
}

function setOpenTaskNameOnUpdateTask () {
    $('#update-form-task-type-input').addClass("hidden");
    $('#update_new_task .select2').removeClass("hidden");
    $('#update_new_task .input-group').removeClass("hidden");
    $('.update-assign-task-button').addClass('hidden');
    $('.update-assign-task-select').removeClass("hidden");
}