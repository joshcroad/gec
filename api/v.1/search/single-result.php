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
     * The unsafe variables sent with the request
     */
    $unescaped_table = $_GET['table'];
    $id = $_GET['id'];

    /**
     * The variables after they have been cleaned up
     */
    $table = $db->real_escape_string($unescaped_table);

    if($table === 'product_group') {
    	$result = $db->select("SELECT * FROM product_group WHERE sku = '$id'");
    } else {
    	$result = $db->select("SELECT * FROM $table WHERE ID = '$id'");
    }

    $item = $result->fetch_assoc();

    if(empty($item)) {
        $item['error']['thrown'] = true;
    	$item['error']['message'] = 'No results found';
    } else {
        $unformattedTime = strtotime($item['post_date']);
        $item['post_date'] = date('d F, Y', $unformattedTime);

        $unformattedTime = strtotime($item['post_modified']);
        $item['post_modified'] = date('d F, Y', $unformattedTime);

        $product_values = $db->select("SELECT * FROM product WHERE sku = '$id'");
        $i = 0;
        while($product = $product_values->fetch_assoc()) {
            $item['product'][$i]['value'] = $product['value'];
            $item['product'][$i]['stock'] = $product['stock'];
            $i++;
        }

        $item['error']['thrown'] = false;
        $item['error']['message'] = '';
    }

} else {
    $item['error']['thrown'] = true;
    $item['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($item);

?>
