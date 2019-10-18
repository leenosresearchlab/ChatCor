/*
 * ChatCor 코더 자바스크립트 (시스템 공통 등)
 *
 */
"use strict";

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