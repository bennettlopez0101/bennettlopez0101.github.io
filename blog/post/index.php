<!DOCTYPE HTML>
<html>
    <head>
        <script src="http://code.jquery.com/jquery.js"></script>
        <script type="text/javascript" src="../blogLib.js"></script>
        <script type="text/javascript" src="index.js"></script>
        <link rel="stylesheet" href="index.css">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
     </head>
    <body onload="populatePost()">
        <div id="TheGrid">
            <div id="title">
                <h1 id="innerTitle">Post: <?php echo $_GET["id"]?></h1>
            </div>
            <div id="content">
                <div id="postContent"></div>
                <div id="postUser"> POST USER: </div>
                <div id="postDate">POST DATE: </div>
                <div id="postStockName">STOCK NAME: </div>
                <div id="postRecomendation"> STOCK RECOMENDATION: </div>
            </div>
            <h1 id="commentTitle">Comments</h1>
            <div id="comments"> </div>
            <div id="editPost">
                <button class="btn btn-outline-primary" onclick="editPost()" id="editButton">EDIT</button>
                <button class="btn btn-outline-primary" id="delete" onclick="deletePost()">DELETE</button>
                <input placeholder="Comment" id="commentField"></input>
            </div>
        </div>
    </body>
</html>

<script>
var BASE_URL = "http://192.168.56.101/blog/php/";
$(document).ready(function() {
    // Get the input field
    var searchBox = document.getElementById("commentField");
    searchBox.addEventListener("keyup", function(event) {
        // Key 13 is enter
        if (event.keyCode === 13) {
            // Prevent Default Action
            event.preventDefault();
            createComment(this.value, <?php echo $_GET["id"]?>);
            // Clear the search box
            searchBox.value = "";
            
        }
    });
});

function editPost() {
    var id = <?php echo $_GET["id"];?>;
    var cookies = getCookies();
    var userId = getUserID(cookies.get("username"));
    var values = {"id":id, "user_id":userId};
    if (verifyOwnership(values) != "DEFAULT") {
        console.log("USER OWNS POST");
        $("#editButton").replaceWith("<input style=\"border: 1px solid black;\"id=\"editButton\" placeholder=\"Edit Post Body\"></input>");
        var editBox = document.getElementById("editButton");
        editBox.addEventListener("keyup", function(event) {
        // Key 13 is enter
        if (event.keyCode === 13) {
            // Prevent Default Action
            event.preventDefault();
            updatePost(this.value);
            // Clear the search box
            this.value = "";
        }
        });
    }
    else {
        console.log("User Does Not Own Post");
    }
}

function updatePost(postValue) {
    var postId = <?php echo $_GET["id"]?>;
    var cookies = getCookies();
    var values = {"id":postId, "post_text":postValue ,"user_id":getUserID(cookies.get("username")), "session_id":cookies.get("session_id")};
    var request = new XMLHttpRequest();
    request.open("PUT", BASE_URL + "post/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("POST UPDATED");
            location.reload();
        }
    }
    request.send(JSON.stringify(values));
}

function deletePost() {
    var postId = <?php echo $_GET["id"]?>;
    var cookies = getCookies();
    var values = {"id":postId, "user_id":getUserID(cookies.get("username"))};
    if (verifyOwnership(values)!= "DEFAULT") {
        deleteComments(getComments(postId), cookies.get("session_id"), getUserID(cookies.get("username")));
        var values = {"id":postId, "user_id":getUserID(cookies.get("username")), "session_id":cookies.get("session_id")};
        console.log(values);
        var request = new XMLHttpRequest();
        request.open("DELETE", BASE_URL + "post/", true);
        request.setRequestHeader("Content-type", "application/json");
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                console.log("POST DELETED");
                window.location.href = "http://192.168.56.101/blog/";
            }
        }
        request.send(JSON.stringify(values));
    }
    else {
        console.log("USER DOES NOT OWN POST, SO NO DELETE");
    }
}

function getPostData() {
    var id = <?php echo $_GET["id"];?>;
    var cookies = getCookies();
    var userId = getUserID(cookies.get("username"));
    var returnData = "DEFAULT"
    var values = {"id":id, "user_id":userId, "session_id":cookies.get("session_id")};
    $.ajax({
        type: "GET",
        url: BASE_URL + "post/",
        data: values,
        success: function(data) {
            console.log("POST DATA RETRIEVED");
            returnData = data;
        },
        error: function(errorMessage) {
            console.log("POST DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}
</script>