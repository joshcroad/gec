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
    $sku = $_POST['sku'];
    $unsafe_title = $_POST['title'];
    $unsafe_content = $_POST['content'];
    $unsafe_price = $_POST['price'];
    $unsafe_sale_price = $_POST['sale'];
    $unsafe_colour = $_POST['colour'];
    $unsafe_status = $_POST['status'];
    $unsafe_category_id = $_POST['category_id'];

    $unsafe_values = json_decode($_POST['values']); // Array
    $unsafe_stocks = json_decode($_POST['stocks']); // Array

    /* Safe to inject parameters */
    $title = $db->real_escape_string($unsafe_title);
    $content = $db->real_escape_string($unsafe_content);
    $price = $db->real_escape_string($unsafe_price);
    $sale_price = $db->real_escape_string($unsafe_sale_price);
    $colour = $db->real_escape_string($unsafe_colour);
    $status = $db->real_escape_string($unsafe_status);
    $category_id = $db->real_escape_string($unsafe_category_id);

    // Get the extension of a file.
    function findExts($filename)  { 
        $filename = strtolower($filename); 
        $exts = explode(".", $filename);
        $exts = end($exts);
        return $exts;
    }

    // Thumbnail checks and validation.
    if(isset($_FILES['thumbnail'])) {
        //This applies the function to our file  
        $exts = findExts($_FILES['thumbnail']['name']);
        $filename = $sku.'.'.$exts;
        $target = "../../../media/".$filename;

        // Allowed extensions
        $allowedExts = array("gif", "jpeg", "jpg", "png", "pjpeg");
        // Check to make sure file type is picture, and size is < 2mb
        if ((($_FILES["thumbnail"]["type"] == "image/gif") || ($_FILES["thumbnail"]["type"] == "image/jpeg")
        || ($_FILES["thumbnail"]["type"] == "image/jpg") || ($_FILES["thumbnail"]["type"] == "image/png") 
        || ($_FILES["thumbnail"]["type"] == "image/pjpeg")) && ($_FILES["thumbnail"]["size"] < 20000) 
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
        // Get current thumbnail from database.
        $result = $db->select("SELECT thumbnail FROM product_group WHERE sku='$sku'");
        $result = $result->fetch_assoc();
        // Explode media from the path.
        $old_file = explode("media/", $result['thumbnail']);
        // Get the filename.
        $old_file = $old_file[1];

        if(file_exists('../../../media/'.$old_file)) {
            $filename = $old_file;
        } else {
            $filename = 'default.jpg';
        }
    }

    /* Sale Validation */
    if($sale_price === null)
        $sale_price = '0.00';

    /* Make the update the the product group */
    $db->update("UPDATE product_group SET title='$title', content='$content', price='$price', sale_price='$sale_price', colour='$colour', thumbnail='media/$filename', post_status='$status', post_modified=NOW(), categoryID='$category_id' WHERE sku='$sku'");

    /* Reset product table */
    $db->delete("DELETE FROM product WHERE sku='$sku'");

    /* Add new records for values and stock in */
    for($i=0, $len=count($unsafe_stocks); $i<$len; $i++) {
        /* Make sure the parameters are safe to inject */
        $value = $db->real_escape_string($unsafe_values[$i]);
        $stock = $db->real_escape_string($unsafe_stocks[$i]);
        $db->insert("INSERT INTO product (sku, value, stock) VALUES('$sku','$value','$stock')");
    }

    if($db->error_thrown) {
        $response['error']['thrown'] = true;
        $response['report']['status'] = $db->error_message;
    } else {
        $response['error']['thrown'] = false;
        $response['report']['status'] = "Update successful";
    }

} else {
    $response['error']['thrown'] = true;
    $response['error']['message'] = "Unable to connect to the database.";
}

echo json_encode($response);

?>
