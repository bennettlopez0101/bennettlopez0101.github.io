<!DOCTYPE html>
<html>
    <head>
        <script src="http://code.jquery.com/jquery.js"></script>
        <link rel="stylesheet" href="index.css">
        <script type="text/javascript" src="blogLib.js"></script>
        <script type="text/javascript" src="index.js"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body onLoad="initialCookieAccessControl()">
        <div id="TheGrid">
            <div id="title">
                User Login
            </div>
            <form class="formContainer" style="display:block" onsubmit="return false" id="loginUser">
                <label class="label" for="username">Username:</label><br>
                <input type="text" id="username" name="username"><br>
                <label class="label" for="password">Password:</label><br>
                <input type="text" id="password" name="password"><br><br>
                <input class="btn btn-outline-primary" id="submit" onclick="loginUser()" type="submit" value="Submit">
            </form> 
            <div id="switchStates">
                <button class="btn btn-danger" id="switchButton" onclick="switchStates()"> Create New User </button>
            </div>
        
        </div>
    </body>
</html>