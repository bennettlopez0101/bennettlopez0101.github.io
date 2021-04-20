<?php
include "../rest.php";
include "../lib.php";
include "validateInput.php";

// Constant that translates the table names to input names
$DB_TABLE_DEF = 
["username" => "username",
"password" => "password",
"salt" => "salt",
"session_id" => "session_id",
"id" => "id"];

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
    if (validateInput($requestValue, ["username","password","salt", "session_id"], "POST", 4, 4)) {
        // ($tableTranslation, $requestValue, $db, $table, $key)
        $sql = createSqlPost($DB_TABLE_DEF, $requestValue, $dataBase, "blog_user", "id");
        executeSQL($sql, $requestValue, $dataBase, "POST", "id");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isGet()) {
    if (validateInput($requestValue, ["username", "id"], "GET", 1, 1)) {
        $sql = createSqlGet($DB_TABLE_DEF, $requestValue, "blog_user");
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
    if (validateInput($requestValue, ["username", "old_password", "password", "session_id"], "PUT", 3, 3)) {
        unset($requestValue["old_password"]);
        $sql = createSqlPut($DB_TABLE_DEF, $requestValue, "blog_user", "username", "username");
        unset($requestValue["username"]);
        executeSQL($sql, $requestValue, $dataBase, "PUT", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
else if ($request->isDelete()) {
    if (validateInput($requestValue, ["username", "password"], "DELETE", 2, 2)) {
        $sql = createSqlDelete($DB_TABLE_DEF, $requestValue, "blog_user");
        executeSQL($sql, $requestValue, $dataBase, "DELETE", "TMP");
        http_response_code(200);
    }
    else {
        http_response_code(404);
    }
}
?>