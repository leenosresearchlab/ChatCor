/*
 * 
 *
 */
"use strict";

(function() {
    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");

    // 메인페이지 접근 시 프로젝트 선택 초기화
    $("#selProjects").empty();
    $("#selProjects").append("<option value=''>== 선택  ==</option>");
    // 전체 프로젝트 목록 호출
    $.ajax({
        method: "POST",
        url: "/chatcor/main/projects",
        async: true,
        success: function (response, textStatus, jqXHR) {
            jQuery.each(response.project_list, function(idx, item) {
                $("#selProjects").append("<option value='"+ item.project_id +"'>" + item.project_name + "</option>");
            });
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });

    $("#alinkLogout").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            method : "POST",
            url : "/chatcor/main/logout",
            success : function(data) {
                window.location = "/chatcor";
            },
            error: function (jqXHR, status, error) {
                console.error(jqXHR.responseJSON.message);
            }
        });
    });

}());