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
    $unsafe_title = $_POST['title'];
    $unsafe_content = $_POST['content'];
    $unsafe_price = $_POST['price'];
    $unsafe_sale_price = $_POST['sale'];
    $unsafe_colour = $_POST['colour'];
    $unsafe_status = $_POST['status'];
    $unsafe_category_id = $_POST['category_id'];

    $unsafe_values = json_decode($_POST['values']); // Array
    $unsafe_stocks = json_decode($_POST['stocks']); // Array

    /* safe to inject parameters */
    $title = $db->real_escape_string($unsafe_title);
    $content = $db->real_escape_string($unsafe_content);
    $price = $db->real_escape_string($unsafe_price);
    $sale_price = $db->real_escape_string($unsafe_sale_price);
    $colour = $db->real_escape_string($unsafe_colour);
    $status = $db->real_escape_string($unsafe_status);
    $category_id = $db->real_escape_string($unsafe_category_id);

    /* Sale Validation */
    if($sale_price === null)
        $sale_price = '0.00';

    $db->insert("INSERT INTO product_group (title, content, price, sale_price, colour, post_status, post_date, categoryID) VALUES ('$title', '$content', '$price', '$sale_price', '$colour', '$status', NOW(), '$category_id')");

    // Get the recently inserted sku number
    $sku = $db->insert_id;

    // Thumbnail checks and validation.
    if(isset($_FILES['thumbnail'])) {
        function findExts($filename)  { 
            $filename = strtolower($filename); 
            $exts = explode(".", $filename);
            $exts = end($exts);
            return $exts;
        }
        //This applies the function to our file  
        $exts = findExts($_FILES['thumbnail']['name']);
        $filename = $sku.'.'.$exts;
        $target = "../../../media/".$filename;

        // Allowed extensions
        $allowedExts = array("gif", "jpeg", "jpg", "png", "pjpeg");
        // Check to make sure file type is picture, and size is < 2mb
        if ((($_FILES["thumbnail"]["type"] == "image/gif") || ($_FILES["thumbnail"]["type"] == "image/jpeg")
        || ($_FILES["thumbnail"]["type"] == "image/jpg") || ($_FILES["thumbnail"]["type"] == "image/png") 
        || ($_FILES["thumbnail"]["type"] == "image/pjpeg")) && ($_FILES["thumbnail"]["size"] < 200000) 
        && in_array($exts, $allowedExts)) {
            // Has the file got an error?
            if ($_FILES["thumbnail"]["error"] > 0) {
                // Give the product default picture.
                $filename = "default.jpg";
            } else {
                // Move uploaded file into media directory.
                move_uploaded_file($_FILES['thumbnail']['tmp_name'], $target);
            }

        } else {
            // Give the product default picture.
            $filename = "default.jpg";
        }
    } else {
        // Give the product default picture.
        $filename = "default.jpg";
    }

    $db->update("UPDATE product_group SET thumbnail='media/$filename' WHERE sku='$sku'");

    /* Add new records for values and stock in */
    for($i=0, $len=count($unsafe_stocks); $i<$len; $i++) {
        /* Make sure the parameters are safe to inject */
        $value = $db->real_escape_string($unsafe_values[$i]);
        $stock = $db->real_escape_string($unsafe_stocks[$i]);
        $db->insert("INSERT INTO product (sku, value, stock) VALUES('$sku','$value','$stock')");
    }

    /* Data returned by the API */
    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['inserted_id'] = $sku;
        $response['report']['status'] = "Added product successfully";
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
