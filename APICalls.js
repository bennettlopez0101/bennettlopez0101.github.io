var previousGraph = null;
var defaultCatFacts = [
    "Kittens sleep so much because the growth hormone is only released when they sleep.",
    "It has been estimated that a cat yawns on the average of 109,500 times in his life.",
    "A cat can jump up to six times its length.",
    "Cats only sweat through their foot pads.",
    "A female cat is called a “molly” or a “queen”.",
    "Black cats are less likely to be adopted because of their \"appearance\".",
    "Cats were mythic symbols of divinity in ancient Egypt.",
    "Cats have 38 chromosomes in each zygote cell.",
    "If they have ample water, cats can tolerate temperatures up to 133 °F."
]
function run(symbol) {
    try {
        getData(symbol);
    }
    catch(err) {
        console.log("ERROR");
    }
}
/**
 * https://www.alphavantage.co
 */
function getData(symbol) {
    var isValid = true;
    enableButtons(true);
    var StockTime = [];
    var price = [];
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ symbol +'&interval=5min&apikey=9TR8OI8HLY3K9LJY';
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json",
        success: function(response) {
            // Itterate over all the objects returend
            document.getElementById("messageBoard").innerHTML = " ";
            jQuery.each(response, function(i, val) {
                // If its the data object
                if (i === "Error Message") {
                    isValid = false;
                    document.getElementById("messageBoard").innerHTML = "Bad API call, use the trading index symbol";
                    sendDefault();
                }
                else if (i === "Note") {
                    document.getElementById("messageBoard").innerHTML = "Too Many API Calls; Limit 5 Per Minute";
                    sendDefault();
                    isValid = false;
                }
                else if (i !== "Meta Data") {
                    // Get the object, and iterate over the response
                    jQuery.each(val, function(x, value) {
                        // x: The time || value: The data
                        
                        var time = JSON.stringify(x).split(/[\s:]+/);
                        for (var t = 0; t < time.length; t++) {
                            var minutes;
                            var seconds;
                            t++;
                            minutes = time[t];
                            t++;
                            seconds = time[t];
                            StockTime.push(minutes + ":" + seconds);
                            t = t + 2;
                        }
                        
                        
                        var stringData = JSON.stringify(value).split("\"");
                        for (var z = 0; z < stringData.length; z++) {
                            if (stringData[z] === "4. close") {
                                price.push(parseFloat(stringData[z + 2]));
                            }
                        }
                    });
                }
            });
            if (isValid) {
                setTheAnalysis(StockTime, price)
                updateChart(symbol, StockTime.reverse(), price.reverse());
            }
            else {
                loadCatFacts(Math.round(Math.random() * 99));
                $(".catPhotoHolder").html("<img class = \"catPhoto\" src=\"defaultCat.jpg\">");
                console.log("Error");
            }
        },
        error: function(error) {
            console.log("ERROR");
            enableButtons(false);
            var hedder = document.getElementById("hedder");
            hedder.innerHTML = JSON.stringify(error);
        }
    });
}


function updateChart(symbol, StockTime, price) {
    
    
    if (previousGraph !== null) {
        previousGraph.destroy();
    }
    
    Chart.defaults.global.animationSteps = 50;
    Chart.defaults.global.tooltipYPadding = 16;
    Chart.defaults.global.tooltipCornerRadius = 0;
    Chart.defaults.global.tooltipTitleFontStyle = "normal";
    Chart.defaults.global.tooltipFillColor = "rgba(0,160,0,0.8)";
    Chart.defaults.global.animationEasing = "easeOutBounce";
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.scaleLineColor = "black";
    Chart.defaults.global.scaleFontSize = 16;
    
    
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        responsive: true,
        pointDotRadius: 10,
        bezierCurve: false,
        scaleShowVerticalLines: false,
        scaleGridLineColor: 'black',
        data: {
            labels: StockTime,
            datasets: [{
                label: symbol,
                data: price,
                borderColor: "#000000",
                borderWidth: 1,
                fill: false
            }],
        },
    });
    
    previousGraph = myChart;
    enableButtons(false);
}


function enableButtons(disable) {
    var color = "";
    var backgroundColor = "";
    var hoverColor = "";
    var hoverBackground = "";
    
    if (disable) {
        color = "#808080";
        backgroundColor = "#adabaa";
        hoverColor = "#808080";
        hoverBackground = "#adabaa";
    }
    else {
        color = "#000000";
        backgroundColor = "#FFFFFF";
        hoverColor = "white";
        hoverBackground = "#1B262C";
        
    }
    var buttons = document.getElementsByClassName("btn");
    var hover = document.getElement
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = disable;
        buttons[i].style.color = color;
        buttons[i].style.backgroundColor = backgroundColor;
    }
}

