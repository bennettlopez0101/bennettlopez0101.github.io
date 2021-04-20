<!DOCTYPE html>
<html>
    <head>
        <script src="http://code.jquery.com/jquery.js"></script>
        <link rel="stylesheet" href="index.css">
        <script type="text/javascript" src="../blogLib.js"></script>
        <script type="text/javascript" src="index.js"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body onLoad="cookieAccessControl();populateInitialPost();">
        <div id="TheGrid">
            <div id="TopBar">
                <button class="btn btn-outline-primary btn-sm" onclick="logout()" id="logout">logout</button>
                <button class="btn btn-outline-primary btn-sm" onclick="createPost()" id="create">Create Post</button>
                <input type="text" id="search_box" placeholder="Hint: Try &quot;DeepFreakingValue&quot;"><br><br>
            </div>
            <h3 id="title"> Current User: <?php echo $_COOKIE["username"]; ?></h3>
            <div id="posts">
                <h1>Posts</h1>
            </div>
        </div>
    </body>
</html>