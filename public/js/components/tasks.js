$(document).ready(function () {

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        $.ajax({
            url: getRole(window.location.pathname) + '/create-task',
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {

                var executorNameSurname = $('#option' + $('#createTaskForm').serializeArray()[2].value).attr('executorFullName');
                var current;
                if (window.location.pathname.includes('admin')) {
                    current = 1;
                } else {
                    current = 2;
                }

                $("#tasks-table").append('<tr id="idx-task-' + data.result.id + '">' +
                    '<td class="tac">' +
                    data.result.id +
                    '</td>' +
                    '<td class="vat">' +
                    '<p><strong>Имя задачи: </strong>' + data.result.name + '</p>' +
                    '<p><strong>Исполнитель: </strong>' + executorNameSurname + '</p>' +
                    '<p><strong>Поручить задачу: </strong>' + data.result.assignedUserID + '</p>' +
                    '<p><strong>Планируемое время: </strong>' + data.result.estimationTime + '</p>' +
                    '<p><strong>Цена: </strong>' + data.result.cost + '</p>' +
                    '<p><strong>Время начала: </strong>' + data.result.startTime + '</p>' +
                    '<p><strong>Конечное время: </strong>' + data.result.endTime + '</p>' +
                    '<p><strong>Описание задачи: </strong>' + data.result.description + '</p>' +
                    '</td>' +
                    '<td class="vat">' +
                    '<p><strong>Запчасти: </strong>' + data.result.parts + '</p>' +
                    '<p><strong>Запчасти клиента: </strong>' + data.result.customerParts + '</p>' +
                    '<p><strong>Недостающие запчасти: </strong>' + data.result.needBuyParts + '</p>' +
                    '</td>' +
                    '<td class="vat">' + data.result.comment + '</td>' +
                    '<td class="tac">' +
                    '<a class="btn btn-default" title="Редактировать задачу" data-toggle="modal"' +
                    'data-target="#updateTaskFormModal" style="outline: none;">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/></a>' +

                    '<a href="#" class="btn delete-task btn-danger modal-window-link" title="Удалить задачу" data-toggle="modal" data-current="' + current + '" data-id="' + data.result.id + '"' +
                    'data-target="#deleteTaskFormModal" style="outline: none; margin-top: 20px;">' +

                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a>' +
                    '</td></tr>');

                deleteTaskOnClick();
                clearModalAddTask();

            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, 5000);
            }
        });
    });

    $('#taskCancelAddButton').on('click', function () {
        clearModalAddTask();
    });

    $('.info-task').on('click', function () {
        $('#info-id').text($(this).data('id'));
        $('#info-description').text($(this).data('description'));
        $('#info-executor-surname').text($(this).data('executor-surname'));
        $('#info-executor-name').text($(this).data('executor-name'));
        $('#info-cost').text($(this).data('cost'));
        $('#info-estimation-time').text($(this).data('estimation-time'));
        $('#info-start').text($(this).data('start'));
        $('#info-end').text($(this).data('end'));
        $('#info-parts').text($(this).data('parts'));
        $('#info-customer-parts').text($(this).data('customer-parts'));
        $('#info-need-buy-parts').text($(this).data('need-buy-parts'));
        $('#info-comments').text($(this).data('comments'));
    });

    $('.update-task').on('click', function () {
        $('#update-form-task-id').val($(this).data('id'));
        $('#update-form-task-name').val($(this).data('task-name'));
        $('#update-form-task-assigned-user').val($(this).data('task-assigned-user'));
        $('#update-form-task-description').val($(this).data('task-description'));
        $('#update-form-task-planed-executor').val($(this).data('task-planed-executor'));
        $('#update-form-task-cost').val($(this).data('task-cost'));

        $('#update-form-task-estimation-time').val(convertFormatDate($(this).data('task-estimation-time')));
        $('#update-form-task-start-time').val(convertFormatDate($(this).data('task-start-time')));
        $('#update-form-task-end-time').val(convertFormatDate($(this).data('task-end-time')));

        $('#update-form-task-parts').val($(this).data('task-parts'));
        $('#update-form-task-customer-parts').val($(this).data('task-customer-parts'));
        $('#update-form-task-need-buy-parts').val($(this).data('task-need-buy-parts'));
        $('#update-form-task-comment').val($(this).data('task-comment'));
    });

    $('#taskUpdateButton').on('click', function () {

        $('#updateTaskFormModal').modal('toggle');

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task',
            type: 'PUT',
            data: $('#update-form-task').serializeArray(),
            success: function (data) {

                var idx = "#idx-task-" + data.task.id;

                var newTask = '<td class="vat">' +
                    '<p><strong>Имя задачи: </strong>' + data.task.name + '</p>' +
                    '<p><strong>Исполнитель: </strong>userSurname' + 'userName</p> ' +
                    '<p><strong>Поручить задачу: </strong>' + data.task.assignedUserID + '</p>' +
                    '<p><strong>Стоимость: </strong>' + data.task.cost + 'грн</p>' +
                    '<p><strong>Планируемое время: </strong>' + formatDate(data.task.estimationTime) + '</p>' +
                    '<p><strong>Время начала: </strong>' + formatDate(data.task.startTime) + '</p> ' +
                    '<p><strong>Конечное время: </strong>' + formatDate(data.task.endTime) + '</p> ' +
                    '</td> ' +
                    '<td class="vat"> ' +
                    '<p><strong>Описание задачи: </strong>' + data.task.description + '</p> ' +
                    '<p class="bt"><strong>Запчасти: </strong>' + data.task.parts + '</p> ' +
                    '<p><strong>Запчасти клиента: </strong>' + data.task.customerParts + '</p> ' +
                    '<p><strong>Недостающие запчасти: </strong>' + data.task.needBuyParts + '</p> ' +
                    '<p class="bt"><strong>Комментарий: </strong>' + data.task.comment + '</p> ' +
                    '</td> ' +
                    '<td class="tac" style="background-color: #eee;"> ' +
                    '<a class="update-task modal-window-link"' +
                    'title="Редактировать задачу"' +
                    'data-toggle="modal"' +
                    'data-id="' + data.task.id + '"' +
                    'data-task-description="' + data.task.description + '"' +
                    'data-task-name="' + data.task.name + '"' +
                    'data-task-assigned-user="' + data.task.assignedUserID + '"' +
                    'data-task-executor-surname="' + "executor.Surname" + '"' +
                    'data-task-executor-name="' + "executor.userName" + '"' +
                    'data-task-cost=' + data.task.cost + '"' +
                    'data-task-estimation-time="' + data.task.estimationTime + '"' +
                    'data-task-start-time="' + data.task.startTime + '"' +
                    'data-task-end-time="' + data.task.endTime + '"' +
                    'data-task-parts="' + data.task.parts + '"' +
                    'data-task-customer-parts="' + data.task.customerParts + '"' +
                    'data-task-need-buy-parts="' + data.task.needBuyParts + '"' +
                    'data-task-comment="' + data.task.comment + '"' +
                    'data-target="#updateTaskFormModal"' +
                    'style="cursor: pointer"> ' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/> ' +
                    '</a> ' +
                    '<a href="#"' +
                    'class="delete-task modal-window-link"' +
                    'title="Удалить задачу" data-toggle="modal"' +
                    'data-current="{typeUser}" data-id="{id}"' +
                    'data-target="#deleteTaskFormModal"' +
                    'style="margin-top: 20px;"> ' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/> ' + '</a>';

                $(idx).html(newTask);
            },
            error: function (err) {
                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, 5000);
            }
        });
    });

    deleteTaskOnClick();

});

function clearModalAddTask() {
    $('.create-form-task').val('');
}

function deleteTaskOnClick() {

    $('.delete-task').on('click', function () {
        $('#delete-button').attr('test', ($(this).data('id')));
        $('#delete-task-id').html($(this).data('id'));
    });

    $('#delete-button').on('click', function () {

        var taskID = $(this).attr('test');

        $('#deleteTaskFormModal').modal('hide');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task/' + taskID,
            type: 'DELETE',
            data: $(this).data('id'),
            success: function (data) {
                var idx = "#idx-task-" + data.id;
                $(idx).remove();
            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, 5000);
            }
        });

    });
}

function getRole(pathname) {
    if (pathname.includes('admin')) {
        return '/admin';
    } else {
        return '/moderator';
    }
}

function convertFormatDate(date) {
    var arrayDate = date.split('.');
    return new Date(arrayDate[2], arrayDate[1], arrayDate[0]);
}

function formatDate(date) {
    var newDate = new Date(date);

    let day = newDate.getDate(), year = newDate.getFullYear(), month;

    if ((newDate.getMonth() + 1) < 10) {
        month = '0' + (newDate.getMonth() + 1);
    } else {
        month = newDate.getMonth() + 1;
    }

    return day + '.' + month + '.' + year;
}