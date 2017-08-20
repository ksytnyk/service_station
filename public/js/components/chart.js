$(document).ready(function () {
// var tableData = "<h2>Statistic Table</h2> " +
//     "<p>The statistic table help for your business:</p> " +
//     "<table class='table table-bordered'> " +
//     "<thead> " +
//     "<tr> " +
//     "<th>Statistic</th> " +
//     "<th>Statistic</th> " +
//     "<th>Statistic</th> " +
//     "</tr> " +
//     "</thead> " +
//     "<tbody> " +
//     "<tr> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "</tr> " +
//     "<tr> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "</tr> " +
//     "<tr> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "<td>Data</td> " +
//     "</tr> " +
//     "</tbody> " +
//     "</table>";

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
                        text: "Замовлення за вказаний діапазон часу"
                    }
                }
            });
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
                        text: "Фінансова статистика за вказаний діапазон часу"
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




