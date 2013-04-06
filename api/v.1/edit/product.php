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
    $sku = $_POST['sku'];
    $unsafe_title = $_POST['title'];
    $unsafe_content = $_POST['content'];
    $unsafe_price = $_POST['price'];
    $unsafe_sale_price = $_POST['sale'];
    $unsafe_colour = $_POST['colour'];
    $unsafe_thumbnail = $_POST['thumbnail'];
    $unsafe_status = $_POST['status'];
    $unsafe_category_id = $_POST['category_id'];

    $unsafe_values = json_decode($_POST['values']); // Array
    $unsafe_stocks = json_decode($_POST['stocks']); // Array

    /* Safe to inject parameters */
    $title = $db->real_escape_string($unsafe_title);
    $content = $db->real_escape_string($unsafe_content);
    $price = $db->real_escape_string($unsafe_price);
    $sale_price = $db->real_escape_string($unsafe_sale_price);
    $colour = $db->real_escape_string($unsafe_colour);
    $thumbnail = $db->real_escape_string($unsafe_thumbnail);
    $status = $db->real_escape_string($unsafe_status);
    $category_id = $db->real_escape_string($unsafe_category_id);

    /* Validation */
    if($sale_price === null)
        $sale_price = '0.00';

    /* Make the update the the product group */
    $db->update("UPDATE product_group SET title='$title', content='$content', price='$price', sale_price='$sale_price', colour='$colour', thumbnail='', post_status='$status', post_modified=NOW(), categoryID='$category_id' WHERE sku='$sku'");

    /* Reset product table */
    $db->delete("DELETE FROM product WHERE sku='$sku'");

    /* Add new records for values and stock in */
    for($i=0, $len=count($unsafe_stocks); $i<$len; $i++) {
        /* Make sure the parameters are safe to inject */
        $value = $db->real_escape_string($unsafe_values[$i]);
        $stock = $db->real_escape_string($unsafe_stocks[$i]);
        $db->insert("INSERT INTO product (sku, value, stock) VALUES('$sku','$value','$stock')");
    }

    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['status'] = "Update successful";
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
