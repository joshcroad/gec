<?php
/**
 * Title: GEC (General E-Commerce)
 * Description: An HTML and PHP website that supports an easily-updated and customized "online shopping" capability for selling whatever kind of physical product the client wishes.
 * Version: 1.0
 */

/**
 * Check required file 'config' exists. Else, throw error.
 */
if(file_exists(dirname(__FILE__) . '/inc/config.php'))
    require_once(dirname(__FILE__) . 'inc/config.php');
else
    exit('ERROR: Unable to find Configuration file.');

?>