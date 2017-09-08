$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    $('#create_request').on('click', function () {
        if($('#request-name-select').serializeArray()[0]){
            var requestID = $('#request-name-select').serializeArray()[0].value;
        }

        var dataArr = $('#createRequestForm').serializeArray();
        var requestName = $('#requestID' + requestID).attr('requestID');

        if (dataArr.length === 9) {
            dataArr[2].value = setTimeToDate(dataArr[2].value);
            dataArr[3].value = setTimeToDate(dataArr[3].value);
        } else {
            dataArr[3].value = setTimeToDate(dataArr[3].value);
            dataArr[4].value = setTimeToDate(dataArr[4].value);
        }

        if (dataArr[0].value === '') {
            dataArr[0].value = requestName;
        }

        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: dataArr,
            success: function (data) {
                $('#print_check').attr('data-customer-phone', data.customer.userPhone);
                $('#print_check').attr('data-request-id', data.result.id);

                showSuccessAlert('Додавання замовлення пройшло успішно.');

                var input = $('#request-name-input')[0].className;

                if(!input.includes('hidden')){
                    $('#request-name-select option[value='+data.result.id+']').remove();
                    $('#request-name-select').append($('<option>', {
                        value: data.result.id,
                        text: dataArr[0].value,
                        requestID: dataArr[0].value,
                        id: 'requestID' + data.result.id
                    }));
                    $('#request-name-select').val(data.result.id).change()
                }

                $('.disable_input').attr('disabled', true);
                $('#step').slideDown('slow');
                $('#requestIDForTask').val(data.result.id);
                $('#update_request')
                    .attr("request-id", data.result.id)
                    .attr('start-time', formatDate(dataArr[2].value))
                    .attr('estimated-time', formatDate(dataArr[3].value));
                $('#create_request').hide();
                $('#access_update_request').show();
                $('#print_check').show();
            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });

    $('#access_update_request').on('click', function () {

        $('.update-request-name-input').addClass("hidden");
        $('#input-group-update').removeClass("hidden");

        if(isFirstUpdateRequestOpen){
            $('#update-request-name-select').val($('#update-request-name-input').attr('request-id')).change();
            isFirstUpdateRequestOpen = false
        }

        $('.disable_input').attr('disabled', false);
        $('#request-name .select2').removeClass("hidden");
        $('.request-name-input').addClass("hidden");
        $('#request-name .input-group').removeClass("hidden");
        $('.select2').removeClass('select2-container--disabled');
        $('#access_update_request').hide();
        $('#update_request').show();
    });

    $('#update_request').on('click', function () {

        var oldStartTime = $('#update_request').attr('start-time');
        var oldEstimatedTime = $('#update_request').attr('estimated-time');
        var dataArr = $('#createRequestForm').serializeArray();

        if(window.location.pathname.includes('create-request')){
            if($('#request-name-select').serializeArray()[0]){
                var requestID = $('#request-name-select').serializeArray()[0].value;
            }

            var requestName = $('#requestID' + requestID).attr('requestID');

            if (dataArr.length === 9) {
                dataArr[2].value = checkDateForUpdate(oldStartTime, dataArr[2].value);
                dataArr[3].value = checkDateForUpdate(oldEstimatedTime, dataArr[3].value);
            } else {
                dataArr[3].value = checkDateForUpdate(oldStartTime, dataArr[3].value);
                dataArr[4].value = checkDateForUpdate(oldEstimatedTime, dataArr[4].value);
            }

            if (dataArr[0].value === '') {
                dataArr[0].value = requestName;
            }
        } else {
            if($('#update-request-name-select').serializeArray()[0]){
                var updateRequestID = $('#update-request-name-select').serializeArray()[0].value;
            }

            var updateRequestName = $('#updateRequestID' + updateRequestID).attr('updateRequestID');

            if (dataArr.length === 9) {
                dataArr[2].value = checkDateForUpdate(oldStartTime, dataArr[2].value);
                dataArr[3].value = checkDateForUpdate(oldEstimatedTime, dataArr[3].value);
            } else {
                dataArr[3].value = checkDateForUpdate(oldStartTime, dataArr[3].value);
                dataArr[4].value = checkDateForUpdate(oldEstimatedTime, dataArr[4].value);
            }

            if (dataArr[0].value === '') {
                dataArr[0].value = updateRequestName;
            }
        }

        $.ajax({
            url: getRole(window.location.pathname) + '/update-request/' + $(this).attr("request-id"),
            type: 'put',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Оновлення замовлення пройшло успішно.');

                $('#print_check_update_request').attr('customer-phone', data.customer.userPhone);

                if(window.location.pathname.includes('create-request')) {

                    var input = $('#request-name-input')[0].className;

                        if(!input.includes('hidden')){
                            $('#request-name-select option[value='+data.request.id+']').remove();
                            $('#request-name-select').append($('<option>', {
                                value: data.request.id,
                                text: data.request.name,
                                requestID: data.request.name,
                                id: 'requestID' + data.request.id
                            }));
                            $('#request-name-select').val(data.request.id).change();
                    }
                } else {
                    var input = $('#update-request-name-input')[0].className;

                    if(!input.includes('hidden')) {
                        $('#update-request-name-select option[value='+data.request.id+']').remove();
                        $('#update-request-name-select').append($('<option>', {
                            value: data.request.id,
                            text: data.request.name,
                            updateRequestID: data.request.name,
                            id: 'updateRequestID' + data.request.id
                        }));
                        $('#update-request-name-select').val(data.request.id).change();
                    }
                }

                $('.disable_input').attr('disabled', true);
                $('#update_request').hide()
                    .attr('start-time', formatDate(dataArr[2].value))
                    .attr('estimated-time', formatDate(dataArr[3].value));
                $('#access_update_request').show();
            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });

    $('.delete-request').on('click', function () {
        $('#delete-request-id').text($(this).data('id'));
        $('.submit-delete-request').attr('data-request-id', $(this).data('id'));
        $('.submit-delete-request').attr('data-had-deleted', $(this).data('had-deleted'));
    });

    $('.submit-delete-request').on('click', function () {
        var requestID = $(this).attr('data-request-id');
        var hadDeleted = $(this).attr('data-had-deleted');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-request/' + requestID,
            type: 'delete',
            data: { hadDeleted: hadDeleted },
            success: function () {
                var idr = "#idr-request-" + requestID;
                $(idr).remove();
            },
            error: function (err) {
                showErrorAlert(err);
            }
        })
    });

    changeRequestStatus('.request-status-button');

    function changeRequestStatus(value) {
        $(value).on('click', function () {
            var requestID = $(this).data('request-id');
            statusID = $(this).data('status');
            hadStarted = $(this).data('had-started');

            $.ajax({
                url: getRole(window.location.pathname) + '/change-request-status/' + requestID,
                type: 'put',
                data: {
                    statusID: statusID,
                    hadStarted: hadStarted
                },
                success: function (data) {
                    var idr = "#idr-request-" + data.requestID;

                    if (window.location.pathname.split('/')[3] === 'all' || window.location.pathname.split('/')[3] === 'hold') {
                        var newRequestStatusClasses = 'status-requests ',
                            newRequestStatusText,
                            newRequestButtons = '';

                        var requestProcessingButton = '' +
                            '<input class="btn btn-primary request-form-status request-status-button"' +
                            ' id="requestProcessing" type="button" value="Доопрацювати"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="2" title="Доопрацювати"/>';

                        var requestDoneButton = '' +
                            '<input class="btn btn-success request-form-status request-status-button"' +
                            ' id="requestDone" type="button" value="Завершити"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="3" title="Завершити"/>';

                        var requestCanceledButton = '' +
                            '<input class="btn request-form-status status-requests-canceled request-status-button"' +
                            ' id="requestCanceled" type="button" value="Анулювати"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="5" title="Анулювати"/>';

                        var give_out = '';
                        if (data.request[0].giveOut || data.request[0].status !== 3 || !data.request[0].payed) {
                            give_out = 'hide';
                        }

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
                                ' data-payed="true" title="Розрахувати"/>';

                            requestDontPayedButton = '' +
                                '<input class="btn btn-danger set_payed_false set_payed ' + set_payed_false + '"' +
                                ' id="requestCanceled" type="button" value="Відмін. розрах."' +
                                ' data-request-id="' + data.requestID + '"' +
                                ' data-payed="false" style="padding: 6px;" title="Відмінити розрахунок"/>';
                        }

                        switch (data.status) {
                            case "2":
                                newRequestStatusClasses += 'status-bgc-processing';
                                newRequestStatusText = '<strong>Замовлення виконується</strong>';
                                newRequestButtons = requestDoneButton + requestCanceledButton + requestGiveOutButton + requestPayedButton + requestDontPayedButton;
                                break;
                            case "3":
                                newRequestStatusClasses += 'status-bgc-done';
                                newRequestStatusText = '<strong>Замовлення виконано</strong>';
                                newRequestButtons = requestProcessingButton + requestCanceledButton + requestGiveOutButton + requestPayedButton + requestDontPayedButton;
                                break;
                            case "5":
                                newRequestStatusClasses += 'status-bgc-canceled';
                                newRequestStatusText = '<strong>Замовлення анульовано</strong>';
                                newRequestButtons = requestProcessingButton + requestGiveOutButton + requestPayedButton + requestDontPayedButton;
                                break;
                        }

                        if (data.status === '5') {
                            $(idr + ' td').addClass('disable-task');
                        } else {
                            $(idr + ' td').removeClass('disable-task');
                        }
                        $(idr + ' .status-requests').removeClass().addClass(newRequestStatusClasses).empty().append(newRequestStatusText);
                        $(idr + ' .requests-status-form').empty().append(newRequestButtons);

                        changeRequestStatus(idr + ' .request-status-button');
                        setPayed(idr + ' .set_payed');
                        setGiveOut(idr + ' .set_give_out');
                    } else {
                        $(idr).remove();
                    }
                },
                error: function (err) {
                    showErrorAlert(err);
                }
            })
        })
    }

    setPayed('.set_payed');

    function setPayed(value) {
        $(value).on('click', function () {
            var requestID = $(this).data('request-id'),
                payed = $(this).data('payed');

            $.ajax({
                url: getRole(window.location.pathname) + '/set-payed/' + requestID,
                type: 'put',
                data: {
                    payed: payed
                },
                success: function (data) {
                    var idr = "#idr-request-" + requestID,
                        idc = "#idr-cost-" + requestID;

                    if (payed) {
                        $(idr + ' .request_payed').addClass('request_payed_true');
                        $(idc + ' span').empty().append('(Розраховано)');
                        $(idr + ' .set_payed_true').addClass('hide');
                        $(idr + ' .set_payed_false').removeClass('hide');
                        if (data.request[0].status === 3) {
                            $(idr + ' .set_give_out').removeClass('hide');
                        }
                    } else {
                        $(idr + ' .request_payed').removeClass('request_payed_true');
                        $(idc + ' span').empty().append('(Не розраховано)');
                        $(idr + ' .set_payed_false').addClass('hide');
                        $(idr + ' .set_payed_true').removeClass('hide');
                        $(idr + ' .set_give_out').addClass('hide');
                    }
                },
                error: function (err) {
                    showErrorAlert(err);
                }
            })
        })
    }

    setGiveOut('.set_give_out');

    function setGiveOut(value) {
        $(value).on('click', function () {
            var requestID = $(this).data('request-id'),
                giveOut = $(this).data('give-out');

            $.ajax({
                url: getRole(window.location.pathname) + '/set-payed/' + requestID,
                type: 'put',
                data: {
                    giveOut: giveOut
                },
                success: function () {
                    var idr = "#idr-request-" + requestID;

                    $(idr + ' .status-requests').empty().append('<strong>Замовлення видано</strong>').removeClass().addClass('status-requests status-bgc-give-out');
                    $(idr + ' .requests-status-form').remove();
                },
                error: function (err) {
                    showErrorAlert(err);
                }
            })
        })
    }

    var addNewUser;

    $('#add_new_user').on('click', function () {
        if (addNewUser) {
            $('#createUserFormModal input[name=userName]').val(addNewUser[0]);
            $('#createUserFormModal input[name=userSurname]').val(addNewUser[1]);
            $('#createUserFormModal').modal('toggle');
        }
    });

    $('.create_request #customers').on('select2:closing', function () {
        addNewUser = $('.select2-search__field')[0].value.split(' ');
    });

    $('.update_request #customers').on('select2:closing', function () {
        addNewUser = $('.select2-search__field')[0].value.split(' ');
    });

    $('.new-request-name').on('click', function () {
        $('#request-name .select2').addClass("hidden");
        $('.request-name-input').removeClass("hidden");
        $('#request-name .input-group').addClass("hidden");
    });

    $('#request-name-select').on('select2:closing', function () {
        $('.request-name-input').val($('.select2-search__field')[0].value);
    });

    $('.update-new-request-name').on('click', function () {
        $('.update-request-name-input').removeClass("hidden");
        $('#input-group-update').addClass("hidden");
    });

    $('#update-request-name-select').on('select2:closing', function () {
        $('.update-request-name-input').val($('.select2-search__field')[0].value);
    });

    $('.update-all-request-button').on('click', function () {
        isFirstUpdateRequestOpen = true;
    });

    var isFirstUpdateRequestOpen = true;
});