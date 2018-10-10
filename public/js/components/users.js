$(document).ready(function () {

    $('.update-user').on('click', function () {
        $('#update-form-id').val($(this).data('id'));
        $('#update-form-name').val($(this).data('name'));
        $('#update-form-surname').val($(this).data('surname'));
        $('#update-form-company').val($(this).data('company'));
        $('#update-form-address').val($(this).data('address'));
        $('#update-form-phone').val($(this).data('phone'));
        $('#update-form-login').val($(this).data('login'));
        $('#update-form-role').val($(this).data('role'));
        $('#update-form-email').val($(this).data('email'));
        $('#update-form-password').val($(this).data('password'));
        $('#update-form-type-user').val($(this).data('type-user'));
    });

    $('.user-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#update-form-user').serializeArray();

        $.ajax({
            url: getRole(window.location.pathname) + '/update-user/' + dataArr[0].value,
            type: 'put',
            data: dataArr,
            success: function () {
                $('.in .close').click();

                showSuccessAlert('Редагування користувача пройшло успішно.');

                var idr = "#idr-user-" + dataArr[0].value;

                $(idr).empty();

                var newUserInfo = '' +
                    '<th class="tac" scope="row">' + dataArr[0].value + '</th>' +
                    '<td class="pr">' +
                    '<div class="col-lg-4"><strong>Прізвище Ім\'я: </strong>' + dataArr[3].value + ' ' + dataArr[2].value + '</div>' +
                    '<div class="col-lg-4"><strong>Адреса: </strong>' + dataArr[5].value + '</div>' +
                    '<div class="col-lg-4"><strong>Логін: </strong>' + dataArr[7].value + '</div>' +
                    '<div class="col-lg-4"><strong>Контактний номер: </strong>' + dataArr[6].value + '</div>' +
                    '<div class="col-lg-4"><strong>Email: </strong>' + dataArr[8].value + '</div>' +
                    '<div class="col-lg-4"><strong>Пароль: </strong>' + dataArr[10].value + '</div>' +
                    '<div class="col-lg-4"><strong>Компанія: </strong>' + dataArr[4].value + '</div>' +
                    '<div class="col-lg-4"><strong>Роль: </strong>' + getRoleName(dataArr[9].value) + '</div>' +
                    '</td><td class="tac">';

                var newUserEditButton = '' +
                    '<a href="#" class="update-user modal-window-link" data-toggle="modal" data-target="#updateUserFormModal" title="Редагувати користувача"' +
                    ' data-id="' + dataArr[0].value + '"' +
                    ' data-name="' + dataArr[2].value + '"' +
                    ' data-surname="' + dataArr[3].value + '"' +
                    ' data-company="' + dataArr[4].value + '"' +
                    ' data-address="' + dataArr[5].value + '"' +
                    ' data-phone="' + dataArr[6].value + '"' +
                    ' data-login="' + dataArr[7].value + '"' +
                    ' data-email="' + dataArr[8].value + '"' +
                    ' data-role="' + dataArr[9].value + '"' +
                    ' data-password="' + dataArr[10].value + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px;"/></a>';

                var newUserDeleteButton = '' +
                    '<a href="#" class="delete-user modal-window-link" data-toggle="modal" data-target="#deleteUserFormModal" title="Видалити користувача"' +
                    ' data-id="' + dataArr[0].value + '"' +
                    ' data-user-name="' + dataArr[2].value + '"' +
                    ' data-user-surname="' + dataArr[3].value + '">' +
                    '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="margin-top: 15px; font-size: 19px;"/></a>';

                if (dataArr[1].value === '1') {
                    if (dataArr[9].value !== '1') {
                        $(idr).append(newUserInfo + newUserEditButton + newUserDeleteButton + '</td>');
                    } else {
                        $(idr).append(newUserInfo + newUserEditButton + '</td>');
                    }
                } else {
                    if (dataArr[9].value !== '1') {
                        $(idr).append(newUserInfo + newUserEditButton + '</td>');
                    } else {
                        $(idr).append(newUserInfo + '<td></td>');
                    }
                }

                deleteUser(idr + ' .delete-user');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteUser('.delete-user');

    function deleteUser(value) {
        $(value).on('click', function () {
            $('.submit-delete-user').attr('data-user-id', $(this).data('id'));
            $('#delete-form-surname-name').html($(this).data('user-name') + " " + $(this).data('user-surname'));
        });
    }

    $('.submit-delete-user').on('click', function () {
        var userID = $(this).data('user-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-user/' + userID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення користувача пройшло успішно.');

                var idr = "#idr-user-" + userID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        })
    });

    function getRoleName(value) {
        switch (value) {
            case "1":
                return 'Адміністратор';
                break;
            case "2":
                return 'Менеджер';
                break;
            case "3":
                return 'Інженер';
                break;
            case "4":
                return 'Зав. складом';
                break;
            case "5":
                return 'Клієнт';
                break;
            case "6":
                return 'Бухгалтер';
                break;
        }
    }

    $('#createUserFormModal input.bfh-phone').keypress(function () {
        let phone = $('#createUserFormModal input.bfh-phone').val();
        let password = $('input[name=userLogin]');
        let login = $('input[name=userPassword]');
        password.val(phone);
        login.val(phone);
    })

    /**
     * check field user create form and if is valid, send data to server
     */
    $('#create-user-button').on('click', (event) => {
        event.preventDefault();
        var user = {
            userCompanyName: "",
            userSurname: "",
            userName: "",
            userPhone: "",
            userTypeID: "",
            userLogin: "",
            userPassword: "",
            userEmail: "",
            userAddress: ""
        };
        var inputElements = $('#create-user-form').find('input');
        user.userTypeID = $('select[name="userTypeID"]').val();
        for (var i = 0; i < inputElements.length; i++) {
                        user[inputElements[i].getAttribute('name')] = inputElements[i].value;
        }
        createUser(user)
    });

    /**
     * send user create data to server
     * @param user
     */
    var createUser = (user) => {
        $.ajax({
            url: getRole(window.location.pathname) + '/create-user',
            type: 'post',
            data: user,
            success: function () {
                showSuccessAlert('Створення користувача пройшло успішно.');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            },
            error: function (err) {
                // $('.in .close').click();
                showErrorAlert(err);
            }
        })
    }

});
