$(document).ready(function () {

    $('#agree-print-check').on('click', function () {


        if ($('#checkbox-print').is(':checked')) {
            window.onafterprint = () => {
                let el = document.querySelector("#print_check");
                window.document.querySelector("#print-content").appendChild(el);
            };
            var doc = document.getElementById('print_check');
            window.document.body.appendChild(doc);
            window.scrollTo(0, 0);
            window.print();
        }
    });


    printOnClick('.print_check_button');

    // handler for start request
    $('#start_and_print_request').on('click', function () {
        var requestID = $(this).attr('request-id');

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
});

function printOnClick(value) {
    $(value).on('click', function () {

        var requestID;

        if (window.location.pathname.includes('update-request')) {
            requestID = window.location.pathname.split('/')[4];
        }
        else if (window.location.pathname.includes('create-request')) {
            requestID = $(this).attr('request-id');
        }
        else {
            requestID = $(this).data('request-id');

            $('#agree-print-check')
                .attr('request-id', $(this).data('request-id'))
                .attr('payed', $(this).data('payed'));
        }

        $.ajax({
            url: getRole(window.location.pathname) + '/get-request-check/' + requestID,
            type: 'get',
            success: function (data) {

                $('#number-or-request').text(data.request[0].id);
                $('#request-name').text(data.request[0].name);
                $('#request-description').text(data.request[0].description);
                $('#request-comment').text(data.request[0].comment);
                $('#client-name').text(data.request[0].user.userName + " " + data.request[0].user.userSurname);
                $('#customer-phone').text($('.print_check_button').attr('customer-phone'));
                $('#start-date').text(formatDate(data.request[0].startTime));
                $('#end-date').text(formatDate(data.request[0].estimatedTime));
                $('#car-type').text(data.request[0].transport_type.transportTypeName);
                $('#car-model').text(data.request[0].transport_model.transportModelName);
                $('#car-mark').text(data.request[0].transport_markk.transportMarkkName);

                $('.check-table tbody').empty();


                var summaryDetailsCost = 0,
                    summaryTasksCost = 0;

                data.tasks.forEach(task => {

                    var detailsCost = 0,
                        detailsClient = '',
                        detailsService = '';
                    summaryTasksCost += task.cost;

                    task.taskDetails.forEach(taskDetail => {
                        if (taskDetail.detailType === 2) {
                            detailsClient += taskDetail.detail.detailName + '-' + taskDetail.detailQuantity + ', ';

                        }
                        else {
                            detailsCost += (taskDetail.detail.detailPrice * taskDetail.detailQuantity);
                            detailsService += taskDetail.detail.detailName + '-' + taskDetail.detailQuantity + ', ';
                        }
                    });

                    detailsClient = detailsClient.slice(0, (detailsClient.length - 2));
                    detailsService = detailsService.slice(0, (detailsService.length - 2));

                    summaryDetailsCost += detailsCost;

                    $('.check-table tbody').append('<tr>' +
                        '<td>' +
                        '<p><label>Назва:</label>' + task.name + '</p>' +
                        '<p><label>Виконавець:</label>' + task.assignedUser.userName + ' ' + task.assignedUser.userSurname + '</p>' +
                        '<p><label>Час виконання:</label>' + task.estimationTime + '</p>' +
                        '<p><label>Початок:</label>' + formatDate(task.startTime) + '</p>' +
                        '<p><label>Кінець:</label>' + formatDate(task.endTime) + '</p>' +
                        '</td>' +
                        '<td class="tac">' + task.cost + '</td>' +
                        '<td><p class="detail-service"><strong>Сервіс: </strong>' + detailsService + '</p><p><strong>Клієнт: </strong>' + detailsClient + '</p></td>' +
                        '<td class="tac vat">' + detailsCost + '</td>' +
                        '</tr>');

                });

                $('.check-table tbody').append('<tr>' +
                    '<th class="tar">Разом:</th>' +
                    '<td class="tac" id="all-sum">' + summaryTasksCost + '</td>' +
                    '<th class="tar">Разом:</th>' +
                    '<td class="tac" id="components-sum">' + summaryDetailsCost + '</td></tr>');
            }
        })
    });


}