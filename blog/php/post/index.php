<?php
include "../rest.php";
include "../lib.php";
include "validateInput.php";

// Constant that translates the table names to input names
$DB_TABLE_DEF = 
["post_text" => "post_text",
"user_id" => "user_id",
"session_id" => "session_id", 
"stock_name" => "stock_name", 
"recomendation" => "recomendation",
"extra" => "extra",
"date" => "post_date",
"id" => "id"
];

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
if ($request->isPost()) {
    if (validateInput($requestValue, ["post_text","user_id","session_id", 
                                      "stock_name", "recomendation"], "POST", 5, 5)) {
        $requestValue = sanitizePostData($requestValue);
        // ($tableTranslation, $requestValue, $db, $table, $key)
        $sql = createSqlPost($DB_TABLE_DEF, $requestValue, $dataBase, "post", "id");
        executeSQL($sql, $requestValue, $dataBase, "POST", "id");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isGet()) {
    if (validateInput($requestValue, ["user_id","session_id","id"], "GET", 2, 3)) {
        unset($requestValue["session_id"]);
        // If ID is not given, the search by user_id
        if (array_key_exists("id", $requestValue)) {
            unset($requestValue["user_id"]);
        }
        // Create the SQL query
        $sql = createSqlGet($DB_TABLE_DEF, $requestValue, "post");
        $sqlResults = executeSQL($sql, $requestValue, $dataBase, "GET", "TMP");
        // Create the JSON response
        createJSONPacket($sqlResults);
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isPut()) {
    if (validateInput($requestValue, ["id", "post_text", "user_id", "session_id"], "PUT", 4, 4)) {
        unset($requestValue["session_id"]);
        unset($requestValue["user_id"]);
        $sql = createSqlPut($DB_TABLE_DEF, $requestValue, "post", "id", "id");
        unset($requestValue["id"]);
        executeSQL($sql, $requestValue, $dataBase, "PUT", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isDelete()) {
    if (validateInput($requestValue, ["id", "user_id", "session_id"], "DELETE", 3, 3)) {
        unset($requestValue["session_id"]);
        unset($requestValue["user_id"]);
        $sql = createSqlDelete($DB_TABLE_DEF, $requestValue, "post");
        executeSQL($sql, $requestValue, $dataBase, "DELETE", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
?>