$(document).ready( function () {
    $("#errorMessage").hide();

    const userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
    $("#userName").val(userData.user_name);
    $("#firstName").val(userData.first_name);
    $("#lastName").val(userData.last_name);
  });


function updateProfile() {
    let userName = $('#userName').val();
    let password = $('#password').val();
    let confPassword = $('#confPassword').val();
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let userData = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if(password == "")
    {
        $("#passwordValidation").text("Password is empty.");
        $("#passwordValidation").show();
        return;
    }
    if(password != confPassword)
    {
        $("#passwordValidation").text("Passwords don't match");
        $("#passwordValidation").show();
        return;
    }

    let data = {
        "user_name": userName,
        "password": password,
        "first_name": firstName,
        "last_name": lastName,
        "id": userData.id
    }

    $.ajax({
        "url": "https://localhost/admin/user",
        "contentType" : 'application/json',
        "type": "PUT",
        "data": JSON.stringify(data),
        "success" : function(responseData) {
            userData.user_name = userName;
            userData.first_name = firstName;
            userData.last_name = lastName;
            userData.password = password;
            sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
            window.location.href = "profile.html";
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $("#errorMessage").text(jqXHR.responseText);
            $("#errorMessage").show();
        }
    })
}

function logOut(){
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "logIn.html";
}