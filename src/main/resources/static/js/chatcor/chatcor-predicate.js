/*
 * 
 *
 */
"use strict";

/*
 * 스크립트 템플릿을 사용하여 반복관용어구 행을 생성한다.
 * */
var fnGetRow = function (rowId, lblId, lblTxt, txtPredicate, valPredicate, btnModId, btnDelId) {
    var rowTemplate = 
        `<div id="${rowId}" class='row mb-1'>
            <div class="col-3 align-self-center">
                <label id="${lblId}">${lblTxt}</label>
            </div>
            <div class="col-7">
                <input type="text" class="form-control" id="${txtPredicate}" name="${txtPredicate}" value="${valPredicate}">
            </div>
            <div class="col-2 pl-1 pr-1">
                <button type="button" class="btn btn-primary" id="${btnModId}" data-tagname="${lblTxt}" data-tagvalid="${txtPredicate}">수정</button>
                <button type="button" class="btn btn-primary" id="${btnDelId}" data-tagname="${lblTxt}">삭제</button>
            </div>
        </div>`;
    return rowTemplate;
};

var fnPredicate = function () {
    var selProject = $("#selProjects").val(), arrModBtnIds = [], arrDelBtnIds = [];
    if (selProject !== "") {
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/predicates/" + selProject,
            async: true,
            success: function (response, textStatus, jqXHR) {
                console.log(response);
                // 반복관용어구 화면 초기화 및 predicate 취득내용을 사용하여 행 추가 
                $("#predicate-contents *").remove();
                jQuery.each(response, function(idx, item) {
                    var row = fnGetRow("divRow-".concat(idx), "lblRow-".concat(idx), item.predicate_name,
                            "txtRow-".concat(idx), item.phrases.join(","), "btnMod-".concat(idx), "btnDel-".concat(idx));
                    $("#predicate-contents").append(row);
                    arrModBtnIds.push("#btnMod-".concat(idx));
                    arrDelBtnIds.push("#btnDel-".concat(idx));
                });
                $(arrModBtnIds.join()).on('click', function (event) {
                    var tagName = $("#" + event.target.id).data("tagname"), 
                    txtId = $("#" + event.target.id).data("tagvalid");
                    event.preventDefault();
                    fnModifyPredicate(tagName, $("#" + txtId).val());
                });
                $(arrDelBtnIds.join()).on('click', function (event) {
                    var tagName = $("#" + event.target.id).data("tagname");
                    event.preventDefault();
                    fnDeletePredicate(tagName);
                });
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    } else {
        var title = "<b>프로젝트를 선택해 주세요.</b>";
        $('#selProjects').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: title,
        });
        $('#selProjects').tooltip("show");
    }
};

(function() {
    // 선택한 프로젝트 하위의 predicate 내용 취득
    fnPredicate();

    $("#btnAddPredicate").on('click', function (event) {
        event.preventDefault();
        viewPage($("#btnAddPredicate"));
    });

    $("#selTagSuffix").on("change", function (event) {
        event.preventDefault();
        console.log(event.target);
        if ($("#txtTagName").val() !== "") {
            var tagValue = $("#txtTagName").val().concat("_").concat(event.target.value);
            console.log(tagValue);
            // TODO: 반복관용어구 유니크 값 체크 처리 필요
            $("#lblTagValue").prop("textContent", tagValue);
        }
    });

    $("#btnNewPredicate").on("click", function (event) {
        event.preventDefault();
        fnNewPredicate($("#lblTagValue").prop("textContent"));
    });

    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        $('#selProjects').tooltip("hide");
        fnPredicate();
    });

}());

var fnModifyPredicate = function (tagName, tagValue) {
    console.log("fnModifyPredicate tagName", tagName);
    console.log("fnModifyPredicate tagValue", tagValue);
}

var fnDeletePredicate = function (tagName) {
    console.log("fnDeletePredicate tagName", tagName);
}

var fnNewPredicate = function (tagName) {
    var param = {
            "project_id": $("#selProjects").val(),
            "predicate_name": tagName
    };
    console.log(JSON.stringify(param));
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/new-predicate",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            console.log('success: ', response);
            console.log('success: ', response.status);  // true/false
            viewPage($("#btnNewPredicate"));
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
};