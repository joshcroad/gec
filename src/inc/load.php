<?php

/**
 * Checks file 'theme.php' exists. Else, throws error.
 * Required to load the theme area.
 */
if(file_exists('site.php'))
    include('site.php');
else 
    exit('ERROR: Unable to load site.');

?>