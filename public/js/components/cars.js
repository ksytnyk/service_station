/**
 * Created by mac on 22.08.17.
 */
"use strict";


$(document).ready(() => {
    let linkForCars = window.location.pathname,
        createLink = "/admin/create-request",
        updateLink = "/admin/update-request";
    if(linkForCars == createLink || (linkForCars.indexOf(updateLink)+1)) {
        $('#customers').select2();
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
            url: "http://api.auto.ria.com/categories"
        }).done((result) => {
            renderTypes(result);
        })
    }

    function renderTypes(Types) {
        var newTypes = [];
        newTypes.push(Types[0], Types[1], Types[5], Types[6]);

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
        link = "http://api.auto.ria.com/categories/"+ $('#' + markk.value).data('id') +"/marks";
        $.ajax({
            url: link
        }).done((result) => {
            renderMarkks(result)
        })
    }


    function renderMarkks(Markk) {
        $("#markk").append("<option>Оберіть марку транспорту</option>");
        for (let i in Markk){
            $("#markk").append("<option id='"+ Markk[i].name +"' value='"+ Markk[i].name +"' data-id='" + Markk[i].value + "'>"+ Markk[i].name +"</option>")
        }
        $("#markk").select2();
    }


    function getModels(Model) {
        $.ajax({
            url: link + "/" +  $('#' + Model.value).data('id') + "/models"
        }).done((result) => {
            renderModels(result)
        })
    }
    function renderModels(Models) {
        $("#model").append("<option>Оберіть модель транспорту</option>");
        for (let i in Models){
            $("#model").append("<option value='"+ Models[i].name +"' attr-id='" + Models[i].value + "' >"+ Models[i].name +"</option>")
        }
        $("#model").select2();
    }
});