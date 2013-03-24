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

/**
 * The number of products in the database.
 */
$result_set = $db->select("SELECT * FROM settings");

/**
 * Calculate the number of pages requred.
 */
while($settings = $result_set->fetch_assoc()) {
    $response['ID'] = $settings['ID'];
    $response[$settings['name']] = $settings['value'];
}

/**
 * Return the encoded JSON object.
 */
echo json_encode($response);

?>