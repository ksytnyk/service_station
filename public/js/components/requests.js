$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    $('#create_request').on('click', function () {
        var dataArr = $('#createRequestForm').serializeArray();

        dataArr[2].value = setTimeToDate(dataArr[2].value);
        dataArr[3].value = setTimeToDate(dataArr[3].value);

        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: dataArr,
            success: function (data) {
                $('#print_check').attr('data-customer-phone', data.customer.userPhone);
                $('#print_check').attr('data-request-id', data.result.id);

                showSuccessAlert('Додавання замовлення пройшло успішно.');

                $('.disable_input').prop('disabled', true);
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
        $('.disable_input').prop('disabled', false);
        $('.select2').removeClass('select2-container--disabled');
        $('#access_update_request').hide();
        $('#update_request').show();
    });

    $('#update_request').on('click', function () {
        var dataArr = $('#createRequestForm').serializeArray();
        var oldStartTime = $('#update_request').attr('start-time');
        var oldEstimatedTime = $('#update_request').attr('estimated-time');

        dataArr[2].value = checkDateForUpdate(oldStartTime, dataArr[2].value);
        dataArr[3].value = checkDateForUpdate(oldEstimatedTime, dataArr[3].value);

        $.ajax({
            url: getRole(window.location.pathname) + '/update-request/' + $(this).attr("request-id"),
            type: 'put',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Оновлення замовлення пройшло успішно.');

                $('#print_check_update_request').attr('customer-phone', data.customer.userPhone);

                $('.disable_input').prop('disabled', true);
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
    });

    $('.submit-delete-request').on('click', function () {
        var requestID = $(this).attr('data-request-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-request/' + requestID,
            type: 'delete',
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
                            ' data-status="2" />';

                        var requestDoneButton = '' +
                            '<input class="btn btn-success request-form-status request-status-button"' +
                            ' id="requestDone" type="button" value="Завершити"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="3" />';

                        var requestCanceledButton = '' +
                            '<input class="btn request-form-status status-requests-canceled request-status-button"' +
                            ' id="requestCanceled" type="button" value="Анулювати"' +
                            ' data-request-id="' + data.requestID + '"' +
                            ' data-status="5" />';

                        var requestPayedButton = '',
                            requestDontPayedButton = '';

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
                                ' data-payed="true" />';

                            requestDontPayedButton = '' +
                                '<input class="btn btn-danger set_payed_false set_payed ' + set_payed_false + '"' +
                                ' id="requestCanceled" type="button" value="Відмінити розрахунок"' +
                                ' data-request-id="' + data.requestID + '"' +
                                ' data-payed="false" />';
                        }

                        switch (data.status) {
                            case "2":
                                newRequestStatusClasses += 'status-bgc-processing';
                                newRequestStatusText = '<strong>Замовлення виконується</strong>';
                                newRequestButtons = requestDoneButton + requestCanceledButton + requestPayedButton + requestDontPayedButton;
                                break;
                            case "3":
                                newRequestStatusClasses += 'status-bgc-done';
                                newRequestStatusText = '<strong>Замовлення виконано</strong>';
                                newRequestButtons = requestProcessingButton + requestCanceledButton + requestPayedButton + requestDontPayedButton;
                                break;
                            case "5":
                                newRequestStatusClasses += 'status-bgc-canceled';
                                newRequestStatusText = '<strong>Замовлення анульовано</strong>';
                                newRequestButtons = requestProcessingButton + requestPayedButton + requestDontPayedButton;
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
                success: function () {
                    var idr = "#idr-request-" + requestID;

                    if (payed) {
                        $(idr + ' .request_payed').addClass('request_payed_true').attr('title', 'Розраховано');
                        $(idr + ' .set_payed_true').addClass('hide');
                        $(idr + ' .set_payed_false').removeClass('hide');
                    } else {
                        $(idr + ' .request_payed').removeClass('request_payed_true').attr('title', 'Не розраховано');
                        $(idr + ' .set_payed_false').addClass('hide');
                        $(idr + ' .set_payed_true').removeClass('hide');
                    }
                },
                error: function (err) {
                    showErrorAlert(err);
                }
            })
        })
    }
});