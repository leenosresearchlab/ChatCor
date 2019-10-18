/*
 * 
 *
 */
"use strict";

(function() {
    // 메인페이지 접근 시 프로넥트 선택 초기화
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


    $("#btnMkData").on('click', function (evt) {
        evt.preventDefault();
        fnMakeData();
    });

}());

var fnMakeData = function () {
    var param = $('#frmMkData').serializeObject();
    param.cbxIntent = $('#cbxIntent').is(':checked');
    param.cbxEntity = $('#cbxEntity').is(':checked');
    console.log('fnMakeData', param);
    $.ajax({
        method: "POST",
        url: "/chatcor/main/make-data",
        async: true,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            console.log('success: ', response);
            console.log('success: ', response.status);  // true/false
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}