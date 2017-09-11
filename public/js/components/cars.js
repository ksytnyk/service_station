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

        $('#typeOfCar' + idItem).on('change', function () {
            $("#markk" + idItem + " option").remove();
            $("#model" + idItem + " option").remove();

            if (this.value !== "default") {
                getMarkks(this, idItem);
            }
        });

        $('#markk' + idItem).on('change', function () {
            $("#model" + idItem + " option").remove();
            getModels(this, idItem);
        });
    });

    function getTypes(idItem) {
        $.ajax({
            url: "https://api.auto.ria.com/categories"
        }).done((result) => {
            renderTypes(result, idItem);
        })
    }

    function renderTypes(Types, idItem) {
        let newTypes = [Types[0], Types[1], Types[5], Types[6]];

        newTypes[0].nameUK = "Легкові автомобілі";
        newTypes[1].nameUK = "Мотоцикли";
        newTypes[2].nameUK = "Вантажні автомобілі";
        newTypes[3].nameUK = "Автобуси";

        newTypes.forEach(item => {
            $("#typeOfCar" + idItem).append("<option id='" + item.name + "' value='" + item.name + "' data-id='" + item.value + "'>" + item.nameUK + "</option>")
        });

        $("#typeOfCar" + idItem).select2();
    }

    let link;

    function getMarkks(markk, idItem) {
        link = "https://api.auto.ria.com/categories/" + $('#' + markk.value).data('id') + "/marks";

        $.ajax({
            url: link
        }).done((result) => {
            renderMarkks(result, idItem)
        })
    }

    function renderMarkks(Markk, idItem) {
        $("#markk" + idItem).append("<option>Оберіть марку транспорту</option>").select2();

        Markk.forEach(item => {
            $("#markk" + idItem).append("<option id='" + item.name.replace(/\s+/g, '-') + "' value='" + item.name.replace(/\s+/g, '-') + "' data-id='" + item.value + "'>" + item.name + "</option>")
        });
    }

    function getModels(Model, idItem) {
        $.ajax({
            url: link + "/" + $('#' + Model.value).data('id') + "/models"
        }).done((result) => {
            renderModels(result, idItem)
        })
    }

    function renderModels(Models, idItem) {
        $("#model" + idItem).append("<option>Оберіть модель транспорту</option>").select2();

        Models.forEach(item => {
            $("#model" + idItem).append("<option value='" + item.name + "' attr-id='" + item.value + "' >" + item.name + "</option>")
        });
    }
});