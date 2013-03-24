<?php

/**
 * The header content.
 */
//header("Content-type: application/json");

/**
 * Configure the API.
 */
require_once('../../../inc/api_config.php');
global $db;

/**
 * The table to count.
 */
$show = $_GET['show'];

/**
 * Validate which table to search. Default is 'products'.
 */
switch($show) {
    case 'product':
        $table = 'product';
        $id = 'sku'; break;
    case 'category':
        $table = 'category';
        $id = 'ID'; break;
    default:
        $table = 'product'; break;
}

/**
 * The number of products in the database.
 */
$products_query = $db->select("SELECT COUNT($id) FROM $table");

/**
 * Calculate the number of pages requred.
 */
$product_count = $products_query->fetch_assoc();

/**
 * Generate the response array.
 */
$response['count'] = $product_count['COUNT('.$id.')'];
$response['table'] = $table;

/**
 * Return the encoded JSON object.
 */
echo json_encode($response);

?>