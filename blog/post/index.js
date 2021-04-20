function verifyOwnership(values) {
    var returnData = "DEFAULT"
    $.ajax({
        type: "GET",
        url: BASE_URL + "post/validateUserPost.php",
        data: values,
        success: function(data) {
            returnData = data;

        },
        error: function(errorMessage) {
            console.log("USER DOES NOT OWN POST");
        },
        async: false
    });
    return returnData;
}

function deleteComments(commentIdList, sessionId, userId) {
    if (commentIdList != "DEFAULT") {
        var JSONcomments = sanitizeJSON(commentIdList);
        for (var i = 0; i < JSONcomments.length; i++) {
            var commentId = JSON.parse(JSONcomments[i]).id
            deleteSingleComment(commentId, sessionId, userId)
        }
    }
}

function deleteSingleComment(commentId, sessionId, userId) {
    var values = {"id":commentId, "user_id":userId, "session_id":sessionId};
    console.log(values);
    var request = new XMLHttpRequest();
    request.open("DELETE", BASE_URL + "comment/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("COMMENT DELETED");
        }
    }
    request.send(JSON.stringify(values));
}

function createComment(commentValue, postId) {
    var cookies = getCookies();
    var values = {"user_id":getUserID(cookies.get("username")), "post_id":postId, "comment_text":commentValue, "session_id":cookies.get("session_id")};
    console.log(values);
    var request = new XMLHttpRequest();
    request.open("POST", BASE_URL + "comment/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("COMMENT ADDED");
            location.reload();
        }
    }
    request.send(JSON.stringify(values));
}

function populatePost() {
    postData = JSON.parse(getPostData())
    extra = JSON.parse(sanitizeJSON(postData["extra"]))
    document.getElementById("postDate").append(postData["post_date"]);
    document.getElementById("postContent").append(postData["post_text"]);
    document.getElementById("postUser").append(getUsername(postData["user_id"]));
    document.getElementById("postStockName").append(extra["stock_name"]);
    document.getElementById("postRecomendation").append(extra["recomendation"]);
    displayComments(getComments(postData["id"]));
}

function getComments(postId) {
    var returnData = "DEFAULT"
    $.ajax({
        type: "GET",
        url: BASE_URL + "comment/?post_id=" + postId,
        success: function(data) {
            console.log("COMMENT DATA RETRIEVED");
            returnData = data
        },
        error: function(errorMessage) {
            console.log("COMMENT DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}

function displayComments(comments) {
    if (comments != "DEFAULT") {
        var commnetBody;
        var commnetAuthor;
        var commentList = sanitizeJSON(comments);
        for (var i = 0; i < commentList.length; i++) {
            var comments = JSON.parse(commentList[i]);
            commnetAuthor = getUsername(comments.user_id);
            commnetBody = comments.comment_text;
            var insertComment = "<div style=\"grid-column: 2/4;text-align:center;\" class=\"commnetContent\"> <h1>Comment User: "+commnetAuthor+"</h1> <h3> Comment: "+commnetBody+"<h3></div>"
            $("#comments").append(insertComment);
        }
    }
}