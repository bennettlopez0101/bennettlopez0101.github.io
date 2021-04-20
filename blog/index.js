var currentState = "LOGIN";

function loginUser() {
    console.log("Login User");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username != "" && password != "") {
        var userInfo = getUserInformation(username)
        if (userInfo != "DEFAULT") {
            console.log("VALID USERNAME");
            var hashedPassword = userInfo["password"];
            var newHashedPassword = stringToHash(userInfo["salt"] + password)
            // If the hashed username and new hash match
            if (newHashedPassword == hashedPassword) {
                console.log("Username + Password Valid");
                createNewSessionId(username, newHashedPassword);
            }
            else {
                console.log("Password Invalid");
            }
        }
        else {
            console.log("NOT VALID USERNAME");
        }
    }
}

function createUser() {
    console.log("Create User");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username != "" && password != "") {
        // If the username is uneque
        if (validateUsernameUnique(username)) {
            // Create the Salt, Session_id, Username, PasswordHash
            var salt = genSalt(32);
            var session_id = genSalt(40);
            var passwordHash = stringToHash(salt + password)
            var userInfo = {"username":username, "password":passwordHash, "salt":salt, "session_id":session_id}
            uploadUser(userInfo)
        }
    }
}

function switchStates() {
    if (currentState == "LOGIN") {
        document.getElementById("title").innerHTML = "Create New User"
        $("#submit").attr("onclick","createUser()");
        $("#switchButton").html("Login");
        currentState = "CREATE"
    }
    else {
        document.getElementById("title").innerHTML = "Login User"
        $("#submit").attr("onclick","loginUser()");
        $("#switchButton").html("Create New User");
        currentState = "LOGIN"
    }
}

function validateUsernameUnique(username) {
    var values = {"username":username};
    var isValid = false; 
    $.ajax({
        type: "GET",
        url: BASE_URL + "user/verifyUser.php",
        data: values,
        success: function(data) {
            console.log("USERNAME IS VALID");
            isValid = true;
        },
        error: function(errorMessage) {
            console.log("USERNAME IS NOT VALID");
        },
        async: false
    });
    return isValid;
}

function genSalt(len) {
    var result = [];
    var possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var numCharacters = possibleCharacters.length;
    for ( var i = 0; i < len; i++ ) {
        result.push(possibleCharacters.charAt(Math.floor(Math.random() * numCharacters)));
    }
    return result.join('');
}

function stringToHash(string) { 
    var hash = 0; 

    for (i = 0; i < string.length; i++) { 
        char = string.charCodeAt(i); 
        hash = ((hash << 5) - hash) + char; 
        hash = hash & hash; 
    } 
    return hash; 
} 

function uploadUser(values) {
    console.log(values);
    var request = new XMLHttpRequest();
    request.open("POST", BASE_URL + "user/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("USER CREATED");
            document.cookie = "username=" + values["username"];
            document.cookie = "session_id=" + values["session_id"];
            location.reload();
        }
    }
    request.send(JSON.stringify(values));
}

function createNewSessionId(username, hashedPassword) {
    removeCookies();
    var session_id = genSalt(40);
    var values = {"username":username, "old_password":hashedPassword, "password":hashedPassword, "session_id":session_id};

    console.log("Updating Session Id");
    var request = new XMLHttpRequest();
    request.open("PUT", BASE_URL + "user/", true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log("USER UPDATED");
            document.cookie = "username=" + username;
            document.cookie = "session_id=" + session_id;
            location.reload();
        }
    }
    request.send(JSON.stringify(values));
}