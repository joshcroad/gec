<!--
Options +FollowSymLinks
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^.*$ admin/index.php

RewriteRule ^admin($|/) - [L]
RewriteRule ^js($|/) - [L]
--> 
<!DOCTYPE html>
<html>

    <head>
        <title>This is the title</title>
        <script src="js/functions.js"></script>
        <script src="js/products_list.js"></script>
        <script src="js/history.js"></script>
    </head>
    <body>
        <header>
            <h1>SITE</h1>
            <a href="home">Homepage</a>
            <a href="products">Products</a>
        </header>

        <section id="content">
            THis is SITE.
        </section>

    </body>

</html>