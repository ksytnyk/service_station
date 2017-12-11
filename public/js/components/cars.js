"use strict";

$(document).ready(() => {
    let linkForCars = window.location.pathname,
        createLink = getRole(linkForCars) + "/create-request",
        createGlobalReq = getRole(linkForCars) + "/create-global-request",
        updateLink = getRole(linkForCars) + "/requests/update-request",
        taskTypeLink = getRole(linkForCars) + "/task-type";

    let idArray = ['', '1'];

    idArray.forEach(idItem => {
        if (linkForCars == createLink || (linkForCars.indexOf(updateLink) + 1) || linkForCars == createGlobalReq || linkForCars == taskTypeLink) {
            getTypes(idItem);
        }

        $('#typeOfCar' + idItem).on('select2:closing', function () {
            if ($('#typeOfCar' + idItem).attr('disabled') === undefined) {
                $("#markk" + idItem + " option").remove();
                $("#model" + idItem + " option").remove();

                if (this.value !== "") {
                    getMarkks(this, idItem);
                }
            }
        });

        $('#markk' + idItem).on('change', function () {
            $("#model" + idItem + " option").remove();
            getModels(this, idItem);
        });
    });

    function getTypes(idItem) {
        $.ajax({
            url: getRole(window.location.pathname) + '/get-transport-type',
            type: 'get',
            headers: {
                'charset': 'UTF-8',
                'Content-Type': 'application/json',
            },
            success: function (data) {
                renderTypes(data, idItem);
            }
        })
    }

    function renderTypes(types, idItem) {

        types.forEach(item => {
            let option = "<option value='" + item.id + "'",
                option1 = "",
                option2 = ">" + item.transportTypeName + "</option>";

            if ( $('#typeOfCar').attr('default-value') === item.id ) {
                option1 = " selected";
            }

            $("#typeOfCar" + idItem).append(option + option1 + option2);
        });

        $("#typeOfCar" + idItem).select2();
    }

    let link;

    function getMarkks(markk, idItem) {
        if ( markk.value !== 'default' ) {
            $.ajax({
                url: getRole(window.location.pathname) + '/get-transport-markk/' + markk.value,
                type: 'get',
            }).done((result) => {
                renderMarkks(result, idItem)
            })
        }
    }

    function renderMarkks(markk, idItem) {
        $("#markk" + idItem).append("<option value=''>Оберіть марку транспорту</option>");

        markk.forEach(item => {
            $("#markk" + idItem).append("<option value='" + item.id + "'>" + item.markkName + "</option>")
        });

        $("#markk" + idItem).select2();
    }

    function getModels(model, idItem) {
        if ( model.value !== 'default' ) {
            $.ajax({
                url: getRole(window.location.pathname) + '/get-transport-model/' + model.value,
                type: 'get',
            }).done((result) => {
                renderModels(result, idItem)
            })
        }
    }

    function renderModels(models, idItem) {
        $("#model" + idItem).append("<option value=''>Оберіть модель транспорту</option>");

        models.forEach(item => {
            $("#model" + idItem).append("<option value='" + item.id + "'>" + item.transportModelName + "</option>")
        });
        $("#model" + idItem).select2();
    }
})