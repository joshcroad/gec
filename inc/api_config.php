<?php
/**
 * Require the config file. If not found, throw error.
 */
$config_path = dirname(__FILE__);
require_once($config_path . '/config.php');

/**
 * Check required file 'class.database.php' exists. Else, throw error.
 * Required to connect to the database.
 */
require_once($config_path . '/class.db.php');

/**
 * Instantiate the database class, declare the new 
 * object to a variable and give it global scope.
 *
 * @global $db Database Object.
 */
function init_db() {
    global $db;
    
    if(isset($db)) // If true, don't instantiate the obj.
        return;
    else
        $db = new db(DB_HOST, DB_USER, DB_PASS, DB_NAME);
}

/**
 * Call to funtion init_db();
 *
 * @see funct. init_db()
 */
init_db();

?>