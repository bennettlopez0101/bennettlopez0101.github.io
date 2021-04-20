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
    if (sizeOf($requestValue) == 1) {
        if (array_key_exists("username", $requestValue)) {
            if (validateUnequeIndividual($dataBase, $requestValue["username"], "username")) {
                http_response_code(200);
            }
            else {
                $arr = array("error_text" => "Username already Exists");
                echo json_encode($arr);
                http_response_code(404);
            }
        }
        else {
            $arr = array("error_text" => "Username is not a parameter");
            echo json_encode($arr);
            http_response_code(404);
        }
    }
    else {
        $arr = array("error_text" => "Reuquest is only the username field");
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