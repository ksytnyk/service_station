$(document).ready(function () {

    $('#task-type-select').on('change', function () {

        if ($(this).val() === 'new task') {
            $('.task-cost').val('');
            $('.task-type-select').addClass("hidden");
            $('.task-type-input').removeClass("hidden");
        } else {

            var taskTypeID = $('#taskTypeID' + $('.task-type-select').serializeArray()[0].value).attr('taskTypeID');

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + taskTypeID,
                type: 'POST',
                data: $('.task-type-select').serializeArray(),
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
            $('.update-form-task-type-input').removeClass("hidden");
        } else if ($(this).val() === null) {
        } else {

            var taskTypeID = $('#updateTaskTypeID' + $('.update-form-task-type-select').serializeArray()[0].value).attr('updateTaskTypeID');

            $.ajax({
                url: getRole(window.location.pathname) + '/get-task-prise/' + taskTypeID,
                type: 'POST',
                data: $('.update-form-task-type-select').serializeArray(),
                success: function (data) {
                    $('#update-form-task-cost').val(data.taskTypeCost);
                }
            })
        }
    });

});