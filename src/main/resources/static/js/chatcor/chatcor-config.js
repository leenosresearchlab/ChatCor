/*
 * 
 *
 */
"use strict";

/*
 * 스크립트 템플릿을 사용하여 반복관용어구 행을 생성한다.
 * */
var fnGetRow = function (rowId, lblId, lblTxt, btnId, prjId, prjTxt, prjInfo) {
    var rowTemplate = `<div id="${rowId}" class='d-flex flex-row mb-1'>
                           <div class="col-5 d-inline-flex align-items-center">
                               <label id="${lblId}" class="mb-0">${lblTxt}</label>
                           </div>
                           <div class="col-3 d-inline-flex align-items-center">
                               <label class="mb-0">${prjInfo}</label>
                           </div>
                           <div class="col-2 d-inline-flex align-items-center">
                                <button type="button" class="btn btn-primary btn-sm" id="${btnId}" data-toggle="modal" data-target="#mdlDelProject" data-prjid="${prjId}" data-prjtxt="${prjTxt}">삭제</button>
                           </div>
                       </div>`;
    return rowTemplate;
};

var fnGetUserRow = function (rowId, btnId, useremail) {
    var rowTemplate = `<div id="${rowId}" class='d-flex flex-row mb-1'>
                           <div class="col-8 d-inline-flex align-items-center">
                               <label id="${useremail}" class="mb-0">${useremail}</label>
                           </div>
                           <div class="col-2 d-inline-flex align-items-center">
                               <button type="button" class="btn btn-primary btn-sm" id="${btnId}" data-toggle="modal" data-target="#mdlDelUser" data-useremail="${useremail}" data-usertxt="${useremail}">삭제</button>
                           </div>
                       </div>`;
    return rowTemplate;
};

(function() {

    var arrBtnIds = [];
    var arrBtnIds2 = [];

    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");

    $.ajax({
        method: "POST",
        url: "/chatcor/main/project-infos/",
        async: false,
        success: function (response, textStatus, jqXHR) {
            var prjList = response.project_list;
            $("#projects-contents *").remove();
            jQuery.each(prjList, function(idx, item) {
                var row, prjTxt = item.project_name.concat("(").concat(item.project_id).concat(")"),
                    prjInfo = "Intent: ".concat(item.intent_cnt).concat("개, Entity: ").concat(item.entity_cnt).concat("개");
                row = fnGetRow("divRow-".concat(idx), item.project_id, prjTxt, "btnRow-".concat(idx), item.project_id, item.project_id, prjTxt, prjInfo);
                $("#projects-contents").append(row);
                arrBtnIds.push("#btnRow-".concat(idx));
            });
            $(arrBtnIds.join()).on('click', function (event) {
                event.preventDefault();
                fnRemoveProject(this);
            });
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
    
    $.ajax({
    	method: "POST",
    	url: "/chatcor/main/all-user/",
    	async : false,
    	success: function(response, textStatus, jqXHR){
    		$("#user-contents *").remove();
    		 jQuery.each(response, function(idx, item) {
    			 var row;
    			 row = fnGetUserRow("divUserRow-".concat(idx), "btnUserRow-".concat(idx), item.userEmail);
    			 $("#user-contents").append(row);
    			 arrBtnIds2.push("#btnUserRow-".concat(idx));
             });
    		 $(arrBtnIds2.join()).on('click', function (event) {
                 event.preventDefault();
                 fnRemoveUser(this);
             });
    	},
    	error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    		
    });

    $('#mdlDelProject').on('hide.bs.modal', function (event) {
        $(this).find("#txtDelProjectId").val("");
    });

    $('#mdlDelFnProject').on('hidden.bs.modal', function (event) {
        $("#alinkConfig").trigger("click");
    });

    $("#btnDelProject").on("click", function (event) {
        var prjId = $(this).data("prjid");
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/del-project/" + prjId,
            async: true,
            success: function (response, textStatus, jqXHR) {
                if (response) {
                    $(`#selProjects option[value='${prjId}']`).remove();
                    $("#selProjects").val("");
                    $("#mdlDelProject").modal("hide");
                    $("#mdlDelFnProject").modal("show");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $("#btnDelUser").on("click", function (event) {
        var useremail = $(this).data("useremail");
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/chatcor/main/del-user/" + useremail,
            async: true,
            success: function (response, textStatus, jqXHR) {
                if (response) {
                    $("#mdlDelUser").modal("hide");
                    $("#mdlDelFnUser").modal("show");
                    location.reload();
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });
}());

var fnRemoveProject = function (btnObj) {
    $("#txtDelProjectId").val($(btnObj).data("prjtxt"));
    $('#txtDelProjectId').tooltip({
        trigger: 'hover',
        placement: 'bottom',
        html: true,
        title: "<b>" + $(btnObj).data("prjtxt") + "</b>"
    });
    $("#btnDelProject").data("prjid", $(btnObj).data("prjid"));
    $("#mdlDelProject").modal("show");
};

var fnRemoveUser = function (userObj) {
    $("#txtDelUserId").val($(userObj).data("usertxt"));
    $('#txtDelUserId').tooltip({
        trigger: 'hover',
        placement: 'bottom',
        html: true,
        title: "<b>" + $(userObj).data("usertxt") + "</b>"
    });
    $("#btnDelUser").data("useremail", $(userObj).data("useremail"));
    $("#mdlDelUser").modal("show");
};

