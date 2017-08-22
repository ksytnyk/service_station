/**
 * Created by mac on 22.08.17.
 */
"use strict";


$(document).ready(() => {
    if(window.location.pathname == "/admin/create-request"){
        getTypes()
    }

    $('#typeOfCar').on('change', function () {
        getMarkks(this)
    });
    $('#markk').on('change', function () {
        getModels(this);
    });


    function getTypes() {
        $.ajax({
            url: "http://api.auto.ria.com/categories"
        }).done((result) => {
            renderTypes(result)
        })
    }

    function renderTypes(Types) {
        for (let i in Types){
            $("#typeOfCar").append("<option id='"+ Types[i].name +"' value='"+ Types[i].name +"' data-id='" + Types[i].value + "'>"+ Types[i].name +"</option>")
        }
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
        
        $("#markk option").remove();
        for (let i in Markk){

            $("#markk").append("<option id='"+ Markk[i].name +"' value='"+ Markk[i].name +"' data-id='" + Markk[i].value + "'>"+ Markk[i].name +"</option>")
        }
        $("#markk").select2();
    }


    function getModels(Model) {
        link += "/" +  $('#' + Model.value).data('id') + "/models"
        $.ajax({
            url: link
        }).done((result) => {
            renderModels(result)
        })
    }
    function renderModels(Models) {
        $("#model option").remove();
        for (let i in Models){
            $("#model").append("<option value='"+ Models[i].name +"' attr-id='" + Models[i].value + "' >"+ Models[i].name +"</option>")
        }
        $("#model").select2();
    }
});