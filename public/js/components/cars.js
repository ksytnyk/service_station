"use strict";

$(document).ready(() => {
    let linkForCars = window.location.pathname,
        createLink = "/admin/create-request",
        createGlobalReq = "/admin/create-global-request",
        updateLink = "/admin/update-request";

    if(linkForCars == createLink || (linkForCars.indexOf(updateLink)+1) || linkForCars == createGlobalReq) {
        getTypes();
    }

    $('#typeOfCar').on('change', function () {
        $("#markk option").remove();
        $("#model option").remove();

        if (this.value !== "default") {
            getMarkks(this);
        }
    });
    $('#markk').on('change', function () {
        $("#model option").remove();
        getModels(this);
    });


    function getTypes() {
        $.ajax({
            url: "https://api.auto.ria.com/categories"
        }).done((result) => {
            renderTypes(result);
        })
    }

    function renderTypes(Types) {
        let newTypes = [Types[0], Types[1], Types[5], Types[6]];

        newTypes[0].nameUK = "Легкові автомобілі";
        newTypes[1].nameUK = "Мотоцикли";
        newTypes[2].nameUK = "Вантажні автомобілі";
        newTypes[3].nameUK = "Автобуси";

        newTypes.forEach(item => {
            $("#typeOfCar").append("<option id='"+ item.name +"' value='"+ item.name +"' data-id='" + item.value + "'>"+ item.nameUK +"</option>")
        });

        $("#typeOfCar").select2();
    }

    let link;
    function getMarkks(markk) {
        link = "https://api.auto.ria.com/categories/"+ $('#' + markk.value).data('id') +"/marks";

        $.ajax({
            url: link
        }).done((result) => {
            renderMarkks(result)
        })
    }


    function renderMarkks(Markk) {
        $("#markk").append("<option>Оберіть марку транспорту</option>").select2();

        Markk.forEach(item => {
            $("#markk").append("<option id='"+ item.name.replace(/\s+/g,'-') +"' value='"+ item.name.replace(/\s+/g,'-') +"' data-id='" + item.value + "'>"+ item.name +"</option>")
        });
    }


    function getModels(Model) {
        $.ajax({
            url: link + "/" +  $('#' + Model.value).data('id') + "/models"
        }).done((result) => {
            renderModels(result)
        })
    }
    function renderModels(Models) {
        $("#model").append("<option>Оберіть модель транспорту</option>").select2();

        Models.forEach(item => {
            $("#model").append("<option value='"+ item.name +"' attr-id='" + item.value + "' >"+ item.name +"</option>")
        });
    }
});