<?php

/**
 * The header content.
 */
header("Content-type: application/json");

/**
 * Configure the API.
 */
require_once('../../../inc/api_config.php');
global $db;

if(!$db || isset($db)) {
    $unescaped_table = $_GET['table'];
    $unescaped_id = $_GET['id'];

    $table = $db->real_escape_string($unescaped_table);
    $id = $db->real_escape_string($unescaped_id);

    if($table === 'product')
    	$result = $db->select("SELECT * FROM $table WHERE sku = '$id'");
    else
    	$result = $db->select("SELECT * FROM $table WHERE ID = '$id'");

    $item = $result->fetch_assoc();

    $unformattedTime = strtotime($item['post_date']);
    $item['post_date'] = date('d F, Y', $unformattedTime);

    $unformattedTime = strtotime($item['post_modified']);
    $item['post_modified'] = date('d F, Y', $unformattedTime);

    $item['error']['thrown'] = false;
    $item['error']['message'] = '';

    if(empty($item)) {
    	$item['error']['thrown'] = true;
    	$item['error']['message'] = 'No results found';
    }
} else {
    $item['error']['thrown'] = true;
    $item['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($item);

?>