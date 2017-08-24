$(document).ready(function () {

    if (window.location.pathname.includes('chart')) {
        var toDate = new Date();
        var fromDate = new Date();

        fromDate.setDate(toDate.getDate() - 30);
        $('#from-date-for-statistic').val(formatDate(fromDate));
        $('#to-date-for-statistic').val(formatDate(toDate));
        setTimeout(() => {
            $('#chart-finances').click();
        }, 1);
    }


    $('#chart-request').on('click', function () {

        var data = $('#between-dates').serializeArray();

        var backgroundColor = [
            'rgba(255, 165, 0, 0.4)',
            'rgba(51, 122, 183, 0.4)',
            'rgba(0, 128, 0, 0.4)',
            'rgba(0, 0, 0, 0.25)'
        ];

        var borderColor = [
            'rgba(255, 165, 0, 1)',
            'rgba(51, 122, 183, 1)',
            'rgba(0, 128, 0, 1)',
            'rgba(0, 0, 0, 0.4)'
        ];

        var labels = ["Очікується", "Виконується", "Виконано", "Анульовано"];

        $.post("/admin/chart/requests", data, function (result) {
            // $('#statistic-table').html(tableData);
            $('#div-for-chart').empty();
            $('#div-for-chart').append('<canvas id="myChart" height="125"></canvas>');
            var ctx = document.getElementById("myChart").getContext('2d');

            Chart.defaults.global.defaultFontColor = '#333';
            Chart.defaults.global.defaultFontSize = 14;

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Статус',
                        data: result.data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                fixedStepSize: 1,
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        fontSize: 16,
                        padding: 25,
                        fontColor: '#333',
                        text: "Статистика замовлень"
                    }
                }
            });
        });
    });

    $('#chart-tasks').on('click', function () {
        var data = $('#between-dates').serializeArray();

        $.post("/admin/chart/tasks", data, function (result) {

            var template = '' +
                '<h4>Статистика виконання задач</h4>' +
                '<div class="panel panel-default">' +
                '<table class="table">' +
                '<thead>' +
                '<tr>' +
                '<th class="md tac">ID</th>' +
                '<th class="tac">Прізвище та ім\'я</th>' +
                '<th class="tac status status-bgc-pending">Очікується</th>' +
                '<th class="tac status status-bgc-processing">Виконується</th>' +
                '<th class="tac status status-bgc-done">Виконано</th>' +
                '<th class="tac status status-bgc-hold">Зупинено</th>' +
                '<th class="tac status status-bgc-canceled">Анульовано</th>' +
                '<th class="tac status">Прибуток</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            var templateArr = result.data.map(item => {
                return (
                    '<tr>' +
                    '<th class="tac">' + item.id + '</th>' +
                    '<td class="tac" class="tac">' + item.userSurname + ' ' + item.userName + '</td>' +
                    '<td class="tac status-bgc-pending">' + item.task.statuses[0] + '</td>' +
                    '<td class="tac status-bgc-processing">' + item.task.statuses[1] + '</td>' +
                    '<td class="tac status-bgc-done">' + item.task.statuses[2] + '</td>' +
                    '<td class="tac status-bgc-hold">' + item.task.statuses[3] + '</td>' +
                    '<td class="tac status-bgc-canceled">' + item.task.statuses[4] + '</td>' +
                    '<td class="tac">' + item.task.cost + ' грн</td>' +
                    '</tr>'
                );
            });

            var template1 = '';
            for (var i = 0; i < templateArr.length; i++) {
                template1 += templateArr[i];
            }

            var template2 = '' +
                '</tbody>' +
                '</table>' +
                '</div>';

            $('#div-for-chart').empty().append( template + template1 + template2 );
        });
    });

    $('#chart-finances').on('click', function () {

        var data = $('#between-dates').serializeArray();

        $.post("/admin/chart/finances", data, function (result) {
            if (result.data === undefined ) {
                showErrorAlert({responseJSON: {
                        errors: [{msg: 'Неправильний порядок дат.'}]
                    }});
                return;
            }

            $('#div-for-chart').empty();
            $('#div-for-chart').append('<canvas id="myChart" height="125"></canvas>');
            var ctx = document.getElementById("myChart").getContext('2d');

            Chart.defaults.global.defaultFontColor = '#333';
            Chart.defaults.global.defaultFontSize = 14;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: result.data.dates,
                    datasets: [{
                        label: 'Всього',
                        data: result.data.money,
                        backgroundColor: 'transparent',
                        borderColor: '#398439',
                        pointRadius: 4,
                        pointBackgroundColor: '#5dd65d'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                fixedStepSize: 100,
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        fontSize: 16,
                        padding: 25,
                        fontColor: '#333',
                        text: "Фінансова статистика"
                    },
                    elements: {
                        line: {
                            tension: 0
                        }
                    }
                }
            });
        });
    });
});




