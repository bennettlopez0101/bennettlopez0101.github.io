var BASE_URL = "http://192.168.56.101/blog/php/";

$(document).ready(function() {
    // Get the input field
    var searchBox = document.getElementById("search_box");
    searchBox.addEventListener("keyup", function(event) {
        // Key 13 is enter
        if (event.keyCode === 13) {
            // Prevent Default Action
            event.preventDefault();
            getUserSearch(searchBox.value);
            // Clear the search box
            searchBox.value = "";
            
        }
    });
});

function createPost() {
    document.location.href = "http://192.168.56.101/blog/createPost";
}

function getUserSearch(username) {
    $('.postElement').remove();
    $("#title").html("Current User: " + username);
    populatePosts(username);
}

function populateInitialPost() {
    let dict = getCookies();
    populatePosts(dict.get("username"));
}

function populatePosts(username) {
    var posts = getPosts(username);
    if (posts != "DEFAULT" && posts != "") {
        JSONposts = sanitizeJSON(posts);
        for (var i = 0; i < JSONposts.length; i++) {
            JSONdata = JSON.parse(JSONposts[i]);
            createUserPost(JSONdata.id, JSONdata.user_id, JSONdata.post_date, JSONdata.post_text, JSONdata.extra);
        }
        var currentFontSize = parseInt($(".postElement").css('font-size'));
        $(".postElement").hover(
            function() {
                $(this).stop(true).animate( {
                    fontSize: (currentFontSize + 10) + "px"
                }, 300);
            },
            function() {
                $(this).stop(true).animate( {
                    fontSize: (currentFontSize) + "px"
                }, 300);
        });
        $(".postElement").click(
            function() {
                document.location.href = "http://192.168.56.101/blog/post?id=" + this.id;
            }
        );
    }
}

function getPosts(username) {
    var userId = getUserID(username);
    var cookies = getCookies();
    var returnData = "DEFAULT"
    var values = {"user_id":userId, "session_id":cookies.get("session_id")};
    if (userId != "DEFAULT" && userId != "") {
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
    }
    return returnData;
}

function logout() {
    console.log("LOGOUT");
    document.cookie = "session_id = ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/blog"
    document.cookie = "username = ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/blog"
    document.location.href = "http://192.168.56.101/blog/";
}

function createUserPost(id, user_id, post_date, post_text, extra) {
    extra = JSON.parse(extra);
    var HtmlElement = "<div style=\"border: 2px solid black;border-radius: 25px;padding:50px;grid-column: 2/3;\" class=\"postElement\" id="+id+" user_id="+user_id+" post_date="+post_date+"><p>Stock Name: "+extra.stock_name+"</p><p> Recomendation: "+extra.recomendation+"</p>"+post_text+"</div>"
    console.log(HtmlElement);
    document.getElementById("posts").innerHTML += HtmlElement;
}
