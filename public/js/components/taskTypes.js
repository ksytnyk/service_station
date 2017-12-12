$(document).ready(function () {

    $('#task-type-select').on('change', function () {

        if ($(this).val() !== null) {
            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.task-type-select').val(),
                type: 'post',
                success: function (data) {
                    $('.task-cost').val(data.taskType[0].cost);
                    $('.task-estimation-time').val(data.taskType[0].estimationTime);
                    $('.task-planed-executor-id').val(data.taskType[0].planedExecutorID).change();
                }
            })
        }
    });

    $('#update-form-task-type-select').on('change', function () {

        if ($(this).val() !== null) {
            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + $('.update-form-task-type-select').val(),
                type: 'post',
                success: function (data) {
                    if (!isFirstUpdateClick) {
                        $('#update-form-task-cost').val(data.taskType[0].cost);
                        $('#update-form-task-estimation-time').val(data.taskType[0].estimationTime);
                        $('#update-form-task-planed-executor').val(data.taskType[0].planedExecutorID).change();
                    } else {
                        isFirstUpdateClick = false;
                    }
                }
            })
        }
    });

    var searchVariable = '';

    $('.add-new-task-type-button').on('click', function () {
        $('#create_new_task .select2').addClass("hidden");
        $('#create_new_task .input-group').addClass("hidden");
        $('.task-type-input').removeClass("hidden");
        $('.task-cost').val('');
        $('.task-estimation-time').val('');
        $('.task-planed-executor-id').val('').change();
        $('.task-type-input').val(searchVariable);
        searchVariable = '';
    });

    $('#task-type-select').on('select2:closing',function () {
        searchVariable = $('.select2-search__field')[0].value;
    });

    $('.update-add-new-task-type-button').on('click', function () {
        $('#update_new_task .select2').addClass("hidden");
        $('#update_new_task .input-group').addClass("hidden");
        $('.update-form-task-type-input').removeClass("hidden");
        if (getRole(window.location.pathname) === '/admin') {
            $('#update-form-task-cost').val('');
        }
        $('#update-form-task-estimation-time').val('');
        $('#update-form-task-planed-executor').val('').change();
        $('.update-form-task-type-input').val(searchVariable);
        searchVariable = '';
    });

    $('#update-form-task-type-select').on('select2:closing',function () {
        searchVariable = $('.select2-search__field')[0].value;
    });

});

var isFirstUpdateClick = false;