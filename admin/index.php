<!DOCTYPE html>
<html>
    <head>
        <title>GEC - Dashboard</title>
        <base href="/gec/admin/" />
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

        <!-- BEGIN header -->
        <header>
            <!-- BEGIN nav -->
            <nav class="clearfix">
                <ul>
                    <li><a href="">Dashboard</a></li>
                    <li><a href="products">Products</a></li>
                    <li><a href="categories">Categories</a></li>
                    <li><a href="tags">Tags</a></li>
                    <li><a href="settings">Settings</a></li>
                </ul>
            <!-- END nav -->
            </nav>
            <div id="request-message"></div>
        <!-- END header -->
        </header>

        <!-- BEGIN #jay-z (main wrapper) -->
        <section id="jay-z">
            <section id="content"></section>
        </section>
        <!-- END #jay-z -->

        <!-- BEGIN scripts -->
        <script src="../js/admin/functions.js" async></script>
        <script src="../js/admin/eventHandler.js" async></script>
        <script src="../js/admin/products.js" async></script>
        <script src="../js/load.js" defer></script>
        <!-- END scripts -->
    <!-- END body -->
    </body>

</html>