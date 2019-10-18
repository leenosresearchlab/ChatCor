/*
 * 
 *
 */
"use strict"; // Start of use strict
/*
 $(function() {
 $("#frmProject").validate();
 // XXX: 유효성 오류 발생 시 툴팁 형태로 표시함
 $('#txtProjectName').tooltip({'trigger':'focus', 'placement': 'right', 'title': 'Project name tooltip Project name tooltip Project name tooltip'});
 });
 */
// FIXME: 즉시 실행함수 (폼 이벤트 등록 등 처리) 
(function() {

    $("#txtProjectName").on('propertychange change keyup paste input', function (evt) {
        evt.preventDefault();
        // TODO: 최대입력 가능 글자 수 체크, 입력가능 문자(스페이스 입력 불가 등) 체크
//        var currentVal = $(this).val();
//        if (currentVal == oldVal) {
//            return;
//        }
//        oldVal = currentVal;
        console.log('Input val: ', $(this).val());
    });

    $("#txtProjectName").on('focus', function (evt) {
        evt.preventDefault();
        $('#txtProjectName').tooltip("hide");
    });

    $("#txtProjectName").on('blur', function (evt) {
        // 프로젝트 이름 입력 여부(최소 글자) 확인 후 동일이름 존재여부 체크
        evt.preventDefault();
        if ($(this).val().length > 0) {
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/has-project/" + $(this).val(),
                async: true,
                success: function (response, textStatus, jqXHR) {
                    if (response) {
                        var title = "<b>같은 이름의 프로젝트가 존재합니다.</b>";
                        $('#txtProjectName').tooltip({
                            trigger: 'manual',
                            placement: 'right',
                            html: true,
                            title: title,
                        });
                        $('#txtProjectName').tooltip("show");
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

    $("#btnNewProject").on('click', function (evt) {
        evt.preventDefault();
        fnNewProject(evt);
    });

}());

var fnNewProject = function (obj) {
    // var param = $('#frmProject').serialize();  // XXX: name=val&name&val (폼 시리얼라이즈)
    var param = $('#frmProject').serializeObject();
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/new-project",
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
};
