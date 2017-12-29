$(document).ready(function () {

    $('#create_task').on('click', function () {

        customDetailID = 999999;

        $('#requestIDForTask').val($("#update_request").attr("request-id"));
        clearModalAddTask();
        setStartTime();
        if (window.location.pathname.includes('create-request')) {

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-types',
                type: 'post',
                data: {
                    typeOfCar: $('#typeOfCar').val(),
                    carMarkk: $('#markk').val(),
                    carModel: $('#model').val()
                },
                success: function (data) {

                    $('#task-type-select').find('option').remove();
                    $.each(data.taskTypes, function (i, item) {
                        var title = setTaskTypesTitle(item);

                        $('#task-type-select').append($('<option>', {
                            value: item.id,
                            text: item.typeName + ' (' + title + ')',
                            taskTypeID: item.typeName,
                            id: 'taskTypeID' + item.id,
                            title: title
                        }));
                    });

                    $('#detail-type-select').find('option').remove();
                    $.each(data.detailTypes, function (i, item) {
                        var title = setDetailTypesTitle(item);

                        $('#detail-type-select').append($('<option>', {
                            value: item.id,
                            text: item.detailName + ' (' + title + ')',
                            id: 'detailTypeID' + item.id,
                            detailName: item.detailName,
                            title: title
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

    // $('#change-status-cancel-task').on('click', function () {
    //     $('#update-form-task-status').val(5);
    // });

    $('#change-status-done-task').on('click', function () {
        $('#update-form-task-status').val(3);
    });

    $('.create-assign-task-button').on('click', function () {
        $('.create-assign-task-button').addClass('hidden');
        $('.create-assign-task-select').removeClass("hidden");
    });

    $('#taskAddButton').on('click', function () {
        var dataArr = $('#createTaskForm').serializeArray();
        if (dataArr[1].value === '' && $('.task-type-select').serializeArray()[0]) {
            var taskTypeID = $('#taskTypeID' + $('.task-type-select').serializeArray()[0].value).attr('taskTypeID');
            dataArr[2].value = taskTypeID;
            dataArr[1].value = dataArr[2].value;
            if (dataArr[6].value !== '') {
                dataArr[6].value = setTimeToDate(dataArr[6].value);
            }
            dataArr.push({
                name: 'typeID',
                value: $('#task-type-select').serializeArray()[0].value
            });
        } else {
            dataArr[5].value = setTimeToDate(dataArr[5].value);
        }

        dataArr.push({
            name: 'detail',
            value: JSON.stringify(detailArray)
        });

        $.ajax({
            url: getRole(window.location.pathname) + '/create-task',
            type: 'post',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Додавання задачі пройшло успішно.');

                detailArray = [];

                var defaultDetails = '',
                    clientDetails = '',
                    missingDetails = '';

                detailsCost = 0;

                data.taskDetail.forEach(item => {

                    detailsCost += (item.detail.detailPrice * item.detailQuantity);

                    if (item.detailType === 1) {
                        defaultDetails += ',&#8195;' + item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                    else if (item.detailType === 2) {
                        clientDetails += ',&#8195;' + item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                    else {
                        missingDetails += ',&#8195;' +  item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                });

                $('.check-table tr:last').before('<tr id="idt-' + data.result.id + '">'+
                    '<td>'+data.result.name+'</td>'+
                    '<td class="tac">'+data.result.cost+'</td>'+
                    '<td>' + convertDetailsString(defaultDetails + clientDetails + missingDetails) + '</td>'+
                    '<td class="tac">' + detailsCost + '</td>'+
                    '</tr>');

                summaryDetailsCost += detailsCost;

                $('.in .close').click();

                setDefaultAssignedUserOnCreateTask();
                setDefaultTaskNameOnCreateTask();

                var executorNameSurname = $('#option' + data.result.planedExecutorID).attr('executorFullName');
                var assignedNameSurname = $('#optionAE' + data.result.assignedUserID).attr('assignedUserFullName');

                var editDeleteButtons = '' +
                    '<tr id="idx-task-' + data.result.id + '">' +
                    '<td class="tac"><strong>' +
                    data.result.id +
                    '</strong></td>' +
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
                    '<p class="bt"><strong>Запчастини сервісу: </strong>' + convertDetailsString(defaultDetails) + '</p>' +
                    '<p><strong>Запчастини клієнта: </strong>' + convertDetailsString(clientDetails) + '</p>' +
                    '<p><strong>Відсутні запчастини: </strong>' + convertDetailsString(missingDetails) + '</p>' +
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
                    ' data-task-type-id="' + data.result.typeID + '"' +
                    ' data-task-assigned-user="' + data.result.assignedUserID + '"' +
                    ' data-task-planed-executor="' + data.result.planedExecutorID + '"' +
                    ' data-task-cost="' + data.result.cost + '"' +
                    ' data-task-estimation-time="' + data.result.estimationTime + '"' +
                    ' data-task-start-time="' + formatDate(data.result.startTime) + '"' +
                    ' data-task-end-time="' + formatDate(data.result.endTime) + '"' +
                    ' data-task-parts="' + convertDetailsString(defaultDetails) + '"' +
                    ' data-task-customer-parts="' + convertDetailsString(clientDetails) + '"' +
                    ' data-task-need-buy-parts="' + convertDetailsString(missingDetails) + '"' +
                    ' data-task-comment="' + data.result.comment + '"' +
                    ' data-target="#updateTaskFormModal"' +
                    ' style=""> ' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"/> ' +
                    '</a> ';

                if(getRole(window.location.pathname)==='/admin') {
                    editDeleteButtons += ''+
                        '<a href="#" class="delete-task modal-window-link" title="Видалити задачу" data-toggle="modal" data-current="' + getIdRole(window.location.pathname) + '" data-id="' + data.result.id + '"' +
                        ' data-target="#deleteTaskFormModal"' +
                        ' data-request-id="' + data.result.requestID + '"' +
                        ' data-task-old-cost="' + data.result.cost + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true"/>' +
                        '</a>' +
                        '</td>' +
                        '</tr>';
                } else {
                    editDeleteButtons += ''+
                        '</td>' +
                        '</tr>';
                }

                $("#tasks-table").append(editDeleteButtons);

                headerFix();
                deleteTaskOnClick('#idx-task-' + data.result.id + ' .delete-task');
                clearModalAddTask();
                $('#createTaskForm .startTime').val(formatDate(new Date()).slice(0, 10));
                updateTaskOnClick('#idx-task-' + data.result.id + ' .update-task');

            },
            error: function (err) {
                $('.in .close').click();
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

    $('.task-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#update-form-task').serializeArray();
        var oldStartTime = $('#change-status-update-task').attr('old-start-time');

        if ( getRole(window.location.pathname) === '/executor') {
            dataArr[6].value = checkDateForUpdate(oldStartTime, dataArr[6].value);

            if (dataArr[3].value !== dataArr[4].value) {
                var planedExecutorChanged = true;

                dataArr[3].value = dataArr[4].value; // set to 'planedExecutorID' value equivalent 'assignedUserID'
            }
        }

        if (getRole(window.location.pathname) !== '/executor' && getRole(window.location.pathname) !== '/store-keeper') {
            if (dataArr[3].value === '') {
                var taskTypeID = $('#updateTaskTypeID' + $('.update-form-task-type-select').serializeArray()[0].value).attr('updateTaskTypeID');
                dataArr[4].value = taskTypeID;
                dataArr[3].value = dataArr[4].value;
                dataArr.push({
                    name: 'typeID',
                    value: $('#update-form-task-type-select').serializeArray()[0].value
                });
            }
            dataArr[8].value = checkDateForUpdate(oldStartTime, dataArr[8].value);
        }

        if (getRole(window.location.pathname) !== '/store-keeper') {
            dataArr.push(
                {
                    name: 'detail',
                    value: JSON.stringify(detailArray)
                },
                {
                    name: 'deleteDetail',
                    value: JSON.stringify(deleteDetailArray)
                },
                {
                    name: 'changeDetail',
                    value: JSON.stringify(changeDetailArray)
                }
            );
        }

        $.ajax({
            url: getRole(window.location.pathname) + '/update-task/' + $('#update-form-task-id').val(),
            type: 'put',
            data: dataArr,
            success: function (data) {

                showSuccessAlert('Редагування задачі пройшло успішно.');
                $('.in .close').click();

                detailArray = [];
                deleteDetailArray = [];
                changeDetailArray = [];

                var defaultDetails = '',
                    clientDetails = '',
                    missingDetails = '';

                data.details.forEach(item => {
                    if (item.detailType === 1) {
                        defaultDetails += ',&#8195;' + item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                    else if (item.detailType === 2) {
                        clientDetails += ',&#8195;' + item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                    else {
                        missingDetails += ',&#8195;' +  item.detail.detailName + ' - ' + item.detailQuantity;
                    }
                });

                var idx = "#idx-task-" + data.task.id;

                if (getRole(window.location.pathname) === '/executor' && planedExecutorChanged) {
                    $(idx).remove();
                }
                else {
                    $('#idt-' + data.task.id + '').empty();
                    $('#idt-' + data.task.id + '').append('' +
                        '<td>' + data.task.name + '</td>' +
                        '<td class="tac">' + data.task.cost + '</td>' +
                        '<td>' + data.task.needBuyParts + '</td>' +
                        '<td class="tac"></td>');

                    $('.update-form-task-type-input').addClass("hidden");
                    $('#update_new_task .select2').removeClass("hidden");

                    var idr = "#idr-cost-" + data.requestID;
                    var idrr = "#idr-request-" + data.requestID;

                    $(idx).empty();
                    $(idr).empty();

                    if (getRole(window.location.pathname) !== "/executor" && getRole(window.location.pathname) !== "/store-keeper") {
                        var executorNameSurname = $('#option' + dataArr[5].value).attr('executorFullName');
                        var assignedNameSurname = $('#optionAE' + dataArr[6].value).attr('assignedUserFullName');
                    }

                    var newTask, newTask1 = '', newTask2, newCost;

                    newTask = '' +
                        '<td class="tac bb"><strong>' +
                        data.task.id +
                        '</strong></td>' +
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
                        '<p class="bt"><strong>Запчастини сервісу: </strong>' + convertDetailsString(defaultDetails) + '</p> ' +
                        '<p><strong>Запчастини клієнта: </strong>' + convertDetailsString(clientDetails) + '</p> ' +
                        '<p  id="need-buy-parts"><strong>Відсутні запчастини: </strong>' + convertDetailsString(missingDetails) + '</p> ' +
                        '<p class="bt" id="comment"><strong>Коментар: </strong>' + data.task.comment + '</p> ' +
                        '</td>';

                    if (getRole(window.location.pathname) === "/executor") {
                        if (data.task.status === 1) {
                            newTask1 = '' +
                                '<td class="tac">' +
                                '<div class="tasks-status-form">' +
                                '<input class="status btn btn-primary task-form-status task-status-button"' +
                                ' id="taskProcessing"' +
                                ' type="button"' +
                                ' value="Почати задачу"' +
                                ' data-task-id="' + data.task.id + '"' +
                                ' data-status="2"' +
                                '/>' +
                                '</div>' +
                                '</td>'
                        } else {
                            newTask1 = '' +
                                '<td class="tac">' +
                                '<div class="tasks-status-form">' +
                                '<input class="status btn btn-danger set-task-status-hold modal-window-link"' +
                                ' data-toggle="modal"' +
                                ' id="taskHold"' +
                                ' type="button"' +
                                ' value="Відсутні запчастини"' +
                                ' data-task-id="' + data.task.id + '"' +
                                ' data-task-comment="' + data.task.comment + '"' +
                                ' data-target="#setTaskStatusHoldModal"' +
                                '/>' +
                                '<input class="status btn btn-success task-form-status task-status-button"' +
                                ' id="taskDone"' +
                                ' type="button"' +
                                ' value="Завершити задачу"' +
                                ' data-task-id="' + data.task.id + '"' +
                                ' data-status="3"' +
                                '/>' +
                                '</div>' +
                                '</td>'
                        }
                    }
                    if (getRole(window.location.pathname) === '/store-keeper') {
                        newTask1 = '' +
                            '<td class="tac"><div class="tasks-status-form">' +
                            '<input class="status btn btn-danger set-task-status-hold modal-window-link" data-toggle="modal" id="taskHold" type="button" value="Анулювати" data-target="#setTaskStatusHoldModal"' +
                            ' data-task-id="' + data.task.id + '"' +
                            ' data-task-comment="' + data.task.comment + '"/>' +

                            '<input class="status btn btn-success task-form-status task-status-button" id="taskPending" type="button" value="Є на складі" data-status="1"' +
                            ' data-task-id="' + data.task.id + '"' +
                            ' data-assigned-user-id="' + data.task.planedExecutorID + '"/></div></td>';
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
                        ' data-task-type-id="' + data.task.typeID + '"' +
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
                        '</a> ';

                    if (getRole(window.location.pathname) === "/admin") {
                        newTask2 += '' +
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
                    } else {
                        newTask2 += '' +
                            '</a>' +
                            '</td>';
                    }

                    var payed = '(Не розраховано)';

                    if (data.request.payed) {
                        payed = '(Розраховано)';
                    }

                    newCost = '<strong>Вартість: ' + data.newCost + ' грн <span>' + payed + '</span></strong>';

                    $(idx).append(newTask + newTask1 + newTask2);
                    $(idr).append(newCost);

                    if (data.isDone) { //if REQUEST IS DONE

                        var newRequestStatusClasses = 'status-requests ',
                            newRequestStatusText;

                        var requestProcessingButton = '' +
                            '<input class="btn btn-primary request-form-status request-status-button"' +
                            ' id="requestProcessing" type="button" value="Доопрацювати"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="2" title="Доопрацювати"/>';

                        var requestCanceledButton = '' +
                            '<input class="btn request-form-status status-requests-canceled request-status-button"' +
                            ' id="requestCanceled" type="button" value="Анулювати"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="5" title="Анулювати"/>';

                        var give_out = '';

                        var requestPayedButton = '',
                            requestDontPayedButton = '',
                            requestGiveOutButton = '' +
                                '<input class="btn btn-info request-form-status set_give_out ' + give_out + '"' +
                                ' type="button" value="Видати"' +
                                ' data-request-id="' + data.requestID + '"' +
                                ' data-give-out="true" title="Видати"/>';


                        if (getRole(window.location.pathname) === '/admin') {
                            var set_payed_true = '',
                                set_payed_false = '';

                            if (data.request[0].payed) {
                                set_payed_true = 'hide';
                            } else {
                                set_payed_false = 'hide';
                            }

                            requestPayedButton = '' +
                                '<input class="btn btn-warning set_payed_true set_payed ' + set_payed_true + '"' +
                                ' id="requestCanceled" type="button" value="Розрахувати"' +
                                ' data-request-id="' + data.requestID + '"' +
                                ' data-payed="true" title="Розрахувати" data-toggle="modal"\n' +
                                ' data-target="#printCheckFormModal" request-start-time="' + data.startTime + '"\n' +
                                ' request-estimate-time="' + data.estimatedTime + '"/>';

                            requestDontPayedButton = '' +
                                '<input class="btn btn-danger set_payed_false set_payed ' + set_payed_false + '"' +
                                ' id="requestCanceled" type="button" value="Відмін. розрах."' +
                                ' data-request-id="' + data.requestID + '"' +
                                ' data-payed="false" style="padding: 6px;" title="Відмінити розрахунок"/>';
                        }

                        newRequestStatusClasses += 'status-bgc-done';
                        newRequestStatusText = '<strong>Замовлення виконано</strong>';
                        newRequestButtons = requestProcessingButton + requestCanceledButton + requestGiveOutButton + requestPayedButton + requestDontPayedButton;

                        $(idrr + ' .status-requests').removeClass().addClass(newRequestStatusClasses).empty().append(newRequestStatusText);
                        $(idrr + ' .requests-status-form').empty().append(newRequestButtons);

                        changeRequestStatus(idrr + ' .request-status-button');
                        setPayed(idrr + ' .set_payed');
                        setGiveOut(idrr + ' .set_give_out');
                        printOnClick();
                    }

                    deleteTaskOnClick('#idx-task-' + data.task.id + ' .delete-task');
                    clearModalAddTask();
                    updateTaskOnClick('#idx-task-' + data.task.id + ' .update-task');
                    changeTaskStatus(idx + ' .task-status-button');
                    setTaskStatusHold(idx + ' .set-task-status-hold');
                }
            },
            error: function (err) {
                $('.in .close').click();
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

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task/' + taskID,
            type: 'delete',
            data: data,
            success: function (data) {
                $('.in .close').click();
                showSuccessAlert('Видалення задачі пройшло успішно.');

                var idx = "#idx-task-" + data.id;
                var idr = "#idr-cost-" + data.requestID;

                $(idx).remove();
                $(idr).empty();

                var payed = '(Не розраховано)';

                if(data.request.payed) {
                    payed = '(Розраховано)';
                }

                var newCost = '<strong>Вартість: ' + data.newCost + ' грн <span>'+ payed+ '</span></strong>';

                $(idr).append(newCost);
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteTaskOnClick('.delete-task');
    updateTaskOnClick('.update-task');
    changeTaskStatus('.task-status-button');

    function changeTaskStatus(value) {
        $(value).on('click', function (event) {
            event.preventDefault();

            var taskID = $(this).data('task-id'),
                statusID = $(this).data('status'),
                data = {
                    status: statusID
                };

            if (statusID === 1) {
                data.assignedUserID = $(this).data('assigned-user-id');
            }

            if (statusID === 4) {
                var dataArr = $('#change-task-status-form').serializeArray();

                if (window.location.pathname.includes('executor') || window.location.pathname.includes('store-keeper')) {
                    if (dataArr[1].value.length === 0) {
                        var err = {
                            responseJSON: {
                                errors: [
                                    {'msg': '"Коментар" -  обов\'язкове поле.'}
                                ]
                            }
                        };

                        return showErrorAlert(err);
                    }
                    else {
                        data.comment = dataArr[1].value;
                    }
                }

                taskID = dataArr[0].value;

                console.log( taskID );
            }

            $.ajax({
                url: getRole(window.location.pathname) + '/set-task-status/' + taskID,
                type: 'put',
                data: data,
                success: function () {
                    $('.in .close').click();

                    var idx = "#idx-task-" + taskID,
                        newTaskStatusClasses = 'status-task ',
                        newTaskStatusText,
                        newTaskButtons = '';

                    var taskHoldButton = '' +
                        '<input class="status btn btn-danger set-task-status-hold modal-window-link"' +
                        ' data-toggle="modal"' +
                        ' id="taskHold"' +
                        ' type="button"' +
                        ' value="Відсутні запчастини"' +
                        ' data-task-id="' + taskID + '"' +
                        ' data-task-comment="' + $('#idx-task-' + taskID + ' #comment')[0].lastChild.data + '"' +
                        ' data-target="#setTaskStatusHoldModal"' +
                        '/>';

                    var taskDoneButton = '' +
                        '<input class="status btn btn-success task-form-status task-status-button"' +
                        ' id="taskDone"' +
                        ' type="button"' +
                        ' value="Завершити задачу"' +
                        ' data-task-id="' + taskID + '"' +
                        ' data-status="3"' +
                        '/>';

                    switch (statusID) {
                        case 1:
                            $(idx).empty();
                            break;
                        case 2:
                            newTaskStatusClasses += 'status-bgc-processing';
                            newTaskStatusText = '<strong>Задача виконується</strong>';
                            newTaskButtons = taskHoldButton + taskDoneButton;
                            $(idx + ' .status-task').removeClass().addClass(newTaskStatusClasses).empty().append(newTaskStatusText);
                            $(idx + ' .tasks-status-form').empty().append(newTaskButtons);
                            changeTaskStatus(idx + ' .task-status-button');
                            break;
                        case 3:
                            newTaskStatusClasses += 'status-bgc-done';
                            newTaskStatusText = '<strong>Задачу виконано</strong>';
                            $(idx + ' .status-task').removeClass().addClass(newTaskStatusClasses).empty().append(newTaskStatusText);
                            $(idx + ' .tasks-status-form').empty();
                            $(idx + ' td:last-child').empty();
                            break;
                        case 4:
                            newTaskStatusClasses += 'status-bgc-hold';
                            newTaskStatusText = '<strong>Задачу зупинено</strong>';
                            $(idx + ' .status-task').removeClass().addClass(newTaskStatusClasses).empty().append(newTaskStatusText);
                            $(idx + ' .tasks-status-form').empty();
                            $(idx + ' td:last-child').empty();
                            $('#idx-task-' + taskID + ' #comment').empty().append('<strong>Коментар: </strong>' + data.comment);
                            break;
                    }

                    setTaskStatusHold(idx + ' .set-task-status-hold');
                },
                error: function (err) {
                    console.error(err);
                }
            })
        })
    }

    $('#change-status-cancel-task').on('click', function () {
        $('#change-task-status-id').val($('#update-form-task-id').val());
        $('#change-task-status-comment').val($('#update-form-task-comment').val());
    });

    $('.task-status-canceled-button').on('click', function () {

        var idx = "#idx-task-" + $('#change-task-status-id').val();
        var dataArr = {
            status: 5,
            comment: $('#change-task-status-comment').val()
        };

        $.ajax({
            url: getRole(window.location.pathname) + '/cancel-task/' + $('#change-task-status-id').val(),
            type: 'put',
            data: dataArr,
            success: function (data) {

                showSuccessAlert('Анулювання задачі пройшло успішно.');

                var newTask, newTask1 = '', newTask2;
                var executorNameSurname = $(idx + ' .executor-name').attr('exec-name');
                var assignedNameSurname = $(idx + ' .assign-user-name').attr('assign-name');

                $(idx).empty();

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
                    '<p class="bt"><strong>Запчастини сервісу: </strong>' + data.task.parts + '</p> ' +
                    '<p><strong>Запчастини клієнта: </strong>' + data.task.customerParts + '</p> ' +
                    '<p  id="need-buy-parts"><strong>Відсутні запчастини: </strong>' + data.task.needBuyParts + '</p> ' +
                    '<p class="bt" id="comment"><strong>Коментар: </strong>' + data.task.comment + '</p> ' +
                    '</td>';

                newTask2 = '' +
                    '<td class="tac bb"> ' +
                    '<a class="update-task modal-window-link"' +
                    ' title="Редагувати задачу"' +
                    ' data-toggle="modal"' +
                    ' data-id="' + data.task.id + '"' +
                    ' data-request-id="' + data.task.requestID + '"' +
                    ' data-task-description="' + data.task.description + '"' +
                    ' data-task-name="' + data.task.name + '"' +
                    ' data-task-type-id="' + data.task.typeID + '"' +
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
                    '</a> ';

                if (getRole(window.location.pathname) === "/admin") {
                    newTask2 += ''+
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
                } else {
                    newTask2 += ''+
                        '</a>' +
                        '</td>';
                }

                $(idx).append(newTask + newTask1 + newTask2);

                deleteTaskOnClick('#idx-task-' + data.task.id + ' .delete-task');
                clearModalAddTask();
                updateTaskOnClick('#idx-task-' + data.task.id + ' .update-task');
                changeTaskStatus(idx + ' .task-status-button');
                setTaskStatusHold(idx + ' .set-task-status-hold');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        })
    });

    $('.task-planed-executor-id').on('change', function () {
        $('.task-assigned-user-id').val($(this).val()).select2();
    });

    $('#update-form-task-planed-executor').on('change', function () {
        $('#update-form-task-assigned-user').val($(this).val()).change();
    });
});

function clearModalAddTask() {
    $('.create-form-task').val('');
    $('#detail-type-tbody').empty();
}

function updateTaskOnClick(value) {

    $(value).on('click', function () {

        clearModalAddTask();
        setStartTime();
        setOpenTaskNameOnUpdateTask();
        if (!window.location.pathname.includes('update-request')) {
            if (window.location.pathname.includes('create-request') || window.location.pathname.includes('requests') || window.location.pathname.includes('executor') ) {

                var dataArr;
                var This = this;

                if (window.location.pathname.includes('create-request')) {
                    dataArr = {
                        typeOfCar: $('#typeOfCar').val(),
                        carMarkk: $('#markk').val(),
                        carModel: $('#model').val()
                    };
                } else if (window.location.pathname.includes('requests')) {
                    dataArr = {
                        typeOfCar: $('#typeOfCar' + $(this).data('request-id')).attr('attr-id'),
                        carMarkk: $('#markk' + $(this).data('request-id')).attr('attr-id'),
                        carModel: $('#model' + $(this).data('request-id')).attr('attr-id')
                    };
                } else if (window.location.pathname.includes('executor')) {
                    dataArr = {
                        requestID: $(this).data('request-id')
                    };
                }

                $.ajax({
                    url: getRole(window.location.pathname) + '/get-task-types',
                    type: 'post',
                    data: dataArr,
                    success: function (data) {

                        if(getRole(window.location.pathname) !== '/executor') {
                            $('#update-form-task-type-select').find('option').remove();
                            data.taskTypes.forEach(item => {
                                var title = setTaskTypesTitle(item);

                                $('#update-form-task-type-select').append($('<option>', {
                                    value: item.id,
                                    text: item.typeName + ' (' + title + ')',
                                    updateTaskTypeID: item.typeName,
                                    id: 'updateTaskTypeID' + item.id,
                                    title: title
                                }));
                            });

                            var taskTypeID = $("option[id='updateTaskTypeID" + $(This).data('task-type-id') + "']").val();

                            $('#update-form-task-type-select').val(taskTypeID).change();
                        }

                        $('#update-detail-type-select').find('option').remove();
                        data.detailTypes.forEach(item => {
                            var title = setDetailTypesTitle(item);

                            $('#update-detail-type-select').append($('<option>', {
                                value: item.id,
                                text: item.detailName + ' (' + title + ')',
                                id: 'detailTypeID' + item.id,
                                detailName: item.detailName,
                                title: title
                            }));
                        });

                        isFirstUpdateClick = true;

                        $('#update-detail-type-select').val('').change();
                        $('#update-detail-type').val('').change();
                        $('#update-form-task-old-cost').val($(This).data('task-cost'));
                        $('#update-form-task-cost').val($(This).data('task-cost'));
                    }
                });

            } else {

                isFirstUpdateClick = true;
                var taskTypeID = $("option[id='updateTaskTypeID" + $(this).data('task-type-id') + "']").val();

                $('#update-form-task-type-select').val(taskTypeID).change();
                $('#update-form-task-old-cost').val($(this).data('task-cost'));
                $('#update-form-task-cost').val($(this).data('task-cost'));
            }
        } else {
            isFirstUpdateClick = true;
            var taskTypeID = $("option[id='updateTaskTypeID" + $(this).data('task-type-id') + "']").val();

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
        $('#update-form-task-start-time').val($(this).data('task-start-time').slice(0, 10));
        $('#change-status-update-task').attr('old-start-time', ($(this).data('task-start-time')));
        $('#update-form-task-end-time').val($(this).data('task-end-time'));
        /*$('#update-form-task-parts').val($(this).data('task-parts'));
        $('#update-form-task-customer-parts').val($(this).data('task-customer-parts'));
        $('#update-form-task-need-buy-parts').val($(this).data('task-need-buy-parts'));*/
        $('#update-form-task-status').val($(this).data('task-status'));
        $('#update-form-task-comment').val($(this).data('task-comment'));

        if(getRole(window.location.pathname) !== '/store-keeper') {

            $.ajax({
                url: getRole(window.location.pathname) + '/details-of-task/' + $('#update-form-task-id').val(),
                type: 'get',
                success: function (data) {

                    customDetailID = 999999;

                    $('#update-detail-type-tbody').empty();

                    data.details.forEach(function (item) {

                        // Emit when modal render
                        var detailTemplate0 = '<tr id="idr-' + item.id + '"><td>' + item.detail.detailName + '</td><td>';

                        var detailTemplate1 = 'Клієнт';

                        var detailTemplate2 = '</td><td>' + item.detailQuantity + '</td><td>';

                        var detailTemplate3 = '';

                        if (getRole(window.location.pathname) === '/admin' || getRole(window.location.pathname) === '/moderator') {
                            detailTemplate1 = '' +
                                '<select detail-id="' + item.id + '" class="change-detail-type-select">' +
                                    '<option value="1">Сервіс</option>' +
                                    '<option value="2">Клієнт</option>' +
                                    '<option value="3">Відсутня</option>' +
                                '</select>';

                            detailTemplate3 = '' +
                                '<a class="delete-detail-from-modal" title="Видалити деталь" ' +
                                ' detail-id="' + item.id + '">' +
                                '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a>';
                        }
                        else {
                            if (+item.detailType !== 2) {
                                detailTemplate1 = '' +
                                    '<select detail-id="' + item.id + '" class="change-detail-type-select">' +
                                        '<option value="1">Сервіс</option>' +
                                        '<option value="3">Відсутня</option>' +
                                    '</select>';

                                detailTemplate3 = '' +
                                    '<a class="delete-detail-from-modal" title="Видалити деталь" ' +
                                    ' detail-id="' + item.id + '">' +
                                    '<span class="glyphicon glyphicon-remove" aria-hidden="true"/></a>';
                            }
                        }

                        var detailTemplate4 = '</td></tr>';

                        $('#update-detail-type-tbody').append(detailTemplate0 + detailTemplate1 + detailTemplate2 + detailTemplate3 + detailTemplate4);

                        $('#idr-' + item.id + ' .change-detail-type-select').val(item.detailType);
                    });

                    deleteDetailFromModal('.delete-detail-from-modal');
                    changeDetailTypeSelect('.change-detail-type-select');

                    $('#update-detail-type-select').val('').change();
                    $('#update-detail-type').val('').change();
                    $('#update-detail-type-input').val('');
                }
            })
        }
    });
}

function deleteDetailFromModal(value) {

    var element;

    $(value).on('click', function () {
        element = $(this).attr('detail-id');
        $('#idr-' + element).remove();

        for (var i = 0; i < detailArray.length; i++) {
            if (detailArray[i].customDetailID === +element) {
                detailArray.splice(i, 1);
                return;
            }
        }
        deleteDetailArray.push(element);
    });
}

function deleteTaskOnClick(value) {
    $(value).on('click', function () {
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


//====================== function change class for status ==============================================================

function changeStatus(data) {
    var newStatus = "";
    switch (data) {
        case 1: {
            newStatus = '<span class="status-task status-bgc-pending"><strong>Задача в очікувані</strong></span>';
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
    $('#detail-type-select').val('').change();
    $('#detail-type').val('').change();
}

function setDefaultAssignedUserOnCreateTask() {
    $('.create-assign-task-button').removeClass('hidden');
    $('.create-assign-task-select').addClass("hidden");
}

function setOpenTaskNameOnUpdateTask() {
    $('#update-form-task-type-input').addClass("hidden");
    $('#update_new_task .select2').removeClass("hidden");
    $('#update_new_task .input-group').removeClass("hidden");
    $('.update-assign-task-button').addClass('hidden');
    $('.update-assign-task-select').removeClass("hidden");
}

function setTaskTypesTitle(item) {
    switch (item.title) {
        case '0': {
            return 'Усі категорії';
            break;
        }
        case '1': {
            return 'Категорія: ' + item.transportType.transportTypeName;
            break;
        }
        case '2': {
            return 'Категорія: ' + item.transportType.transportTypeName + ', ' + item.transportMarkk.transportMarkkName;
            break;
        }
        case '3': {
            return 'Категорія: ' + item.transportType.transportTypeName + ', ' + item.transportMarkk.transportMarkkName + ', ' + item.transportModel.transportModelName;
            break;
        }
    }
}

function setDetailTypesTitle(item) {
    switch (item.title) {
        case '0': {
            return 'Усі категорії';
            break;
        }
        case '1': {
            return 'Категорія: ' + item.transportType.transportTypeName;
            break;
        }
        case '2': {
            return 'Категорія: ' + item.transportType.transportTypeName + ', ' + item.transportMarkk.transportMarkkName;
            break;
        }
        case '3': {
            return 'Категорія: ' + item.transportType.transportTypeName + ', ' + item.transportMarkk.transportMarkkName + ', ' + item.transportModel.transportModelName;
            break;
        }
    }
}

setTaskStatusHold('.set-task-status-hold');

function setTaskStatusHold(value) {
    $(value).on('click', function () {
        $('#change-task-status-id').val($(this).data('task-id'));

        if ('' + $(this).data('task-comment') !== 'undefined') {
            $('#change-task-status-comment').val($(this).data('task-comment'));
        }
    });
}

function convertDetailsString(str) {
    if (str.substr(0, 8) === ',&#8195;') {
        str = str.substr(8);
    }
    return str;
}

var summaryDetailsCost;
var detailsCost;