$(document).ready(function () {

    $('.global-task-type-select').val('');
    $('[data-toggle="popover"]').popover();

    $('#create_task_request').on('click', function () {

        var dataArr = $('#createRequestForm').serializeArray();

        if ($('#global-task-type-select').serializeArray()[0]) {
            var taskTypeID = $('#global-task-type-select').serializeArray()[0].value;
            var taskTypeName = $('#globalTaskTypeID' + taskTypeID).attr('globalTaskTypeID');
            if (dataArr[3].value === '') {
                dataArr[3].value = taskTypeName;
            }
        }
        if (dataArr.length === 15) {
            dataArr[5].value = setTimeToDate(dataArr[5].value);
        } else {
            dataArr[6].value = setTimeToDate(dataArr[6].value);
        }

        $.ajax({
            url: window.location.pathname,
            type: 'post',
            data: dataArr,
            success: function (data) {

                showSuccessAlert('Додавання замовлення пройшло успішно.');

                $('#print_check_global')
                    .attr('data-request-id', data.request.id)
                    .attr('data-customer-phone', data.customer.userPhone)
                    .show();
                $('#create_task_request').hide();
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
        $('#global_request_name .input-group').removeClass("hidden");
    });

    $('#model').on('change', function () {
        $("#global-task-type-select option").remove();
        $('#global_request_name .select2').removeClass("hidden");
        $('.global-task-type-input').addClass("hidden");
        $('#global_request_name .input-group').removeClass("hidden");

        $.ajax({
            url: getRole(window.location.pathname) + '/get-task-types',
            type: 'post',
            data: {
                carMarkk: $('#markk').val(),
                carModel: $('#model').val()
            },
            success: function (data) {

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

        var dataArr = $(this).serializeArray();
        var taskTypeName = $('#globalTaskTypeID' + dataArr[0].value).attr('globalTaskTypeID');
        dataArr[0].value = taskTypeName;

        $.ajax({
            url: getRole(window.location.pathname) + '/get-task-prise/' + $('#global-task-type-select').serializeArray()[0].value,
            type: 'post',
            data: dataArr,
            success: function (data) {

                $('.task-cost').val(data.taskType.cost);
                $('.task-estimation-time').val(data.taskType.estimationTime);
                $('#planedExecutor').val(data.taskType.planedExecutorID).change();
            }
        })
    });

    $('.new-global-task-type').on('click', function () {
        $('#global_request_name .select2').addClass("hidden");
        $('.global-task-type-input').removeClass("hidden");
        $('#global_request_name .input-group').addClass("hidden");
    });

    $('#global-task-type-select').on('select2:closing', function () {
        $('.global-task-type-input').val($('.select2-search__field')[0].value);
    });
});