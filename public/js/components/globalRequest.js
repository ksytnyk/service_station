$(document).ready(function () {

    $('.global-task-type-select').val('');
    $('[data-toggle="popover"]').popover();

    $('#create_task_request').on('click', function () {
        if ( $('#global-task-type-select').serializeArray()[0] ) {
            var taskTypeID = $('#global-task-type-select').serializeArray()[0].value;
        }

        var dataArr = $('#createRequestForm').serializeArray();
        var taskTypeName = $('#globalTaskTypeID' + taskTypeID).attr('globalTaskTypeID');

        if (dataArr[3].value === '') {
            dataArr[3].value = taskTypeName;
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

    $('#markk').on('change', function () {
        $("#global-task-type-select option").remove();
        $('#global_request_name .select2').removeClass("hidden");
        $('.global-task-type-input').addClass("hidden");
    });

    $('#model').on('change', function () {
        $("#global-task-type-select option").remove();
        $('#global_request_name .select2').removeClass("hidden");
        $('.global-task-type-input').addClass("hidden");

        $.ajax({
            url: getRole(window.location.pathname) + '/get-task-types',
            type: 'post',
            data: {
                carMarkk: $('#markk').val(),
                carModel: $('#model').val()
            },
            success: function (data) {
                $('#global-task-type-select').append('<option value="new task">Додати нове замовлення</option>');

                $.each(data.taskTypes, function (i, item) {
                    $('#global-task-type-select').append($('<option>', {
                        value: item.id,
                        text: item.typeName,
                        globalTaskTypeID: item.typeName,
                        id: 'globalTaskTypeID' + item.id
                    }));
                });
                $('.global-task-type-select').val('').select2();
            }
        });
    });

    $('#global-task-type-select').on('change', function () {

        if ($(this).val() === 'new task') {
            $('.task-cost').val('');
            $('#global_request_name .select2').addClass("hidden");
            $('.global-task-type-input').removeClass("hidden");
        } else {

            var dataArr = $('#global-task-type-select').serializeArray();
            var taskTypeName = $('#globalTaskTypeID' + dataArr[0].value).attr('globalTaskTypeID');
            dataArr[0].value = taskTypeName;

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('#global-task-type-select').serializeArray()[0].value,
                type: 'post',
                data: dataArr,
                success: function (data) {
                    $('.task-cost').val(data.taskTypeCost);
                }
            })
        }
    });
});