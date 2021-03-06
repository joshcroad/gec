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
    $unsafe_name = $_POST['site_name'];

    /*
     * Remove any escape characters to allow them to be added into the sql statement.
     */
    $site_name = $db->real_escape_string($unsafe_name);

    /**
     * Execute the queries to update the settings.
     */
    $db->update("UPDATE settings SET value='$site_name' WHERE name='site_name'");

    /**
     * The array to be returned. As long as an error
     * has not occurred.
     */
    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['status'] = 'Updated Successful.';
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