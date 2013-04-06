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
            $products = $db->select("SELECT * FROM product_group WHERE post_status = 'publish' ORDER BY sku DESC LIMIT $start, $show"); break;
        case 'trash':
            $products = $db->select("SELECT * FROM product_group WHERE post_status = 'trash' ORDER BY sku DESC LIMIT $start, $show"); break;
        case 'draft':
            $products = $db->select("SELECT * FROM product_group WHERE post_status = 'draft' ORDER BY sku DESC LIMIT $start, $show"); break;
        case 'not-trash':
            $products = $db->select("SELECT * FROM product_group WHERE post_status <> 'trash' ORDER BY sku DESC LIMIT $start, $show"); break;
        default:
            $products = $db->select("SELECT * FROM product_group ORDER BY sku DESC LIMIT $start, $show"); break;
    }

    /**
     * Populate the products array.
     */
    $i = 0;
    while($item = $products->fetch_assoc()) {
        $id = $item['sku'];
        $response['product_group'][$i]['sku'] = $id;
        $response['product_group'][$i]['title'] = $item['title'];
        $response['product_group'][$i]['content'] = $item['content'];
        $response['product_group'][$i]['price'] = $item['price'];
        $response['product_group'][$i]['sale_price'] = $item['sale_price'];
        $response['product_group'][$i]['colour'] = $item['colour'];
        $response['product_group'][$i]['post_status'] = $item['post_status'];
        $response['product_group'][$i]['categoryID'] = $item['categoryID'];
        $product_values = $db->select("SELECT * FROM product WHERE sku = '$id'");
        $j = 0;
        while($product_value = $product_values->fetch_assoc()) {
            $response['product_group'][$i]['product'][$j]['value'] = $product_value['value'];
            $response['product_group'][$i]['product'][$j]['stock'] = $product_value['stock'];
            $j++;
        }
        $i++;
    }

    /**
     * Nothing was added to the array.
     */
    if(empty($response) || $response['product_group'][0]['sku'] == null) {
        $response['error']['thrown'] = true;
        $response['error']['message'] = 'No results found.';
    } else {
        $response['error']['thrown'] = false;
        $response['error']['message'] = '';
    }

    /**
     * Return the start number and how many shown.
     */
    $response['start'] = $start;
    $response['show'] = $show;

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = 'Unable to connect to the database.';
}

echo json_encode($response);

?>