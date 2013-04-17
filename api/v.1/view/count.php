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
    /**
     * The table to count.
     */
    $show = $_GET['show'];
    $status = $_GET['status'];
    // Check to see if the user wants to specify a 
    // category to view.
    if(isset($_GET['category'])) {
        $category = $_GET['category'];
        $category = 'AND categoryID='.$category;
    } else {
        $category = '';
    }

    /**
     * Validate which table to search. Default is 'product_group'.
     */
    switch($show) {
        case 'category':
            $table = 'category';
            $id = 'ID'; break;
        default:
            $table = 'product_group';
            $id = 'sku'; break;
    }

    /**
     * Return on results the user has specified. Default is all.
     */
    switch($status) {
        case 'publish':
            $products_query = $db->select("SELECT COUNT($id) FROM $table WHERE post_status = 'publish' $category"); break;
        case 'trash':
            $products_query = $db->select("SELECT COUNT($id) FROM $table WHERE post_status = 'trash' $category"); break;
        case 'draft':
            $products_query = $db->select("SELECT COUNT($id) FROM $table WHERE post_status = 'draft' $category"); break;
        case 'not-trash':
            $products_query = $db->select("SELECT COUNT($id) FROM $table WHERE post_status <> 'trash' $category"); break;
        default:
            $products_query = $db->select("SELECT COUNT($id) FROM $table"); break;
    }

    /**
     * Calculate the number of pages requred.
     */
    $count = $products_query->fetch_assoc();

    /**
     * Generate the response array.
     */
    $response['count'] = $count['COUNT('.$id.')'];
    $response['show'] = $table;
    $response['status'] = ($status === null ? 'all' : $status);
} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = 'Unable to connect to the database.';
}

/**
 * Return the encoded JSON object.
 */
echo json_encode($response);

?>