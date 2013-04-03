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

if(!$db || isset($db)) {

    /* Unescaped parameters passed in */
    $unsafe_title = $_POST['title'];
    $unsafe_desc = $_POST['desc'];
    $unsafe_price = $_POST['price'];
    $unsafe_reduced_price = $_POST['reduced'];
    $unsafe_stock = $_POST['stock'];
    $unsafe_status = $_POST['status'];

    /* safe to inject parameters */
    $title = $db->real_escape_string($unsafe_title);
    $desc = $db->real_escape_string($unsafe_desc);
    $price = $db->real_escape_string($unsafe_price);
    $reduced_price = $db->real_escape_string($unsafe_reduced_price);
    $stock = $db->real_escape_string($unsafe_stock);
    $status = $db->real_escape_string($unsafe_status);

    if($reduced_price === null)
        $reduced_price = '0.00';

    $db->insert("INSERT INTO product (title, content, post_status, post_date, price, reduced_price, stock, categoryID) VALUES ('$title', '$desc', '$status', NOW(), '$price', '$reduced_price', '$stock', '1')");

    /* Data returned by the API */
    if($db->errorThrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->errorMessage;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['inserted_id'] = $db->insert_id;
        $response['report']['status'] = "Update successful";
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
