$(document).ready(function () {

    $('#create_task').on('click', function () {
        $('#requestIDForTask').val($("#update_request").attr("request-id"));
    });

    $('#change-status-update-task').on('click', function () {
        $('#update-form-task-status').val(1);
    });

    $('#change-status-cancel-task').on('click', function () {
        $('#update-form-task-status').val(5);
    });

    $('.assign-task-button').on('click', function () {
        $('.assign-task-button').addClass('hidden');
        $('.assign-task-select').removeClass("hidden");
    });

    $('#taskAddButton').on('click', function () {

        $('.assign-task-select').addClass("hidden");
        $('.assign-task-button').removeClass("hidden");

        $('#createTaskFormModal').modal('toggle');

        $.ajax({
            url: getRole(window.location.pathname) + '/create-task',
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {

                var executorNameSurname = $('#option' + $('#createTaskForm').serializeArray()[2].value).attr('executorFullName');
                var assignedNameSurname = $('.optionAE' + $('#createTaskForm').serializeArray()[3].value).attr('assignedUserFullName');

                $("#tasks-table").append('' +
                    '<tr id="idx-task-' + data.result.id + '">' +
                    '<th class="tac" style="background-color: #fff;">' +
                    data.result.id +
                    '</th>' +
                    '<td class="vat" style="position: relative; padding-top: 40px;">' +
                    changeStatus(data.result.status) +
                    '<p><strong>Имя задачи: </strong>' + data.result.name + '</p>' +
                    '<p><strong>Исполнитель: </strong>' + executorNameSurname + '</p>' +
                    '<p><strong>Поручить задачу: </strong>' + assignedNameSurname + '</p>' +
                    '<p><strong>Стоимость: </strong>' + data.result.cost + ' грн</p>' +
                    '<p><strong>План. время: </strong>' + formatDate(data.result.estimationTime) + '</p>' +
                    '<p><strong>Время начала: </strong>' + formatDate(data.result.startTime) + '</p>' +
                    '<p><strong>Конечное время: </strong>' + formatDate(data.result.endTime) + '</p>' +
                    '</td>' +
                    '<td class="vat">' +
                    '<p><strong>Описание задачи: </strong>' + data.result.description + '</p>' +
                    '<p class="bt"><strong>Запчасти: </strong>' + data.result.parts + '</p>' +
                    '<p><strong>Запчасти клиента: </strong>' + data.result.customerParts + '</p>' +
                    '<p><strong>Недостающие запчасти: </strong>' + data.result.needBuyParts + '</p>' +
                    '<p class="bt"><strong>Комментарий: </strong>' + data.result.comment + '</p>' +
                    '</td>' +
                    '<td class="tac">' +
                    '<a class="update-task modal-window-link"' +
                    ' title="Редактировать задачу"' +
                    ' data-toggle="modal"' +
                    ' data-id="' + data.result.id + '"' +
                    ' data-task-description="' + data.result.description + '"' +
                    ' data-task-name="' + data.result.name + '"' +
                    ' data-task-assigned-user="' + data.result.assignedUserID + '"' +
                    ' data-task-planed-executor="' + data.result.planedExecutorID + '"' +
                    ' data-task-cost="' + data.result.cost + '"' +
                    ' data-task-estimation-time="' + formatDate(data.result.estimationTime) + '"' +
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
                    '<a href="#" class="delete-task modal-window-link" title="Удалить задачу" data-toggle="modal" data-current="' + getIdRole(window.location.pathname) + '" data-id="' + data.result.id + '"' +
                    ' data-target="#deleteTaskFormModal">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/>' +
                    '</a>' +
                    '</td>' +
                    '</tr>');

                deleteTaskOnClick();
                clearModalAddTask();
                updateTaskOnClick();

            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, TIME_FOR_FLASH);
            }
        });
    });

    $('#taskCancelAddButton').on('click', function () {
        clearModalAddTask();
    });

    $('.task-update-button').on('click', function () {

        $('.assign-task-select').addClass("hidden");
        $('.assign-task-button').removeClass("hidden");
        $('#updateTaskFormModal').modal('toggle');

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task/' + $('#update-form-task-id').val(),
            type: 'PUT',
            data: $('#update-form-task').serializeArray(),
            success: function (data) {

                var idx = "#idx-task-" + data.task.id;

                $(idx).empty();

                if (getRole(window.location.pathname) !== "/executor" && getRole(window.location.pathname) !== "/store-keeper") {
                    var executorNameSurname = $('#option' + $('#update-form-task').serializeArray()[2].value).attr('executorFullName');
                    var assignedNameSurname = $('.optionAE' + $('#update-form-task').serializeArray()[3].value).attr('assignedUserFullName');
                }


                var newTask, newTask1 = '', newTask2;

                newTask = '' +
                    '<th class="tac bb" style="background-color:#fff;">' +
                    data.task.id +
                    '</th>' +
                    '<td class="vat bb' + disableFields(data.task.status) + '" style="position: relative; padding-top: 40px;">' +
                    changeStatus(data.task.status) +
                    '<p><strong>Имя задачи: </strong>' + data.task.name + '</p>' +
                    '<p class="executor_name_surname"><strong>Исполнитель: </strong>' + executorNameSurname + '</p> ' +
                    '<p class="assigned_name_surname"><strong>Поручить задачу: </strong>' + assignedNameSurname + '</p>' +
                    '<p><strong>Стоимость: </strong>' + data.task.cost + ' грн</p>' +
                    '<p><strong>План. время: </strong>' + formatDate(data.task.estimationTime) + '</p>' +
                    '<p><strong>Время начала: </strong>' + formatDate(data.task.startTime) + '</p> ' +
                    '<p><strong>Конечное время: </strong>' + formatDate(data.task.endTime) + '</p> ' +
                    '</td>' +
                    '<td class="vat bb' + disableFields(data.task.status) + '"> ' +
                    '<p><strong>Описание задачи: </strong>' + data.task.description + '</p> ' +
                    '<p class="bt"><strong>Запчасти: </strong>' + data.task.parts + '</p> ' +
                    '<p><strong>Запчасти клиента: </strong>' + data.task.customerParts + '</p> ' +
                    '<p><strong>Недостающие запчасти: </strong>' + data.task.needBuyParts + '</p> ' +
                    '<p class="bt"><strong>Комментарий: </strong>' + data.task.comment + '</p> ' +
                    '</td>';

                if (getRole(window.location.pathname) === "/executor") {
                    newTask1 = '' +
                        '<td class="tac">' +
                        '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                        '<input type="hidden" value="2" name="status">' +
                        '<button class="status btn btn-primary" type="submit">Начать</button>' +
                        '</form>' +
                        '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                        '<input type="hidden" value="4" name="status">' +
                        '<button class="status btn btn-danger" type="submit">Остановить</button>' +
                        '</form>' +
                        '<form action="/executor/set-status/' + data.task.id + '" method="POST">' +
                        '<input type="hidden" value="5" name="status">' +
                        '<button class="status btn btn-success" type="submit">Завершить</button>' +
                        '</form>' +
                        '</td>';
                }
                if (getRole(window.location.pathname) === '/store-keeper') {

                    newTask1 = '' +
                        '<td class="tac">' +
                        '<form action="/store-keeper/task-hold" method="POST">' +
                        '<input class="btn btn-danger status" type="submit" id="taskHold" value="Остановить"/>' +
                        '<input type="hidden" value="' + data.task.id + '" name="taskID"/>' +
                        '</form>' +
                        '<form action="/store-keeper/task-confirm" method="POST">' +
                        '<input class="btn btn-warning status-storekeeper" type="submit" id="taskPending" value="Подтвердить"/>' +
                        '<input type="hidden" value="' + data.task.id + '" name="taskID"/>' +
                        '</form>' +
                        '</td>'
                }
                newTask2 = '' +
                    '<td class="tac bb"> ' +
                    '<a class="update-task modal-window-link"' +
                    ' title="Редактировать задачу"' +
                    ' data-toggle="modal"' +
                    ' data-id="' + data.task.id + '"' +
                    ' data-task-description="' + data.task.description + '"' +
                    ' data-task-name="' + data.task.name + '"' +
                    ' data-task-assigned-user="' + data.task.assignedUserID + '"' +
                    ' data-task-planed-executor="' + data.task.planedExecutorID + '"' +
                    ' data-task-cost="' + data.task.cost + '"' +
                    ' data-task-estimation-time="' + formatDate(data.task.estimationTime) + '"' +
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
                    ' title="Удалить задачу" data-toggle="modal"' +
                    ' data-current="' + getIdRole(window.location.pathname) + '" data-id="' + data.task.id + '"' +
                    ' data-target="#deleteTaskFormModal"' +
                    ' style=""> ' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/> ' +
                    '</a>' +
                    '</td>';


                $(idx).append(newTask + newTask1 + newTask2);

                deleteTaskOnClick();
                clearModalAddTask();
                updateTaskOnClick();
            },
            error: function (err) {
                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, TIME_FOR_FLASH);
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
        $('#update-form-task-id').val($(this).data('id'));
        $('#update-form-task-name').val($(this).data('task-name'));
        $('#update-form-task-assigned-user').val($(this).data('task-assigned-user'));
        $('#update-form-task-description').val($(this).data('task-description'));
        $('#update-form-task-planed-executor').val($(this).data('task-planed-executor'));
        $('#update-form-task-cost').val($(this).data('task-cost'));
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
        $('#delete-task-id').html($(this).data('id'));

    });

    $('#delete-button').on('click', function () {

        var taskID = $(this).attr('task-id');

        var data = {
            requestID: $(this).attr('request-id')
        };

        $('#deleteTaskFormModal').modal('hide');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task/' + taskID,
            type: 'DELETE',
            data: data,
            success: function (data) {
                var idx = "#idx-task-" + data.id;
                $(idx).remove();

                if (data.requestID) {
                    var idr = "#idr-request-" + data.requestID;
                    $(idr).remove();
                    window.location.replace(window.location.pathname);
                }
            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, TIME_FOR_FLASH);
            }
        });
    });
}

function getIdRole(pathname) {
    if (pathname.includes('admin')) {
        return 1;
    } else {
        return 2;
    }
}

function getRole(pathname) {
    if (pathname.includes('admin')) {
        return '/admin';
    }
    else if (pathname.includes('moderator')) {
        return '/moderator';
    }
    else if (pathname.includes('store-keeper')) {
        return '/store-keeper';
    }
    else {
        return '/executor';
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
            newStatus = '<span class="status-task status-bgc-pending"><strong>Задача в ожидании</strong></span>';
            break;
        }
        case 2: {
            newStatus = '<span class="status-task status-bgc-processing"><strong>Задача выполняется</strong></span>';
            break;
        }
        case 3: {
            newStatus = '<span class="status-task status-bgc-done"><strong>Задача завершена</strong></span>';
            break;
        }
        case 4: {
            newStatus = '<span class="status-task status-bgc-hold"><strong>Задача остановлена</strong></span>';
            break;
        }
        case 5: {
            newStatus = '<span class="status-task status-bgc-canceled"><strong>Задача анулирована</strong></span>';
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