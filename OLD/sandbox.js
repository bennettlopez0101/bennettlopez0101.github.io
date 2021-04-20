var previousGraph = null;
/**
 * This is the default cat facts, b/c the API is inconsitnt and is hosted on a 
 * unreliable server
 */
const defaultCatFacts = [
    "Kittens sleep so much because the growth hormone is only released when they sleep.",
    "It has been estimated that a cat yawns on the average of 109,500 times in his life.",
    "A cat can jump up to six times its length.",
    "Cats only sweat through their foot pads.",
    "A female cat is called a \“molly\” or a \“queen\”.",
    "Black cats are less likely to be adopted because of their \"appearance\".",
    "Cats were mythic symbols of divinity in ancient Egypt.",
    "Cats have 38 chromosomes in each zygote cell.",
    "If they have ample water, cats can tolerate temperatures up to 133 °F."
]




/**
 * The API's Used:
 * https://www.chartjs.org 
 * https://www.alphavantage.com 
 * https://alexwohlbruck.github.io/cat-facts/docs/ 
 * https://docs.thecatapi.com 
 * https://clearbit.com/docs?ruby#logo-api 
 * https://developer.nytimes.com/docs
 */
function run(symbol, company) {
    alert("This webpage uses stock data, converts it into a chart, and analizes it. It also comes up with articles relating to the company chosen. Theres also a special surprise at the bottom of the page");
    try {
        getData(symbol);
        getArticle(company);
    }
    catch(err) {
        console.log("ERROR");
    }
    
    $("#newStock").on('keyup', function (e) {
        if (e.keyCode === 13) {
            getData(document.getElementById("newStock").value)
            document.getElementById("newStock").value = "";
        }
        e.keyCode = 0;
    });

    $("#searchLable").on('keyup', function (f) {
        if (f.keyCode === 13) {
            getArticle(document.getElementById("searchLable").value)
            document.getElementById("searchLable").value = "";
        }
        f.keyCode = 0;
    });
    
}

/**
 * This function gets the article to be posted to the HTML
 */
function getArticle(company) {
    
    // Reset the articles
    for (var m = 0; m < 3; m++) {
        var current1 = ".artSynopsis" + (m + 1).toString();
        $(current1).html("")
    }
    var headlines = [];
    var lead_paragraph = [];
    var pub_date = [];
    var web_url = [];
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + company +"+inc&api-key=olyNoXhWtITbUZ0ZgxVvtRproOX7IipG";
    $.ajax({
        url: url,
        type: "GET",
        format: "json",
        success: function(response) {
            jQuery.each(response, function(key, value) {
                if (key === "response") {
                    jQuery.each(value, function(key2, value2) {
                        if (key2 === "docs") {
                            jQuery.each(value2, function(key3, value3) {
                                jQuery.each(value3, function(key4, value4) {
                                    if (key4 === "headline") {
                                        jQuery.each(value4, function(key5, value5) {
                                            if (key5 === "main") {
                                                headlines.push(JSON.stringify(value5));
                                            }
                                        });
                                    }
                                    if (key4 === "lead_paragraph") {
                                        lead_paragraph.push(JSON.stringify(value4));
                                    }
                                    if (key4 === "pub_date") {
                                        pub_date.push(JSON.stringify(value4));
                                    }
                                    if (key4 === "web_url") {
                                        web_url.push(JSON.stringify(value4));
                                    }
                                });
                            });
                        }
                    });
                }
            });
            
            /* Send the content to the HTML */
            
            for (var i = 0; i < 3; i++) {
                var current = ".artSynopsis" + (i + 1).toString();
                for (var t = 1; t < 11; t++) {
                    $(current).append(pub_date[i][t])
                }
                $(current).append("<br><br><p id = \"headline\">" + headlines[i] + "</p><br><br>")
                $(current).append("<p id = \"paragraph\">" + lead_paragraph[i] + "</p><br><br><br><br>")
                $(current).append(web_url[i])
            }
            
        },
        error: function(error) {
            console.log(error);
        },
    });
    getPhoto(company)
}



/**
 * This function gets the photo for the article seciton of the HTML
 */
function getPhoto(company) {
    url = "https://logo.clearbit.com/"+ company +".com?size=300&greyscale=false&format=png";
    $.ajax({
        url: url,
        type: "GET",
        format: "json",
        success: function(response) {
            /* Send the content to the HTML */
            for (var i = 0; i < 3; i++) {
                $(".photo" + (i + 1)).html("<img class = \"artPhotos\" src = \""+ url +"\">");
            } 
        },
        error: function(error) {
            /* Send the content to the HTML */
            for (var i = 0; i < 3; i++) {
                $(".photo" + (i + 1)).html("Error, company not recognized");
            } 
        },
        connection: function(value) {
            console.log(this.http);
        }
    });
    
}


/**
 * This function gets the stock data for the graph
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

/**
 * This function updates the graph with the stock data
 */
function updateChart(symbol, StockTime, price) {
    if (previousGraph !== null) {
        previousGraph.destroy();
    }
    
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        responsive: false,
        data: {
            labels: StockTime,
            datasets: [{
                label: symbol,
                data: price,
                borderColor: "rgba(124,252,0, 1)",
                backgroundColor: "rgba(124,252,0, .5)",
                borderWidth: 1,
                fill: true
            }],
        },
    });
    
    previousGraph = myChart;
    enableButtons(false);
}

/**
 * This function enables/disables the data
 */
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

/**
 * This is for the default graph when an error is thrown
 */
function sendDefault() {
    var StockTime = [1,2,3,4,5,6,7,8,9,10];
    var price = [1,2,3,4,5,6,7,8,9,10];
    updateChart("Default", StockTime, price);
}

/**
 * This function calculates and sets the stock analitics
 */
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

/**
 * This function loads the cat photos
 */
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

/**
 * This function loads the cats
 */
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

/**
 * This function calculates the catInfo with a random number
 */
function calculateCatInfo(random, num) {
    if (random) {
        loadTheCat(Math.round(Math.random() * 99))
    }
    else {
        loadTheCat(num);
    }
}

/**
 * This calcualtes a cat based off the stock numbers
 */
function calculateRandomCat(high, low) {
    var newNum = 0;
    newNum = high - low;
    newNum = Math.round(newNum);
    if (0 > newNum || newNum > 99) {
        newNum = Math.round(Math.random() * 99);
    }
    calculateCatInfo(false, newNum);
}