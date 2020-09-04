/*
 * 
 *
 */
"use strict";

(function() {

    $('#selProjects').off("change");
    $("#selProjects").empty();
    $("#selProjects").append("<option value=''>== 선택  ==</option>");

    $("#txtUserName, #txtUserEmail, #pwdUserPassword1, #pwdUserPassword2").on("focus", function (event) {
        event.preventDefault();
        $(this).tooltip("hide");
        $("label[for='txtUserEmail']").tooltip("hide");
    });

    $("#btnAccount").on("click", function (event) {
        event.preventDefault();
        var ptnEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/gi,
            txtUserName = $("#txtUserName").val().trim(), 
            txtEmail = $("#txtUserEmail").val().trim(), 
            txtPwd1 = $("#pwdUserPassword1").val().trim(), 
            txtPwd2 = $("#pwdUserPassword2").val().trim(),
            param = {};
        if ($.isEmptyObject(txtUserName) || getByteLength(txtUserName) > 45) {
            $("#txtUserName").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>정확한 사용자 이름을 입력해 주세요.</b>"
            });
            $("#txtUserName").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(txtEmail) || !ptnEmail.test(txtEmail) || getByteLength(txtEmail) > 50) {
            $("#txtUserEmail").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>정확한 이메일을 입력해 주세요.</b>"
            });
            $("#txtUserEmail").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(txtPwd1) || (getByteLength(txtPwd1) < 8 || getByteLength(txtPwd1) > 16)) {
            $("#pwdUserPassword1").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>정확한 비밀번호를 입력해 주세요.</b>"
            });
            $("#pwdUserPassword1").tooltip("show");
            return false;
        }
        if ($.isEmptyObject(txtPwd2) || txtPwd1 !== txtPwd2) {
            $("#pwdUserPassword2").tooltip({
                trigger: 'manual',
                placement: 'right',
                html: true,
                title: "<b>정확한 비밀번호를 입력해 주세요.</b>"
            });
            $("#pwdUserPassword2").tooltip("show");
            return false;
        }
        param.user_name = txtUserName;
        param.user_email = txtEmail;
        param.user_pwd = txtPwd1;
        console.log("new account", param);
        $.ajax({
            method: "POST",
            url: "/chatcor/main/new-account",
            async: true,
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(param),
            success: function (response, textStatus, jqXHR) {
                if (response) {
                    $("#mdlNewAccount").modal("show");
                } else {
                    console.error("Fail to create new account!");
                }
            },
            error: function (jqXHR, status, error) {
                console.error("code: ", jqXHR.status);      // error code
            }
        });
    });

    $("#mdlNewAccount").on("hidden.bs.modal", function (event) {
        event.preventDefault();
        window.location = "/chatcor";
    });

    $("#txtUserEmail").on('blur', function (evt) {
        // 이메일 입력값 유효성 확인 후  유일성  체크
        evt.preventDefault();
        var txtEmail = $(this).val().trim(),
            ptnEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/gi;
        $("label[for='txtUserEmail']").tooltip("hide");
        if (txtEmail.length > 0 && ptnEmail.test(txtEmail)) {
            $.ajax({
                method: "POST",
                url: "/chatcor/main/has-email",
                async: true,
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify({ user_email: txtEmail }),
                success: function (response, textStatus, jqXHR) {
                    if (response) {
                        $("label[for='txtUserEmail']").tooltip({
                            trigger: 'manual',
                            placement: 'right',
                            html: true,
                            title: "<b>동일한 사용자 이메일 주소가 존재합니다.</b>"
                        });
                        $("label[for='txtUserEmail']").tooltip("show");
                    }
                },
                error: function (jqXHR, status, error) {
                    console.error("code: ", jqXHR.status);      // error code
                }
            });
        }
    });

}());