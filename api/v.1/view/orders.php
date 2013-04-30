<?php

/**
 * Settings the HTTP header
 */
header("Content-type: application/json");

/**
 * Configure the API.
 */
require_once('../../../inc/api_config.php');
global $db;

if($db || isset($db)) {

    /**
     * Run the query.
     */
    $result = $db->select("SELECT * FROM $db->db_name.order WHERE dispatched = 'false'");

    /**
     * Loop through all records retrieved from the query.
     */
    $i = 0;
    while($item = $result->fetch_assoc()) {
        $id = $item['ID'];
        $response['order'][$i]['id'] = $item['ID'];
        $response['order'][$i]['customer'] = $item['customer'];
        $response['order'][$i]['purchase_date'] = $item['purchase_date'];
        $response['order'][$i]['mail_type'] = $item['mail_type'];
        $response['order'][$i]['dispatched'] = $item['dispatched'];
        $product_orders = $db->select("SELECT * FROM $db->db_name.product_order WHERE ID = '$id'");
        $j = 0;
        while($product = $product_orders->fetch_assoc()) {
            $response['order'][$i]['product_order'][$j]['quantity'] = $product['quantity'];
            $response['order'][$i]['product_order'][$j]['price'] = $product['price'];
            $response['order'][$i]['product_order'][$j]['productID'] = $product['productID'];
            $product_sku = $product['productID'];
            $sku_result = $db->select("SELECT sku FROM $db->db_name.product WHERE ID = '$product_sku'");
            $sku = $sku_result->fetch_assoc();
            $response['order'][$i]['product_order'][$j]['sku'] = $sku['sku'];
            $j++;
        }
        $i++;
    }

    if(empty($response)) {
        $response['error']['thrown'] = true;
        $response['error']['message'] = 'No results found.';
    } else {
        $response['error']['thrown'] = false;
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = 'Unable to connect to the database.';
}

/**
 * Encode the JSON obj and return it.
 */
echo json_encode($response);

?>