/*
 * 
 *
 */
"use strict";

// Intent 학습문자 리스트
var arrIntents;

var fnFillIntents = function () {
    var selProject = $("#selProjects").val();
    $("#selIntentFile").val("");
    $("#selIntentFile").empty();
    $("#selIntentFile").append("<option value=''>== 선택  ==</option>");
    $("#divUserContents *").remove();
    if (!jQuery.isEmptyObject(selProject)) {
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/list-intents/" + selProject,
            async: true,
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    $.each(response.intent_files, function (idx, item) {
                        var value = item.split(".json")[0];
                        $("#selIntentFile").append(`<option value='${idx}' data-filename='${item}'>${value}</option>`);
                    });
                } else {
                    console.error("N/A", textStatus);
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    }
};

var fnGetContentsRow = function (divId, rdId, lblFor, idx, content) {
    var rowTemplate = `<div id="${divId}" class="custom-control custom-radio ml-1">
                           <input type="radio" class="custom-control-input" id="${rdId}" name="rdContentsList" value="${idx}">
                           <label class="custom-control-label d-inline text-nowrap" for="${lblFor}">${content}</label>
                       </div>`;
    return rowTemplate;
};

var fnGetValidRow = function (valid) {
    var rowTemplate = `<div class='alert-secondary  pl-1 mb-1'><sm>${valid}</sm></div>`;
    return rowTemplate;
};

var fnGetValidRows = function (color, valid) {
    var rowTemplate = `<div class='alert-secondary text-nowrap ${color} pl-1 mb-1'><sm>${valid}</sm></div>`;
    return rowTemplate;
};

