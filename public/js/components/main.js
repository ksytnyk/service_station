$(document).ready(function () {

    let permission = true;

    $(document).keydown(function(event) {

        if (event.keyCode === 13) {
            if (permission) {
                $('.in .agree').click();
            } else {
                return;
            }
        }

        if (event.keyCode === 27) $('.in .close').click();
    });

    $('select')
        .on('select2:open', function () {
            permission = false;
        })
        .on('select2:close', function (event) {
            permission = true;
            event.stopPropagation();
        });

    if (document.getElementsByClassName(window.location.pathname)[0] !== undefined) {
        var elements = document.getElementsByClassName(window.location.pathname);

        if (window.location.pathname.includes('requests')) {
            $('.requests_link').addClass('active');
        }

        for (var key in elements) {
            if (!isNaN(key)) {
                elements[key].classList.add('active');
            }
        }
    }

    headerFix();

    $('.hide_alert').on('click', function () {
        $('.alert').css('left', '-65vw');
    });

    $('.clean-search').on('click', () => {
            var table = $('#DataTables_Table_0').DataTable();
            let executorTable = $('.executor').find('#tasks-table').DataTable();
            let storeKeepre = $('.store-keeper').find('#tasks-table').DataTable();
                table.search( '' ).columns().search( '' ).draw();
                executorTable.search('').columns().search().draw();
                storeKeepre.search('').columns().search().draw();
                $('input[type=serarch]').val('');
    });

    setTimeout(function () {
        $('.hide_alert').trigger('click');
    }, TIME_FOR_FLASH);

    $('.dtable').DataTable({
        "bPaginate": false,
        "bInfo" : false
    });

    $('.dtable-requests').DataTable({
        "order": [[0, "desc"]],
        "bPaginate": false,
        "bInfo" : false
    });

    $('.dtable-task-type').DataTable({
        "order": [[ 2, "asc" ]],
        "bPaginate": false,
        "bInfo" : false
    });

    $('tr[class^="idr-request-"]').find('#tasks-table').DataTable({
        "orderFixed": [ 0, 'asc' ],
        "bPaginate": false,
        "bInfo": false,
        "searching": false,
    });


    $('#idr-request-11').find('#tasks-table').DataTable({
        "orderFixed": [ 0, 'asc' ],
        "bPaginate": false,
        "bInfo": false,
        "searching": false,
    });



    $('.dtable-markk').DataTable({
        "order": [[ 2, "asc" ]],
        "bPaginate": false,
        "bInfo" : false
    });

    $('.dtable-detail').DataTable({
        /*"order": [[ 2, "asc" ]],*/
        "bPaginate": false,
        "bInfo" : false
    });

    $('.startTime').datetimepicker({
        defaultDate: new Date(),
        locale: "uk",
        format: "YYYY.MM.DD"
    });

    setEndTime();

    function setEndTime() {
        var endTime = new Date($('.startTime').val());

        endTime.setDate(endTime.getDate() + 14);
        $('.endTime').val(formatDate(endTime).slice(0, 10));
    }

    $(".startTime").on("dp.change", function() {
        setEndTime();
    });


    $('.datetimepickerN').datetimepicker({
        locale: "uk",
        format: "YYYY.MM.DD"
    });

});

const TIME_FOR_FLASH = 10000;

function getRole(pathname) {
    if (pathname.includes('admin')) {
        return '/admin';
    }
    else if (pathname.includes('moderator')) {
        return '/moderator';
    }
    else if (pathname.includes('store-keeper')) {
        return '/store-keeper';
    }
    else if (pathname.includes('executor')) {
        return '/executor';
    } else  {
        return '/book-keeper';
    }
}

function showSuccessAlert(message) {
    $('.hide_alert').trigger('click');
    $('.alerts-success-info').css({
        "display": "block",
        "left": "15px"
    });

    var successTemplate = "<div>" + message + "</div>";

    $('#success-block').html(successTemplate);

    hideAlert();
}

function showErrorAlert(err) {
    $('.hide_alert').trigger('click');
    $('.alerts-errors-info').css({
        "display": "block",
        "left": "15px"
    });

    var errorsTemplate = err.responseJSON.errors.map(error => {
        return ("<div>" + error.msg + "</div>");
    });

    $('#errors-block').html(errorsTemplate);

    hideAlert();
}

function hideAlert() {
    setTimeout(function () {
        $('.hide_alert').trigger('click');
    }, TIME_FOR_FLASH);
}

function headerFix() {
    $('.modal-window-link').on('click', function () {
        setTimeout(() => {
            if ($('body').css('padding-right') === '17px') {
                $('.white_block').outerWidth(+window.innerWidth - 17);
            }
        }, 0);
    });
}

function formatDate(date) {
    var date = new Date(date);
    var array = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        // date.getSeconds()
    ];

    var res = array.map(item => {
        if (item < 10) item = "0" + item;
        return item;
    });

    return res[0] + '.' + res[1] + '.' + res[2] + ' ' + res[3] + ':' + res[4];
      //  + ':' + res[5];
}

function setTimeToDate(value) {

    var array = value.split('.');

    for (var i = 0; i < array.length; i++) {
        array[i] = +array[i];
    }

    array[1] = array[1] - 1;

    value = new Date(array[0], array[1], array[2]);

    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    value.setHours(hours, minutes, seconds);

    return value;
}

function checkDateForUpdate(oldDate, newDate) {
    if ( oldDate.slice(0, 10) === newDate ) {
        return oldDate;
    } else {
        newDate = setTimeToDate(newDate);
        return newDate;
    }
}

function setStartTime() {
    $('.startTime').val(formatDate(new Date()).slice(0,10));
}