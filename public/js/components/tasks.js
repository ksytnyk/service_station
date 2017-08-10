$(document).ready(function () {

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        console.log(  );

        $.ajax({
            url: '/admin/create-task',
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {
                let executorNameSurname = $('#createTaskForm').serializeArray()[3].value;

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
                    '</a></td><td class="tac"><a class="btn btn-danger" title="Удалить задачу" data-toggle="modal"' +
                    'data-target="#deleteTaskFormModal" style="outline: none;">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a></td></tr>');

                clearModalAddTask()

            },
            error: function (err) {
                $('#errorsCreateRequest').text('ERROR!');
                console.log(err.responseText);
            }
        });
    });

    $('#taskCancelAddButton').on('click', function () {
        clearModalAddTask();
    })

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