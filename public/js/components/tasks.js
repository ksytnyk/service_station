$(document).ready(function () {

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        $.ajax({
            url: '/admin/create-task',
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {

                let executorNameSurname = $('#option'+$('#createTaskForm').serializeArray()[2].value).attr('executorFullName');

                $("#tasks-table").append('<tr>' +
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
                        '<a class="btn btn-danger" title="Удалить задачу" data-toggle="modal" data-id="data.result.id"' +
                        'data-target="#deleteTaskFormModal" style="outline: none; margin-top: 20px;">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a>' +
                    '</td></tr>');

                clearModalAddTask()

            },
            error: function (err) {

                $('.errorsCreateRequestBlock').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errorsCreateRequest').html(errorsTemplate);

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

});

function clearModalAddTask() {
    $('.create-form-task').val('');
}