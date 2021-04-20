var chosenButton = ""
var BASE_URL = "http://192.168.56.101/blog/php/";

function editButton(buttonID) {
    chosenButton = buttonID;
    var buttonIds = ["poor", "good", "excellent"]
    for (var i = 0; i < buttonIds.length; i++) {
        $("#" + buttonIds[i]).removeAttr("class");
        if (buttonIds[i] != buttonID) {
            $("#" + buttonIds[i]).addClass("btn btn-outline-primary");
        }
        else {
            $("#" + buttonIds[i]).addClass("btn btn-primary");
        }
    }
}

function createPost() {
    var stockName = getStockName();
    var postBody = getPostBody();
    if (validatePostInput(chosenButton, postBody, stockName)) {
        sendPostInfo(chosenButton, postBody, stockName);
    }
}

function getPostBody() {
    return document.getElementById("postText").value;
}

function getStockName() {
    return document.getElementById("stockName").value;
}

function validatePostInput(button, postBody, stockName) {
    var isValid = true;
    if (button == "") {
        alert("Error, Pick a Recomendation");
        isValid = false;
    }
    if (postBody == "" && isValid) {
        alert("Error, Enter something for the post body");
        isValid = false;
    }
    if (stockName == "" && isValid) {
        alert("Error, Pick a stock name");
        isValid = false;
    }
     return isValid;
}

function sendPostInfo(stockRecomendation, postBody, stockName) {
    var cookies = getCookies();
    var values = {"user_id":getUserID(cookies.get("username")), "session_id":cookies.get("session_id"), "stock_name":stockName, "recomendation":stockRecomendation, "post_text":postBody};
    var request = new XMLHttpRequest();
    request.open("POST", BASE_URL + "post/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("ADDED");
            document.location.href = "http://192.168.56.101/blog/home/";
        }
    }
    request.send(JSON.stringify(values));
}