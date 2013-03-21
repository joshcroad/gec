<?php

/**
 * Settings the HTTP header
 */
header("Content-type: application/json");

global $is_api;
$is_api = true;

/**
 * Configure the file.
 */
if(file_exists('../../../inc/config.php'))
    require_once('../../../inc/config.php');
else 
    echo 'Cannot configure the API';

/**
 * Make database object visible.
 */
global $db;

/**
 * Parse all information.
 */
$table = $_GET['table']; // The table.
$unescaped_q = $_GET['q']; // The query.

/**
 * Escape the query string of any SQL harmful
 * characters.
 */
$q = $db->real_escape_string($unescaped_q);
/**
 * Run the query.
 */
$result = $db->select("SELECT * FROM product WHERE stock > 0 AND title LIKE '$q%'");

/**
 * Loop through all records retrieved from the query.
 */
$i = 0;
while($item = $result->fetch_assoc()) {
    $response[$i]['sku'] = $item['sku'];
    $response[$i]['title'] = $item['title'];
    $response[$i]['content'] = $item['content'];
    $response[$i]['post_date'] = $item['post_date'];
    $response[$i]['price'] = $item['price'];
    $response[$i]['reduced_price'] = $item['reduced_price'];
    $response[$i]['stock'] = $item['stock'];
    $i++;
}

if(empty($response)) {
    $response[0]['error'] = 'true';
    $response[0]['message'] = 'No results found.';
}

/**
 * Encode the JSON obj and return it.
 */
echo json_encode($response);

?>