<?php $href = explode("/", dirname(__FILE__)); $base = end($href); 
// Sets up the database, if it has not already been done.
// Mainly for new installations.
include('inc/api_config.php'); ?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $base; ?></title>
        <base href="/<?php echo $base; ?>/" />
        <!-- BEGIN meta -->
        <meta charset="utf8" />
        <!-- BEGIN stylesheets -->
        <link rel="stylesheet" type="text/css" href="css/style.css" />
    </head>

    <!-- BEGIN body -->
    <body>
        <div id="loader-container">
            <div id="loader">
                <div class="load-circle" id="load-rotate-01"></div>
                <div class="load-circle" id="load-rotate-02"></div>
                <div class="load-circle" id="load-rotate-03"></div>
                <div class="load-circle" id="load-rotate-04"></div>
                <div class="load-circle" id="load-rotate-05"></div>
                <div class="load-circle" id="load-rotate-06"></div>
                <div class="load-circle" id="load-rotate-07"></div>
                <div class="load-circle" id="load-rotate-08"></div>
            </div>
        </div>

        <!-- BEGIN #jay-z (main wrapper) -->
        <section id="jay-z">

            <!-- BEGIN header -->
            <header>
                <div class="titlebar clearfix">
                    <h2 id="site-name"></h2>
                    <div class="basket">
                        <a href="basket" id="basket-link">
                            <div id="basket-items"></div>
                            <div id="basket-value"></div>
                        </a>
                    </div>
                </div>
                <!-- BEGIN nav -->
                <nav class="clearfix">
                    <ul id="navigation"></ul>
                    <!-- Needs to sort out content with search results. -->
                    <input type="text" id="search-products" placeholder="Search Products" />
                <!-- END nav -->
                </nav>
                <div id="global-message"></div>
            <!-- END header -->
            </header>

            <section id="content"></section>

        <!-- END #jay-z -->
        </section>

        <!-- BEGIN scripts -->
        <script src="js/functions.js" async></script>
        <script src="js/basket.js" async></script>
        <script src="js/eventHandler.js" async></script>
        <script src="js/load.js" defer></script>
        <!-- END scripts -->
    <!-- END body -->
    </body>

</html>