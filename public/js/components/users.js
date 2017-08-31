$(document).ready(function () {

    $('.update-user').on('click', function () {
        if ($(this).data('current') === 1) {
            $('#update-form-id').attr('action', ('/admin/update-user/' + $(this).data('id')));
        } else {
            $('#update-form-id').attr('action', ('/moderator/update-user/' + $(this).data('id')));
        }
        $('#update-form-name').val($(this).data('name'));
        $('#update-form-surname').val($(this).data('surname'));
        $('#update-form-company').val($(this).data('company'));
        $('#update-form-address').val($(this).data('address'));
        $('#update-form-phone').val($(this).data('phone'));
        $('#update-form-login').val($(this).data('login'));
        $('#update-form-role').val($(this).data('role'));
        $('#update-form-email').val($(this).data('email'));
        $('#update-form-password').val($(this).data('password'));
    });

    $('.delete-user').on('click', function () {
        $('.submit-delete-user').attr('data-user-id', $(this).data('id'));
        $('#delete-form-surname-name').html($(this).data('user-name') + " " + $(this).data('user-surname'));
    });

    $('.submit-delete-user').on('click', function () {
        var userID = $(this).data('user-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-user/' + userID,
            type: 'delete',
            success: function (data) {
                window.location.reload();
            }
        })
    })

});
