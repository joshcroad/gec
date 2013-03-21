<?php

/**
 * The header content.
 */
header("Content-type: application/json");

global $is_api;
$is_api = true;

/**
 * Configure the file.
 */
if(file_exists( '../../../inc/config.php'))
    require_once('../../../inc/config.php');
else 
    echo 'Cannot configure the API';

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
        $id = 'sku';
        break;
    case 'category':
        $table = 'category';
        $id = 'ID';
        break;
    default:
        $table = 'product';
        break;
}

/**
 * Set database object visible.
 */
global $db;

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