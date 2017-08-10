$(document).ready(function () {

    $('#create_request').on('click', function () {
        $.ajax({
            url: '/admin/create-request',
            type: 'Post',
            data: $('#createRequestForm').serializeArray(),
            success: function (data) {
                $('.disable_input').prop('disabled', true);
                $('#step').slideDown('slow');
                $('#requestIDForTask').val(data.result.id);
            },
            error: function (err) {
                $('#errorsCreateRequest').text('ERROR!');
                console.log(err.responseText);
            }
        });
    })
});