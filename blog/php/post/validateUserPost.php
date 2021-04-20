<?php
include "../rest.php";
include "../lib.php";
include "validateInput.php";

/**
 * Get the request
 */
$request = new RestRequest();
$requestValue = $request->getRequestVariables();

/**
 * Connect to DB
 */
$dataBase = connect_to_db();
if (!$dataBase) {
    exit("Database error!");
}

/**
 * Parse though the different HTTP request types: Validate the input, create the SQL 
 * statemnet, and send to code / corresponding JSON packet
 * 
 *                                 |
 *                                 |
 *                                 V
 */

if ($request->isGet()) {
    if (validateInput($requestValue, ["user_id","id"], "GET", 2, 2)) {
        $sql = "SELECT * FROM post WHERE user_id = ? AND id = ?";
        $statement = $dataBase ->prepare($sql);
        $statement->execute([$requestValue["user_id"], $requestValue["id"]]);
        $sqlResults = $statement->fetchAll(PDO::FETCH_ASSOC);
        if ($sqlResults == []) {
            http_response_code(404);
        }
        else {
            http_response_code(200);
        }
    }
    else {
        http_response_code(404);
    }
}
else {
    http_response_code(404);
}
?>