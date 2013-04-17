<!DOCTYPE html>
<html>
    <head>
        <title>GEC - Site</title>
        <base href="/gec/" />
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
                <h2 id="site-name"></h2>
                <!-- BEGIN nav -->
                <nav class="clearfix">
                    <ul id="navigation"></ul>
                    <!-- Needs to sort out content with search results. -->
                    <input type="text" class="searchProducts" placeholder="Search Products" />
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
        <script src="js/eventHandler.js" async></script>
        <script src="js/load.js" defer></script>
        <!-- END scripts -->
    <!-- END body -->
    </body>

</html>