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
     * Parse all information.
     */
    $unescaped_q = $_GET['q']; // The query.

    /**
     * Escape the query string of any SQL harmful
     * characters.
     */
    $q = $db->real_escape_string($unescaped_q);
    /**
     * Run the query.
     */
    $result = $db->select("SELECT * FROM product_group WHERE post_status = 'publish' AND (title LIKE '%$q%' OR sku LIKE '$q')");

        /**
         * Loop through all records retrieved from the query.
         */
        $i = 0;
        while($item = $result->fetch_assoc()) {
            $id = $item['sku'];
            $response['product_group'][$i]['sku'] = $item['sku'];
            $response['product_group'][$i]['title'] = $item['title'];
            $response['product_group'][$i]['content'] = $item['content'];
            $response['product_group'][$i]['price'] = $item['price'];
            $response['product_group'][$i]['sale_price'] = $item['sale_price'];
            $response['product_group'][$i]['colour'] = $item['colour'];
            $response['product_group'][$i]['thumbnail'] = $item['thumbnail'];
            $response['product_group'][$i]['post_status'] = $item['post_status'];
            $response['product_group'][$i]['post_date'] = $item['post_date'];
            $response['product_group'][$i]['post_modified'] = $item['post_modified'];
            $response['product_group'][$i]['categoryID'] = $item['categoryID'];
            $products = $db->select("SELECT * FROM product WHERE sku = '$id'");
            $j = 0;
            while($product = $products->fetch_assoc()) {
                $response['product_group'][$i]['product'][$j]['value'] = $product['value'];
                $response['product_group'][$i]['product'][$j]['stock'] = $product['stock'];
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