// 3 means empty
var board;

var player = 1;
var playerMode = false;
var currentDimentions;
var theEnd = false;
var HardMode = true;

function constructor(dimention) {
    currentDimentions = dimention;
    
    // Create a new 2D array
    board = new Array(dimention);
    for (i = 0; i < currentDimentions; i++) {
        board[i] = new Array(dimention);
    }
    
    // Add blank spaces to the 2D Array
    for (x = 0; x < currentDimentions; x++) {
        for (y = 0; y < currentDimentions; y++) {
            board[x][y] = 3;
        }
    }
    setTheBoard(dimention);
}


function setTheBoard(dimention) {
    var d1;
    var d2;
    var d3;
    var firstVar;
    var secondVar;
    var thirdVar;
    
    if (dimention == 3) {
        firstVar = 'block';
        secondVar = 'none';
        thirdVar = 'none';
        document.getElementById("gameWrapper").style.gridTemplateColumns = "repeat(3, 200px)";
        document.getElementById("gameWrapper").style.gridTemplateRows = "repeat(3, 200px)";
        document.getElementById("TheGrid").style.gridTemplateColumns = "1fr 700px 1fr";
    }
    else if (dimention == 4) {
        firstVar = 'block';
        secondVar = 'block';
        thirdVar = 'none';
        document.getElementById("gameWrapper").style.gridTemplateColumns = "repeat(4, 200px)";
        document.getElementById("gameWrapper").style.gridTemplateRows = "repeat(4, 200px)";
        document.getElementById("TheGrid").style.gridTemplateColumns = "1fr 900px 1fr";
    }
    else if (dimention == 5) {
        firstVar = 'block';
        secondVar = 'block';
        thirdVar = 'block';
        document.getElementById("gameWrapper").style.gridTemplateColumns = "repeat(5, 200px)";
        document.getElementById("gameWrapper").style.gridTemplateRows = "repeat(5, 200px)";
        document.getElementById("TheGrid").style.gridTemplateColumns = "1fr 1100px 1fr";
    }
    
    d1 = document.getElementsByClassName("ThreeByThree");
    for (i = 0; i < d1.length; i ++) {
        d1[i].style.display = firstVar;
    }
    
    d2 = document.getElementsByClassName("FourByFour");
    for (i = 0; i < d2.length; i ++) {
        d2[i].style.display = secondVar;
    }
    
    d3 = document.getElementsByClassName("FiveByFive");
    for (i = 0; i < d3.length; i ++) {
        d3[i].style.display = thirdVar;
    }
}

function run(row, column) {
    var done;
    
    addElement(row, column);
    incrementTurn();
    Over();
    
    if (playerMode === false && theEnd === false) {
        determineNextMove();
        incrementTurn();
        Over();
    }
}

function Over() {
    done = isOver();
    if (done != 3) {
        theEnd = true;
        disableButtons();
        if (done == 1) {
            done = "X";
        }
        document.getElementById("title").innerHTML = "Player <b>" + done + "</b> is the Winner";
        
        if (done == "X") {
            document.getElementById("Advance").parentElement.innerHTML = "<button onclick=\"advance()\" type=\"button\" class=\"btn btn-default btn-xl\" id = \"Advance\"> Advance </button>";
        }
    }
}

function doublePlayer() {
    if (playerMode === false) {
        playerMode = true;
        document.getElementById("player").innerHTML = "Single Player";
    }
    else {
        playerMode = false;
        document.getElementById("player").innerHTML = "Double Player";
    }
}

function addElement(row, column) {
    board[row][column] = player;
    
    var updatedGraphic;
    var id = row + "" + column;
    if (player === 1) {
        updatedGraphic = "<img src=\"x.png\" class = \"btn-custom_size\" id = \"" + id + "\">";
    }
    else {
        updatedGraphic = "<img src=\"o.png\" class = \"btn-custom_size\" id = \"" + id + "\" >";
    }
    document.getElementById(id).parentElement.innerHTML = updatedGraphic;
}

function incrementTurn() {
    if (player === 1) {
        player = 0;
    }
    else {
        player = 1;
    }
}

