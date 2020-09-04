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
            <div class="col-3 align-self-center form-control-sm">
                <label id="${lblId}">${lblTxt}</label>
            </div>
            <div class="col-7">
                <input type="text" class="form-control form-control-sm" id="${txtPredicate}" name="${txtPredicate}" value="${valPredicate}">
            </div>
            <div class="col-2 pl-1 pr-1">
                <button type="button" class="btn btn-primary btn-sm" id="${btnModId}" data-toggle="modal" data-target="#mdlModifyPredicate" data-tagname="${lblTxt}" data-tagvalid="${txtPredicate}">수정</button>
                <button type="button" class="btn btn-primary btn-sm" id="${btnDelId}" data-tagname="${lblTxt}">삭제</button>
            </div>
        </div>`;
    return rowTemplate;
};

var fnPredicate = function () {
    var selProject = $("#selProjects").val(), arrModBtnIds = [], arrDelBtnIds = [];
    if (selProject !== "") {
    	if($("#selProjects").val().indexOf("-BERT-") < 0){
    		$('#divPredicateBody').removeClass('d-none');
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/predicates/" + selProject,
                async: true,
                success: function (response, textStatus, jqXHR) {
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
    	}
    	else{
    		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
    		$('#divPredicateBody').addClass('d-none');
    		$("#predicate-contents *").remove();
    	}
    } else {
        //$('#selProjects').tooltip("show");
    	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
        $('#divPredicateBody').addClass('d-none');
        $("#predicate-contents *").remove();
    }
};

(function() {
    // 선택한 프로젝트 하위의 predicate 내용 취득
    fnPredicate();

    $("#btnAddPredicate").on('click', function (event) {
        event.preventDefault();
        viewPage($("#btnAddPredicate"));
    });

    $('#lblTagValue').tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>같은 이름의 반복관용어구 태그가 존재합니다.</b>"
    });

    $('#lblTagValue').on('show.bs.tooltip', function (event) {
        $(this).data("istooltip", true);
    });

    $('#lblTagValue').on('hide.bs.tooltip', function (event) {
        $(this).data("istooltip", false);
    });

    $("#selTagSuffix").on("change", function (event) {
        event.preventDefault();
        $('#lblTagValue').tooltip("hide");
        $("#txtTagName").tooltip("hide");
        $("#lblTagValue").prop("textContent", "");
        if (!$.isEmptyObject($("#txtTagName").val().trim()) && !$.isEmptyObject($(this).val())) {
            var tagValue = $("#txtTagName").val().concat("_").concat(event.target.value);
            $("#lblTagValue").prop("textContent", tagValue);
            fnHasPredicateTag(tagValue);
        }
    });

    $("#txtTagName").on("blur", function (event) {
        event.preventDefault();
        $('#lblTagValue').tooltip("hide");
        $("#txtTagName").tooltip("hide");
        $("#lblTagValue").prop("textContent", "");
        if (!$.isEmptyObject($(this).val().trim()) && !$.isEmptyObject($("#selTagSuffix").val())) {
            var tagValue = $(this).val().trim().concat("_").concat($("#selTagSuffix").val());
            $("#lblTagValue").prop("textContent", tagValue);
            fnHasPredicateTag(tagValue);
        }
    });

    $("#txtTagName").on("focus", function (event) {
        event.preventDefault();
        $('#lblTagValue').tooltip("hide");
        $("#txtTagName").tooltip("hide");
    });

    $("#btnNewPredicate").on("click", function (event) {
        event.preventDefault();
        fnNewPredicate($("#lblTagValue").prop("textContent"));
    });

    $('#selProjects').off("change");
    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        $('#selProjects').tooltip("hide");
        fnPredicate();
    });

    // 수정완료 이벤트 : Modal show
    $('#mdlModifyPredicate').on('show.bs.modal', function (event) {
        var tagName = $(event.relatedTarget).data("tagname");
        $(this).find("#divModifyPredicate *").remove();
        $(this).find("#divModifyPredicate").append(`<p>관용어구 "${tagName}"의 내용을 수정하였습니다.</p>`);
    })

    // 수정완료 이벤트 : Modal hide
    $('#mdlModifyPredicate').on('hide.bs.modal', function (event) {
         fnPredicate();
    });

}());

var fnHasPredicateTag = function (tagName) {
    var param = { project_id: $("#selProjects").val(), predicate_name: tagName };
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/has-predicate",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            if (response) {
                $('#lblTagValue').tooltip("show");
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}

var fnModifyPredicate = function (tagName, tagValue) {
    var param = { "project_id": $("#selProjects").val(),
                  "predicate_name": tagName,
                  "phrases": tagValue.split(",") };
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/mod-predicate",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            if (response.status) {
                $("#mdlModifyPredicate").modal("show");
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}

var fnDeletePredicate = function (tagName) {
    var param = {
            "project_id": $("#selProjects").val(),
            "predicate_name": tagName
    };
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/del-predicate",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            if (response.status) {
                fnPredicate();
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}

var fnNewPredicate = function (tagName) {
    var param = {
            "project_id": $("#selProjects").val(),
            "predicate_name": tagName
    };
    if ($('#lblTagValue').data("istooltip")) {
        return;
    };
    if (!$.isEmptyObject(tagName.trim())) {
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/new-predicate",
            async: true,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                viewPage($("#btnNewPredicate"));
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    } else {
        $("#txtTagName").tooltip({
            trigger: 'manual',
            placement: 'bottom',
            html: true,
            title: "<b>반복관용어구 태그를 정의해 주세요.</b>"
        });
        $("#txtTagName").tooltip("show");
    }
};