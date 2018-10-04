$(document).ready(function () {

    updateTaskType('.update-task-type');
    /**
     * get details for task by type, mark and model car
     * @param typeCar - type Car id
     * @param mark - mark Car id
     * @param model - model Car id
     * @param elementId - id element for insert detail must be id html selector
     */
    var getDetailType = (typeCar, mark, model, elementId) => {
        var body = {
            typeOfCar: typeCar,
            carMarkk: mark,
            carModel: model
        };
        $.ajax({
            url: getRole(window.location.pathname) + '/get-task-types',
            type: 'post',
            data: body,
            success: (response) =>{
                updateDetailSelector(response.detailTypes, elementId);
            }
        });
    };

   var  getDetailByTypeTaskID = () => {
     return {
          details:[
              {id:64,
                taskID:65,
                detailID:3,
               detailQuantity:1,
               detailType:1, createdAt:"2018-10-03T12:46:19.338Z", updatedAt:"2018-10-03T12:46:19.338Z",
               detail:{"id":3, detailName:"Поршень", detailCode:"2342349", detailPrice:200, transportTypeID:2,
               transportMarkkID:4, transportModelID:6, createdAt:"2018-09-19T09:46:58.098Z", updatedAt:"2018-09-24T11:01:52.835Z"}
              },
              {id:68, taskID:65,detailID:10,detailQuantity:2,detailType:2,createdAt:"2018-10-04T10:17:12.825Z",updatedAt:"2018-10-04T10:17:12.825Z",
                  detail:{id:10,detailName:"Шатун ",detailCode:"3223221",detailPrice:122,
                      transportTypeID:2,transportMarkkID:4,transportModelID:6,createdAt:"2018-09-24T07:36:47.693Z",updatedAt:"2018-09-24T07:36:47.693Z"}}
              ]
          };
   };

    //if user change model car get list details and insert to
    // detail selector in CREATE task type page
    $('#model1').on('change', () => {
            getDetailType($('#typeOfCar1').val(), $('#markk1').val(), $('#model1').val(), '#detail-type-select.create-task-detail-select')
    });
    //if user change model car get list details and insert to
    // detail selector in UPDATE task type page
    $('#model').on('change', () => {
        getDetailType($('#typeOfCar').val(), $('#markk').val(), $('#model').val(), '#update-detail-type-select')
    });

    /**
     * Update Selector detail inside create Type task popup
     * @param details array details
     * @param elementId - inset option to this element
     */
    var updateDetailSelector = (details, elementId) => {
        $(elementId).empty();
        var options = [];
        details.forEach(detail => {
            options.push(
                '<option id="detailTypeID'+ detail.id +'" detailPrice="'+ detail.detailPrice +'" value="' + detail.id + '" detailName="' + detail.detailName +
                ' / '+ detail.detailCode + '" detailPrice="'+ detail.detailPrice +'" title="Усі категорії"> '+ detail.detailName +' / ' + detail.detailCode + '</option>"'
            );
        });
        $(elementId).append(options);
    };

    /**
     * Send to server request create Task Type
     * inside array details
     */
    $('#create-task-type').on('click', (event) => {
        event.preventDefault();
        var formDataArray = $('#create-type-task-form').serializeArray();
        var body = {
            typeName: formDataArray[0].value,
            articleCode: formDataArray[1].value,
            typeOfCar: formDataArray[2].value,
            carMarkk: formDataArray[3].value,
            carModel: formDataArray[4].value,
            planedExecutorID: formDataArray[5].value,
            estimationTime: formDataArray[6].value,
            cost: formDataArray[7].value,
            details: []
        };
        var rows = $('#detail-type-tbody').children();

        for(var i = 0; i < rows.length; i++){
            body.details.push({
                detailID:rows[i].getAttribute('detailid'),
                detailQuantity: rows[i].getAttribute('detailquantity'),
                detailType:rows[i].getAttribute('detailType'),
                detailName:rows[i].getAttribute('detailName')
            })
        }
        body.details = JSON.stringify(body.details);
        $.ajax({
            url: getRole(window.location.pathname) + '/create-task-type',
            type: 'post',
            data: body,
            success:  (response) =>  {
                console.log(response);
            }
        })
    });


    function updateTaskType(value) {
        $(value).on('click', function () {
            $('#update-form-id').val($(this).data('id'));
            $('#update-form-type-name').val($(this).data('type-name'));
            $('#update-form-type-article').val($(this).data('article-code'));

            // if ($(this).data('type-of-car')) {
            //     console.log(  111, "#typeOfCar #" + $(this).data('type-of-car') );
            //     $("#typeOfCar #" + $(this).data('type-of-car')).attr('selected', true);
            //     $("#typeOfCar").change();
            // }

            $("#typeOfCar").val($(this).data('type-of-car')).select2();
            $("#markk").empty().append("<option value='" + $(this).data('car-markk') + "'>" + $(this).data('car-markk-name') + "</option>");
            $("#model").empty().append("<option value='" + $(this).data('car-model') + "'>" + $(this).data('car-model-name') + "</option>");

            $('#update-form-planed-executor-id').val($(this).data('planed-executor-id')).change();
            $('#update-form-estimation-time').val($(this).data('estimation-time'));
            $('#update-form-cost').val($(this).data('cost'));

            //if user change model car get list details and insert to
            // detail selector in UPDATE task type page
            getDetailType($("#typeOfCar").val(), $("#markk").val(), $("#model").val(), '#update-detail-type-select');
        });
    }

    $('.task-type-update-button').on('click', function (event) {
        event.preventDefault();

        var dataArr = $('#task-type-update-form').serializeArray();

        // get old details list
        var oldDetail = getDetailByTypeTaskID();
        var newDetail = [];

        var rows = $('#update-detail-type-tbody').children();

        for(var i = 0; i < rows.length; i++){
            newDetail.push({
                detailID:rows[i].getAttribute('detailid'),
                detailQuantity: rows[i].getAttribute('detailquantity'),
                detailType:rows[i].getAttribute('detailType'),
                detailName:rows[i].getAttribute('detailName')
            })
        }
        console.log(oldDetail);
        console.log(newDetail);

            // detailID
            // detailQuantity
            // detailType
            // detailName


        var requestBody = {
            typeName: dataArr[0].value,
            articleCode: dataArr[1].value,
            typeOfCar: dataArr[2].value,
            carMarkk: dataArr[3].value,
            carModel: dataArr[4].value,
            planedExecutorID: dataArr[5].value,
            estimationTime: dataArr[6].value,
            cost: dataArr[7].value,
            details: [],
            deleteDetail: [],
            changeDetail: [],
        };

        console.log(requestBody);

        // $.ajax({
        //     url: getRole(window.location.pathname) + '/update-task-type/' + dataArr[0].value,
        //     type: 'put',
        //     data: requestBody,
        //     success: function (data) {
        //         showSuccessAlert('Редагування задачі пройшло успішно.');
        //
        //         if (data.taskType.transportType === null) {
        //             data.taskType.transportType = {
        //                 transportTypeName: ''
        //             }
        //         }
        //         if (data.taskType.transportMarkk === null) {
        //             data.taskType.transportMarkk = {
        //                 transportMarkkName: ''
        //             }
        //         }
        //         if (data.taskType.transportModel === null) {
        //             data.taskType.transportModel = {
        //                 transportModelName: ''
        //             }
        //         }
        //
        //         $('.in .close').click();
        //
        //         var idr = "#idr-task-type-" + dataArr[0].value;
        //         var newTaskType,
        //             newTaskType1 = '',
        //             newTaskType2 = '</td>';
        //
        //         newTaskType = '' +
        //             '<th class="tac" scope="row">' + data.taskType.id + '</th>' +
        //             '<td class="tac">' + data.taskType.typeName + '</td>' +
        //             '<td class="tac">' + data.taskType.articleCode + '</td>' +
        //             '<td class="tac">' + data.taskType.transportType.transportTypeName + '</td>' +
        //             '<td class="tac">' + data.taskType.transportMarkk.transportMarkkName + '</td>' +
        //             '<td class="tac">' + data.taskType.transportModel.transportModelName + '</td>' +
        //             '<td class="tac">' + data.taskType.cost + '</td>' +
        //             '<td class="tac">' + data.user.userSurname + ' ' + data.user.userName + '</td>' +
        //             '<td class="tac">' + data.taskType.estimationTime + '</td>' +
        //             '<td class="tac">' +
        //                 '<a href="#" class="update-task-type modal-window-link"' +
        //                 ' data-toggle="modal" data-target="#updateTaskTypeFormModal" title="Редагувати задачу"' +
        //                 ' data-id="' + data.taskType.id + '"' +
        //                 ' data-type-name="' + data.taskType.typeName + '"' +
        //                 ' data-type-of-car="' + data.taskType.transportType.id + '"' +
        //                 ' data-car-markk="' + data.taskType.transportMarkk.id + '"' +
        //                 ' data-car-model="' + data.taskType.transportModel.id + '"' +
        //                 ' data-car-markk-name="' + data.taskType.transportMarkk.transportMarkkName + '"' +
        //                 ' data-car-model-name="' + data.taskType.transportModel.transportModelName + '"' +
        //                 ' data-cost="' + data.taskType.cost + '"' +
        //                 ' data-planed-executor-id="' + data.user.id + '"' +
        //                 ' data-estimation-time="' + data.taskType.estimationTime + '">' +
        //                     '<span class="glyphicon glyphicon-pencil" aria-hidden="true" style="font-size: 17px; margin-right: 10px;"/>' +
        //                 '</a>';
        //
        //         if (getRole(window.location.pathname) === '/admin') {
        //             newTaskType1 =  '<a href="#" class="delete-task-type modal-window-link" ' +
        //                 ' data-toggle="modal" data-target="#deleteTaskTypeFormModal" title="Видалити задачу"' +
        //                 ' data-id="' + dataArr[0].value + '">' +
        //                 '<span class="glyphicon glyphicon-remove" aria-hidden="true" style="font-size: 19px;"/>' +
        //                 '</a>';
        //         }
        //
        //         $(idr).empty().append(newTaskType + newTaskType1 + newTaskType2);
        //
        //         updateTaskType(idr + ' .update-task-type');
        //         deleteTaskType(idr + ' .delete-task-type');
        //     },
        //     error: function (err) {
        //         $('.in .close').click();
        //         showErrorAlert(err);
        //     }
        // });
    });

    deleteTaskType('.delete-task-type');

    function deleteTaskType(value) {
        $(value).on('click', function () {
            $('#delete-task-type-button').attr('task-type-id', ($(this).data('id')));
            $('#delete-task-type-id').html($(this).data('id'));
        });
    }

    $('#delete-task-type-button').on('click', function () {

        var taskTypeID = $(this).attr('task-type-id');

        $.ajax({
            url: getRole(window.location.pathname) + '/delete-task-type/' + taskTypeID,
            type: 'delete',
            success: function () {
                showSuccessAlert('Видалення задачі пройшло успішно.');

                $('.in .close').click();
                var idr = "#idr-task-type-" + taskTypeID;
                $(idr).remove();
            },
            error: function (err) {
                $('.in .close').click();
                showErrorAlert(err);
            }
        });
    });
});