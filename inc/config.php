<?php

// Get array of location.
$site_address = explode("/", dirname(__FILE__));
// Find index of root (this DIR is /inc, parent DIR required).
$index = count($site_address)-2;
$site_address = $site_address[$index];

/**
 * Define global constants.
 */
define('VERSION', 1.0);

define('SITE_ADDRESS', '/'.$site_address.'/', false);
define('ROOT', dirname(__FILE__), false);
define('INC', 'inc', false);
define('SITE', 'site', false);
define('ADMIN', 'admin', false);

/**
 * Database constants.
 */
define('DB_HOST', 'localhost', false);
define('DB_PORT', '8889', false);
define('DB_USER', 'root', false);
define('DB_PASS', 'root', false);
define('DB_NAME', 'gec_shop', false);
define('DB_CHARSET', 'utf8', false);

define('DIR_SEPERATOR', '/', false);

?>