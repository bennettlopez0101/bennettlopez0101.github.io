var BASE_URL = "http://192.168.56.101/blog/php/";

function getUserID(username) {
    var returnData = "DEFAULT"
    $.ajax({
        type: "GET",
        url: BASE_URL + "user/?username=" + username,
        success: function(data) {
            console.log("USER DATA RETRIEVED");
            returnData = JSON.parse(data).id;
        },
        error: function(errorMessage) {
            console.log("USER DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}

function getCookies() {
    let dict = new Map();
    var cookies = document.cookie.split("; ")
    for (var i = 0; i < cookies.length; i++) {
        var cookieParts = cookies[i].split("=");
        dict.set(cookieParts[0], cookieParts[1]);
    }
    return dict;
}

function sanitizeJSON(posts) {
    let JsonObjects = []
    for (var i = 0; i < posts.length; i++) {
        if (posts[i] == "}" && posts[i + 1] == "{") {
            posts = posts.substr(0, i + 1) + "\t" + posts.substr(i + 1, posts.length)
        }
    }
    return posts.split("\t");
}

function getUsername(userId) {
    var returnData = "DEFAULT"
    $.ajax({
        type: "GET",
        url: BASE_URL + "user/?id=" + userId,
        success: function(data) {
            console.log("USER DATA RETRIEVED");
            returnData = JSON.parse(data).username;
        },
        error: function(errorMessage) {
            console.log("USER DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}

function sanitizeJSON(posts) {
    let JsonObjects = []
    for (var i = 0; i < posts.length; i++) {
        if (posts[i] == "}" && posts[i + 1] == "{") {
            posts = posts.substr(0, i + 1) + "\t" + posts.substr(i + 1, posts.length)
        }
    }
    return posts.split("\t");
}

function getUserInformation(username) {
    var returnData = "DEFAULT"
    $.ajax({
        type: "GET",
        url: BASE_URL + "user/?username=" + username,
        success: function(data) {
            console.log("USER DATA RETRIEVED");
            returnData = JSON.parse(data);
        },
        error: function(errorMessage) {
            console.log("USER DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}

function initialCookieAccessControl() {
    let dict = getCookies();
    if (dict.size == 2) {
        if (dict.get("session_id") != undefined && dict.get("username") != undefined ) {
            initalConfirmCookieValidity(dict.get("session_id"), dict.get("username"));
        }
    }
    function initalConfirmCookieValidity(sessionId, username) {
        var values = {"username":username, "session_id":sessionId};
        $.ajax({
            type: "GET",
            url: BASE_URL + "user/verifyUserCookie.php",
            data: values,
            success: function(data) {
                console.log("COOKIES ARE VALID");
                document.location.href = "http://192.168.56.101/blog/home";
            },
            error: function(errorMessage) {
                console.log("COOKIES ARE NOT VALID");
            },
            async: false
        });
    }
}

/** Cookie Access Control */
function cookieAccessControl() {
    let dict = getCookies();
    if (dict.size == 2) {
        if (dict.get("session_id") != undefined && dict.get("username") != undefined ) {
            confirmCookieValidity(dict.get("session_id"), dict.get("username"));
        }
    }
    else {
        document.location.href = "http://192.168.56.101/blog/";
    }

    function confirmCookieValidity(sessionId, username) {
        var values = {"username":username, "session_id":sessionId};
        $.ajax({
            type: "GET",
            url: BASE_URL + "user/verifyUserCookie.php",
            data: values,
            success: function(data) {
                console.log("COOKIES ARE VALID");
            },
            error: function(errorMessage) {
                console.log("COOKIES ARE NOT VALID");
                document.location.href = "http://192.168.56.101/blog/";
            },
            async: false
        });
    }
}

function getUserData(username) {
    var returnData = "DEFAULT";
    $.ajax({
        type: "GET",
        url: BASE_URL + "user/?username=" + username,
        success: function(data) {
            console.log("USER DATA RETRIEVED");
            returnData = data;
        },
        error: function(errorMessage) {
            console.log("USER DATA NOT RETRIEVED");
        },
        async: false
    });
    return returnData;
}

function removeCookies() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}