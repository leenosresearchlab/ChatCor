/*
 * 
 *
 */
"use strict";

(function() {

    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");
    $("#selMkProjects").empty();
    $("#selMkProjects").append("<option value=''>== 선택  ==</option>");
    // 전체 프로젝트 목록 호출
    $.ajax({
        method: "POST",
        url: "/chatcor/main/projects",
        async: true,
        success: function (response, textStatus, jqXHR) {
            jQuery.each(response.project_list, function(idx, item) {
                $("#selMkProjects").append("<option value='"+ item.project_id +"'>" + item.project_name + "</option>");
            });
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });

    $("#selMkProjects").tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>대상 프로젝트를 선택해 주세요.</b>"
    });

    $("#selMkProjects").on("change", function (event) {
        event.preventDefault();
        $("#selMkProjects").tooltip("hide");
    });

    $("#btnMkData").on('click', function (evt) {
        evt.preventDefault();
        if ($.isEmptyObject($("#selMkProjects").val())) {
            $("#selMkProjects").tooltip("show");
        } else {
            $("#selMkProjects").tooltip("hide");
            fnMakeData();
        }
    });

    $("#cbxIntent, #cbxEntity").change(function () {
        if ($("#cbxIntent").is(":checked") || $("#cbxEntity").is(":checked")) {
            $('#divDummy').tooltip("hide");
        }
    });

}());

var fnMakeData = function () {
    var param = $('#frmMkData').serializeObject();
    param.cbxIntent = $('#cbxIntent').is(':checked');
    param.cbxEntity = $('#cbxEntity').is(':checked');
    if (param.cbxIntent || param.cbxEntity) {
        $.ajax({
            method: "POST",
            url: "/chatcor/main/make-data",
            async: true,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response.status) {
                    $("#mdlMakeData").modal("show");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    } else {
        var title = "<b>Intent 또는 Entity를 체크해 주세요.</b>";
        $('#divDummy').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: title,
        });
        $('#divDummy').tooltip("show");
    }
}