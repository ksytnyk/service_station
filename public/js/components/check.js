$(document).ready(function () {

    $('#print_check').on('click', function () {

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

    $('#print_check_global').on('click', function () {

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
    });

});