function executeForm() {
    var text = document.getElementById("newStock");
    getData(text.value);
    text.value = "";
}

function sendDefault() {
    var StockTime = [1,2,3,4,5,6,7,8,9,10];
    var price = [1,2,3,4,5,6,7,8,9,10];
    updateChart("Default", StockTime, price);
}


function setTheAnalysis(StockTime, price) {
    var maxPrice = 0;
    var maxTime = 0;
    var minPrice = 9999;
    var minTime = 9999;
    var averagePrice = 0;
    var bigestDrop = 0;
    var bigestDropTimes = [0,0];
    var differenceOverTradingDay = 0;
    
    for (var i = 0; i < price.length; i++) {
        
        if (maxPrice < price[i]) {
            maxPrice = price[i];
            maxTime = StockTime[i];
        }
        
        if (minPrice > price[i]) {
            minPrice = price[i];
            minTime = StockTime[i];
        }
        
        averagePrice = averagePrice + price[i];
    }
    
    averagePrice = averagePrice / price.length;
    
    for (i = 1; i < price.length; i++) {
        if ((price[i - 1] - price[i]) > bigestDrop) {
            bigestDrop = (price[i - 1] - price[i]);
            bigestDropTimes[0] = StockTime[i];
            bigestDropTimes[1] = StockTime[i - 1];
        }
    }
    
    differenceOverTradingDay = price[0] - price[price.length - 1];
    
    $(".TopList").html("");
    var appendString;
    appendString = "<b> Max Price: &#8195;</b>" + Math.round(maxPrice * 100) / 100 + "<br><br>"
    appendString = appendString + "<b> Max Time: &#8195;</b>" + maxTime + "<br><br>"
    appendString = appendString + "<b> Min Price: &#8195;</b>" + Math.round(minPrice * 100) / 100 + "<br><br>"
    appendString = appendString + "<b> Min Time: &#8195;</b>" + minTime +"<br><br>"
    appendString = appendString + "<b> Average Price: &#8195;</b>" + Math.round(averagePrice * 100) / 100 + "<br><br>"
    appendString = appendString + "<b> Biggest Drop: &#8195;</b>" + Math.round(bigestDrop * 100) / 100 + "<br><br>"
    appendString = appendString + "<b> Biggest Drop Times:&#8195;</b> " + bigestDropTimes + "<br><br>"
    appendString = appendString + "<b> The Difference Over the Trading Day: &#8195;</b>" + Math.round(differenceOverTradingDay * 100) / 100 + "<br><br>"
    
    $(".TopList").append(appendString);
    
    calculateRandomCat(bigestDrop, differenceOverTradingDay);
}


function loadTheCat(catNum) {
    $.ajax({
        url: 'https://api.thecatapi.com/v1/images/search?limit=100&order=ASC&size=full',
        type: "GET",
        format: "json",
        api_key: "0ff99fc6-df3a-4e1f-992e-859de2670739",
        success: function(response) {
            jQuery.each(response, function(x, value) {
                if (x === catNum) {
                    jQuery.each(value, function(y, z) {
                        if (y === "url") {
                            $(".catPhotoHolder").html("<img class = \"catPhoto\" src=\"" + z + "\">");
                        }
                    });
                }
            });
            
        },
        error: function(error) {
            console.log(error);
        }
    });
    
    loadCatFacts(catNum);
}




function loadCatFacts(catNum) {
    var catFacts = [];
    
    $.ajax({
        url: "https://cat\-fact.herokuapp.com/facts",
        type: "GET",
        format: "json",
        success: function(response) {
            jQuery.each(response, function(x, value) {
                
                jQuery.each(value, function(y, z) {
                    
                    if (y === catNum) {
                        jQuery.each(z, function(first, second) {
                            if (first === "text") {
                                catFacts.push(second);
                                $(".bottomList").html("");
                                var appendString = "<p>Cat Fact!<br>  "+ second +"<p><br>"
                                $(".bottomList").append(appendString);
                            }
                        });
                    }
                });
            });
        },
        error: function(error) {
            $(".bottomList").html("");
            var appendString = "<p>Cat Fact!<br>  "+ defaultCatFacts[Math.round(Math.random() * 8)] +"<p><br>"
            $(".bottomList").append(appendString);
        }
    });
}

function calculateCatInfo(random, num) {
    if (random) {
        loadTheCat(Math.round(Math.random() * 99))
    }
    else {
        loadTheCat(num);
    }
}

function calculateRandomCat(high, low) {
    var newNum = 0;
    newNum = high - low;
    newNum = Math.round(newNum);
    if (0 > newNum || newNum > 99) {
        newNum = Math.round(Math.random() * 99);
    }
    calculateCatInfo(false, newNum);
}

