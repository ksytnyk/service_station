$(document).ready(function () {

    updateTaskType('.update-task-type');

    function updateTaskType(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-type-name').val($(this).data('type-name'));
            if ($(this).data('type-of-car')) {
                $("#typeOfCar #" + $(this).data('type-of-car')).attr('selected', true);
                $("#typeOfCar").change();
            }
            $("#typeOfCar").val($(this).data('type-of-car')).select2();

            if ($(this).data('car-markk') !== '') {
                $("#markk").empty().append("<option value='" + $(this).data('car-markk') + "'>" + $(this).data('car-markk-name') + "</option>");
            }
            if ($(this).data('car-model')) {
                $("#model").empty().append("<option value='" + $(this).data('car-model') + "'>" + $(this).data('car-model-name') + "</option>");
            }

            $('#update-form-planed-executor-id').val($(this).data('planed-executor-id')).change();
            $('#update-form-estimation-time').val($(this).data('estimation-time'));
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
            success: function (data) {
                showSuccessAlert('Редагування задачі пройшло успішно.');

                if (data.taskType.transportType === null) {
                    data.taskType.transportType = {
                        transportTypeName: ''
                    }
                }
                if (data.taskType.transportMarkk === null) {
                    data.taskType.transportMarkk = {
                        transportMarkkName: ''
                    }
                }
                if (data.taskType.transportModel === null) {
                    data.taskType.transportModel = {
                        transportModelName: ''
                    }
                }

                $('.in .close').click();

                var idr = "#idr-task-type-" + dataArr[0].value;
                var newTaskType,
                    newTaskType1 = '',
                    newTaskType2 = '</td>';

                newTaskType = '' +
                    '<th class="tac" scope="row">' + data.taskType.id + '</th>' +
                    '<td class="tac">' + data.taskType.typeName + '</td>' +
                    '<td class="tac">' + data.taskType.transportType.transportTypeName + '</td>' +
                    '<td class="tac">' + data.taskType.transportMarkk.transportMarkkName + '</td>' +
                    '<td class="tac">' + data.taskType.transportModel.transportModelName + '</td>' +
                    '<td class="tac">' + data.taskType.cost + '</td>' +
                    '<td class="tac">' + data.user.userSurname + ' ' + data.user.userName + '</td>' +
                    '<td class="tac">' + data.taskType.estimationTime + '</td>' +
                    '<td class="tac">' +
                        '<a href="#" class="update-task-type modal-window-link"' +
                        ' data-toggle="modal" data-target="#updateTaskTypeFormModal" title="Редагувати задачу"' +
                        ' data-id="' + data.taskType.id + '"' +
                        ' data-type-name="' + data.taskType.typeName + '"' +
                        ' data-type-of-car="' + data.taskType.transportType.id + '"' +
                        ' data-car-markk="' + data.taskType.transportMarkk.id + '"' +
                        ' data-car-model="' + data.taskType.transportModel.id + '"' +
                        ' data-cost="' + data.taskType.cost + '"' +
                        ' data-planed-executor-id="' + data.user.id + '"' +
                        ' data-estimation-time="' + data.taskType.estimationTime + '">' +
                            '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
                        '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newTaskType1 =  '<a href="#" class="delete-task-type modal-window-link" ' +
                        ' data-toggle="modal" data-target="#deleteTaskTypeFormModal" title="Видалити задачу"' +
                        ' data-id="' + dataArr[0].value + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/>' +
                        '</a>';
                }

                $(idr).empty().append(newTaskType + newTaskType1 + newTaskType2);

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
                showSuccessAlert('Видалення задачі пройшло успішно.');

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