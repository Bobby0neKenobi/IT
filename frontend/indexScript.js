$(document).ready(function () {
    adjustElementVisibility();
});

function getUserInfo() {
    let loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser != null) {
        return JSON.parse(loggedInUser);
    }
    else {
        return null;
    }

}

function adjustElementVisibility() {
    var userInfo = getUserInfo();
    if (userInfo == null) {
        $("#menuLogOut").hide();
        $("#menuProfile").hide();
        $("#menuProfile").hide();
        $("#loggedInUser").hide();
        $("#menuSignin").show();
        $("#menuLogin").show();
    }
    else {
        $("#menuSignin").hide();
        $("#menuLogin").hide();
        $("#menuLogOut").show();
        $("#menuProfile").show();
        $("#username").text(userInfo.user_name);
        $("#loggedInUser").show();
    }
}

function logOut(){
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "logIn.html";
}