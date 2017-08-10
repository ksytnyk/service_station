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
});