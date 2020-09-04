/*
 * 
 *
 */
"use strict";

(function() {

    $('#selProjects').off("change");
    $("#selProjects").empty();
    $("#selProjects").append("<option value=''>== 선택  ==</option>");

    $("#txtLoginEmail, #pwdLogin").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
    });

    $("#btnLogin").on("click", function (event) {
        event.preventDefault();
        var txtEmail = $("#txtLoginEmail").val().trim(),
            txtPwd = $("#pwdLogin").val().trim();
        if ($.isEmptyObject(txtEmail)) {
            $("#txtLoginEmail").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>이메일을 입력해 주세요.</b>"
            });
            $("#txtLoginEmail").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(txtPwd)) {
            $("#pwdLogin").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>비밀번호를 입력해 주세요.</b>"
            });
            $("#pwdLogin").tooltip("show");
            return false;
        }
        $.ajax({
            method: "POST",
            url: "/chatcor/main/login",
            async: true,
            data: { txtLoginEmail: txtEmail, pwdLogin: txtPwd },
            success: function (response, textStatus, jqXHR) {
                window.location = "/chatcor";
            },
            error: function (jqXHR, status, error) {
                console.error(jqXHR.responseJSON.message);
                $("#mdlLoginFailed").modal("show");
            }
        });
    });

    $("#mdlLoginFailed").on("hidden.bs.modal", function (event) {
        event.preventDefault();
        $('#txtLoginEmail').val("");
        $('#pwdLogin').val("");
    });

}());