function isOver() {
    // 8 Opetion for winning
    var winner = 3;
    var x = 0;
    var y = 0;
    var innerFlag;
    var secondFalg;
    var previous;
    
    // Horizontal 
    while (x < currentDimentions && winner == 3) {
        y = 0;
        previous = board[x][y];
        innerFlag = true;
        while (y < currentDimentions && innerFlag === true) {
            if (previous != board[x][y]) {
                innerFlag = false;
            }
            y++;
        }
        if (innerFlag === true) {
            winner = previous;
            outerFlag = false;
        }
        x++;
    }
    
    x = 0;
    y = 0;
    // Vertical
    while (x < currentDimentions && winner == 3) {
        y = 0;
        previous = board[y][x];
        outterFlag = true;
        while (y < currentDimentions && outterFlag === true) {
            if (previous != board[y][x]) {
                outterFlag = false;
            }
            y++;
        }
        if (outterFlag === true) {
            winner = previous;
            outerFlag = false;
        }
        x++;
    }
    
    // Cross
    x = 0;
    y = 0;
    outerFlag = true;
    previous = board[x][y];
    x = x + 1;
    y = y + 1;
    while (x >= 0 && x < currentDimentions && y >= 0 && y < currentDimentions && previous != 3) {
        if (previous != board[x][y]) {
            outerFlag = false;
        }
        x++;
        y++;
    }
    if (outerFlag === true && winner == 3) {
        winner = previous;
    }
    
    
    
    x = 0;
    y = currentDimentions - 1;
    outerFlag = true;
    previous = board[y][x];
    x = x + 1;
    y = y - 1;
    while (x >= 0 && x < currentDimentions && y >= 0 && y < currentDimentions && previous != 3) {
        if (previous != board[y][x]) {
            outerFlag = false;
        }
        else {
        }
        x++;
        y--;
    }
    if (outerFlag === true && winner == 3) {
        winner = previous;
    }
    
    return winner;
}

function disableButtons() {
    var updatedGraphic;
    var id;
    for (x = 0; x < currentDimentions; x++) {
        for (y = 0; y < currentDimentions; y++) {
            if (board[x][y] == 3) {
                id = x + "" + y;
                updatedGraphic = "<button type=\"button\" class=\"btn btn-default btn-custom_size\" id = \"" + id + "\"></button>";
                document.getElementById(id).parentElement.innerHTML = updatedGraphic;
            }
        }
    }
}

function resetTheBoard() {
    var id;
    for (x = 0; x < currentDimentions; x++) {
        for (y = 0; y < currentDimentions; y++) {
            id = x + "" + y;
            board[x][y] = 3;
            updatedGraphic = "<button onclick= \"run(" + x + ", " + y + ")\" type=\"button\" class=\"btn btn-default btn-custom_size\" id = \""+ x + "" + y + "\" ></button>";
            document.getElementById(id).parentElement.innerHTML = updatedGraphic;
        }
    }
    document.getElementById("title").innerHTML = "The Ultimate Game of Tick-Tac-Toe";
    player = 1;
    theEnd = false;
}


function determineNextMove() {
    var x = 0;
    var y = 0;
    var done = false;
    var possibleMoves = new Array(currentDimentions);
    var count = 0;
    var current;
    
    
    if (HardMode === true) {
        possibleMoves = smartOpponent();
    }
    if (possibleMoves[0] == "A" || HardMode === false) {
        possibleMoves = new Array(currentDimentions);
        // Pick a random move
        while (x < currentDimentions && done === false) {
            y = 0;
            while (y < currentDimentions && done === false) {
                if (board[x][y] == 3) {
                    current = new Array(2);
                    current[0] = x;
                    current[1] = y;
                    possibleMoves[count] = current;
                    count++;
                }
                y++;
            }
            x++;
        }
        var toAdd = possibleMoves[Math.floor(Math.random() * count)];
        addElement(toAdd[0], toAdd[1]);
    }
    else {
        addElement(possibleMoves[0], possibleMoves[1]);
    }
}

function advance() {
    resetTheBoard();
    currentDimentions = currentDimentions + 1;
    // MAX SIZE
    if (currentDimentions > 5) {
        currentDimentions = 3; 
    }
    document.getElementById("Advance").parentElement.innerHTML = "<button type=\"button\" class=\"btn btn-danger btn-xl\" id = \"Advance\"> Advance </button>";
    constructor(currentDimentions);
}

