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

if ($request->isGet()) {
    if (sizeOf($requestValue) == 2) {
        if (array_key_exists("username", $requestValue) && array_key_exists("session_id", $requestValue)) {
            if (!validateTwoFields($dataBase, "blog_user", $requestValue["username"], "username", $requestValue["session_id"], "session_id")) {
                http_response_code(200);
            }
            else {
                $arr = array("error_text" => "Username does not match key");
                echo json_encode($arr);
                http_response_code(404);
            }
        }
        else {
            $arr = array("error_text" => "Username or sessionId is not a parameter");
            echo json_encode($arr);
            http_response_code(404);
        }
    }
    else {
        $arr = array("error_text" => "Reuquest is only the username and session_id field");
        echo json_encode($arr);
        http_response_code(404);
    }
}
else {
    $arr = array("error_text" => "Endpoint only accepts GET request");
    echo json_encode($arr);
    http_response_code(404);
}

?>