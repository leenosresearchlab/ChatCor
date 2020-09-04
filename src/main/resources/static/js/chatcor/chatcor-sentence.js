/*
 * 
 *
 */
"use strict";

// Sentence response
var objResponse;
// Sentence 작업내역 저장을 위한 전역 변수
var objSentence;
// 내용어 지정을 위한 배열
var arrContents;

 var fnGetRow = function (id, idx, jsonFile, sentence) {
     var rowTemplate = `<div class="text-truncate custom-control custom-radio ml-1">
                            <input type="radio" class="custom-control-input" id="${id}" name="rdSentenceList" value="${idx}" data-jsonfile="${jsonFile}">
                            <label class="custom-control-label d-inline" for="${id}">${sentence}</label>
                        </div>`;
     return rowTemplate;
 };

var fnListSentence = function () {
    var selProject = $("#selProjects").val();
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/list-sentence/" + selProject,
        async: false,
        success: function (response, textStatus, jqXHR) {
            $("#divSentenceList *").remove();
            // Response 복제
            objResponse = {};
            $.extend(true, objResponse, response);
            // Sentence 목록 표시
            //kjw : item갯수만큼 반복
            jQuery.each(objResponse.sentences, function(idx, item) {
                var row = fnGetRow("rdSentence-".concat(idx), item.index, item.file_name, item.sentence);
                $("#divSentenceList").append(row);
            });
            if ($.isEmptyObject(objResponse.sentences)) {
                $("#divSentenceList").append("<div class='alert alert-warning text-sm-center' role='alert'>문장 목록이 존재하지 않습니다.</div>");
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
};

(function() {
    if ($.isEmptyObject($("#selProjects").val())) {
    	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
        $('#selProjects').tooltip("show");
        $('#divSentenceBody').addClass('d-none');
    } else {
    	if($("#selProjects").val().indexOf("-BERT-") < 0){
    		$('#selProjects').tooltip("hide");
            $('#divSentenceBody').removeClass('d-none');
            fnListSentence();
    	}
    	else{
    		console.log('sentence tooltip');
    		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
    	}
    };

    $('#selProjects').off("change");
    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        if ($.isEmptyObject($(this).val())) {
        	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
            $('#selProjects').tooltip("show");
            $('#divSentenceBody').addClass('d-none');
        } else {
        	if($("#selProjects").val().indexOf("-BERT-") < 0){
                $('#selProjects').tooltip("hide");
                $('#divSentenceBody').removeClass('d-none');
        	}
        	else{
        		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
        	}

        }
        $("#alinkSentence").trigger("click");
    });

    // Sentence 목록 선택 이벤트
    $("input[name='rdSentenceList']").change(function (event) {
        var idx = $("input[name='rdSentenceList']:checked").val();
        // 선택한 Sentence 복제
        objSentence = {};
        // 내용어 선택 배열 초기화
        arrContents = new Array();
        $.extend(true, objSentence, objResponse.sentence_list[idx]);
        $("#divSentenceContent").prop("textContent", objResponse.sentences[idx].sentence);
        // Sentence 영역 생성
        fnMakeSentence();
        $("#divBtnArea").show();
        $("#divWorkingLog").show();
        $("#btnSave").data("jsonfile", $(this).data("jsonfile"));
        if ($(objSentence.sentences[0]).prop("working_logs") === undefined) {
            $(objSentence.sentences[0]).prop("working_logs", []);
        } else {
            $(objSentence.sentences[0].working_logs).each(function (idx, item) {
                var working_log = item;
                $("#ulLogList").append(`<li class="text-sm-left">${working_log}</li>`);
            });
        }
    });

    // Sentence 페이지 - 내용어 추출 버튼 이벤트
    $("#btnSave").on("click", function (event) {
        event.preventDefault();
        $("#contentModal").modal("show");
    });

    $("#txtContentFileName").on('focus', function (evt) {
        evt.preventDefault();
        $('#txtContentFileName').tooltip("hide");
    });

    // 내용어 추출  Modal dialog - 추출 버튼 이벤트
    $("#btnCntExp").on("click", function (event) {
        var param = { project_id: $("#selProjects").val(),
                      json_file: $("#btnSave").data("jsonfile"),
                      content_file: $("#txtContentFileName").val().trim(),
                      content_list: arrContents };
        event.preventDefault();
        if (param.content_file === "") {
            var title = "<b>추출할 파일이름을 입력해 주십시오.</b>";
            $('#txtContentFileName').tooltip({
                trigger: 'manual',
                placement: 'bottom',
                html: true,
                title: title,
            });
            $('#txtContentFileName').tooltip("show");
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/export-sentence",
            async: true,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    arrContents = [];
                    $("#txtContentFileName").val("");
                    $("#contentModal").modal("hide");
                    $("#contentFnModal").modal("show");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

}());

var fnGetWordBadge = function (divId, word) {
    var wordBadge = `<div id="${divId}" class="badge badge-secondary badge-h60p text-wrap d-inline-flex align-items-center justify-content-center ml-1 mr-1">${word}</div>`;
    return wordBadge;
};

var fnGetPosBadge = function (id, pos) {
    var posBadge = `<div id="${id}" class="badge badge-light border min-w74p max-w74p text-wrap font-weight-light d-inline-flex align-items-center justify-content-center">${pos}</div>`;
    return posBadge;
};

var fnGetMorpBadge = function (id, morp) {
    var morpBadge = `<span id="${id}" class="badge badge-pill badge-success badge-h40p min-w74p max-w74p text-wrap d-inline-flex align-items-center justify-content-center">${morp}</span>`;
    return morpBadge;
}

var fnGetEvalDiv = function (divId) {
    var divEval = `<div id="${divId}" class='d-flex flex-row ml-1 mr-1 mt-1 mb-1'></div>`;
    return divEval;
};

var fnGetEvalButton = function (btnId, btnClass, wordIdx, morpIdx, btnTxt) {
    var wordBadge = `<button id="${btnId}" type="button" class="btn ${btnClass} btn-sm min-w74p" data-toggle="button" data-wordidx="${wordIdx}" data-morpidx="${morpIdx}" aria-pressed="false">${btnTxt}</button>`;
    return wordBadge;
};

var fnMakeSentence = function () {
    var arrEvalIds = [], arrCnclIds = [], btnIdx = 0;
    $("#divWordList *").remove();
    $("#divEvalList *").remove();
    $("#divMorpList *").remove();
    $("#divPosList *").remove();
    $("#divCnclList *").remove();
    $("#ulLogList *").remove();
    $.each(objSentence.sentences[0].word_list, function (idx, item) {
        var width = 74 * item.morp_list.length, wordBadge = fnGetWordBadge("divWord-".concat(idx), item.word);
        $("#divWordList").append(wordBadge);
        // Word 항목 가로넓이(min-width) 강제 지정 : 기본 74px
        $("#divWord-".concat(idx)).attr("style", `min-width: ${width}px !important`);
    });
    $.each(objSentence.sentences[0].word_list, function (didx, ditem) {
        var objEvalDiv = $(fnGetEvalDiv("divEval-".concat(didx))),
            objMorpDiv = $(fnGetEvalDiv("divMorp-".concat(didx))),
            objPosDiv = $(fnGetEvalDiv("divPos-".concat(didx))),
            objCnclDiv = $(fnGetEvalDiv("divCncl-".concat(didx))),
            arrPreTglIds = [];
        $.each(ditem.morp_list, function (idx, item) {
            // word, morp, pos 생성
            var evalId  = "btnEval-".concat(btnIdx),
                btnEval = fnGetEvalButton(evalId, "btn-outline-warning", didx, idx, "분석오류"),
                bdgMorp = fnGetMorpBadge("bdgMorp".concat(idx), item.morp),
                bdgPos = fnGetPosBadge("bdgPos-".concat(idx), item.pos),
                cnclId = "btnCncl-".concat(btnIdx),
                btnCncl = fnGetEvalButton(cnclId, "btn-outline-info", didx, idx, "내용어");
            $(objEvalDiv).append(btnEval);
            $(objMorpDiv).append(bdgMorp);
            $(objPosDiv).append(bdgPos);
            $(objCnclDiv).append(btnCncl);
            // 분석오류, 내용어 기본값 지정
            if ($(item).prop("err") === undefined) {
                item.err = 0;  // error 아님
            } else {
                if ($(item).prop("err") == 1) {
                    // 토글버튼 on을 위한 배열 추가
                    arrPreTglIds.push("#".concat(evalId));
                }
            }
            if ($(item).prop("ner") === undefined) {
                item.ner = 0;  // 내용어 아님
            } else {
                if ($(item).prop("ner") == 1) {
                    // 토글버튼 on을 위한 배열 추가
                    arrPreTglIds.push("#".concat(cnclId));
                    if (arrContents.indexOf(item.morp.trim()) < 0) {
                        arrContents.push(item.morp.trim());
                    }
                }
            }
            // 분석오류 버튼 ID 배열
            arrEvalIds.push("#".concat(evalId));
            // 내용어 버튼 ID 배열
            arrCnclIds.push("#".concat(cnclId));
            // Button idx 증가
            btnIdx += 1;
        });
        $("#divEvalList").append(objEvalDiv);
        $("#divMorpList").append(objMorpDiv);
        $("#divPosList").append(objPosDiv);
        $("#divCnclList").append(objCnclDiv);
        $(arrPreTglIds.join()).addClass("active").attr("aria-pressed", "true");
    });
    // 분석오류  토글버튼 이벤트
    $(arrEvalIds.join()).on("click", function (event) {
        var word = objSentence.sentences[0].word_list[$(this).data("wordidx")],
            wordTxt = word.word.trim(),
            morp = word.morp_list[$(this).data("morpidx")],
            morpTxt = morp.morp.trim(),
            dateTime = $.fn.getDateTime();
        event.preventDefault();
        if ($(this).attr("aria-pressed") === "true") {
            morp.err = 0;   // ok
            $("#ulLogList").append(`<li class="text-sm-left">${dateTime} 분석오류 지정 해제 \"${wordTxt}\" 중 \"${morpTxt}\"</li>`);
        } else {
            morp.err = 1;   // error
            $("#ulLogList").append(`<li class="text-sm-left">${dateTime} 분석오류 지정 \"${wordTxt}\" 중 \"${morpTxt}\"</li>`);
        }
        modifySentence(event);
    });
    // 내용어 토글버튼 이벤트
    $(arrCnclIds.join()).on("click", function (event) {
        var word = objSentence.sentences[0].word_list[$(this).data("wordidx")],
            wordTxt = word.word.trim(),
            morp = word.morp_list[$(this).data("morpidx")],
            morpTxt = morp.morp.trim(),
            dateTime = $.fn.getDateTime();
        event.preventDefault();
        if ($(this).attr("aria-pressed") === "true") {
            morp.ner = 0;   // 내용어 아님
            $("#ulLogList").append(`<li class="text-sm-left">${dateTime} 내용어 지정해제 \"${wordTxt}\" 중 \"${morpTxt}\"</li>`);
            arrContents.splice(arrContents.indexOf(morpTxt), 1);
        } else {
            morp.ner = 1;   // 내용어
            $("#ulLogList").append(`<li class="text-sm-left">${dateTime} 내용어 지정 \"${wordTxt}\" 중 \"${morpTxt}\"</li>`);
            if (arrContents.indexOf(morpTxt) < 0) {
                arrContents.push(morpTxt);
            }
        }
        modifySentence(event);
    });
};

var modifySentence = function (event) {
    var sidx = $("input[name='rdSentenceList']:checked").val(),
        file_name = $("input[name='rdSentenceList']:checked").data("jsonfile"),
        project_name = $("#selProjects").val();
    event.preventDefault();
    objSentence.sentences[0].working_logs = [];
    $("#ulLogList").find('li').each(function (idx, item) {
        objSentence.sentences[0].working_logs.push($(item).text());
    });
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/modify-sentence",
        async: false,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify({ project_name: project_name, file_name: file_name, sentence: objSentence }),
        success: function (response, textStatus, jqXHR) {
            if (response.result) {
                // Sentence 목록 갱신
                objResponse.sentence_list.splice(sidx, 1, objSentence);
            } else {
                console.error('success result: ', response.result);  // false
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
};