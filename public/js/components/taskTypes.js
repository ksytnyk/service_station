$(document).ready(function () {

    $('#task-type-select').on('change', function () {

        if($(this).val() !== null) {
            var dataArr = $('.task-type-select').serializeArray();
            var taskTypeName = $('#taskTypeID' + dataArr[0].value).attr('taskTypeID');
            dataArr[0].value = taskTypeName;

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.task-type-select').serializeArray()[0].value,
                type: 'post',
                data: dataArr,
                success: function (data) {
                    $('.task-cost').val(data.taskType.cost);
                    $('.task-estimation-time').val(data.taskType.estimationTime);
                    $('.task-planed-executor-id').val(data.taskType.planedExecutorID).change();
                }
            })
        }
    });

    $('#update-form-task-type-select').on('change', function () {

        if($(this).val() !== null) {
            var dataArr = $('.update-form-task-type-select').serializeArray();
            var taskTypeName = $('#updateTaskTypeID' + dataArr[0].value).attr('updateTaskTypeID');
            dataArr[0].value = taskTypeName;

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.update-form-task-type-select').serializeArray()[0].value,
                type: 'post',
                data: dataArr,
                success: function (data) {
                    if (!isFirstUpdateClick) {
                        $('#update-form-task-cost').val(data.taskType.cost);
                        $('#update-form-task-estimation-time').val(data.taskType.estimationTime);
                        $('#update-form-task-planed-executor').val(data.taskType.planedExecutorID).change();
                    } else {
                        isFirstUpdateClick = false;
                    }
                }
            })
        }
    });

    $('.add-new-task-type-button').on('click', function () {
        $('#create_new_task .select2').addClass("hidden");
        $('#create_new_task .input-group').addClass("hidden");
        $('.task-type-input').removeClass("hidden");
        $('.task-cost').val('');
        $('.task-estimation-time').val('');
        $('.task-planed-executor-id').val('');
    });

    $('#task-type-select').on('select2:closing',function () {
        $('.task-type-input').val($('.select2-search__field')[0].value);
    });

    $('.update-add-new-task-type-button').on('click', function () {
        $('#update_new_task .select2').addClass("hidden");
        $('#update_new_task .input-group').addClass("hidden");
        $('.update-form-task-type-input').removeClass("hidden");
        $('#update-form-task-cost').val('');
        $('#update-form-task-estimation-time').val('');
        $('#update-form-task-planed-executor').val('');
    });

    $('#update-form-task-type-select').on('select2:closing',function () {
        $('.update-form-task-type-input').val($('.select2-search__field')[0].value);
    });

});

var isFirstUpdateClick = false;