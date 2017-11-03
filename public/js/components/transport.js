$(document).ready(function () {

    /* ========================= TRANSPORT TYPE ===============*/
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
                showSuccessAlert('Редагування задачі пройшло успішно.');

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
                showSuccessAlert('Видалення задачі пройшло успішно.');

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
            markkName: markkName,
            typeID: typeID
        };

        console.log(dataArr, id);

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


});