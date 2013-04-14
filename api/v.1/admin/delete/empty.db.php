<?php

/**
 * The header content.
 */
header("Content-type: application/json");

/**
 * Configure the API.
 */
require_once('../../../../inc/api_config.php');
global $db;

if($db || isset($db)) {
    $db->truncate(); break;

    $response['error']['thrown'] = false;
    $response['status'] = "Database reset successfully.";
} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = 'Unable to connect to the database.';
}

/**
 * Return the encoded JSON object.
 */
echo json_encode($response);

?>