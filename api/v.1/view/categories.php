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
    $unescaped_status = $_GET['status']; // The status.
    $status = $db->real_escape_string($unescaped_status);

    if(isset($_GET['menu'])) {
        $unescaped_menu = $_GET['menu']; // Whether it's a menu
        $menu = $db->real_escape_string($unescaped_menu);
    }

    if(!isset($status) || $status === 'not-trash')
        $status = 'publish';

    if(isset($menu) && $menu == true) {
        $result = $db->select("SELECT * FROM category WHERE post_status = '$status' AND menu_order != '-1' ORDER BY menu_order, name ASC");
    } else {
        $result = $db->select("SELECT * FROM category WHERE post_status = '$status' ORDER BY menu_order, name ASC");
    }

    /**
     * Loop through all records retrieved from the query.
     */
    $i = 0;
    while($item = $result->fetch_assoc()) {
        $response['category'][$i]['id'] = $item['ID'];
        $response['category'][$i]['name'] = $item['name'];
        $response['category'][$i]['slug'] = $item['slug'];
        $response['category'][$i]['menu_order'] = $item['menu_order'];
        $response['category'][$i]['post_status'] = $item['post_status'];
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