/*
 * 
 *
 */
"use strict";

(function() {
    // 메인페이지 접근 시 프로넥트 선택 초기화
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

    $("#btnUpData").on('click', function (evt) {
        evt.preventDefault();
        fnUploadData();
    });

}());

var fnUploadData = function () {
    var frmData = new FormData($('#frmUpData')[0]);
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
            console.log('success: ', response);
            console.log('success: ', response.status);  // true/false
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
}