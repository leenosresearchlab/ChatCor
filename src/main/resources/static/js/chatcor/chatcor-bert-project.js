/*
 * 
 *
 */
"use strict"; // Start of use strict
 
(function() {

    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");

    $("#txtBertProjectName").on('propertychange change keyup paste input', function (evt) {
        evt.preventDefault();
        // TODO: 최대입력 가능 글자 수 체크, 입력가능 문자(스페이스 입력 불가 등) 체크 - 입력에 대한 실시간 체크 필요시 기능 구현
        var currentVal = $(this).val();
    });

    $("#txtBertProjectName").on('focus', function (evt) {
        evt.preventDefault();
        $('#txtBertProjectName').tooltip("hide");
        $('#divDummy').tooltip("hide");
    });

    $("#txtBertProjectName").on('blur', function (evt) {
        // 프로젝트 이름 입력 여부(최소 글자) 확인 후 동일이름 존재여부 체크
        evt.preventDefault();
        if ($(this).val().length > 0) {
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/has-project/" + $(this).val(),
                async: true,
                success: function (response, textStatus, jqXHR) {
                    if (response) {
                        $('#txtBertProjectName').tooltip({
                            trigger: 'manual',
                            placement: 'right',
                            html: true,
                            title: "<b>같은 이름의 프로젝트가 존재합니다.</b>",
                        });
                        $('#txtBertProjectName').tooltip("show");
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

    $('#txtBertProjectName').on('show.bs.tooltip', function (event) {
        $(this).data("istooltip", true);
    });

    $('#txtBertProjectName').on('hide.bs.tooltip', function (event) {
        $(this).data("istooltip", false);
    });


    $("#btnNewProject").on('click', function (evt) {
        evt.preventDefault();
        if (!$('#txtBertProjectName').data("istooltip")) {
            fnNewProject(evt);
        } else {
            console.error("프로젝트 이름 중복 오류");
        }
    });

}());

var fnNewProject = function (obj) {
    var projectName = $("#txtBertProjectName").val().trim(),
        pattern = /^[a-zA-Z]+$/gi,
        param = $('#frmBertProject').serializeObject();
    if ($.isEmptyObject(projectName) || !pattern.test(projectName) || projectName.length > 25) {
        // 영문만 입력 : /^[a-zA-Z]+$/gi, 최대 문자수 : 25
        $('#divDummy').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: "<b>정확한 프로젝트 이름을 입력해 주세요.</b>",
        });
        $('#divDummy').tooltip("show");
        return false;
    }
    $('#divDummy').tooltip("hide");
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/new-bertproject",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            $("#selProjects").append("<option value='"+ response.project_id +"'>" + response.project_name + "</option>");
            viewPage($("#btnNewProject"));
        },
        error: function (jqXHR, status, error) {
            $("#mdlMkPrjError").modal("show");
            console.error("code: ", jqXHR.status);      // error cod-+e
        }
    });
};
