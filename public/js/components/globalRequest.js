$(document).ready(function () {

    $('.global-task-type-select').val('');

    $('[data-toggle="popover"]').popover();

    $('#create_task_request').on('click', function () {

        var dataArr = $('#createRequestForm').serializeArray();

        if (dataArr[0].value === '') {
            dataArr[0].value = dataArr[1].value;
        }

        $.ajax({

            url: window.location.pathname,
            type: 'post',
            data: dataArr,
            success: function () {
                window.location.replace('/admin/requests');
            },
            error: function (err) {
                showErrorAlert(err);
            }
        })
    });

    $('#model').on('change', function () {

        $.ajax({
            url: getRole(window.location.pathname) + '/get-task-types',
            type: 'post',
            data: {
                carMarkk: $('#markk').val(),
                carModel: $('#model').val()
            },
            success: function (data) {
                $('#global-task-type-select').find('option:not(:first)').remove();

                $.each(data.taskTypes, function (i, item) {

                    $('#global-task-type-select').append($('<option>', {
                        value: item.typeName,
                        text: item.typeName,
                        globalTaskTypeID: item.id,
                        id: 'globalTaskTypeID' + item.typeName
                    }));
                });
                $("#global-task-type-select").selectpicker("refresh");
                $('.global-task-type-select').val('');
            }
        });

    });

    $('#global-task-type-select').on('change', function () {

        if ($(this).val() === 'new task') {
            $('.task-cost').val('');
            $('.global-task-type-select').addClass("hidden");
            $('.global-task-type-input').removeClass("hidden");
        } else {

            var taskTypeID = $('#globalTaskTypeID' + $('.global-task-type-select').serializeArray()[0].value).attr('globalTaskTypeID');

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + taskTypeID,
                type: 'post',
                data: $('.global-task-type-select').serializeArray(),
                success: function (data) {
                    $('.task-cost').val(data.taskTypeCost);
                }
            })
        }

    });
});