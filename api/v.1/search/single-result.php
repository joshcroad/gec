<?php

header("Content-type: application/json");

require_once('../../../inc/api_config.php');
global $db;

$unescaped_table = $_GET['table'];
$unescaped_id = $_GET['id'];

$table = $db->real_escape_string($unescaped_table);
$id = $db->real_escape_string($unescaped_id);

if($table === 'product')
	$result = $db0->select("SELECT * FROM $table WHERE sku = '$id'");
else
	$result = $db->select("SELECT * FROM $table WHERE ID = '$id'");

$item = $result->fetch_assoc()

if(empty($item)) {
	$item['error'] = true;
	$item['message'] = 'No results found';
}

echo json_encode($item);

?>
