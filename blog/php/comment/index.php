<?php
include "../rest.php";
include "../lib.php";
include "validateInput.php";

// Constant that translates the table names to input names
$DB_TABLE_DEF = 
["id" => "id",
"user_id" => "user_id",
"post_id" => "post_id",
"comment_text" => "comment_text",
"date" => "comment_date",
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
    if (validateInput($requestValue, ["post_id", "user_id", "comment_text", "session_id"], "POST", 4, 4)) {
        // ($tableTranslation, $requestValue, $db, $table, $key)
        unset($requestValue["session_id"]);
        $requestValue["date"] = date("Y-m-d");
        $sql = createSqlPost($DB_TABLE_DEF, $requestValue, $dataBase, "blog_comment", "id");
        executeSQL($sql, $requestValue, $dataBase, "POST", "id");
        // http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isGet()) {
    if (validateInput($requestValue, ["post_id"], "GET", 1, 1)) {
        $sql = createSqlGet($DB_TABLE_DEF, $requestValue, "blog_comment");
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
    if (validateInput($requestValue, ["id", "session_id", "user_id", "comment_text"], "PUT", 4, 4)) {
        unset($requestValue["user_id"]);
        unset($requestValue["session_id"]);
        $sql = createSqlPut($DB_TABLE_DEF, $requestValue, "blog_comment", "id", "id");
        unset($requestValue["id"]);
        executeSQL($sql, $requestValue, $dataBase, "PUT", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isDelete()) {
    if (validateInput($requestValue, ["id", "session_id", "user_id"], "DELETE", 3, 3)) {
        unset($requestValue["user_id"]);
        unset($requestValue["session_id"]);
        $sql = createSqlDelete($DB_TABLE_DEF, $requestValue, "blog_comment");
        executeSQL($sql, $requestValue, $dataBase, "DELETE", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
?>