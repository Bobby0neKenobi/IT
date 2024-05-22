$(document).ready( function () {
    adjustElementVisibility();
  });

function getUserInfo() {
    return {
        username: "Veskinz"
    };
}

function adjustElementVisibility(){
    var userInfo = getUserInfo();
    if(userInfo == null){
        $("#menuLogOut").hide();
        $("#menuProfile").hide();
        $("#menuProfile").hide();
        $("#menuSignin").show();
        $("#menuLogin").show();
    }
    else{
        $("#menuSignin").hide();
        $("#menuLogin").hide();
        $("#menuLogOut").show();
        $("#menuProfile").show();
        $("#username").text(userInfo.username);

    }
}