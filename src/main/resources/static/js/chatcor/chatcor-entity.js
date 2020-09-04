/*
 * 
 *
 */
"use strict";

var fnFillEntries = function () {
    var selProject = $("#selProjects").val();
    $("#selEntryFile").empty();
    $("#selEntryFile").append("<option value=''>== 선택  ==</option>");
    $("#selEntityFile").empty();
    $("#selEntityFile").append("<option value=''>== 선택  ==</option>");
    if (!jQuery.isEmptyObject(selProject)) {
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/list-entries/" + selProject,
            async: true,
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    $.each(response.entries, function (idx, item) {
                        var value = item.split(".txt")[0];
                        $("#selEntryFile").append(`<option value='${idx}' data-filename='${item}'>${value}</option>`);
                    });
                    $.each(response.entities, function (idx, item) {
                        var value = item.split(".json")[0];
                        $("#selEntityFile").append(`<option value='${idx}' data-filename='${item}'>${value}</option>`);
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

var fnGetEntryRow = function (id, idx, entryName, entry) {
    var rowTemplate = `<div class="text-left custom-control custom-checkbox ml-1">
                           <input type="checkbox" id="${id}" name="${entryName}" class="custom-control-input" value="${idx}" data-entry="${entry}">
                           <label class="custom-control-label d-inline" for="${id}">${entry}</label>
                       </div>`;
    return rowTemplate;
};

var fnGetEntityRow = function (id, idx, entity, synonyms) {
    var rowTemplate = `<div class='custom-control custom-radio'>
                           <input type="radio" class="custom-control-input" id="${id}" name="rdEntityList" value="${idx}" data-synonyms="${synonyms}">
                           <label class="custom-control-label d-inline" for="${id}">${entity}</label>
                       </div>`;
    return rowTemplate;
};

(function() {

    var selProject = $("#selProjects").val();

    $('#selProjects').off("change");
    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        if ($(this).val() == "") {
        	$('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
            $("#selEntryFile").val("");
            $("#selEntryFile").empty();
            $("#selEntryFile").append("<option value=''>== 선택  ==</option>");
            $("#divEntryList *").remove();
            $("#selEntityFile").val("");
            $("#selEntityFile").empty();
            $("#selEntityFile").append("<option value=''>== 선택  ==</option>");
            $("#divEntityList *").remove();
            $('#selProjects').tooltip("show");
            $('#divEntityBodyL').addClass('d-none');
            $('#divEntityBodyR').addClass('d-none');
        } else {
        	if($("#selProjects").val().indexOf("-BERT-") < 0){
        		$('#selProjects').tooltip("hide");
                $('#divEntityBodyL').removeClass('d-none');
                $('#divEntityBodyR').removeClass('d-none');
                fnFillEntries();
        	}
        	else{
        		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
        		$("#selEntryFile").val("");
                $("#selEntryFile").empty();
                $("#selEntryFile").append("<option value=''>== 선택  ==</option>");
                $("#divEntryList *").remove();
                $("#selEntityFile").val("");
                $("#selEntityFile").empty();
                $("#selEntityFile").append("<option value=''>== 선택  ==</option>");
                $("#divEntityList *").remove();
                $('#selProjects').tooltip("show");
                $('#divEntityBodyL').addClass('d-none');
                $('#divEntityBodyR').addClass('d-none');        		
        	}
            
        }
    });

    if (!$.isEmptyObject(selProject)) {
    	if($("#selProjects").val().indexOf("-BERT-") < 0){
    		$('#selProjects').tooltip("hide");
            $('#divEntityBodyL').removeClass('d-none');
            $('#divEntityBodyR').removeClass('d-none');
            fnFillEntries();
    	}
    	else{
    		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 Bert프로젝트 입니다. 다른 프로젝트를 선택해 주세요.</b>').tooltip('show');
    	}        
    } else {
        $('#selProjects').tooltip("show");
        $('#divEntityBodyL').addClass('d-none');
        $('#divEntityBodyR').addClass('d-none');
    }

    $("#selEntryFile").on("change", function (event) {
        var param = { project_id: $("#selProjects").val(), 
                      file_name: $("#selEntryFile option:selected").data("filename") };
        event.preventDefault();
        $("#selEntityFile").tooltip("hide");
        $("#divEntityList").tooltip("hide");
        $("#divEntryList *").remove();
        if ($.isEmptyObject($("#selEntryFile").val())) {
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/sel-entries/",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    $.each(response.entries, function (idx, item) {
                        var row = fnGetEntryRow("cbxEntry-".concat(idx), idx, 'cbxEntryList', item.trim());
                        $("#divEntryList").append(row);
                    });
                    $("input[name='cbxEntryList']").on("change", function (event) {
                        event.preventDefault();
                        $("#divEntityList").tooltip("hide");
                        $("#divEntityEntries").tooltip("hide");
                    });
                } else {
                    console.error("N/A", textStatus);
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $("#selEntityFile").on('click', function (event) {
        event.preventDefault();
        $(this).tooltip('hide');
    });

    $("#selEntityFile").on("change", function (event, selVal) {
        var param = { project_id: $("#selProjects").val(),
                      entity_id: $("#selEntityFile option:selected").text(),
                      file_name: $("#selEntityFile option:selected").data("filename") };
        event.preventDefault();
        $("#selEntityFile").tooltip("hide");
        $("#divEntityList").tooltip("hide");
        $("#divInEntries").tooltip("hide");
        $("#divEntityList *").remove();
        $("#divEntityEntries, #divBtnEntries").removeClass('d-block').addClass('d-none');
        $("#divInEntries *").remove();
        if ($.isEmptyObject($("#selEntityFile").val())) {
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/sel-entities/",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response.result) {
                    $.each(response.entities, function (idx, item) {
                        var row = fnGetEntityRow("rbEntity-".concat(idx), idx, item.value.trim(), item.synonyms);
                        $("#divEntityList").append(row);
                    });
                    $("input[name='rdEntityList']").on("change", function (event) {
                        event.preventDefault();
                        $("#divInEntries").tooltip("hide");
                        $('#divEntityList').tooltip('hide');
                        $("#divEntityEntries, #divBtnEntries").removeClass('d-none').addClass('d-block');
                        $("#divInEntries *").remove();
                        if (!$.isEmptyObject($(this).data("synonyms"))) {
                            $.each($(this).data("synonyms").toString().split(","), function (idx, item) {
                                var row = fnGetEntryRow("cbxInEntry-".concat(idx), idx, 'cbxInEntryList', item.trim());
                                $("#divInEntries").append(row);
                            });
                            $("input[name='cbxInEntryList']").on("change", function (event) {
                                event.preventDefault();
                                $("#divInEntries").tooltip("hide");
                            });
                        }
                    });
                    if (!$.isEmptyObject(selVal)) {
                        $(`#${selVal}`).prop("checked", true).trigger("change");
                    }
                } else {
                    console.error("N/A", textStatus);
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $("#btnAddEntry").tooltip({
        trigger: 'hover',
        placement: 'bottom',
        html: true,
        title: "<b><small>선택한 용어(Entry)목록을 선택된 엔티티의 용어로 추가합니다.</small></b>"
    });

    $("#selEntityFile").tooltip({
        trigger: 'manual',
        placement: 'bottom',
        html: true,
        title: "<b><small>Entity 파일을 선택해 주시기 바랍니다.</small></b>"
    });

    $("div").on('click', "input[name='rdEntityList']", function (event) {
        event.stopPropagation();
        $('#divEntityList').tooltip('hide');
        $("#divEntityEntries").tooltip("hide");
    });

    $("#btnAddEntry").on("click", function (event) {
        event.preventDefault();
        var entries = $("input[name='cbxEntryList']:checked");
        if (entries.length === 0) {
            return false;
        } else {
            if ($.isEmptyObject($("#selEntityFile").val())) {
                $("#selEntityFile").tooltip("show");
                return false;
            } else {
                if ($.isEmptyObject($("input[name='rdEntityList']:checked").val())) {
                    $("#divEntityList").tooltip({
                        trigger: 'manul',
                        placement: 'top',
                        html: true,
                        title: "<b><small>추가 대상 엔티티를 선택해 주세요.</small></b>"
                    });
                    $("#divEntityList").tooltip("show");
                    return false;
                }
                var flag = false, arrLabel = [];
                $.each($("#divInEntries > div > label"), function (idx, item) {
                    arrLabel.push($(item).text().trim());
                });
                $.each(entries, function (idx, item) {
                    var val = $(item).data("entry").trim();
                    if (arrLabel.indexOf(val) >= 0) {
                        flag = true;
                        return false;
                    }
                });
                if (flag) {
                    $("#divEntityEntries").tooltip({
                        trigger: 'manual',
                        placement: 'top',
                        html: true,
                        title: "<b><small>동일한 이름의 용어가 존재 합니다.</small></b>"
                    });
                    $("#divEntityEntries").tooltip("show");
                    return false;
                } else {
                    var rid = $("input[name='rdEntityList']:checked").prop("id"),
                    param = { 
                        project_id: $("#selProjects").val(),
                        entity_id: $("#selEntityFile option:selected").text(),
                        entity_value: $(`label[for='${rid}']`).text(),
                        entry: []
                    };
                    $.each(entries, function (idx, item) {
                        param.entry.push($(item).data('entry'));
                    });
                    $.ajax({
                        method: "POST",
                        url: "/chatcor/biz/add-entry/",
                        contentType: 'application/json',
                        dataType: "json",
                        data: JSON.stringify(param),
                        success: function (response, textStatus, jqXHR) {
                            if (response.result) {
                                $("#txtInEntryName").val("");
                                $("#mdlNewInEntry").modal("hide");
                                $("#selEntityFile").val($("#selEntityFile").val()).trigger("change", rid);
                                $("input[name='cbxEntryList']").prop('checked', false);
                            } else {
                                console.error("N/A", textStatus);
                            }
                        },
                        error: function (jqXHR, status, error) {
                            console.error("code: ", jqXHR.status);      // error code
                        }
                    });
                }
            }
        }
    });

    $("#btnNewEntity").on("click", function (event) {
        event.preventDefault();
        if ($.isEmptyObject($("#selEntityFile").val())) {
            $("#selEntityFile").tooltip("show");
            return false;
        } else {
            $("#txtEntityName").val("");
            $("#mdlNewEntity").modal("show");
        }
    });

    $("#txtEntityName").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
        $("#btnMdlNewEntity").tooltip("hide");
    });

    $("#btnMdlNewEntity").on("click", function (event) {
        event.preventDefault();
        var txtEntity = $("#txtEntityName").val().trim(), arrLabel = [];
        if ($.isEmptyObject(txtEntity)) {
            $("#txtEntityName").tooltip({
                trigger: 'manual',
                placement: 'bottom',
                html: true,
                title: "<b><small>엔티티 이름을 입력해 주세요.</small></b>"
            });
            $("#txtEntityName").tooltip("show");
            return false;
        } else {
            $.each($("#divEntityList > div > label"), function (idx, item) {
                arrLabel.push($(item).text().trim());
            });
            if (arrLabel.indexOf(txtEntity) >= 0) {
                $("#btnMdlNewEntity").tooltip({
                    trigger: 'manual',
                    placement: 'right',
                    html: true,
                    title: "<b><small>동일한  Entity 이름이 존재 합니다.</small></b>"
                });
                $("#btnMdlNewEntity").tooltip("show");
                return false;
            } else {
                fnAddEntity([{
                    value: txtEntity,
                    synonyms: [txtEntity]
                }]);
                $("#txtEntityName").val("");
                $("#mdlNewEntity").modal("hide");
            }
        }
    });

    $("#btnDelEntry").tooltip({
        trigger: 'hover',
        placement: 'top',
        html: true,
        title: "<b><small>선택된 용어(Entry)를 엔티티에서 삭제합니다.</small></b>"
    });

    $("#btnDelEntry").on("click", function (event) {
        event.preventDefault();
        var entries = $("input[name='cbxInEntryList']:checked");
        if (entries.length === 0) {
            if ($("input[name='cbxInEntryList']").length > 0) {
                $("#divInEntries").tooltip({
                    trigger: 'manul',
                    placement: 'top',
                    html: true,
                    title: "<b><small>삭제할 용어를 선택해 주세요.</small></b>"
                });
                $("#divInEntries").tooltip("show");
            }
            return false;
        } else {
            var rid = $("input[name='rdEntityList']:checked").prop("id"),
                param = { 
                    project_id: $("#selProjects").val(),
                    entity_id: $("#selEntityFile option:selected").text(),
                    entity_value: $(`label[for='${rid}']`).text(),
                    synonyms: []
                };
            $.each($("input[name='cbxInEntryList']:unchecked"), function (idx, item) {
                param.synonyms.push($(item).data("entry"));
            });
            // 전체 엔트리 삭제시 Entity의 기본값(value)를 동의어에 추가함.
//            if (param.synonyms.length === 0) {
//                param.synonyms.push(param.entity_value);
//            }
            $.ajax({
                method: "POST",
                url: "/chatcor/biz/del-entries/",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(param),
                success: function (response, textStatus, jqXHR) {
                    if (response.result) {
                        $("input[name='cbxInEntryList']").prop("checked", false);
                        $("#selEntityFile").val($("#selEntityFile").val()).trigger("change", rid);
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

    $("#btnNewEntry").tooltip({
        trigger: 'hover',
        placement: 'bottom',
        html: true,
        title: "<b><small>선택된 엔티티에 용어(Entry)를 임의로 추가합니다.</small></b>"
    });

    $("#btnNewEntry").on("click", function (event) {
        event.preventDefault();
        if ($("input[name='rdEntityList']:checked").length > 0) {
            $("#txtInEntryName").val("");
            $("#mdlNewInEntry").modal("show");
        }
    });

    $("#txtInEntryName").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
        $("#btnMdlNewInEntry").tooltip("hide");
    });

    $("#btnMdlNewInEntry").on("click", function (event) {
        event.preventDefault();
        var txtEntry = $("#txtInEntryName").val().trim(), arrLabel = [];
        if ($.isEmptyObject(txtEntry)) {
            $("#txtInEntryName").tooltip({
                trigger: 'manul',
                placement: 'bottom',
                html: true,
                title: "<b>용어 이름을 입력해 주세요.</b>"
            });
            $("#txtInEntryName").tooltip("show");
            return false;
        } else {
            $.each($("#divInEntries > div > label"), function (idx, item) {
                arrLabel.push($(item).text().trim());
            });
            if (arrLabel.indexOf(txtEntry) >= 0) {
                $("#btnMdlNewInEntry").tooltip({
                    trigger: 'manul',
                    placement: 'right',
                    html: true,
                    title: "<b>동일한 용어 이름이 존재 합니다.</b>"
                });
                $("#btnMdlNewInEntry").tooltip("show");
                return false;
            } else {
                var rid = $("input[name='rdEntityList']:checked").prop("id"),
                    param = { 
                        project_id: $("#selProjects").val(),
                        entity_id: $("#selEntityFile option:selected").text(),
                        entity_value: $(`label[for='${rid}']`).text(),
                        entry: [txtEntry]
                    };
                $.ajax({
                    method: "POST",
                    url: "/chatcor/biz/add-entry/",
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify(param),
                    success: function (response, textStatus, jqXHR) {
                        if (response.result) {
                            $("#txtInEntryName").val("");
                            $("#mdlNewInEntry").modal("hide");
                            $("#selEntityFile").val($("#selEntityFile").val()).trigger("change", rid);
                        } else {
                            console.error("N/A", textStatus);
                        }
                    },
                    error: function (jqXHR, status, error) {
                        console.error("code: ", jqXHR.status);      // error code
                    }
                });
            }
        }
    });

    $("#btnNewEntityFile").on("click", function (event) {
        event.preventDefault();
        if (!$.isEmptyObject($("#selProjects").val())) {
            $("#mdlNewEntityFile").modal("show");
        }
    });

    $("#txtEntityFileName").on("focus", function (event) {
        event.preventDefault();
        $("#txtEntityFileName").tooltip("hide");
    });

    $("#txtFirstEntityName").on("focus", function (event) {
        event.preventDefault();
        $("#txtFirstEntityName").tooltip("hide");
    });

    $("#btnMdlNewEntityFile").on("click", function (event) {
        event.preventDefault();
        var pattern = /^[a-zA-Z.]+$/gi,
            param = {
                project_id: $("#selProjects").val(),
                entity_fileName: $("#txtEntityFileName").val().trim(),
                first_entityId: $("#txtFirstEntityName").val().trim(),
                entity: {},
                entries: []
            };
        if ($.isEmptyObject(param.entity_fileName) || !pattern.test(param.entity_fileName) || param.entity_fileName.length > 25) {
            $("#txtEntityFileName").tooltip({
                trigger: 'manul',
                placement: 'right',
                html: true,
                title: "<b>엔티티 파일 이름은 영문 25자 이내로 공백없이 입력해 주시기 바랍니다.</b>"
            });
            $("#txtEntityFileName").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(param.first_entityId)) {
            $("#txtFirstEntityName").tooltip({
                trigger: 'manul',
                placement: 'right',
                html: true,
                title: "<b>첫번째 Entity ID 이름을 입력해 주세요.</b>"
            });
            $("#txtFirstEntityName").tooltip("show");
            return false;
        }
        // Entity Object 설정
        param.entity = { "name": param.entity_fileName,
                         "isOverridable": true,
                         "isEnum": false,
                         "isRegexp": false,
                         "automatedExpansion": false,
                         "allowFuzzyExtraction": false };
        // Entry 리스트 설정
        param.entries.push({
            "value": param.first_entityId,
            // "synonyms": [param.first_entityId]
            "synonyms": []
        });
        $.ajax({
            method: "POST",
            url: "/chatcor/biz/new-entityfile/",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                $("#mdlNewEntityFile").modal("hide");
                if (response.result) {
                    $("#mdlEntityFileSuccess").modal("show");
                } else {
                    $("#mdlEntityFileFail").modal("show");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $('#mdlNewEntityFile').on('hide.bs.modal', function (event) {
        $("#txtEntityFileName").val("");
        $("#txtFirstEntityName").val("");
    });

    $('#mdlEntityFileSuccess').on('hidden.bs.modal', function (event) {
        $("#alinkEntity").trigger("click");
    });

}());

var fnAddEntity = function (entities) {
    var param = {
            project_id: $("#selProjects").val(),
            entity_id: $("#selEntityFile option:selected").text(),
            entities: entities
        };
    $.ajax({
        method: "POST",
        url: "/chatcor/biz/add-entities/",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(param),
        success: function (response, textStatus, jqXHR) {
            if (response.result) {
                $("#selEntityFile").val($("#selEntityFile").val()).trigger("change");
            } else {
                console.error("N/A", textStatus);
            }
        },
        error: function (jqXHR, status, error) {
            console.error("code: ", jqXHR.status);      // error code
        }
    });
};