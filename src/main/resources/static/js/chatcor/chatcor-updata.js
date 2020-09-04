/*
 * 
 *
 */
"use strict";

(function() {

    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");

    // 툴팁 선언
    $('#selUpProjects').tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>대상 프로젝트를 선택해 주세요.</b>"
    });

    $('#divDummyOpt').tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>용어정보 또는 문장정보를 선택해 주세요.</b>"
    });

    $('#lblSelFile').tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>업로드 파일을 선택해 주세요.</b>"
    });

    // 프로젝트 선택 초기화
    $("#selUpProjects").empty();
    $("#selUpProjects").append("<option value=''>== 선택  ==</option>");
    // 전체 프로젝트 목록 호출
    $.ajax({
        method: "POST",
        url: "/chatcor/main/projects",
        async: true,
        success: function (response, textStatus, jqXHR) {
            jQuery.each(response.project_list, function(idx, item) {
                $("#selUpProjects").append("<option value='"+ item.project_id +"'>" + item.project_name + "</option>");
            });
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });

    $('#flUpFileData').filestyle({
        icon : false,
        buttonName : 'btn-primary',
        buttonText : '선택'
    });

    $('#selUpProjects').on("change", function (evt) {
        if (!$.isEmptyObject($(this).val().trim())) {
            $('#selUpProjects').tooltip("hide");
        } else {
            $('#selUpProjects').tooltip("show");
        }
    });

    $("input[name='rdSelInfo']").on("click", function (evt) {
        $('#divDummyOpt').tooltip("hide");
    });

    $('#flUpFileData').on("change", function (evt) {
        $('#lblSelFile').tooltip("hide");
    });

    $("#btnUpData").on('click', function (evt) {
        evt.preventDefault();
        if ($.isEmptyObject($("#selUpProjects").val().trim())) {
            $('#selUpProjects').tooltip("show");
        } else {
            $('#selUpProjects').tooltip("hide");
        }
        if ($.isEmptyObject($("input[name='rdSelInfo']:checked").val())) {
            $('#divDummyOpt').tooltip("show");
        } else {
            $('#divDummyOpt').tooltip("hide");
        }
        if ($.isEmptyObject($('#flUpFileData').val())) {
            $('#lblSelFile').tooltip("show");
        } else {
            $('#lblSelFile').tooltip("hide");
        }
        fnUploadData();
    });

    $('#mdlUpDataY').on('hide.bs.modal', function (event) {
        $('#frmUpData')[0].reset();
    });

}());

var fnUploadData = function () {
    var frmData = new FormData($('#frmUpData')[0]);
    if ($.isEmptyObject($("#selUpProjects").val().trim()) ||
            $.isEmptyObject($("input[name='rdSelInfo']:checked").val()) ||
                $.isEmptyObject($('#flUpFileData').val())) {
        console.error("입력값 오류");
        return;
    } else {
        $.ajax({
            method: "POST",
            enctype: 'multipart/form-data',
            url: "/chatcor/main/upload-data",
            async: true,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            data: frmData,
            success: function (response, textStatus, jqXHR) {
                if (response.upload_status) {
                    $('#mdlUpDataY').modal("show");
                } else {
                    $('#mdlUpDataN').modal("show");
                }
            },
            error: function (jqXHR, status, error) {
                $('#mdlUpDataN').modal("show");
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    }
}