$(document).ready(function () {

    $(document).keydown(function(event) {
        if (event.keyCode === 13) {
            $('.in .agree').click();
        }

        if (event.keyCode === 27) $('.in .close').click();
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
        $('.alert').slideUp();
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

    $('.startTime').datetimepicker({
        defaultDate: new Date(),
        locale: "uk",
        format: "YYYY.MM.DD HH:mm:ss"
    });

    $('.datetimepickerN').datetimepicker(
        {
            locale: "uk",
            format: "YYYY.MM.DD HH:mm:ss"
        }
    );

});

const TIME_FOR_FLASH = 5000;

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
    else {
        return '/executor';
    }
}

function showSuccessAlert(message) {
    $('.alerts-success-info').css("display", "block");

    var successTemplate = "<div class='col-lg-12'>" + message + "</div>";

    $('#success-block').html(successTemplate);

    hideAlert();
}

function showErrorAlert(err) {
    $('.alerts-errors-info').css("display", "block");

    var errorsTemplate = err.responseJSON.errors.map(error => {
        return ("<div class='col-lg-12'>" + error.msg + "</div>");
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