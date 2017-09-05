$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    $('#create_request').on('click', function () {
        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {

                console.log(data.result);

                $('#print_check').attr('data-customer-phone', data.customer.userPhone);
                $('#print_check').attr('data-request-id', data.result.id);

                showSuccessAlert('Додавання замовлення пройшло успішно.');

                $('.disable_input').prop('disabled', true);
                $('#step').slideDown('slow');
                $('#requestIDForTask').val(data.result.id);
                $('#update_request').attr("request-id", data.result.id);
                $('#create_request').hide();
                $('#access_update_request').show();
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
        $.ajax({
            url: getRole(window.location.pathname) + '/update-request/' + $(this).attr("request-id"),
            type: 'put',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
                showSuccessAlert('Оновлення замовлення пройшло успішно.');

                $('.disable_input').prop('disabled', true);
                $('#update_request').hide();
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

    $('.submit-delete-request').on('click',function () {
        var requestID = $(this).data('request-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-request/' + requestID,
            type: 'delete',
            success: function () {
                var idr = "#idr-request-" + requestID;
                $(idr).remove();
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

                        switch (data.status) {
                            case "2":
                                newRequestStatusClasses += 'status-bgc-processing';
                                newRequestStatusText = '<strong>Замовлення виконується</strong>';
                                newRequestButtons = requestDoneButton + requestCanceledButton;
                                break;
                            case "3":
                                newRequestStatusClasses += 'status-bgc-done';
                                newRequestStatusText = '<strong>Замовлення виконано</strong>';
                                newRequestButtons = requestProcessingButton + requestCanceledButton;
                                break;
                            case "5":
                                newRequestStatusClasses += 'status-bgc-canceled';
                                newRequestStatusText = '<strong>Замовлення анульовано</strong>';
                                newRequestButtons = requestProcessingButton;
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
                    } else {
                        $(idr).remove();
                    }
                }
            })
        })
    }
});