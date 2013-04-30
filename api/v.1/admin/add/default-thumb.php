<?php

/**
 * The header content.
 */
header("Content-type: application/json");

$successful = false;

// Gets the extension on the file.
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
    $target = "../../../../media/default.jpg";

    // Allowed extensions
    $allowedExts = array("jpeg", "jpg", "png", "pjpeg");
    // Check to make sure file type is picture, and size is < 2mb
    if ((($_FILES["thumbnail"]["type"] == "image/jpeg") || ($_FILES["thumbnail"]["type"] == "image/jpg") 
    || ($_FILES["thumbnail"]["type"] == "image/png") || ($_FILES["thumbnail"]["type"] == "image/pjpeg")) 
    && ($_FILES["thumbnail"]["size"] < 200000) && in_array($exts, $allowedExts)) {
        // Has the file got an error?
        if ($_FILES["thumbnail"]["error"] < 1) {
            // Move uploaded file into media directory.
            move_uploaded_file($_FILES['thumbnail']['tmp_name'], $target);
            $successful = true;
        }
    }
}


/* Data returned by the API */
if($successful) {
    $response['error']['thrown'] = false;
    $response['report']['status'] = "Default thumbnail changed";
} else {
    $response['error']['thrown'] = true;
    $response['report']['status'] = "Default thumbnail not changed";
}

echo json_encode($response);

?>
