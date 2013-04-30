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

if($db || isset($db)) {

    /**
     * The unsafe variables sent with the request
     */
    $unescaped_id = $_GET['id'];

    /**
     * The variables after they have been cleaned up
     */
    $id = $db->real_escape_string($unescaped_id);

    $result = $db->select("SELECT * FROM product WHERE ID = '$id'");

    $item = $result->fetch_assoc();

    if(empty($item)) {
        $item['error']['thrown'] = true;
        $item['error']['message'] = 'No results found';
    } else {
        $item['error']['thrown'] = false;
        $item['error']['message'] = '';
    }

} else {
    $item['error']['thrown'] = true;
    $item['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($item);

?>
