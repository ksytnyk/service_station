$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    $('#create_request').on('click', function () {
        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
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
        /*if ($(this).data('current') === 1) {
            $('#delete-request-form-id').attr('action', ('/admin/delete-request/' + $(this).data('id')));
        } else {
            $('#delete-request-form-id').attr('action', ('/moderator/delete-request/' + $(this).data('id')));
        }*/
        $('#delete-request-id').text($(this).data('id'));
        $('.submit-delete-request').attr('data-request-id', $(this).data('id'));
    });

    $('.submit-delete-request').on('click',function () {
        var requestID = $(this).data('request-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-request/' + requestID,
            type: 'delete',
            success: function (data) {
                window.location.reload();
            }
        })

    });
    
    $('.request-status-button').on('click', function () {
        var requestID = $(this).data('request-id');
        var statusID = $(this).data('status');

        $.ajax({
            url: getRole(window.location.pathname) + '/change-request-status/' + requestID,
            type: 'put',
            data: {statusID: statusID},
            success: function (data) {
                window.location.reload();
            }
        })
    })
});