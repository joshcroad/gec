<?php

/**
 * Define global constants.
 */
define('VERSION', 1.0);

define('ROOT', '../' . dirname(__FILE__), false);
define('PWD', '.', false;)
define('INC', 'inc', false);
define('SITE', 'site', false);
define('ADMIN', 'admin', false);

define('DB_HOST', 'localhost', false);
define('DB_PORT', '8889', false);
define('DB_USER', 'root', false);
define('DB_PASS', 'root', false);
define('DB_NAME', 'show_db', false);
define('DB_CHARSET', 'utf8', false);

define('DIR_SEPERATOR', '/', false);

/**
 * Checks to see where this file was called from.
 */
global $is_admin;
global $api_call;

/**
 * Check required file 'class.database.php' exists. Else, throws error.
 * Required to connect to the database.
 */
if(file_exists('PWD' . DIR_SEPERATOR . 'class.db.php')) {
    require_once('PWD' . DIR_SEPERATOR . 'class.db.php');
    // Instantiates the database class.
    init_db();
} else {
    exit('ERROR: Unable to find database file.');
}

/**
 * Instantiates the database class file, declares the new object to a variable and gives it global scope.
 *
 * @global $db Database Object.
 */
function require_db() {
    global $db;
    
    if(isset($db)) // If true, don't instantiate the obj.
        return;
    $db = new db(DB_HOST, DB_USER, DB_PASS, DB_NAME);
}

/**
 * If API call or Admin call, not need to load the site.
 */
if(!isset($api_call) || $api_call === false
    || !isset($is_admin) || $is_admin === false) {
    
    /**
     * Checks file 'load.php' exists. Else, throws error.
     * Loads all the information to display the site.
     */
    if(file_exists(ABS_PATH . INC_PATH . '/load.php'))
        include(ABS_PATH . INC_PATH . '/load.php');
    else
        exit('ERROR: Unable to load site.');
}

?>