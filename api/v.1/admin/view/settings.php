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
    /**
     * The number of products in the database.
     */
    $results = $db->select("SELECT * FROM settings");

    /**
     * Calculate the number of pages requred.
     */
    while($settings = $results->fetch_assoc()) {
        $response['ID'] = $settings['ID'];
        $response[$settings['name']] = $settings['value'];
    }

    $response['error']['thrown'] = false;

} else {
    $response['error']['thrown'] = true;
    $response['report']['message'] = 'Unable to connect to the database.';
}

/**
 * Return the encoded JSON object.
 */
echo json_encode($response);

?>