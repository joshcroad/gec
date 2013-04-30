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

    /* The JSON object with the products in */
    $product_ids = json_decode($_POST['id']);
    $product_quantities = json_decode($_POST['quantity']);
    $product_prices = json_decode($_POST['price']);
    $unsafe_customer_name = $_POST['customer_name'];

    $customer_name = $db->real_escape_string($unsafe_customer_name);

    $db->insert("INSERT INTO $db->db_name.order (customer, purchase_date, mail_type, dispatched) VALUES ('$customer_name', NOW(), 'standard', 'false')");

    // Get the recently inserted sku number
    $order_id = $db->insert_id;

    /* Add new records for values and stock in */
    for($i=0, $len=count($product_ids); $i<$len; $i++) {
        $quantity = $product_quantities[$i];
        $price = $product_prices[$i];
        $product_id = $product_ids[$i];
        $db->insert("INSERT INTO $db->db_name.product_order (ID, quantity, price, productID) VALUES('$order_id', '$quantity', '$price', '$product_id')");
    }

    $response['error']['thrown'] = false;
    $response['report']['message'] = "Thank you for your purchase!";

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
