$(document).ready(function () {

    $('#create_request').on('click', function () {
        $.ajax({
            url: window.location.pathname,
            type: 'Post',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
                $('.disable_input').prop('disabled', true);
                $('#step').slideDown('slow');
                $('#requestIDForTask').val(data.result.id);
                $('#update_request').attr("request-id", data.result.id);
                $('#create_request').hide();
                $('#access_update_request').show();
            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, 5000);
            }
        });
    });

    $('#access_update_request').on('click', function () {
        $('.disable_input').prop('disabled', false);
        $('#access_update_request').hide();
        $('#update_request').show();
    });

    $('#update_request').on('click', function () {
        $.ajax({
            url: getRole(window.location.pathname) + '/update-request/' + $(this).attr("request-id"),
            type: 'PUT',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
                $('.disable_input').prop('disabled', true);
                $('#update_request').hide();
                $('#access_update_request').show();
            },
            error: function (err) {

                $('.errors-info').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errors-block').html(errorsTemplate);

                setTimeout(function () {
                    $('.hide_alert').trigger('click');
                }, 5000);
            }
        });
    });

    $('.delete-request').on('click', function () {
        if ($(this).data('current') === 1) {
            $('#delete-request-form-id').attr('action', ('/admin/delete-request/' + $(this).data('id')));
        } else {
            $('#delete-request-form-id').attr('action', ('/moderator/delete-request/' + $(this).data('id')));
        }
        $('#delete-request-id').text($(this).data('id'));
    });
});

function getRole(pathname) {
    if (pathname.includes('admin')) {
        return '/admin';
    } else {
        return '/moderator';
    }
}