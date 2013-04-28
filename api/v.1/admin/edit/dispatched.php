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
     * Initialise the variables sent through $_POST.
     */
    $id = $_POST['orderID'];

    /**
     * Execute the queries to update the settings.
     */
    $db->update("UPDATE $db->db_name.order SET dispatched='true' WHERE ID='$id'");

    /**
     * The array to be returned. As long as an error
     * has not occurred.
     */
    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
    }
} else {
    $response['error']['thrown'] = true;
    $response['error']['status'] = 'Unable to connect to the database.';
}

/**
 * The data returned, as a JSON object.
 */
echo json_encode($response);


?>