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
    $productID = $_POST['productID'];
    $quantity = $_POST['quantity'];
    $unsafe_operation = $_POST['operation'];
    // Confirm the operation set is okay to use.
    $operation = $db->real_escape_string($unsafe_operation);
    echo $unsafe_operation;

    /* Make the update the the product group */
    if($operation == 'add' || $operation == "+") {
        $db->update("UPDATE $db->db_name.product SET stock=(stock + '$quantity') WHERE ID='$productID'");
    } else {
        $db->update("UPDATE $db->db_name.product SET stock=(stock - '$quantity') WHERE ID='$productID'");
    }

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
