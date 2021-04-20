<!DOCTYPE HTML>
<html>
    <head>
        <script src="http://code.jquery.com/jquery.js"></script>
        <link rel="stylesheet" href="index.css">
        <script type="text/javascript" src="../blogLib.js"></script>
        <script type="text/javascript" src="index.js"></script>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>

    <body onLoad="cookieAccessControl()">
        <div id="TheGrid">
            <h1 id="title">Create Post</h1>
            <div id="createPost">
                <input class="userInput" type="text" id="postText" placeholder="Create Your Post"><br><br>
            </div>
            <div id="createStockName"> 
                <input class="userInput" type="text" id="stockName" placeholder="Stock Name/Symbol"><br><br>
            </div>
            <h3 id="recomendationTitle">Recomentation</h3>
            <div id="recButtons">
                <button class="btn btn-outline-primary" id="poor" onclick="editButton('poor')">Poor</button>
                <button class="btn btn-outline-primary" id="good" onclick="editButton('good')">Good</button>
                <button class="btn btn-outline-primary" id="excellent" onclick="editButton('excellent')">Excellent</button><br><br>
            </div>
            <div id="lastButtons">
                <button id="submit" class="btn btn-success" onclick="createPost()">submit</button><br><br>
                <button id="back" class="btn btn-danger" onclick="location.href='http://192.168.56.101/blog/home/'" >BACK</button>
            </div>
        </div>
    </body>
</html>