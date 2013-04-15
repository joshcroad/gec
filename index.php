<!DOCTYPE html>
<html>
    <head>
        <title>GEC - Admin</title>
        <!-- BEGIN meta -->
        <meta charset="utf8" />
    </head>

    <!-- BEGIN body -->
    <body>
        <!-- BEGIN header -->
        <header>
            <?php if(isset($_GET['url'])) { echo $_GET['url']; } ?>
            <h1><a href="homepage">Shop Area</a></h1>
            <!-- BEGIN nav -->
            <nav>
                <ul>
                    <li><a href="products">Products</a></li>
                </ul>
            <!-- END nav -->
            </nav>
        <!-- END header -->
        </header>

        <!-- BEGIN #jay-z -->
        <section id="jay-z"></section>
        <!-- END #jay-z -->

        <!-- BEGIN scripts -->
        <script src="../js/functions.js"></script>
        <script src="../js/history.js"></script>
        <!-- END scripts -->
    <!-- END body -->
    </body>

</html>