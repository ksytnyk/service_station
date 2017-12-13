$(document).ready(function () {

    /* ========================= TRANSPORT TYPE ===============*/

    $('.transport-type-create-button').on('click', function () {
        if (!window.location.pathname.includes('create-request') && !window.location.pathname.includes('update-request')) {
            setTimeout(function () {
                location.reload();
            }, 500);
        }
    });

    updateTransportType('.update-transport-type');

    function updateTransportType(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-type-name').val($(this).data('type-name'));
        });
    }

    $('.transport-type-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#transport-type-update-form').serializeArray();

        $.ajax({
            url: getRole(window.location.pathname) + '/update-transport-type/' + dataArr[0].value,
            type: 'put',
            data: dataArr,
            success: function () {
                showSuccessAlert('Редагування типу транспорту пройшло успішно.');

                $('.in .close').click();

                var idr = "#idr-transport-type-" + dataArr[0].value;
                var newTransportType,
                    newTransportType1 = '',
                    newTransportType2 = '</td>';

                newTransportType = '' +
                    '<th class="tac" scope="row">' + dataArr[0].value + '</th>' +
                    '<td>' + dataArr[1].value + '</td>' +
                    '<td class="tac">' +
                    '<a href="#" class="update-transport-type modal-window-link"' +
                    ' data-toggle="modal" data-target="#updateTransportTypeFormModal" title="Редагувати тип транспорту"' +
                    ' data-id="' + dataArr[0].value + '"' +
                    ' data-type-name="' + dataArr[1].value + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px;"/>' +
                    '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newTransportType1 = '' +
                        '<a href="#" class="delete-transport-type modal-window-link"' +
                        ' data-toggle="modal" data-target="#deleteTransportTypeFormModal" title="Видалити тип транспорту"' +
                        ' data-id="' + dataArr[0].value + '"' +
                        ' data-type-name="' + dataArr[1].value + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"></span>' +
                        '</a>';
                }

                $(idr).empty().append(newTransportType + newTransportType1 + newTransportType2);

                updateTransportType(idr + ' .update-transport-type');
                deleteTransportType(idr + ' .delete-transport-type');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteTransportType('.delete-transport-type');

    function deleteTransportType(value) {
        $(value).on('click', function () {
            $('#delete-transport-type-button').attr('transport-type-id', ($(this).data('id')));
            $('#delete-transport-type-name').html($(this).data('type-name'));
        });
    }

    $('#delete-transport-type-button').on('click', function () {

        var transportTypeID = $(this).attr('transport-type-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-transport-type/' + transportTypeID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення типу транспорту пройшло успішно.');

                $('.in .close').click();
                var idr = "#idr-transport-type-" + transportTypeID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    /* ========================= TRANSPORT MARKK===============*/

    $('.transport-markk-create-button').on('click', function () {
        if (!window.location.pathname.includes('create-request') && !window.location.pathname.includes('update-request')) {
            setTimeout(function () {
                location.reload();
            }, 500);
        }
    });

    //disable input field for create markk
    $('#typeName').on('change', function () {
        if($('#typeName').find(":selected").val() !== '') {
            $('#markkName').prop("disabled", false);
        } else {
            $('#markkName').prop("disabled", true);
        }
    });

    $('.update-transport-markk').on('click', function () {
        var markkName = $(this).data('transport-markk-name');
        var typeID = +$(this).data('transport-type-id');
        var id = +$(this).data('id');
        $('#typeNameUpdate').val(typeID).select2();
        $('#markkNameUpdate').val(markkName);
        $('#transport-markk-id').val(id);
    });

    $('.transport-markk-update-button').on('click', function () {
        event.preventDefault();

        var typeID = $('#typeNameUpdate').find(":selected").val();
        var markkName = $('#markkNameUpdate').val();
        var id = +$('#transport-markk-id').val();

        var dataArr = {
            transportMarkkName: markkName,
            transportTypeID: typeID
        };

        $.ajax({
            url: getRole(window.location.pathname) + '/update-transport-markk/' + id,
            type: 'put',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Редагування марки пройшло успішно.');
                $('.in .close').click();

                var idr = "#idr-transport-markk-" + id;
                var newTransportMarkk,
                    newTransportMarkk1 = '',
                    newTransportMarkk2 = '</td>';

                newTransportMarkk = '' +
                    '<th class="tac" scope="row">' + id + '</th>' +
                    '<td>' + markkName + '</td>' +
                    '<td class="tac">' +
                    '<a href="#" class="update-transport-name modal-window-link"' +
                    ' data-toggle="modal" data-target="#updateTransportMarkkFormModal" title="Редагувати марку транспорту"' +
                    ' data-id="' + id + '"' +
                    ' data-type-name="' + markkName + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px;"/>' +
                    '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newTransportMarkk1 = '' +
                        '<a href="#" class="delete-transport-type modal-window-link"' +
                        ' data-toggle="modal" data-target="#deleteTransportTypeFormModal" title="Видалити марку транспорту"' +
                        ' data-id="' + id + '"' +
                        ' data-type-name="' + markkName + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"></span>' +
                        '</a>';
                }

                $(idr).empty().append(newTransportMarkk + newTransportMarkk1 + newTransportMarkk2);

                updateTransportType(idr + ' .update-transport-markk');
                deleteTransportType(idr + ' .delete-transport-markk');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        })
    });

    deleteTransportMarkk('.delete-transport-markk');

    function deleteTransportMarkk(value) {
        $(value).on('click', function () {
            $('#delete-transport-markk-button').attr('transport-markk-id', ($(this).data('id')));
            $('#delete-transport-markk-name').html($(this).data('markk-name'));
        });
    }

    $('#delete-transport-markk-button').on('click', function () {

        var transportMarkkID =  $(this).attr('transport-markk-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-transport-markk/' + transportMarkkID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення марки пройшло успішно.');

                $('.in .close').click();
                var idr = "#idr-transport-markk-" + transportMarkkID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    /* =============== TRANSPORT MODEL =============== */

    $('.transport-model-create-button').on('click', function () {
        if (!window.location.pathname.includes('create-request') && !window.location.pathname.includes('update-request')) {
            setTimeout(function () {
                location.reload();
            }, 500);
        }
    });

    updateTransportModel('.update-transport-model');

    function updateTransportModel(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#transportMarkkID').val($(this).data('markk-id')).select2();
            $('#update-form-model-name').val($(this).data('model-name'));
        });
    }

    $('.transport-model-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#transport-model-update-form').serializeArray();

        $.ajax({
            url: getRole(window.location.pathname) + '/update-transport-model/' + dataArr[0].value,
            type: 'put',
            data: dataArr,
            success: function () {
                showSuccessAlert('Редагування моделі транспорту пройшло успішно.');

                $('.in .close').click();

                var idr = "#idr-transport-model-" + dataArr[0].value;
                var newTransportType,
                    newTransportType1 = '',
                    newTransportType2 = '</td>';

                newTransportType = '' +
                    '<th class="tac" scope="row">' + dataArr[0].value + '</th>' +
                    '<td>' + dataArr[2].value + '</td>' +
                    '<td class="tac">' +
                    '<a href="#" class="update-transport-model modal-window-link"' +
                    ' data-toggle="modal" data-target="#updateTransportModelFormModal" title="Редагувати модель транспорту"' +
                    ' data-id="' + dataArr[0].value + '"' +
                    ' data-model-name="' + dataArr[2].value + '"' +
                    ' data-markk-id="' + dataArr[1].value + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px;"/>' +
                    '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newTransportType1 = '' +
                        '<a href="#" class="delete-transport-model modal-window-link"' +
                        ' data-toggle="modal" data-target="#deleteTransportModelFormModal" title="Видалити модель транспорту"' +
                        ' data-id="' + dataArr[0].value + '"' +
                        ' data-model-name="' + dataArr[2].value + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"></span>' +
                        '</a>';
                }

                $(idr).empty().append(newTransportType + newTransportType1 + newTransportType2);

                updateTransportModel(idr + ' .update-transport-model');
                deleteTransportModel(idr + ' .delete-transport-model');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteTransportModel('.delete-transport-model');

    function deleteTransportModel(value) {
        $(value).on('click', function () {
            $('#delete-transport-model-button').attr('transport-model-id', ($(this).data('id')));
            $('#delete-transport-model-name').html($(this).data('model-name'));
        });
    }

    $('#delete-transport-model-button').on('click', function () {

        var transportModelID = $(this).attr('transport-model-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-transport-model/' + transportModelID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення моделі транспорту пройшло успішно.');

                $('.in .close').click();
                var idr = "#idr-transport-model-" + transportModelID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });
});