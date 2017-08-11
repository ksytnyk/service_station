$(document).ready(function () {

    let count = 1;

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        $.ajax({
            url: '/admin/create-task', // TODO норм
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {

                let executorNameSurname = $('#option' + $('#createTaskForm').serializeArray()[2].value).attr('executorFullName');
                let current;
                if (window.location.pathname.includes('admin')) {
                    current = 1;
                } else {
                    current = 2;
                }

                $("#tasks-table").append('<tr>' +
                    '<td class="tac">' +
                    count +
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

                $('.delete-task').on('click', function () {
                    console.log('lal', $(this).data('id'));

                    if ($(this).data('current') === 1) {
                        $('#delete-task-form-id').attr('action', ('/admin/delete-task/' + $(this).data('id')));
                    } else {
                        $('#delete-task-form-id').attr('action', ('/moderator/delete-task/' + $(this).data('id')));
                    }
                    $('#delete-task-id').text($(this).data('id'));
                });

                count++;
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
        $('#update-form-task-description').val($(this).data('task-description'));
        $('#update-form-task-planed-executor').val($(this).data('task-planed-executor'));
        $('#update-form-task-cost').val($(this).data('task-cost'));
        $('#update-form-task-estimation-time').val($(this).data('task-estimation-time'));
        $('#update-form-task-start-time').val($(this).data('task-start-time'));
        $('#update-form-task-end-time').val($(this).data('task-end-time'));
        $('#update-form-task-parts').val($(this).data('task-parts'));
        $('#update-form-task-customer-parts').val($(this).data('task-customer-parts'));
        $('#update-form-task-need-buy-parts').val($(this).data('task-need-buy-parts'));
        $('#update-form-task-task-comments').val($(this).data('task-comments'));
    });

    $('#taskUpdateButton').on('click', function () {

        $('#updateTaskFormModal').modal('toggle');

        $.ajax({
            url: '/admin/update-task',
            type: 'PUT',
            data: $('#update-form-task').serializeArray(),
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
                $('.errors-info').css("display", "block");

                let errorsTemplate = err.responseJSON.errors.map(error => {
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
        if ($(this).data('current') === 1) {
            $('#delete-task-form-id').attr('action', ('/admin/delete-task/' + $(this).data('id')));
        } else {
            $('#delete-task-form-id').attr('action', ('/moderator/delete-task/' + $(this).data('id')));
        }
        $('#delete-task-id').text($(this).data('id'));
    });
}