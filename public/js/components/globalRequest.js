$(document).ready(function () {

    $('[data-toggle="popover"]').popover();

    $('#create_task_request').on('click', function () {
        $.ajax({
            url: window.location.pathname,
            type: 'Post',
            data: $('#createRequestForm').serializeArray(),
            success: function () {
                window.location.replace('/admin/requests');
            },
            error: function (err) {
                showErrorAlert(err);
            }
        });
    });
});