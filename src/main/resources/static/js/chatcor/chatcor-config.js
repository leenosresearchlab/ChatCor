/*
 * 
 *
 */
"use strict";

/*
 * 스크립트 템플릿을 사용하여 반복관용어구 행을 생성한다.
 * */
var fnGetRow = function (rowId, lblId, lblTxt, lblPrjInfo, btnId, prjId) {
    var rowTemplate = 
        `<div id="${rowId}" class='row mb-1'>
            <div class="col-5 align-self-center">
                <label id="${lblId}">${lblTxt}</label>
            </div>
            <div class="col-3 align-self-center">
                <label>${lblPrjInfo}</label>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-primary" id="${btnId}" data-prjid="${prjId}">삭제</button>
            </div>
            <div class="col-2"></div>
        </div>`;
    return rowTemplate;
};

(function() {
    var arrBtnIds = [];
    $.ajax({
        method: "POST",
        url: "/chatcor/main/project-infos/",
        async: true,
        success: function (response, textStatus, jqXHR) {
            console.log(response);
            var prjList = response.project_list;
            $("#projects-contents *").remove();
            jQuery.each(prjList, function(idx, item) {
                console.log(item);
                var prjTxt = item.project_name.concat("(").concat(item.project_id).concat(")"),
                prjInfo = "Intent: ".concat(item.intent_cnt).concat("개, Entity: ").concat(item.entity_cnt).concat("개"),
                row = fnGetRow("divRow-".concat(idx), item.project_id, prjTxt, prjInfo, "btnRow-".concat(idx), item.project_id);
                $("#projects-contents").append(row);
                arrBtnIds.push("#btnRow-".concat(idx));
            });
            console.log(arrBtnIds);
            $(arrBtnIds.join()).on('click', function (event) {
                console.log(event);
                console.log($("#" + event.target.id).data("prjid"));
            });
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}());