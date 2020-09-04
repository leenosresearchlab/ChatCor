/*
 * 
 *
 */
"use strict";

var fnGetBertProject = function (obj) {
	$("#selBertFile").empty();
	if (!$.isEmptyObject($("#selProjects").val())) {
		var param = {
                project_id: $("#selProjects").val(),               
                BertFile_Type: $("#selBertEdit").val()
                };
		$.ajax({
	        method: "POST",
	        url: "/chatcor/biz/get-bertProject",
	        async: true,
	        contentType: 'application/json',
	        dataType: "json",
	        data: JSON.stringify(param),
	        success: function (response, textStatus, jqXHR) {
	            if (response) {
	            	var backyn = response.backupfileList;
	            	$("#spanProjectVersion").text("버전정보 : " + response.version);
	            	$("#selBertFile").append("<option value=''>== 선택  ==</option>");
	                $.each(response.fileList, function (idx, item) {
	                    var value = item;
	                    $("#selBertFile").append(`<option value='${value}' data-filename='${item}'>${value}</option>`);	                    
	                });
	                
	                if(backyn[0] != "false"){
	                	$("#selBertFile").append("<option value=''>== 백업파일  ==</option>");
	                $.each(response.backupfileList, function (idx, item) {
	                	var backupyn = "BackUp";
	                	var value = item;
	                    
	                    $("#selBertFile").append(`<option value='${backupyn}' name='${backupyn}' data-filename='${item}'>${value}</option>`);	
	                    });
	                }
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

var fnReadBertProject = function () {
	if (!$.isEmptyObject($("#selProjects").val())) {
		//$("#selBertFile").empty();
		var txtvername = $("#spanProjectVersion").text();
		var versionName = txtvername.substring(txtvername.lastIndexOf("v"));
		var param = {
                project_id: $("#selProjects").val(),
                BertFile_Type: $("#selBertEdit").val(),
                BertFile_name: $("#selBertFile option:selected").text(),
                BertFile_Backup: $("#selBertFile").val(),
                BertFile_version: versionName
                };
		$.ajax({
	        method: "POST",
	        url: "/chatcor/biz/get-bertFile",
	        async: true,
	        contentType: 'application/json',
	        dataType: "json",
	        data: JSON.stringify(param),
	        success: function (response, textStatus, jqXHR) {
	            if (response) {
	            	$("#txtAreaBertContents").val(response.bertFile);
//	            	document.getElementById("txtAreaBertContents").value = response.bertFile;
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

var fnSaveBertProject = function () {
	if (!$.isEmptyObject($("#selProjects").val())) {
		if(!$.isEmptyObject($("#selBertEdit").val())){
			if(!$.isEmptyObject($("#selBertFile").val())){
				var txtvername = $("#spanProjectVersion").text();
				var versionName = txtvername.substring(txtvername.lastIndexOf("v"));
				var param = {
		                project_id: $("#selProjects").val(),
		                BertFile_Type: $("#selBertEdit").val(),
		                BertFile_version: versionName,
		                BertFile_name: $("#selBertFile").val(),
		                BertFile_content: $("#txtAreaBertContents").val()
		                };
				$.ajax({
			        method: "POST",
			        url: "/chatcor/biz/save-bertFile",
			        async: true,
			        contentType: 'application/json',
			        dataType: "json",
			        data: JSON.stringify(param),
			        success: function (response, textStatus, jqXHR) {
			            if (response) {
			            	if(response.result == ("success")){
			            		$("#mdlSaveComplete").modal("show");
			            	}
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
}

var fnChangeVersion = function () {
	if (!$.isEmptyObject($("#selProjects").val())) {
		if(!$.isEmptyObject($("#selBertEdit").val())){
			var txtvername = $("#spanProjectVersion").text();
			var versionName = txtvername.substring(txtvername.lastIndexOf("v")+1);
			var param = {
	                project_id: $("#selProjects").val(),
	                BertFile_Type: $("#selBertEdit").val(),
	                BertFile_version: versionName,
	                BertFile_name: $("#selBertFile").val(),
	                BertFile_content: $("#txtAreaBertContents").val()
	                };
			$.ajax({
		        method: "POST",
		        url: "/chatcor/biz/change-version",
		        async: true,
		        contentType: 'application/json',
		        dataType: "json",
		        data: JSON.stringify(param),
		        success: function (response, textStatus, jqXHR) {
		            if (response) {
		            	if(response.result == ("success")){
		            		$("#txtAreaBertContents").val("");
		            		$("#mdlCheckVersion").modal("show");
		            	}
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

$(document).ready(function() {
	var BertEditContent = ["일별 데이터", "월별 데이터", "분기별 데이터", "연차별 데이터"];
	var BertEditTag = ["Day", "Month", "Quater", "Year"];
	
    $('#selProjects').off("change");
    $('#selProjects').tooltip("hide");

    if ($.isEmptyObject($("#selProjects").val())) {
        $('#selProjects').tooltip("show");
        $('#divBertEditBody').addClass('d-none');
        $('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
    } else {
    	if($("#selProjects").val().indexOf("-BERT-") < 0){
            $('#selProjects').tooltip("show");
            $('#divBertEditBody').addClass('d-none');
        	$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 일반프로젝트 입니다. BERT 프로젝트를 선택해 주세요.</b>').tooltip('show');
    	}
    	else{
    		$('#selProjects').tooltip("hide");
            $('#divBertEditBody').removeClass('d-none');
    		$("#selBertEdit").empty();
    		$("#selBertEdit").append("<option value=''>== 선택  ==</option>");
    		for(var i in BertEditContent) {
    			$("#selBertEdit").append("<option value='" + BertEditTag[i] + "'>== " + BertEditContent[i] + " ==</option>");
    		}
    		$("#selBertFile").empty();
    	    $("#selBertFile").append("<option value=''>== 선택  ==</option>");
    	}
    };
    $('#selProjects').off("change");
    $('#selProjects').on("change", function (event) {
        event.preventDefault();
        if ($.isEmptyObject($(this).val())) {
            $('#selProjects').tooltip("show");
            $('#divBertEditBody').addClass('d-none');
            $('#selProjects').attr('data-original-title','<b>프로젝트를 선택해 주세요.</b>').tooltip('show');
        } else {
        	if($("#selProjects").val().indexOf("-BERT-") < 0){
                $('#selProjects').tooltip("show");
                $('#divBertEditBody').addClass('d-none');
        		$('#selProjects').attr('data-original-title','<b>해당 프로젝트는 일반프로젝트 입니다. BERT 프로젝트를 선택해 주세요.</b>').tooltip('show');
        	}
        	else{
        		$('#selProjects').tooltip("hide");
                $('#divBertEditBody').removeClass('d-none');
        		$("#selBertEdit").empty();
        		$("#selBertEdit").append("<option value=''>== 선택  ==</option>");
        		for(var i in BertEditContent) {
        			$("#selBertEdit").append("<option value='" + BertEditTag[i] + "'>== " + BertEditContent[i] + " ==</option>"); 
        		}
        	    $("#selBertFile").empty();
        	    $("#selBertFile").append("<option value=''>== 선택  ==</option>");
        	}
            
        }
    });
    
    $("#selBertEdit").on("change", function (event) {
    	if(!$.isEmptyObject($("#selBertEdit").val())){
    		$("#txtAreaBertContents").val("");
    		$("#selBertFile").empty();
        	fnGetBertProject();
    	}
    
    });
    
    $("#selBertFile").on("change", function (event) {
    	if(!$.isEmptyObject($("#selBertEdit").val())){
    		if(!$.isEmptyObject($("#selBertFile").val())){
            	fnReadBertProject();
    		}
    		else{
    			$("#txtAreaBertContents").val("");
    		}
    	}
    });
    $('#btnBertSave').on("click", function(event) {
    	fnSaveBertProject();		
	})
	
	$("#btnComplete").on("click", function(event) {
		$("#selBertFile").empty();
		fnGetBertProject();	
	})
	
	$("#btnChangeVersion").on("click", function(event) {
		if(!$.isEmptyObject($("#selBertEdit").val())){
			$("#mdlChangeVersion").modal("show");
		}
		else{
			$("#mdlCheckEdit").modal("show");
		}
	})
	
	$("#btnChange").on("click", function(event) {
		fnChangeVersion();
	})
	
	$("#btnCheckVersion").on("click", function(event) {
		$("#selBertFile").empty();
		fnGetBertProject();
	})
	
}());




