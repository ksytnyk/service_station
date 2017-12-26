$(document).ready(function () {

    updateDetail('.update-detail');

    function updateDetail(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-detail-name').val($(this).data('detail-name'));
            if ($(this).data('transport-type-id')) {
                $("#typeOfCar #" + $(this).data('transport-type-id')).attr('selected', true);
                $("#typeOfCar").change();
            }
            $("#typeOfCar").val($(this).data('transport-type-id')).select2();

            if ($(this).data('transport-markk-id') !== '') {
                $("#markk").empty().append("<option value='" + $(this).data('transport-markk-id') + "'>" + $(this).data('transport-markk-name') + "</option>");
            }
            if ($(this).data('transport-model-id')) {
                $("#model").empty().append("<option value='" + $(this).data('transport-model-id') + "'>" + $(this).data('transport-model-name') + "</option>");
            }

            $('#update-form-detail-price').val($(this).data('detail-price'));
        });
    }

    $('.detail-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#detail-update-form').serializeArray();

        $.ajax({
            url: getRole(window.location.pathname) + '/update-detail/' + dataArr[0].value,
            type: 'put',
            data: dataArr,
            success: function (data) {
                showSuccessAlert('Редагування деталі пройшло успішно.');

                if (data.detail.transportType === null) {
                    data.detail.transportType = {
                        transportTypeName: ''
                    }
                }
                if (data.detail.transportMarkk === null) {
                    data.detail.transportMarkk = {
                        transportMarkkName: ''
                    }
                }
                if (data.detail.transportModel === null) {
                    data.detail.transportModel = {
                        transportModelName: ''
                    }
                }

                $('.in .close').click();

                var idr = "#idr-detail-" + dataArr[0].value;
                var newDetail,
                    newDetail1 = '',
                    newDetail2 = '</td>';

                newDetail = '' +
                    '<th class="tac" scope="row">' + data.detail.id + '</th>' +
                    '<td class="tac">' + data.detail.detailName + '</td>' +
                    '<td class="tac">' + data.detail.transportType.transportTypeName + '</td>' +
                    '<td class="tac">' + data.detail.transportMarkk.transportMarkkName + '</td>' +
                    '<td class="tac">' + data.detail.transportModel.transportModelName + '</td>' +
                    '<td class="tac">' + data.detail.detailPrice + '</td>' +
                    '<td class="tac">' +
                    '<a href="#" class="update-detail modal-window-link"' +
                    ' data-toggle="modal" data-target="#updateDetailFormModal" title="Редагувати деталь"' +
                    ' data-id="' + data.detail.id + '"' +
                    ' data-detail-name="' + data.detail.detailName + '"' +
                    ' data-transport-markk-name="' + data.detail.transportMarkk.transportMarkkName + '"' +
                    ' data-transport-model-name="' + data.detail.transportModel.transportModelName + '"' +
                    ' data-transport-type-id="' + data.detail.transportType.id + '"' +
                    ' data-transport-markk-id="' + data.detail.transportMarkk.id + '"' +
                    ' data-transport-model-id="' + data.detail.transportModel.id + '"' +
                    ' data-detail-price="' + data.detail.detailPrice + '">' +
                    '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
                    '</a>';

                if (getRole(window.location.pathname) === '/admin') {
                    newDetail1 =  '<a href="#" class="delete-detail modal-window-link" ' +
                        ' data-toggle="modal" data-target="#deleteDetailFormModal" title="Видалити деталь"' +
                        ' data-id="' + dataArr[0].value + '">' +
                        '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/>' +
                        '</a>';
                }

                $(idr).empty().append(newDetail + newDetail1 + newDetail2);

                updateDetail(idr + ' .update-detail');
                deleteDetail(idr + ' .delete-detail');
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    deleteDetail('.delete-detail');

    function deleteDetail(value) {
        $(value).on('click', function () {
            $('#delete-detail-button').attr('detail-id', ($(this).data('id')));
            $('#delete-detail-id').html($(this).data('id'));
        });
    }

    $('#delete-detail-button').on('click', function () {

        var detailID = $(this).attr('detail-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-detail/' + detailID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення деталі пройшло успішно.');

                $('.in .close').click();
                var idr = "#idr-detail-" + detailID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });

    $('#add-detail').on('click', function () {

        var detailID = $('#detail-type-select').val(),
            detailQuantity = $('#detail-type-input').val(),
            detailType = $('#detail-type').val(),
            detailName = $('#detailTypeID' + detailID).attr('detailName'),
            detailTypeName;

        if (+detailType === 1) {
            detailTypeName = 'Сервіс'
        }
        else if (+detailType === 2) {
            detailTypeName = 'Клієнт'
        }
        else {
            detailTypeName = 'Відсутня'
        }

        if( detailID !== null && detailQuantity !== '' && detailType !== null) {

            defaultDetailArray.push({
                detailID: +detailID,
                detailQuantity: +detailQuantity,
                detailType: detailType,
                detailName: detailName
            });

            $('#detail-type-tbody').append('<tr><td>' + detailName + '</td><td>' + detailTypeName + '</td><td>' + detailQuantity + '</td></tr>');
            $('#detail-type-select').val('').change();
            $('#detail-type').val('').change();
            $('#detail-type-input').val('');
        }
    });

    $('#update-add-detail').on('click', function () {

        var detailID = $('#update-detail-type-select').val(),
            detailType = $('#update-detail-type').val(),
            detailQuantity = $('#update-detail-type-input').val(),
            detailName = $('#detailTypeID' + detailID).attr('detailName'),
            detailTypeName;

        if (+detailType === 1) {
            detailTypeName = 'Сервіс'
        }
        else if (+detailType === 2) {
            detailTypeName = 'Клієнт'
        }
        else {
            detailTypeName = 'Відсутня'
        }

        if ( detailID !== null && detailQuantity !== '' && detailType !== null) {

            defaultDetailArray.push({
                detailID: +detailID,
                detailQuantity: +detailQuantity,
                detailType: detailType,
                detailName: detailName
            });

            $('#update-detail-type-tbody').append('<tr><td>' + detailName + '</td><td>' + detailTypeName + '</td><td>' + detailQuantity + '</td></tr>');
            $('#update-detail-type-select').val('').change();
            $('#update-detail-type').val('').change();
            $('#update-detail-type-input').val('');
        }
    });
});

var defaultDetailArray = [];