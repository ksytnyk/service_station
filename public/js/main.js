$(document).ready(function () {

    $('.modal-window-link').on('click', function () {
        if (document.body.offsetHeight > window.innerHeight) {
            $('.white_block').outerWidth( +window.innerWidth - 17 );
        }
    });

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

    $('.info-user').on('click', function () {
        $('#info-id').text($(this).data('id'));
        $('#info-name').text($(this).data('name'));
        $('#info-surname').text($(this).data('surname'));
        $('#info-company').text($(this).data('company'));
        $('#info-address').text($(this).data('address'));
        $('#info-phone').text($(this).data('phone'));
        $('#info-login').text($(this).data('login'));
        $('#info-role').text($(this).data('role'));
        $('#info-email').text($(this).data('email'));
        $('#info-password').text($(this).data('password'));
    });

    $('.delete-user').on('click', function () {
        if ($(this).data('current') === 1) {
            $('#delete-form-id').attr('action', ('/admin/delete-user/' + $(this).data('id')));
        } else {
            $('#delete-form-id').attr('action', ('/moderator/delete-user/' + $(this).data('id')));
        }
        $('#delete-form-login').html($(this).data('login'));
    });

    $('.hide_alert').on('click', function () {
        $('.alert').slideUp();
    });

    setTimeout(function () {
        $('.hide_alert').trigger('click');
    }, 5000);

    $('.table').DataTable();

});