function smartOpponent() {
    // 8 Opetion for winning
    var optimalSpace = ["A", "A"]
    var tempHoler = ["A", "A"];
    var x = 0;
    var y = 0;
    var count = 0;
    var innerFlag;
    var secondFalg;
    var previous;
    
    while (x < currentDimentions && optimalSpace[0] === "A") {
        innerFlag = true;
        y = 0;
        secondFalg = true;
        previous = null;
        while (y < currentDimentions && innerFlag == true) {
            // If the counter is not three, set to a comparitor
            if (board[x][y] != 3 && previous == null) {
                previous = board[x][y];
            }
            // If there is one three, set the flag
            if (secondFalg === true && board[x][y] == 3) {
                secondFalg = false;
                tempHoler[0] = x;
                tempHoler[1] = y;
            }
            // Compare the filled elements
            else if (previous != null && board[x][y] != 3) {
                if (previous != board[x][y]) {
                    innerFlag = false;
                }
            }
            // If there are two threes
            else if (secondFalg === false && board[x][y] == 3) {
                innerFlag = false;
            }
            y++;
        }
        
        if (innerFlag == true) {
            optimalSpace = tempHoler;
        }
        x++;
    }
    
    x = 0;
    y = 0;
    tempHoler = ["A", "A"];
    while (x < currentDimentions && optimalSpace[0] === "A") {
        innerFlag = true;
        y = 0;
        secondFalg = true;
        previous = null;
        while (y < currentDimentions && innerFlag == true) {
            // If the counter is not three, set to a comparitor
            if (board[y][x] != 3 && previous == null) {
                previous = board[y][x];
            }
            // If there is one three, set the flag
            if (secondFalg === true && board[y][x] == 3) {
                secondFalg = false;
                tempHoler[0] = y;
                tempHoler[1] = x;
            }
            // Compare the filled elements
            else if (previous != null && board[y][x] != 3) {
                if (previous != board[y][x]) {
                    innerFlag = false;
                }
            }
            // If there are two threes
            else if (secondFalg === false && board[y][x] == 3) {
                innerFlag = false;
            }
            y++;
        }
        
        if (innerFlag == true) {
            optimalSpace = tempHoler;
        }
        x++;
    }
    
    
   // Cross
    x = 0;
    y = 0;
    tempHoler = ["A", "A"];
    innerFlag = true;
    secondFalg = true;
    previous = null;
    outerFlag = true;
    while (x >= 0 && x < currentDimentions && y >= 0 && y < currentDimentions) {
        // If the counter is not three, set to a comparitor
        if (board[x][y] != 3 && previous == null) {
            previous = board[x][y];
        }
        // If there is one three, set the flag
        if (secondFalg === true && board[x][y] == 3) {
            secondFalg = false;
            tempHoler[0] = x;
            tempHoler[1] = y;
        }
        // Compare the filled elements
        else if (previous != null && board[x][y] != 3) {
            if (previous != board[x][y]) {
                innerFlag = false;
            }
        }
        // If there are two threes
        else if (secondFalg === false && board[x][y] == 3) {
            innerFlag = false;
        }
        x++;
        y++;
    }
    if (innerFlag == true) {
        optimalSpace = tempHoler;
    }
    
    tempHoler = ["A", "A"];
    innerFlag = true;
    secondFalg = true;
    previous = null;
    outerFlag = true;
    x = 0;
    y = currentDimentions - 1;
    while (x >= 0 && x < currentDimentions && y >= 0 && y < currentDimentions) {
        // If the counter is not three, set to a comparitor
        if (board[x][y] != 3 && previous == null) {
            previous = board[x][y];
        }
        // If there is one three, set the flag
        if (secondFalg === true && board[x][y] == 3) {
            secondFalg = false;
            tempHoler[0] = x;
            tempHoler[1] = y;
        }
        // Compare the filled elements
        else if (previous != null && board[x][y] != 3) {
            if (previous != board[x][y]) {
                innerFlag = false;
            }
        }
        // If there are two threes
        else if (secondFalg === false && board[x][y] == 3) {
            innerFlag = false;
        }
        x++;
        y--
    }
    if (innerFlag == true) {
        optimalSpace = tempHoler;
    }
    return optimalSpace;
}

function changeMode() {
    if (HardMode == true) {
        HardMode = false;
        document.getElementById("mode").parentElement.innerHTML = "<button onclick = \"changeMode()\" type=\"button\" class=\"btn btn-success btn-xl\" id = \"mode\"> Easy Mode </button>";
    }
    else {
        HardMode = true;
        document.getElementById("mode").parentElement.innerHTML = "<button onclick = \"changeMode()\" type=\"button\" class=\"btn btn-danger btn-xl\" id = \"mode\"> Hard Mode </button>";
    }
}



