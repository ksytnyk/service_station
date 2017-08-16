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


$('#chart-tasks').on('click', function () {
    var ctx = document.getElementById("myChart").getContext('2d');
    $.get("/admin/chart/tasks", function (data) {

        $('#statistic-table').html(tableData);

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Pending", "Processing", "Done", "Hold", "Canceled"],
                datasets: [{
                    label: 'Statuses Tasks',
                    data: data.tasks,
                    backgroundColor: [
                        'rgba(255, 165, 0, 0.4)',
                        'rgba(51, 122, 183, 0.4)',
                        'rgba(0, 128, 0, 0.4)',
                        'rgba(255, 0, 0, 0.4)',
                        'rgba(0, 0, 0, 0.4)'
                    ],
                    borderColor: [
                        'rgba(255, 165, 0, 1)',
                        'rgba(51, 122, 183, 1)',
                        'rgba(0, 128, 0, 1)',
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 0, 0, 0.1)'
                    ],
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


$('#chart-request').on('click', function () {
    var ctx = document.getElementById("myChart").getContext('2d');
    $.get("/admin/chart/requests", function (data) {
        $('#statistic-table').html(tableData);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Pending", "Processing", "Done", "Canceled"],
                datasets: [{
                    label: 'Statuses Requests',
                    data: data.requests,
                    backgroundColor: [
                        'rgba(255, 165, 0, 0.4)',
                        'rgba(51, 122, 183, 0.4)',
                        'rgba(0, 128, 0, 0.4)',
                        'rgba(0, 0, 0, 0.4)'
                    ],
                    borderColor: [
                        'rgba(255, 165, 0, 1)',
                        'rgba(51, 122, 183, 1)',
                        'rgba(0, 128, 0, 1)',
                        'rgba(0, 0, 0, 0.1)'
                    ],
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



