<?php

/**
 * The header content.
 */
header("Content-type: application/json");

global $is_api;
$is_api = true;

/**
 * Configure the file.
 */
if(file_exists('../../../../inc/config.php'))
    require_once('../../../../inc/config.php');
else 
    die('Cannot configure the API');

/**
 * Set database object visible.
 */
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