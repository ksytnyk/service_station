var tableData = "<h2>Statistic Table</h2> " +
    "<p>The statistic table help for your business:</p> " +
    "<table class='table table-bordered'> " +
    "<thead> " +
    "<tr> " +
    "<th>Statistic</th> " +
    "<th>Statistic</th> " +
    "<th>Statistic</th> " +
    "</tr> " +
    "</thead> " +
    "<tbody> " +
    "<tr> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "</tr> " +
    "<tr> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "</tr> " +
    "<tr> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "<td>Data</td> " +
    "</tr> " +
    "</tbody> " +
    "</table>";

$('#chart-tasks, #chart-request').on('click', function () {

    var typeURL = $(this).data('chart-type');
    var data = $('#between-dates').serializeArray();

    var backgroundColor = [
        'rgba(255, 165, 0, 0.4)',
        'rgba(51, 122, 183, 0.4)',
        'rgba(0, 128, 0, 0.4)',
        'rgba(255, 0, 0, 0.4)',
        'rgba(0, 0, 0, 0.4)'
    ];

    var borderColor = [
        'rgba(255, 165, 0, 1)',
        'rgba(51, 122, 183, 1)',
        'rgba(0, 128, 0, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(0, 0, 0, 0.1)'
    ];

    var labels = ["Очікування", "Виконується", "Виконано", "Зупинено", "Анульовано"];

    if (typeURL === "requests") {
        backgroundColor.splice(3, 1);
        borderColor.splice(3, 1);
        labels.splice(3, 1);
    }

    $.post("/admin/chart/" + typeURL, data, function (result) {
        // $('#statistic-table').html(tableData);
        $('#div-for-chart').empty();
        $('#div-for-chart').append('<canvas id="myChart" width="400" height="400"></canvas>');
        var ctx = document.getElementById("myChart").getContext('2d');
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
                            fixedStepSize: 1
                        }
                    }]
                }
            }
        });
    });
});




