$(document).ready( function () {
    $("#errorMessage").hide();
  });


function login() {
    let username = $('#uname').val();
    let password = $('#password').val();
    $.get({
        "url": "/admin/user" ,
        "data": {
            "user_name": username,
            "password": password
        },
        "success" : function(responseData) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(responseData));
            window.location.href = "index.html";
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $("#errorMessage").text(jqXHR.responseText);
            $("#errorMessage").show();
        }
    })
}