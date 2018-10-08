$(document).ready(function () {

    updateTaskType('.update-task-type');
    /**
     * get details for task by type, mark and model car
     * @param typeCar - type Car id
     * @param mark - mark Car id
     * @param model - model Car id
     * @param elementId - id element for insert detail must be id html selector
     */
    var getDetailType = (typeCar, mark, model, elementId) => {
        if (typeCar && mark && model) {
            var body = {
                typeOfCar: typeCar,
                carMarkk: mark,
                carModel: model
            };
            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-types',
                type: 'post',
                data: body,
                success: (response) => {
                    if (elementId) {
                        updateDetailSelector(response.detailTypes, elementId);
                    } else {
                        console.warn("Detail selector element id is empty! ");
                    }
                }
            });
        } else {
            console.warn("Type Car, Mark or Model ids is empty !");
        }
    };

    /**
     * get array details by task id
     * and push to table in update task type
     * @param taskId
     */
    var getDetailByTypeTaskID = (taskId) => {
        if (taskId) {
            $.ajax({
                url: getRole(window.location.pathname) + '/details-of-task-type/' + taskId,
                type: 'get',
                success: (response) => {
                    pushDetailsToTable(response.details, '#update-detail-type-tbody');
                }
            });
        } else {
            console.warn("Task id is empty !");
        }
    };

    // bind button edit task and get details func
    var editTaskTypeButtonBind = (bindingClass) => {
        $(bindingClass).on('click', (event) => {
            getDetailByTypeTaskID(event.currentTarget.getAttribute('data-id'));
        });
    };
    editTaskTypeButtonBind('.update-task-type');


    //if user change model car get list details and insert to
    // detail selector in CREATE task type page
    $('#model1').on('change', () => {
        getDetailType($('#typeOfCar1').val(), $('#markk1').val(), $('#model1').val(), '#detail-type-select.create-task-detail-select')
    });
    //if user change model car get list details and insert to
    // detail selector in UPDATE task type page
    $('#model').on('change', () => {
        getDetailType($('#typeOfCar').val(), $('#markk').val(), $('#model').val(), '#update-detail-type-select')
    });

    /**
     * Update Selector detail inside create Type task popup
     * @param details array details
     * @param elementId - inset option to this element
     */
    var updateDetailSelector = (details, elementId) => {
        $(elementId).empty();
        var options = [];
        details.forEach(detail => {
            options.push(
                '<option id="detailTypeID' + detail.id + '" detailPrice="' + detail.detailPrice + '" value="' + detail.id + '" detailName="' + detail.detailName +
                ' / ' + detail.detailCode + '" detailPrice="' + detail.detailPrice + '" title="Усі категорії"> ' + detail.detailName + ' / ' + detail.detailCode + '</option>"'
            );
        });
        $(elementId).append(options);
    };

    /**
     * Send to server request create Task Type
     * inside array details
     */
    $('#create-task-type').on('click', (event) => {
        event.preventDefault();
        var formDataArray = $('#create-type-task-form').serializeArray();

        let body = {
            details: []
        };
        formDataArray.forEach(item => body[item.name] = item.value);

        body.details = JSON.stringify(detailArray);

        $.ajax({
            url: getRole(window.location.pathname) + '/create-task-type',
            type: 'post',
            data: body,
            success: response => {
                detailArray = [];
                deleteDetailArray = [];
                changeDetailArray = [];
                clearCreateTaskTypeForm();

                console.log('create-task-type-response', response);
                pushTaskTypeInTable(response.taskType[0], '#tasks-table');
                $('.in .close').click();
                showSuccessAlert('Додавання задачі пройшло успішно.');
            },
            error: err => {
                console.log('error', err);
                $('.in .close').click();
                showErrorAlert(err);
            }
        })
    });

    // bind cancel button with clear create task-type form function
    $( '.cancel-create-task-type').on('click', () => {
        clearCreateTaskTypeForm();
    });

    /**
     * Make clear field for create task type form
     */
    var clearCreateTaskTypeForm = () => {
        $('.form-control').val('');
        $('#detail-type-tbody').empty();
        $('#detail-type-select').empty();

        // $('#update-form-type-article').val();
        // $('#typeOfCar1').val();
        // $('#markk1').val();
        // $('#model1').val();
        // $('.task-planed-executor-id').val();
    };

    /**
     * Push row with task info after create task Type
     * @param task - object with task information
     * @param tableBodyID - html selector by id table body like '#my-custom-id'
     */
    var pushTaskTypeInTable = (task, tableBodyID) => {
        if (task && tableBodyID) {
            var taskModel = {
                id: task.id ? task.id : '',
                typeName: task.typeName ? task.typeName : '',
                articleCode: task.articleCode ? task.articleCode : '',
                transportTypeName: task.transportType ? (task.transportType.transportTypeName ? task.transportType.transportTypeName : '') : '',
                transportMarkkName: task.transportMarkk ? (task.transportMarkk.transportMarkkName ? task.transportMarkk.transportMarkkName : '') : '',
                transportModelName: task.transportModel ? (task.transportModel.transportModelName ? task.transportModel.transportModelName : '') : '',
                cost: task.cost ? task.cost : '',
                userSurname: task.planedExecutor ? (task.planedExecutor.userSurname ? task.planedExecutor.userSurname : '') : '',
                userName: task.planedExecutor ? (task.planedExecutor.userName ? task.planedExecutor.userName : '') : '',
                estimationTime: task.estimationTime ? task.estimationTime : ''
            };

            var deleteIcon = '';
            if (getRole(window.location.pathname) === "/admin") {
                deleteIcon = '<a href="#" class="delete-task-type modal-window-link"' +
                    ' data-toggle="modal" data-target="#deleteTaskTypeFormModal" data-id="' + taskModel.id + '"' +
                    ' title="Видалити задачу"><span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/></a>';
            }
            var row = '' +
                '<tr id="idr-task-type-' + taskModel.id + '">' +
                '<th class="tac" scope="row">' + taskModel.id + '</th>' +
                '<td class="tac">' + taskModel.typeName + '</td>' +
                '<td class="tac">' + taskModel.articleCode + '</td>' +
                '<td class="tac"> Details </td>' +

                '<td class="tac">' + taskModel.transportTypeName + '</td>' +
                '<td class="tac">' + taskModel.transportMarkkName + '</td>' +
                '<td class="tac">' + taskModel.transportModelName + '</td>' +
                '<td class="tac">' + taskModel.cost + '</td>' +
                '<td class="tac">' + taskModel.userSurname + ' ' + task.userName + '</td>' +
                '<td class="tac">' + taskModel.estimationTime + '</td>' +
                '<td class="tac">' +
                '<a href="#" class="update-task-type modal-window-link" data-toggle="modal" data-target="#updateTaskTypeFormModal"' +
                ' data-id="' + taskModel.id + '" data-type-name="' + taskModel.typeName + '" data-article-code="' + taskModel.articleCode + '" data-type-of-car="' + taskModel.typeOfCar + '"' +
                ' data-car-markk="' + taskModel.carMarkk + '" data-car-markk-name="' + taskModel.transportMarkkName + '" data-car-model="' + taskModel.carModel + '"' +
                ' data-car-model-name="' + taskModel.transportModelName + '" data-cost="' + taskModel.cost + '" data-planed-executor-id="' + taskModel.planedExecutorID + '"' +
                ' data-estimation-time="' + taskModel.estimationTime + '" title="Редагувати задачу">' +
                '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
                '</a>' +
                deleteIcon +
                '</td>' +
                '</tr>';

            $(tableBodyID).append(row);
        } else {
            console.warn('Task object or id table is empty ');
        }
        // after inert element to page need repeat bind listener
        deleteTaskType('.delete-task-type');
        updateTaskType('.update-task-type');
        //binding edit task button and function get list detail
        editTaskTypeButtonBind('.update-task-type');
    };

    /**
     * push details to details table in update task table
     * GLOBAL function
     * @param details - details array
     * @param tableBodyID - table body id like '#table-body-id'
     */
     pushDetailsToTable = (details, tableBodyID) => {
         console.log(details);
        $(tableBodyID).empty();
        var rows = [];
        details.forEach(detail => {
            var selector = '';
            if (getRole(window.location.pathname) === '/admin' || getRole(window.location.pathname) === '/moderator') {
                selector = '' +
                    '<select detail-id="' + detail.detail.id + '" class="change-detail-type-select" >' +
                    '<option value="1">Сервіс</option>' +
                    '<option value="2">Клієнт</option>' +
                    '<option value="3">Відсутня</option>' +
                    '</select>';
            }
            rows.push(
                '<tr detailId="' + detail.detail.id + '" detailName="' + detail.detail.detailName + ' / ' + detail.detail.detailCode + '" detailtype="' + detail.detailType + '" ' +
                'detailquantity="' + detail.detailQuantity + '" id="idr-' + detail.id + '" ><td>' +
                detail.detail.detailName + ' / ' + detail.detail.detailCode +
                '</td><td>' + detail.detail.detailPrice + '</td><td>' + selector + '</td><td>' + detail.detailQuantity + '</td><td>' +
                '<a class="delete-detail-from-modal" title="Видалити деталь" ' +
                ' detail-id="' + detail.id + '">' +
                '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a>' +
                '</td></tr>'
            );
            customDetailID--;
        });
        $(tableBodyID).append(rows);
        details.forEach(detail => {
            $('#idr-' + detail.id + ' .change-detail-type-select').val(detail.detailType);
        });

        // bind delete icon to listener
        deleteDetailFromModal('.delete-detail-from-modal');
        // bind selector type detail to listener
        changeDetailTypeSelect('.change-detail-type-select');
    };

    function updateTaskType(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-type-name').val($(this).data('type-name'));
            $('#update-form-type-article').val($(this).data('article-code'));

            // if ($(this).data('type-of-car')) {
            //     console.log(  111, "#typeOfCar #" + $(this).data('type-of-car') );
            //     $("#typeOfCar #" + $(this).data('type-of-car')).attr('selected', true);
            //     $("#typeOfCar").change();
            // }

            $("#typeOfCar").val($(this).data('type-of-car')).select2();
            $("#markk").empty().append("<option value='" + $(this).data('car-markk') + "'>" + $(this).data('car-markk-name') + "</option>");
            $("#model").empty().append("<option value='" + $(this).data('car-model') + "'>" + $(this).data('car-model-name') + "</option>");

            $('#update-form-planed-executor-id').val($(this).data('planed-executor-id')).change();
            $('#update-form-estimation-time').val($(this).data('estimation-time'));
            $('#update-form-cost').val($(this).data('cost'));

            //if user change model car get list details and insert to
            // detail selector in UPDATE task type page
            getDetailType($("#typeOfCar").val(), $("#markk").val(), $("#model").val(), '#update-detail-type-select');
        });
    }

    $('.task-type-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#task-type-update-form').serializeArray();

        var requestBody = {
            id: dataArr[0].value,
            typeName: dataArr[1].value,
            articleCode: dataArr[2].value,
            typeOfCar: dataArr[3].value,
            carMarkk: dataArr[4].value,
            carModel: dataArr[5].value,
            planedExecutorID: dataArr[6].value,
            estimationTime: dataArr[7].value,
            cost: dataArr[8].value,
            details: JSON.stringify(detailArray),
            deleteDetail: JSON.stringify(deleteDetailArray),
            changeDetail: JSON.stringify(changeDetailArray),
        };

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task-type/' + dataArr[0].value,
            type: 'put',
            data: requestBody,
            success: function (data) {
                showSuccessAlert('Редагування задачі пройшло успішно.');

                detailArray = [];
                deleteDetailArray = [];
                changeDetailArray = [];

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
                    '<td class="tac">' + data.taskType.articleCode + '</td>' +
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
                    ' data-article-code="' + data.taskType.articleCode + '"' +
                    ' data-type-of-car="' + data.taskType.transportType.id + '"' +
                    ' data-car-markk="' + data.taskType.transportMarkk.id + '"' +
                    ' data-car-model="' + data.taskType.transportModel.id + '"' +
                    ' data-car-markk-name="' + data.taskType.transportMarkk.transportMarkkName + '"' +
                    ' data-car-model-name="' + data.taskType.transportModel.transportModelName + '"' +
                    ' data-cost="' + data.taskType.cost + '"' +
                    ' data-planed-executor-id="' + data.user.id + '"' +
                    ' data-estimation-time="' + data.taskType.estimationTime + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
                    '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newTaskType1 = '<a href="#" class="delete-task-type modal-window-link" ' +
                        ' data-toggle="modal" data-target="#deleteTaskTypeFormModal" title="Видалити задачу"' +
                        ' data-id="' + dataArr[0].value + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/>' +
                        '</a>';
                }

                $(idr).empty().append(newTaskType + newTaskType1 + newTaskType2);

                updateTaskType(idr + ' .update-task-type');
                deleteTaskType(idr + ' .delete-task-type');

                // bind edit task button with get details list function
                editTaskTypeButtonBind('.update-task-type');
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