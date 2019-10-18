/*
 * 
 *
 */
"use strict";



 var fnGetRow = function (id, idx, jsonFile, sentence) {
     var rowTemplate = `<div class="text-truncate">
                            <input type="radio" id="${id}" name="rdSentenceList" value="${idx}" data-jsonfile="${jsonFile}">
                            <span class="text-md-left">${sentence}</span>
                        </div>`;
     return rowTemplate;
 };

var fnListSentence = function () {
    var selProject = $("#selProjects").val();
    if (selProject !== "") {
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/list-sentence/" + selProject,
            async: true,
            success: function (response, textStatus, jqXHR) {
                $("#divSentenceList *").remove();
                jQuery.each(response.sentences, function(idx, item) {
                    var row = fnGetRow("rdSentence-".concat(idx), item.index, item.file_name, item.sentence);
                    $("#divSentenceList").append(row);
                });
                $("input[name='rdSentenceList']").change(function () {
                    var idx = $("input[name='rdSentenceList']:checked").val();
                    $("#divSentenceContent").prop("textContent", response.sentences[idx].sentence);
                    fnMakeSentence(response.sentences[idx].file_name, response.sentence_list[idx]);
                    $("#divWorkingLog").show();
                });
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    } else {
        var title = "<b>프로젝트를 선택해 주세요.</b>";
        $('#selProjects').tooltip({
            trigger: 'manual',
            placement: 'right',
            html: true,
            title: title,
        });
        $('#selProjects').tooltip("show");
    }
};

(function() {

    fnListSentence();

    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        $('#selProjects').tooltip("hide");
        fnListSentence();
    });

    $("#btnToggle").on("click", function (event) {
        if ($(this).attr("aria-pressed") === "true") {
            console.log("Button off");
        } else {
            console.log("Button on");
        }
    });

}());

var fnGetWordBadge = function (divId, word) {
    var wordBadge = `<div id="${divId}" class="badge badge-secondary badge-h60p text-wrap ml-1 mr-1 pt-4">${word}</div>`;
    return wordBadge;
};

var fnGetPosBadge = function (id, pos) {
    // var posBadge = `<div id="${id}" class="badge badge-light min-w74p max-w74p d-inline-flex align-items-center text-wrap font-weight-light">${pos}</div>`;
    var posBadge = `<div id="${id}" class="badge badge-light border min-w74p max-w74p text-center text-wrap font-weight-light">${pos}</div>`;
    return posBadge;
};

var fnGetMorpBadge = function (id, morp) {
    var morpBadge = `<span id="${id}" class="badge badge-pill badge-success min-w74p max-w74p text-center text-wrap">${morp}</span>`;
    return morpBadge;
}

var fnGetEvalDiv = function (divId) {
    var divEval = `<div id="${divId}" class='d-flex flex-row ml-1 mr-1 mt-1 mb-1'></div>`;
    return divEval;
};

var fnGetEvalButton = function (btnId, btnClass, btnTxt) {
    var wordBadge = `<button id="${btnId}" type="button" class="btn ${btnClass} btn-sm min-w74p" data-toggle="button" aria-pressed="false">${btnTxt}</button>`;
    return wordBadge;
};


var fnMakeSentence = function (jsonFile, sentence) {
    console.log("fnMakeSentence", jsonFile);
    console.log("fnMakeSentence", sentence);
    $("#divWordList *").remove();
    $("#divEvalList *").remove();
    $("#divMorpList *").remove();
    $("#divPosList *").remove();
    $("#divCnclList *").remove();
    $.each(sentence.sentences[0].word_list, function (idx, item) {
        var width = 74 * item.morp_list.length, wordBadge = fnGetWordBadge("divWord-".concat(idx), item.word);
        $("#divWordList").append(wordBadge);
        // Word 항목 가로넓이(min-width) 강제 지정 : 기본 74px
        $("#divWord-".concat(idx)).attr("style", `min-width: ${width}px !important`);
    });
    $.each(sentence.sentences[0].word_list, function (didx, item) {
        var objEvalDiv = $(fnGetEvalDiv("divEval-".concat(didx))),
            objMorpDiv = $(fnGetEvalDiv("divMorp-".concat(didx))),
            objPosDiv = $(fnGetEvalDiv("divPos-".concat(didx))),
            objCnclDiv = $(fnGetEvalDiv("divCncl-".concat(didx)));
        $.each(item.morp_list, function (idx, item) {
            var btnEval = fnGetEvalButton("btnEval-".concat(idx), "btn-outline-warning", "분석오류"),
                bdgMorp = fnGetMorpBadge("bdgMorp".concat(idx), item.morp),
                bdgPos = fnGetPosBadge("bdgPos-".concat(idx), item.pos),
                btnCncl = fnGetEvalButton("btnCncl-".concat(idx), "btn-outline-info", "내용어");
            $(objEvalDiv).append(btnEval);
            $(objMorpDiv).append(bdgMorp);
            $(objPosDiv).append(bdgPos);
            $(objCnclDiv).append(btnCncl);
        });
        $("#divEvalList").append(objEvalDiv);
        $("#divMorpList").append(objMorpDiv);
        $("#divPosList").append(objPosDiv);
        $("#divCnclList").append(objCnclDiv);
    });
};