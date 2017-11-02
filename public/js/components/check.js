$(document).ready(function () {

    $('.print_check_button').on('click', function () {

        changeModalView($(this));

        window.scrollTo(0,0);
        $('#number-or-request').text($(this).data('request-id'));
        $('#customer-phone').text($(this).data('customer-phone'));

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + $(this).data('request-id'),
            type: 'get',
            success: function (data) {
                $('#start-date').text(formatDate(data.request[0].startTime));
                $('#end-date').text(formatDate(data.request[0].estimatedTime));
                $('#all-sum').text(data.request[0].cost);
            }
        })
    });

    $('#agree-print-check').on('click', function () {

        if($('#checkbox-print').is(':checked')) {
            window.print();
        }
    });

    $('#print_check_update_request').on('click', function () {

        window.scrollTo(0,0);
        var requestID = window.location.pathname.split('/')[4];

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + requestID,
            type: 'get',
            success: function (data) {
                $('#number-or-request').text(data.request[0].id);
                $('#customer-phone').text($('#print_check_update_request').attr('customer-phone'));
                $('#start-date').text(formatDate(data.request[0].startTime));
                $('#end-date').text(formatDate(data.request[0].estimatedTime));
                $('#all-sum').text(data.request[0].cost);
            }
        })
    });

    //handler for start request
    $('#start_and_print_request').on('click', function () {
        var requestID = $(this).data('request-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/start-request/' + requestID,
            type: 'put',
            success: function () {
                $('#start_and_print_request').hide();
                showSuccessAlert("Замовлення почато.");
            },
            error: function () {
                showErrorAlert("Помилка при початку замовлення.");
            }
        })
    });

    /*$('#print_check_global').on('click', function () {

        window.scrollTo(0,0);
        $('#number-or-request').text($(this).data('request-id'));
        $('#customer-phone').text($(this).data('customer-phone'));

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + $(this).data('request-id'),
            type: 'get',
            success: function (data) {

                $('#start-date').text(formatDate(data.request[0].startTime));
                $('#end-date').text(formatDate(data.request[0].estimatedTime));
                $('#all-sum').text(data.request[0].cost);
                $('#customer-phone').text($('#print_check_update_request').attr('customer-phone'));
                $('.check-table tr:last').before('<tr id="idt-' + data.request.id + '">'+
                    '<td>'+data.request[0].name+'</td>'+
                    '<td class="tac">'+data.request[0].cost+'</td>'+
                    '<td>'+$("#needBuyParts").val()+'</td>'+
                    '<td class="tac"></td>'+
                    '</tr>');
            }
        })
    });*/

    printOnClick();
});

function printOnClick() {
    $('.set_payed_true').on('click', function () {
        $('#agree-print-check')
            .attr('request-id', $(this).data('request-id'))
            .attr('payed', $(this).data('payed'));

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + $(this).data('request-id'),
            type: 'get',
            success: function (data) {
                $('#number-or-request').text($('.set_payed_true').data('request-id'));
                $('#customer-phone').text(data.customerPhone);
                $('#start-date').text(formatDate(data.request[0].startTime));
                $('#end-date').text(formatDate(data.request[0].estimatedTime));
                $('#all-sum').text(data.request[0].cost);
                $(".check-table").find("tr:gt(0):not(:last)").remove();

                for (var i = 0; i < data.tasks.length; i++) {
                    $('.check-table tr:last').before('<tr id="idt-' + data.tasks[i].id + '">'+
                        '<td>'+data.tasks[i].name+'</td>'+
                        '<td class="tac">'+data.tasks[i].cost+'</td>'+
                        '<td>'+data.tasks[i].needBuyParts+'</td>'+
                        '<td class="tac"></td>'+
                        '</tr>');
                }
            }
        })
    })
}

function changeModalView(sourceButton) {
    var sourceButtonID = sourceButton.attr('id');
    var goalButton = $('#agree-print-check');

    if (sourceButtonID==='start_and_print_request') {
        $('.checkbox-block').hide();
        goalButton.text('Друкувати');
    } else {
        goalButton.text('Підтвердити');
        $('.checkbox-block').show();
    }
}