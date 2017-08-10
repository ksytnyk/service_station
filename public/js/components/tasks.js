$(document).ready(function () {

    $('#taskAddButton').on('click', function () {

        $('#createTaskFormModal').modal('toggle');

        $.ajax({
            url: '/admin/create-task',
            type: 'Post',
            data: $('#createTaskForm').serializeArray(),
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
                $('#errorsCreateRequest').text('ERROR!');
                console.log(err.responseText);
            }
        });
    });
});