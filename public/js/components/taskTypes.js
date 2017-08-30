$(document).ready(function () {

    $('#task-type-select').on('change', function () {

        if ($(this).val() === 'new task') {
            $('.task-cost').val('');
            $('.task-type-select').addClass("hidden");
            $('#create_new_task .select2').addClass("hidden");
            $('.task-type-input').removeClass("hidden");
        } else if ($(this).val() === null) {
        } else {

            var dataArr = $('.task-type-select').serializeArray();
            var taskTypeName = $('#taskTypeID' + dataArr[0].value).attr('taskTypeID');
            dataArr[0].value = taskTypeName;

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.task-type-select').serializeArray()[0].value,
                type: 'post',
                data: dataArr,
                success: function (data) {
                    $('.task-cost').val(data.taskTypeCost);
                }
            })
        }
    });

    $('#update-form-task-type-select').on('change', function () {

        if ($(this).val() === 'new task') {
            $('.update-form-task-cost').val('');
            $('.update-form-task-type-select').addClass("hidden");
            $('#update_new_task .select2').addClass("hidden");
            $('.update-form-task-type-input').removeClass("hidden");
        } else if ($(this).val() === null) {
        } else {

            var dataArr = $('.update-form-task-type-select').serializeArray();
            var taskTypeName = $('#updateTaskTypeID' + dataArr[0].value).attr('updateTaskTypeID');
            dataArr[0].value = taskTypeName;

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.update-form-task-type-select').serializeArray()[0].value,
                type: 'post',
                data: dataArr,
                success: function (data) {
                    if (!isFirstUpdateClick) {
                        $('#update-form-task-cost').val(data.taskTypeCost);
                    } else {
                        isFirstUpdateClick = false;
                    }
                }
            })
        }
    });

});

var isFirstUpdateClick = false;