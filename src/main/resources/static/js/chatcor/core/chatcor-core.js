/*
 * ChatCor 코어 자바스크립트 (시스템 공통 등)
 *
 */
"use strict";

/* 즉시실행함수 (공통기능 선언) */
(function () {
	console.log('core tooltip');
    // 프로젝트 선택 툴팁
    $('#selProjects').tooltip({
        trigger: 'manual',
        placement: 'right',
        html: true,
        title: "<b>프로젝트를 선택해 주세요.</b>",
    });

    $(".sidebar a").click(function (event) {
        var tooltips = $(".tooltip-inner");
        $.each(tooltips, function (idx, item) {
            $(item).prop("parentNode").remove();
        });
    });

    // 로그인 버튼
    $("#btnLogin").on("click", function (event) {
        $('#txtLoginEmail').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: "<b>이메일 체크...</b>",
        });
        $('#txtLoginEmail').tooltip("show");
        $('#pwdLogin').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: "<b>비밀번호 & 이메일 오류</b>",
        });
        $('#pwdLogin').tooltip("show");
    });

}());

/*
 * ChatCor 개별 페이지  로드 메소드
 * 
 * obj: 설정된 jQuery data-path에 따른 페이지를 로드
 */
var viewPage = function (obj) {
    $("#content-wrapper").load('/chatcor/main/navi', "viewName="+$(obj).data("path"));
}

var loadHtml = function (obj) {
    var page = $(obj).data("path");
    $("#content-wrapper").load(`/chatcor/biz/${page}`);
}

/*
 * 로그인 모달 다이얼로그 표시
 */
var fnLogin = function (obj) {
    $("#mdlLogin").modal("show");
}

/*
 * 선택한 Form의 모든 입력 항목을 Json Object로 반환
 */
jQuery.fn.serializeObject = function() {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function() {
                    obj[this.name] = this.value;
                });
            } //if ( arr ) {
        }
    } catch (e) {
        console.error(e.message);
    } finally {
        ;   // N/A
    }
    return obj;
};

/*
 * 현재 날짜와 시간을 (YYYY/MM/DD HH24:MI) 형태로 반환
 */
jQuery.fn.getDateTime = function() {
    var date = new Date();
    return date.getFullYear() + "/"
        + ("0" + (date.getMonth()+1)).slice(-2) + "/"
        + ("0" + (date.getDate())).slice(-2) + " "
        + ("0" + (date.getHours())).slice(-2) + ":"
        + ("0" + (date.getMinutes())).slice(-2);
};

/*
 * 문자열로 부터 특정 패턴 사이의 문자열을 배열로 추출 (String 프로토타입)
 * 
 *  originString: 추출 대상 문자열
 *  stPattern: 시작 패턴
 *  enPattern: 종료 패턴
 * 
 */
var extractsPattern = function (originString, stPattern, enPattern) {
    var stIdx = 0, enIdx = 0, extracts = [];
    while (true) {
        stIdx = originString.indexOf(stPattern, stIdx);
        if (stIdx < 0) {
            break;
        }
        enIdx = originString.indexOf(enPattern, stIdx + 1);
        if (enIdx < 0) {
            break;
        }
        extracts.push(originString.substring(stIdx + 1, enIdx));
        stIdx = enIdx + 1;
    }
    return extracts;
};

/* 문자열 Byte 계산 */
var getByteLength = function (str) {
    var b, c, i;
    for(b = i = 0; c = str.charCodeAt(i++); b += c>>11 ? 3 : c>>7 ? 2 : 1);
    return b;
}