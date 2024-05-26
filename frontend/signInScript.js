$(document).ready( function () {
    $("#passwordValidation").hide();
    $("#signInConfirmed").hide();
    $("#errorMessage").hide();
  });


function signin() {
    let username = $('#uname').val();
    let firstname = $('#fname').val();
    let lastname = $('#lname').val();
    let password = $('#password').val();
    let confPassword = $('#confPassword').val();
    if(password != confPassword)
    {
        $("#passwordValidation").text("Passwords don't match");
        $("#passwordValidation").show();
        return;
    }
    //password match
    let data = {
        "user_name" : username,
        "first_name" : firstname,
        "last_name" : lastname,
        "password" : password
    }
    $.post({
        "url": "/admin/user",
        "contentType" : 'application/json',
        "data": JSON.stringify(data),
        "success" : function(responseData) {
            $("#signInForm").hide();
            $("#signInConfirmed").show();
            $("#errorMessage").show();
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $("#errorMessage").text(jqXHR.responseText);
        }
    })
}