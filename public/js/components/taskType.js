$(document).ready(function () {

    updateTaskType('.update-task-type');

    function updateTaskType(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-type-name').val($(this).data('type-name'));
            $("#markk").append("<option value='" + $(this).data('car-markk') + "'>" + $(this).data('car-markk') + "</option>");
            $("#model").append("<option value='" + $(this).data('car-model') + "'>" + $(this).data('car-model') + "</option>");
            $('#update-form-cost').val($(this).data('cost'));
        });
    }

    $('.task-type-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#task-type-update-form').serializeArray();

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task-type/' + dataArr[0].value,
            type: 'put',
            data: dataArr,
            success: function () {
                $('.in .close').click();

                var idr = "#idr-task-type-" + dataArr[0].value;
                var newTaskType = '' +
                    '<th class="tac" scope="row">' + dataArr[0].value + '</th>' +
                    '<td class="tac pr">' + dataArr[1].value + '</td>' +
                    '<td class="tac pr">' + dataArr[3].value + '</td>' +
                    '<td class="tac pr">' + dataArr[4].value + '</td>' +
                    '<td class="tac pr">' + dataArr[5].value + '</td>' +
                    '<td class="tac">' +
                        '<a href="#" class="update-task-type modal-window-link"' +
                        ' data-toggle="modal" data-target="#updateTaskTypeFormModal" title="Редагувати задачу"' +
                        ' data-id="' + dataArr[0].value + '"' +
                        ' data-type-name="' + dataArr[1].value + '"' +
                        ' data-car-markk="' + dataArr[3].value + '"' +
                        ' data-car-model="' + dataArr[4].value + '"' +
                        ' data-cost="' + dataArr[5].value + '">' +
                            '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
                        '</a>' +
                        '<a href="#" class="delete-task-type modal-window-link" ' +
                        ' data-toggle="modal" data-target="#deleteTaskTypeFormModal" title="Видалити задачу"' +
                        ' data-id="' + dataArr[0].value + '">' +
                            '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/>' +
                        '</a>' +
                    '</td>';

                $(idr).empty().append(newTaskType);

                updateTaskType(idr + ' .update-task-type');
                deleteTaskType(idr + ' .delete-task-type');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteTaskType('.delete-task-type');

    function deleteTaskType(value) {
        $(value).on('click', function () {
            $('#delete-task-type-button').attr('task-type-id', ($(this).data('id')));
            $('#delete-task-type-id').html($(this).data('id'));
        });
    }

    $('#delete-task-type-button').on('click', function () {

        var taskTypeID = $(this).attr('task-type-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task-type/' + taskTypeID,
            type: 'delete',
            success: function () {
                $('.in .close').click();
                var idr = "#idr-task-type-" + taskTypeID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });
});