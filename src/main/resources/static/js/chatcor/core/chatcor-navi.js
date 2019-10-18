/*
 * 
 *
 */
"use strict";

var viewPage = function (obj) {
	$("#content-wrapper").load('/chatcor/main/navi', "viewName="+$(obj).data("path"));
}
