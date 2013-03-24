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

/**
 * The variables for the range. Start from and
 * how many to show per page.
 */
$start = (int) $_GET['start'];
$show = (int) $_GET['show'];

/**
 * Run the query.
 */
$result = $db->select("SELECT * FROM product LIMIT $start, $show");

/**
 * Populate the products array.
 */
$i = 0;
while($item = $result->fetch_assoc()) {
    $response['product'][$i]['sku'] = $item['sku'];
    $response['product'][$i]['title'] = $item['title'];
    $response['product'][$i]['content'] = $item['content'];
    $response['product'][$i]['post_status'] = $item['post_status'];
    $response['product'][$i]['post_date'] = $item['post_date'];
    $response['product'][$i]['post_modified'] = $item['post_modified'];
    $response['product'][$i]['price'] = $item['price'];
    $response['product'][$i]['reduced_price'] = $item['reduced_price'];
    $response['product'][$i]['stock'] = $item['stock'];
    $response['product'][$i]['categoryID'] = $item['categoryID'];
    $i++;
}

/**
 * Nothing was added to the array.
 */
if(empty($response) || $response['product'][0]['sku'] == null) {
    $response['error']['thrown'] = true;
    $response['error']['message'] = 'No results found.';
} else {
    $response['error']['thrown'] = false;
    $response['error']['message'] = '';
}

/**
 * Return the start number.
 */
$response['start'] = $start;

/**
 * Return the number of items shown.
 */
$response['show'] = $show;

echo json_encode($response);

?>