$(document).ready(function () {

    $('#create_request').on('click', function () {
        $.ajax({
            url: window.location.pathnam,
            type: 'Post',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
                $('.disable_input').prop('disabled', true);
                $('#step').slideDown('slow');
                $('#requestIDForTask').val(data.result.id);
                $('#create_request').hide();
                $('#create_task').show();
            },
            error: function (err) {
                $('.errorsCreateRequestBlock').css("display", "block");

                var errorsTemplate = err.responseJSON.errors.map(error => {
                    return ("<div class='col-lg-4'>" + error.msg + "</div>");
                });

                $('#errorsCreateRequest').html(errorsTemplate);

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