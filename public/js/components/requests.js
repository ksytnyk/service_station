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

    $('.info-task').on('click', function () {
        $('#info-id').text($(this).data('id'));
        $('#info-description').text($(this).data('description'));
        $('#info-executor-surname').text($(this).data('executor-surname'));
        $('#info-executor-name').text($(this).data('executor-name'));
        $('#info-cost').text($(this).data('cost'));
        $('#info-estimation-time').text($(this).data('estimation-time'));
        $('#info-start').text($(this).data('start'));
        $('#info-end').text($(this).data('end'));
        $('#info-parts').text($(this).data('parts'));
        $('#info-customer-parts').text($(this).data('customer-parts'));
        $('#info-need-buy-parts').text($(this).data('need-buy-parts'));
        $('#info-comments').text($(this).data('comments'));
    });
});