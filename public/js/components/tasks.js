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
                    '<td class="tac">' + data.result.id + '</td>' +
                    '<th class="tac"><a class="modal-window-link" title="Полная информация" data-toggle="modal"' +
                    'data-target="#infoTaskFormModal" style="cursor: pointer">' + data.result.taskDescription + '</a></th>' +
                    '<td class="tac">' + executorNameSurname + '</td>' +
                    '<td class="tac">' + data.result.cost + '</td>' +
                    '<td class="tac">' + data.result.estimationTime + '</td>' +
                    '<td class="tac">' + data.result.startTime + '</td>' +
                    '<td class="tac">' + data.result.endTime + '</td>' +
                    '<td class="tac">' +
                    '<a class="btn btn-default" title="Редактировать задачу" data-toggle="modal"' +
                    'data-target="#updateTaskFormModal" style="outline: none;">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/>' +
                    '</a></td><td class="tac"><a class="btn btn-danger" title="Удалить задачу" data-toggle="modal" data-id="data.result.id"' +
                    'data-target="#deleteTaskFormModal" style="outline: none;">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a></td></tr>');

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
    $('#create-form-task-comments').val('');
    $('#create-form-task-customer-parts').val('');
    $('#create-form-task-description').val('');
    $('#create-form-task-end-time').val('');
    $('#create-form-task-estimated-time').val('');
    $('#create-form-task-need-buy-parts').val('');
    $('#create-form-task-parts').val('');
    $('#create-form-task-start-time').val('');
    $('#create-form-task-cost').val('');
    $('#create-form-task-executor-id').val('');
}