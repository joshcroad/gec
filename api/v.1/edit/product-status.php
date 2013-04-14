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

    /* Unescaped parameters passed in */
    $sku = $_POST['sku'];
    $unsafe_status = $_POST['status'];

    $status = $db->real_escape_string($unsafe_status);

    /* Make the update the the product group */
    $db->update("UPDATE product_group SET post_status='$status', post_modified=NOW() WHERE sku='$sku'");

    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['status'] = "Updated";
    }

} else {
    $response['error']['thrown'] = true;
    $response['report']['status'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