(function() {

    $('#selProjects').off("change");
    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        if ($.isEmptyObject($(this).val())) {
        	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
            $("#selIntentFile").val("");
            $("#selIntentFile").empty();
            $("#selIntentFile").append("<option value=''>== 선택  ==</option>");
            $("#divUserContents *").remove();
            $(this).tooltip("show");
            $('#divIntentBody').addClass('d-none');
        } else {
        	if($("#selProjects").val().indexOf("-BERT-") < 0){
        		$(this).tooltip("hide");
                $('#divIntentBody').removeClass('d-none');
                fnFillIntents();
        	}
        	else{
        		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
        		$("#selIntentFile").val("");
                $("#selIntentFile").empty();
                $("#selIntentFile").append("<option value=''>== 선택  ==</option>");
                $("#divUserContents *").remove();
                $(this).tooltip("show");
                $('#divIntentBody').addClass('d-none');
        	}
        }
    });

    if (!$.isEmptyObject($("#selProjects").val())) {
    	if($("#selProjects").val().indexOf("-BERT-") < 0){
    		$('#selProjects').tooltip("hide");
            $('#divIntentBody').removeClass('d-none');
            fnFillIntents();
    	}
    	else {
    		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
    	}
    } else {
    	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
        $('#selProjects').tooltip("show");
        $('#divIntentBody').addClass('d-none');
    }

    $("#btnNewIntent").on("click", function (event) {
        event.preventDefault();
        if (!$.isEmptyObject($('#selProjects').val())) {
            var tooltips = $(".tooltip-inner");
            $.each(tooltips, function (idx, item) {
                $(item).prop("parentNode").remove();
            });
            viewPage(this);
        }
    });

    $("label[for='selIntentFile']").tooltip({
        trigger: 'manul',
        placement: 'right',
        html: true,
        title: "<b><small>Intent 파일을 선택해 주세요.</small></b>"
    });

    $("#btnAddUserContents").on("click", function (event) {
        event.preventDefault();
        if ($.isEmptyObject($("#selIntentFile").val())) {
            $("label[for='selIntentFile']").tooltip("show");
            return false;
        } else {
            $("#mdlAddUserContents").modal("show");
            $("#txtUserContents").val("");
        }
    });

    $("#selIntentFile").on("click", function (event) {
        event.preventDefault();
        $("label[for='selIntentFile']").tooltip("hide");
    });

    $("#selIntentFile").on("change", function (event) {
        event.preventDefault();
        $("#divUserContents *").remove();
        $("#divValidContents *").remove();
        arrIntents = [];
        $("label[for='selIntentFile']").tooltip("hide");
        $("#divUserContents").tooltip("hide");
        if (!$.isEmptyObject($(this).val())) {
            var param = {
                project_id: $("#selProjects").val(),
                intent_id: $(this).children("option:selected").text().trim()
            };
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/sel-intents",
                contentType: 'application/json',
                dataType: "json",
                async: true,
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response.result) {
                        arrIntents = response.intent_list;
                        $.each(arrIntents, function (idx, item) {
                            var content = item.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
                            // $("#divUserContents").append(`<div class="text-left text-nowrap"><p class="mb-0">${contents}</p></div>`);
                            $("#divUserContents").append(fnGetContentsRow("divCont-".concat(idx), "rd-".concat(idx), "rd-".concat(idx), idx, content));
                        });
                        $("input[name='rdContentsList']").on("change", function (event) {
                            event.preventDefault();
                            $("#divUserContents").tooltip("hide");
                        });
                    } else {
                        console.error("N/A", textStatus);
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });


    $("#btnValidContents").on("click", function (event) {
        event.preventDefault();
        $("#divValidContents *").remove();
        if ($.isEmptyObject($("#selIntentFile").val())) {
            $("label[for='selIntentFile']").tooltip("show");
            return false;
        } else {
            $("#divValidContents *").remove();
            var param = {
                    project_id: $('#selProjects').val(),
                    intent_list: []
                }, count = 0;
            $.each(arrIntents, function (idx, item) {
                var arr = extractsPattern(item, "<", ">");
                if (!$.isEmptyObject(arr)) {
                    param.intent_list.push({
                        intent: item,
                        predicates: arr
                    });
                }
                count += arr.length;
            });
            if (count > 0) {
                var result = fnValidIntents(param);
                $.each(result, function (idx, item) {
                    var text = item.intent.replace(/</gi, "&lt;").replace(/>/gi, "&gt;");
                    if (item.status) {
                        $("#divValidContents").append(fnGetValidRows("text-dark", text));
                    } else {
                        $.each(item.valid_list, function (idx, item) {
                            if (!item.exists) {
                                var txtInvalid = text.concat(`의 &lt;${item.value}&gt; 반복관용어구가 없습니다.`);
                                $("#divValidContents").append(fnGetValidRows("text-danger", txtInvalid));
                            }
                        });
                    }
                });

            } else {
                $("#divValidContents").append(fnGetValidRows("text-dark", "문법 검증 오류가 없습니다."));
            }
        }
    });

    $("#txtFirstIntent").tooltip({
        trigger: 'manul',
        placement: 'bottom',
        html: true,
        title: "<b><small>첫번째 문형 프레임 입력 내용을 확인해 주세요.(미입력 또는 문법 오류)</small></b>"
    });

    $("#btnValidIntent").on("click", function (event) {
        event.preventDefault();
        var pattern = /[\S]@|@[\s]|@$/gi,
            param = {
                project_id: $('#selProjects').val(),
                intent_list: [
                    {
                        intent: $("#txtFirstIntent").val().trim(),
                        predicates: []
                    }
                ]
            };
        $("#divValidIntent").tooltip("hide");
        $("#divValidIntent *").remove();
        if ($.isEmptyObject(param.intent_list[0].intent) || pattern.test(param.intent_list[0].intent)) {
            $("#txtFirstIntent").tooltip("show");
            return false;
        }
        param.intent_list[0].predicates = extractsPattern(param.intent_list[0].intent, "<", ">");
        if ($.isEmptyObject(param.intent_list[0].predicates)) {
            $("#divValidIntent").append(fnGetValidRow(param.intent_list[0].intent.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")));
            $(this).data("isvalid", true);
        } else {
            var result = fnValidIntents(param)[0];
            if (result.status) {
                $("#divValidIntent").append(fnGetValidRow(result.intent.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")));
                $(this).data("isvalid", true);
            } else {
                $.each(result.valid_list, function (idx, item) {
                    if (!item.exists) {
                        var txtIntent = "&lt;".concat(item.value).concat("&gt; 반복관용어구가 없습니다.");
                        $("#divValidIntent").append(fnGetValidRow(txtIntent.replace(/</gi, "&lt;").replace(/>/gi, "&gt;")));
                    }
                });
                $(this).data("isvalid", false);
            }
        }
    });

    $("label[for='txtIntentName']").on("hidden.bs.tooltip", function (event) {
        $("label[for='txtIntentName']").data("exists", false);
    });

    $("#txtIntentName").on("blur", function (event) {
        event.preventDefault();
        if (!$.isEmptyObject($(this).val().trim())) {
            var param = {
                    project_id: $('#selProjects').val(),
                    intent_name: $(this).val().trim()
                };
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/has-intent",
                async: true,
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response) {
                        $("label[for='txtIntentName']").tooltip({
                            trigger: 'manul',
                            placement: 'bottom',
                            html: true,
                            title: "<b><small>동일한  Intent 이름이 존재 합니다.</small></b>"
                        });
                        $("label[for='txtIntentName']").tooltip("show");
                        $("label[for='txtIntentName']").data("exists", true);
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

    $("#txtIntentName, #txtFirstIntent").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
        if (event.currentTarget.id === $("#txtIntentName").prop("id")) {
            $("label[for='txtIntentName']").tooltip("hide");
        }
        $("#divValidIntent").tooltip("hide");
    });

    $("#btnCreateIntent").on("click", function (event) {
        event.preventDefault();
        var pattern = /^[a-zA-Z.]+$/gi,
            param = {
                project_id: $('#selProjects').val(),
                intent_name: $("#txtIntentName").val().trim(),
                first_intent: $("#txtFirstIntent").val().trim(),
                intent_obj: {
                    name: $("#txtIntentName").val().trim(),
                    auto: true,
                    contexts: []
                },
                usersay_list: [
                    {
                        data: [],
                        isTemplate: false,
                        count: 0,
                        updated: 0
                    }
                ]
            };
        if ($.isEmptyObject(param.intent_name) || !pattern.test(param.intent_name) || param.intent_name.length > 30) {
            $("#txtIntentName").tooltip({
                trigger: 'manul',
                placement: 'bottom',
                html: true,
                title: "<b><small>인텐트 이름은 영문 30자 이내로 공백없이 입력해 주시기 바랍니다.</small></b>"
            });
            $("#txtIntentName").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(param.first_intent)) {
            $("#txtFirstIntent").tooltip("show");
            return false;
        }
        if (!$("#btnValidIntent").data("isvalid")) {
            $("#divValidIntent").tooltip({
                trigger: 'manul',
                placement: 'top',
                html: true,
                title: "<b><small>첫번째 문형 프레임 내용에 오류가 있습니다. 수정 후 문법검증을 다시 실행해 주세요.</small></b>"
            });
            $("#divValidIntent").tooltip("show");
            return false;
        }
        if ($("label[for='txtIntentName']").data("exists")) {
            console.error("Intent 이름 중복 툴팁 존재");
            return false;
        }
        param.usersay_list[0].data = fnGetUsersays(param.first_intent);
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/new-intent",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    $("#btnValidIntent").data("isvalid", false);
                    $("#alinkIntent").trigger("click");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $("#txtUserContents").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
    });

    $("#btnMdlAddUserContents").on("click", function (event) {
        event.preventDefault();
        var param = {
                project_id: $("#selProjects").val(),
                intent_id: $("#selIntentFile option:selected").text(),
                user_content: $("#txtUserContents").val().trim(),
                usersay: {
                    data: [],
                    isTemplate: false,
                    count: 0,
                    updated: 0
                }
            };
        if ($.isEmptyObject(param.user_content)) {
            $("#txtUserContents").tooltip({
                trigger: 'manul',
                placement: 'bottom',
                html: true,
                title: "<b><small>사용자 표현 내용을 입력해 주세요.</small></b>"
            });
            $("#txtUserContents").tooltip("show");
            return false;
        } else {
            param.usersay.data = fnGetUsersays(param.user_content);
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/add-intent",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response.result) {
                        var selVal = $("#selIntentFile").val();
                        if (!$.isEmptyObject(selVal)) {
                            $("#selIntentFile").val(selVal).prop("selected", true).trigger("change");
                        }
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

    $("#divUserContents").tooltip({
        trigger: 'manul',
        placement: 'top',
        html: true,
        title: "<b><small>사용자 표현을 선택해 주세요.</small></b>"
    });

    $("#btnModContent").on("click", function (event) {
        event.preventDefault();
        var rdObj = $("input[name='rdContentsList']:checked"),
            rdVal = rdObj.val(),
            rdId = rdObj.prop("id");
        if ($.isEmptyObject(rdVal)) {
            $("#divUserContents").tooltip("show");
        } else {
            $("#txtModUserContents").val("");
            $("#mdlModUserContents").modal("show");
            $("#txtModUserContents").val($(`label[for="${rdId}"]`).text());
        }
    });

    $("#txtModUserContents").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
    });

    $("#btnMdlModUserContents").on("click", function (event) {
        event.preventDefault();
        var rdObj = $("input[name='rdContentsList']:checked"),
            rdVal = rdObj.val(),
            rdId = rdObj.prop("id"),
            txtIntent = $("#txtModUserContents").val().trim(),
            param = {
                project_id: $("#selProjects").val(),
                intent_id: $("#selIntentFile option:selected").text(),
                user_contents: [],
                usersay_list: []
            };
        if ($.isEmptyObject(txtIntent)) {
            $("#txtModUserContents").tooltip({
                trigger: 'manul',
                placement: 'bottom',
                html: true,
                title: "<b><small>사용자 표현을 입력해 주세요.</small></b>"
            });
            $("#txtModUserContents").tooltip("show");
            return false;
        } else {
            $("#txtModUserContents").tooltip("hide");
            arrIntents.splice(rdVal, 1, txtIntent);
            param.user_contents = arrIntents;
            $.each(arrIntents, function (idx, item) {
                var usersay = {
                    data: [],
                    isTemplate: false,
                    count: 0,
                    updated: 0
                };
                usersay.data = fnGetUsersays(item);
                param.usersay_list.push(usersay);
            });
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/mod-intent",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response.result) {
                        $(`label[for='${rdId}']`).text(txtIntent);
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

    $("#btnDelContent").on("click", function (event) {
        event.preventDefault();
        var rdObj = $("input[name='rdContentsList']:checked"),
            rdVal = rdObj.val(),
            param = {
                project_id: $("#selProjects").val(),
                intent_id: $("#selIntentFile option:selected").text(),
                user_contents: [],
                usersay_list: []
            };
        if ($.isEmptyObject(rdVal)) {
            $("#divUserContents").tooltip("show");
        } else {
            arrIntents.splice(rdVal, 1);
            param.user_contents = arrIntents;
            $.each(arrIntents, function (idx, item) {
                var usersay = {
                    data: [],
                    isTemplate: false,
                    count: 0,
                    updated: 0
                };
                usersay.data = fnGetUsersays(item);
                param.usersay_list.push(usersay);
            });
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/del-intent",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response.result) {
                        rdObj.parent().remove();
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

}());

var fnValidIntents = function (param) {
    var result;
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/valid-intent",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        async: false,
        success: function (response, textStatus, jqXHR) {
            result = response;
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
    return result;
};

var fnGetUsersays = function (intent) {
    var usersays = [], data = [], st = 0, en = 0;
    while (true) {
        if (intent.startsWith("@", st)) {
            en = intent.indexOf(" ", st);
            if (en < 0) {
                data.push(intent.substring(st).trim());
                break;
            } else {
                data.push(intent.substring(st, en).trim());
            }
            st = en;
        } else {
            intent = intent.substring(st).trim();
            st = 0;
            en = intent.indexOf("@", st);
            if (en < 0) {
                data.push(intent.substring(st).trim());
                break;
            } else {
                data.push(intent.substring(st, en).trim());
            }
            st = en;
        }
    }
    $.each(data, function (idx, item) {
        var obj = {};
        if (!$.isEmptyObject(item)) {
            if (item.startsWith("@")) {
                obj.text = item;
                obj.alias = item;
                obj.meta = item;
                obj.userDefined = true;
            } else {
                obj.text = " ".concat(item).concat(" ");
                obj.userDefined = false;
            }
            usersays.push(obj);
        }
    });
    usersays[0].text = usersays[0].text.trimLeft();
    usersays[usersays.length - 1].text = usersays[usersays.length - 1].text.trimRight();
    return usersays;
};