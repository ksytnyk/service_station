$(document).ready(function () {

    if (window.location.pathname.includes('chart')) {
        var toDate = new Date();
        var fromDate = new Date();

        fromDate.setDate(toDate.getDate() - 30);
        $('#from-date-for-statistic').val(formatDate(fromDate));
        $('#to-date-for-statistic').val(formatDate(toDate));
        setTimeout(function () {
            $('#chart-finances').click();
        }, 1);
    }

    var lastChart = '';

    $(".datetimepickerN").on("dp.change", function () {
        $(lastChart).click();
    });

    $('#chart-request').on('click', function () {
        chartRequest();
        lastChart = '#chart-request';
    });

    $('#chart-tasks').on('click', function () {
        chartTasks();
        lastChart = '#chart-tasks';
    });

    $('#chart-finances').on('click', function () {
        chartFinances();
        lastChart = '#chart-finances';
    });

    function chartRequest() {
        var data = $('#between-dates').serializeArray();
        var newData = {
            fromDateChart: setTimeToDate(data[0].value),
            toDateChart: setTimeToDate(data[1].value)
        };

        if (checkSequence(newData)) {
            var pointBackgroundColor = [
                '#ffc927',
                '#43c743',
                '#bbbbbb'
            ];

            var borderColor = [
                '#eca323',
                '#398439',
                '#777777'
            ];

            var title = ["Нові замовлення", "Виконані замовлення", "Анульовані замовлення"];

            $.post("/admin/chart/requests", newData, function (result) {
                $('#div-for-chart').empty().append('<canvas id="myChart" height="42"></canvas>');
                $('#div-for-chart1').empty().append('<canvas id="myChart1" height="42"></canvas>');
                $('#div-for-chart2').empty().append('<canvas id="myChart2" height="42"></canvas>');

                var ctx = document.getElementById("myChart").getContext('2d');
                var ctx1 = document.getElementById("myChart1").getContext('2d');
                var ctx2 = document.getElementById("myChart2").getContext('2d');

                Chart.defaults.global.defaultFontColor = '#333';
                Chart.defaults.global.defaultFontSize = 14;

                new Chart(ctx, setChart(result.data.dates, result.data.newRequests, borderColor[0], pointBackgroundColor[0], title[0], title[0]));
                new Chart(ctx1, setChart(result.data.dates, result.data.doneRequests, borderColor[1], pointBackgroundColor[1], title[1], title[1]));
                new Chart(ctx2, setChart(result.data.dates, result.data.canceledRequests, borderColor[2], pointBackgroundColor[2], title[2], title[2]));
            });
        } else {
            showErrorAlert({
                responseJSON: {
                    errors: [{msg: 'Неправильний порядок дат.'}]
                }
            });
            $('#div-for-chart').empty();
        }
    }

    function chartTasks() {
        var data = $('#between-dates').serializeArray();
        var newData = {
            fromDateChart: setTimeToDate(data[0].value),
            toDateChart: setTimeToDate(data[1].value)
        };

        if (checkSequence(newData)) {
            $.post("/admin/chart/tasks", newData, function (result) {

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

                $('#div-for-chart1').empty();
                $('#div-for-chart2').empty();
                $('#div-for-chart').empty().append(template + template1 + template2);
            });
        } else {
            showErrorAlert({
                responseJSON: {
                    errors: [{msg: 'Неправильний порядок дат.'}]
                }
            });

            $('#div-for-chart1').empty();
            $('#div-for-chart2').empty();
            $('#div-for-chart').empty();
        }
    }

    function chartFinances() {
        var data = $('#between-dates').serializeArray();
        var newData = {
            fromDateChart: setTimeToDate(data[0].value),
            toDateChart: setTimeToDate(data[1].value)
        };

        if (checkSequence(newData)) {
            $.ajax({
                url: "/admin/chart/finances",
                type: 'post',
                data: newData,
                success: function (result) {
                    $('#div-for-chart1').empty();
                    $('#div-for-chart2').empty();
                    $('#div-for-chart').empty().append('<canvas id="myChart" height="125"></canvas>');

                    var ctx = document.getElementById("myChart").getContext('2d');

                    Chart.defaults.global.defaultFontColor = '#333';
                    Chart.defaults.global.defaultFontSize = 14;

                    new Chart(ctx, setChart(result.data.dates, result.data.money, '#398439', '#5dd65d', "Фінансова статистика", "Всього"));
                },
                error: function (err) {
                    showErrorAlert(err);
                }
            });
        } else {
            showErrorAlert({
                responseJSON: {
                    errors: [{msg: 'Неправильний порядок дат.'}]
                }
            });

            $('#div-for-chart').empty();
            $('#div-for-chart1').empty();
            $('#div-for-chart2').empty();
        }
    }
    function checkSequence(data) {
        return data.toDateChart > data.fromDateChart;
    }

    function setChart(labels, data, borderColor, pointBgc, title, label) {
        return {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: label,
                        data: data,
                        backgroundColor: "transparent",
                        borderColor: borderColor,
                        pointRadius: 4,
                        pointBackgroundColor: pointBgc
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
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
                    padding: 10,
                    fontColor: '#333',
                    text: title
                },
                elements: {
                    line: {
                        tension: 0
                    }
                }
            }
        };
    }
});