<?php
/**
 * This function validates the input
 * @requestValue: The HTTP request value
 * @validParams: The valid params for the call
 * @HttpType: The type of request
 * @min: The min number of params
 * @max: The max number of params
 * 
 * @return: If the input is valid, then it will return true
 */
function validateInput($requestValue, $validParams, $HttpType, $min, $max) {
    $isValid = true;
    if (!validateInputSize($requestValue, $min, $max)) {
        $isValid = false;
        send404("Invlaid Number of Inputs", array("Message" => "Invalid input lenght"));
    }
    else if (!validateInputName($validParams, $requestValue)) {
        $isValid = false;
        // Send 404 in validateInputName
    }
    else if (!httpResponseValidatation($HttpType, $requestValue)) {
        $isValid = false;
        // Send 404 in validateInputContents
    }
    return $isValid;
}

/**
 * Validate the size of the inptus
 * 
 * @requestValue: The array of the request value
 * @min: The minimum amount of value to request
 * @max: The maximum amount of values to request
 */
function validateInputSize($requestValue, $min, $max) {
    $numParams = count($requestValue);
    $validateInput = true;
    // Validate the number of inputs
    if ($numParams < $min && $numParams < $max) {
        $validateInput = false;
    }
    return $validateInput;
}

/**
 * Send the 404 message
 * 
 * @message: The message to send in the 404 message
 * @params: The paramiters of the message
 */
function send404($message, $params) {
    $messageParams = "";
    $keys = array_keys($params);
    for ($i = 0; $i < count($params); $i++) {
        $messageParams = $messageParams . $params[$keys[$i]];
    }
    $arr = array("error_text" => $message . "---->" . $messageParams);
    echo json_encode($arr);
}

/**
 * Validate the input name
 * 
 * @correctElements: The list of names that are valid input names
 * @requestedElements: The list of requested names
 */
function validateInputName($correctElements, $requestedElements) {
    $returnValid = true;
    $repetition = [];
    $reqElmKeys = array_keys($requestedElements);
    // This test for valid inputs + repetition
    for ($i = 0; $i < count($reqElmKeys) && $returnValid; $i++) {
        if (in_array($reqElmKeys[$i], $repetition) || !in_array($reqElmKeys[$i], $correctElements)) {
            $returnValid = false;
            send404("Invalid Input Name or Repeat", array("Name" => "$reqElmKeys[$i]"));
        }
        array_push($repetition, $reqElmKeys[$i]);
    }
    return $returnValid;
}

/**
 * Validate HTTP call specifics
 * 
 * @HttpType: The type of HTTP request (POST, PUT, DELETE, GET)
 * @requestValue: The array of the actual request value
 */
function httpResponseValidatation($HttpType, $requestValue) {
    // Connect to DB
    $dataBase = connect_to_db();
    if (!$dataBase) {
        exit("Database error!");
    }
    $returnValid = true;
    // var_dump("VERIFY USER");
    $keys = array_keys($requestValue);
    if ($HttpType == "POST") {
        // username is  a required field, and must be uneque
        if (validateUnequeIndividualFromTable("post", $dataBase, $requestValue["post_id"], "id")) {
            $returnValid = false;
            send404("Invlaid post given", array("Message" => " Post " . $requestValue["post_id"] . " id does not exist"));
        }
    }
    else if ($HttpType == "GET" || $HttpType == "PUT" || $HttpType == "DELETE") {
        if (array_key_exists("post_id", $requestValue)) {
            if (validateUnequeIndividualFromTable("blog_comment", $dataBase, $requestValue["post_id"], "post_id")) {
                $returnValid = false;
                send404("Invlaid ID given", array("Message" =>"Post ".  $requestValue["post_id"] . " does not match"));
            }
        }
    }
    return $returnValid;
}

/**
 * Validates a single element from the DB that is uneque
 * 
 * @db: The database to compare the unequeness to
 * @data: The input to compare the unenquieness to 
 * @dbColumnName: The column name in the DB
 */
function validateUnequeIndividual($db, $data, $dbColumnName) {
    $sql = "SELECT * FROM blog_comment WHERE " . $dbColumnName . " = ?";
    $isUneque = true;
    $statement = $db ->prepare($sql);
    $statement->execute([$data]);

    $results = $statement->fetchAll(PDO::FETCH_ASSOC);
    if ($results != []) {
        $isUneque = false;
    }
    return $isUneque;
}

function validateUsernamePassword($db, $username, $password) {
    $sql = "SELECT * FROM blog_user WHERE username = ? AND password = ?";
    $isUneque = true;
    $statement = $db ->prepare($sql);
    $statement->execute([$username, $password]);
    $results = $statement->fetchAll(PDO::FETCH_ASSOC);
    if ($results != []) {
        $isUneque = false;
    }
    return $isUneque;
}

/**
 * Validates a single element from the DB that is uneque
 * 
 * @db: The database to compare the unequeness to
 * @data: The input to compare the unenquieness to 
 * @dbColumnName: The column name in the DB
 */
function validateUnequeIndividualFromTable($table, $db, $data, $dbColumnName) {
    $sql = "SELECT * FROM " . $table . " WHERE " . $dbColumnName . " = ?";
    $isUneque = true;
    $statement = $db ->prepare($sql);
    $statement->execute([$data]);

    $results = $statement->fetchAll(PDO::FETCH_ASSOC);
    if ($results != []) {
        $isUneque = false;
    }
    return $isUneque;
}
?>