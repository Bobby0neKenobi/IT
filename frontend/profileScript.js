$(document).ready( function () {
    $("#errorMessage").hide();

    $.get({
        "url": "https://localhost/admin/user",
        "dataType": "json",
        "data": {
            "id": JSON.parse(sessionStorage.getItem("loggedInUser")).id
        },
        "success" : function(responseData) {
            const userData = responseData.user[0];
            $("#profileDetails").append("<div>User Name: " + userData.user_name + "</div>");
            $("#profileDetails").append("<div>First Name: " + userData.first_name + "</div>");
            $("#profileDetails").append("<div>Last Name: " + userData.last_name + "</div>");
            $("#profileDetails").append("<div>Created Date: " + new Date(userData.created_date).toLocaleString() + "</div>");
        },
        "error": function(jqXHR, textStatus, errorThrown) {
            $("#errorMessage").text(jqXHR.responseText);
            $("#errorMessage").show();
        }
    })
  });

function logOut(){
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "logIn.html";
}