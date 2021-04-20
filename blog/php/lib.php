<?php
/**
 * Connect to the DB
 */
function connect_to_db() {
	try {
		$db = new PDO("pgsql:dbname=blog host=localhost user=dev password=314dev");
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $err) {
		$db = false;
	}
	return $db;
}
/**
 * Test to see if in array
 */
function found_all_keys($inputs, $keys) {
	$found_all = true;
	foreach($keys as $key) {
		if(!array_key_exists($key, $inputs)) {
			$found_all = false;
		}
	}
	return $found_all;
}

/**
 * Creates the POST SQL Statement
 * 
 * @tableTranslation: The list of table names that corresponds to the input names
 * @requestValue: The array values of the requested elements
 * @db: The database
 * @table: The table to aim the SQL script to 
 * @key: The synthetic key to create
 */
function createSqlPost($tableTranslation, $requestValue, $db, $table, $key) {
	$sql = "INSERT INTO ". $table ." (";
	$keys = array_keys($requestValue);
	for ($i = 0; $i < count($keys) - 1; $i++) {
		$sql = $sql . $tableTranslation[$keys[$i]] . ", ";
	}
	$sql = $sql . $tableTranslation[$keys[count($keys) - 1]] . ", " . $key . " ) VALUES (";
	for ($i = 0; $i < count($keys) - 1; $i++) {
		$sql = $sql . "?, ";
	}
	$sql = $sql . "?, " . getSyntheticKey($db, $key, $table) . ")";
	return $sql;
}

/**
 * Creates the GET SQL Statement
 * 
 * @tableTranslation: The list of table names that corresponds to the input names
 * @requestValue: The array values of the requested elements
 * @table: The table to aim the SQL script to 
 */
function createSqlGet($tableTranslation, $requestValue, $table) {
	$sql = "SELECT * FROM " . $table . " WHERE ";
	$keys = array_keys($requestValue);
	$sql = $sql . $tableTranslation[$keys[0]] . " = ?";
	return $sql;
}

/**
 * Creates the PUT SQL Statement
 * 
 * @tableTranslation: The list of table names that corresponds to the input names
 * @requestValue: The array values of the requested elements
 * @id: The requested value name of the key
 * @table: The table to aim the SQL script to 
 * @key: The synthetic key to create
 * @databaseID: The column name of the ID
 */
function createSqlPut($tableTranslation, $requestValue, $table, $id, $databaseID) {
	$sql = "UPDATE " . $table . " SET ";
	$keys = array_keys($requestValue);
	for ($i = 0; $i < count($keys) - 1; $i++) {
		if ($keys[$i] != $id) {
			$sql = $sql . $tableTranslation[$keys[$i]] . " = ?, ";
		}
	}
	if ($keys[$i] != $id) {
		$sql = $sql . $tableTranslation[$keys[count($keys) - 1]] . " = ? ";
	}
	$sql = $sql . " WHERE " . $databaseID . " = '" . $requestValue[$id] . "'";
	return $sql;
}

/**
 * Creates the DELETE SQL Statement
 * 
 * @tableTranslation: The list of table names that corresponds to the input names
 * @requestValue: The array values of the requested elements
 * @table: The table to aim the SQL script to 
 */
function createSqlDelete($tableTranslation, $requestValue, $table) {
	$sql = "DELETE FROM " . $table . " WHERE ( ";
	$keys = array_keys($requestValue);
	for ($i = 0; $i < count($keys) - 1; $i++) {
		$sql = $sql . $tableTranslation[$keys[$i]] . " = ? AND ";
	}
	$sql = $sql . $tableTranslation[$keys[count($keys) - 1]] . " = ? )";
	return $sql;
}
/**
 * Executes the given SQL statement
 * 
 * @sql: The SQL statement
 * @requestValues: The array of requested values
 * @db: The database to connect to 
 * @type: The type of HTTP request
 * @id: If the type is put, then the ID to ignore
 */
function executeSQL($sql, $requestValues, $db, $type, $id) {
	$status = true;
	$statement = $db->prepare($sql);
	if ($type == "PUT") {
		unset($requestValues[$id]);
	}
	$statement->execute(array_values($requestValues));
	$results = $statement->fetchAll(PDO::FETCH_ASSOC);
	return $results;
}

/**
 * This function creates a syntetic key; creates one, then checks to see
 * if it already exists. If it does, create a new key.
 * 
 * @db: The database to connect to 
 * @key: The column of the table to create the key for
 * @table: The table to compare the key to
 */
function getSyntheticKey($db, $key, $table) {
	$randKey = rand(0, 1000000000);
	while (!validateUnequeIndividual($db, $randKey, $key, $table)) {
		$randKey = rand(0, 1000000000);
	}
	return $randKey;
}

/**
 * Creates a JSON packet based on the SQL results 
 * 
 * @sqlResults: The array to create the JSON packet. 
 */
function createJSONPacket($sqlResults) {
	for ($i = 0; $i < count($sqlResults); $i++) {
		$results = array();
		$keys = array_keys($sqlResults[$i]);
		for ($x = 0; $x < count($sqlResults[$i]); $x++) {
			$results = array_merge($results, array($keys[$x] => $sqlResults[$i][$keys[$x]]));
		}
		echo(json_encode($results));
	}
}
?>