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
    echo 'Unable to load \'config.php\'. Please download and re-install your product again. Thanks.';

/**
 * Set database object visible.
 */
global $db;

/**
 * Initialise the variables sent through $_POST.
 */
$unsafe_name = $_POST['site_name'];
$unsafe_desc = $_POST['description'];

/*
 * Remove any escape characters to allow them to be added into the sql statement.
 */
$site_name = $db->real_escape_string($unsafe_name);
$desc = $db->real_escape_string($unsafe_desc);

/**
 * Execute the queries to update the settings.
 */
$db->update("UPDATE settings SET value = '$site_name' WHERE name = 'site_name'");
$db->update("UPDATE settings SET value = '$desc' WHERE name = 'description'");

/**
 * The array to be returned. As long as an error
 * has not occurred.
 */
if($db->errorThrown) {
    $response['error']['thrown'] = true;
    $response['error']['message'] = $db->errorMessage;
} else {
    $response['error']['thrown'] = false;
    $response['report']['status'] = 'Updated Successful.';
    $response['report']['title'] = $unsafe_name;
    $response['report']['description'] = $desc;
}

/**
 * The data returned, as a JSON object.
 */
echo json_encode($response);


?>