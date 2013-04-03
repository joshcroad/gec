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
$status = $_GET['status'];
$start = (int) $_GET['start'];
$show = (int) $_GET['show'];

/**
 * Return on results the user has specified. Default is all.
 */
switch($status) {
    case 'publish':
        $products = $db->select("SELECT * FROM product WHERE post_status = 'publish' ORDER BY sku DESC LIMIT $start, $show"); break;
    case 'trash':
        $products = $db->select("SELECT * FROM product WHERE post_status = 'trash' ORDER BY sku DESC LIMIT $start, $show"); break;
    case 'draft':
        $products = $db->select("SELECT * FROM product WHERE post_status = 'draft' ORDER BY sku DESC LIMIT $start, $show"); break;
    case 'not-trash':
        $products = $db->select("SELECT * FROM product WHERE post_status <> 'trash' ORDER BY sku DESC LIMIT $start, $show"); break;
    default:
        $products = $db->select("SELECT * FROM product ORDER BY sku DESC LIMIT $start, $show"); break;
}

/**
 * Populate the products array.
 */
$i = 0;
while($item = $products->fetch_assoc()) {
    $id = $item['sku'];
    $response['product'][$i]['sku'] = $item['sku'];
    $response['product'][$i]['title'] = $item['title'];
    $response['product'][$i]['content'] = $item['content'];
    $response['product'][$i]['post_status'] = $item['post_status'];
    $response['product'][$i]['post_date'] = $item['post_date'];
    $response['product'][$i]['post_modified'] = $item['post_modified'];
    $response['product'][$i]['price'] = $item['price'];
    $response['product'][$i]['reduced_price'] = $item['reduced_price'];
    $response['product'][$i]['colour'] = $item['colour'];
    $response['product'][$i]['categoryID'] = $item['categoryID'];
    $stock = $db->select("SELECT * FROM stock WHERE sku = '$id'");
    $j = 0;
    while($stock_item = $stock->fetch_assoc()) {
        $response['product'][$i]['stock'][$j]['size'] = $stock_item['size'];
        $response['product'][$i]['stock'][$j]['stock'] = $stock_item['stock'];
        $j++;
    }
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

echo json_encode($response);

?>