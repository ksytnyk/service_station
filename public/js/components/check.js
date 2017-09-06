$(document).ready(function () {

    $('#print_check').on('click', function () {

        $('#number-or-request').text($(this).data('request-id'));
        $('#customer-phone').text($(this).data('customer-phone'));
        /*$('#start-date').text($('#startDate')[0].value);
        $('#end-date').text($('#endDate')[0].value);*/

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + $(this).data('request-id'),
            type: 'get',
            success: function (data) {
                console.log(data.request);
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
    })

});