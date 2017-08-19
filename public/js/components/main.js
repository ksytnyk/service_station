$(document).ready(function () {

    var element = document.getElementById(window.location.pathname);
    if (element !== null) {
        element.classList.add("active");
    }

    headerFix();

    $('.hide_alert').on('click', function () {
        $('.alert').slideUp();
    });

    setTimeout(function () {
        $('.hide_alert').trigger('click');
    }, TIME_FOR_FLASH);

    $('.dtable').DataTable();

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

    var successTemplate = "<div class='col-lg-4'>" + message + "</div>";

    $('#success-block').html(successTemplate);

    hideAlert();
}

function showErrorAlert(err) {
    $('.alerts-errors-info').css("display", "block");

    var errorsTemplate = err.responseJSON.errors.map(error => {
        return ("<div class='col-lg-4'>" + error.msg + "</div>");
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
        if (document.body.offsetHeight > window.innerHeight) {
            $('.white_block').outerWidth(+window.innerWidth - 17);
        }
    });
}