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

    /* Unescaped parameters passed in */
    $unsafe_name = $_POST['name'];
    $unsafe_menu_order = $_POST['menu_order'];
    $unsafe_status = $_POST['status'];

    /* safe to inject parameters */
    $name = $db->real_escape_string($unsafe_name);
    $menu_order = $db->real_escape_string($unsafe_menu_order);
    $status = $db->real_escape_string($unsafe_status);

    // Makes the name lower case and replaces spaces with '-'
    $slug = explode(' ', strtolower($name));
    $slug = implode('-', $slug);

    if($menu_order < 0) {
        $menu_order = -1;
    }

    $db->insert("INSERT INTO category (name, slug, menu_order, post_status) VALUES ('$name', '$slug', '$menu_order', '$status')");

    // Get the recently inserted sku number
    $id = $db->insert_id;

    /* Data returned by the API */
    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['inserted_id'] = $id;
        $response['report']['status'] = "Added category successfully";
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
