<?php

class db {
    
    /**
     * Whether the database queries are ready to start executing.
     *
     * @access public
     * @var bool
     */
    var $connection;
    
    /**
     * The name of the database.
     *
     * @access private
     * @var string
     */
    var $db_name;
    
    /**
     * The last inserted if from the last query.
     *
     * @access public
     * @var int
     */
    var $insert_id;
    
    /**
     * The value of rows affected from the last query.
     *
     * @access public
     * @var int
     */
    var $affected_rows;
    
    /**
     * Whether the database queries are ready to start executing.
     *
     * @access private
     * @var bool
     */
    var $ready = false;
    
    /**
     * The saved results from the last query.
     *
     * @access private
     * @var array|null
     */
    var $last_result;
    
    /**
     * Whether an error has been thrown from the last query.
     *
     * @access private
     * @var int
     */
    var $error_thrown = false;
    
    /**
     * The reason behind the last error.
     *
     * @access private
     * @var int
     */
    var $error_message;
    
    /**
     * PHP5 constructor.
     *
     * @param string $db_host. The database host.
     * @param string $db_user. The database user.
     * @param string $db_pass. The database password.
     * @param string $db_name. The database name.
     */
    function __construct($db_host, $db_user, $db_pass, $db_name) {
        $this->db_name = $db_name;
        // Instantiates the mysqli object.
        $this->connection = new mysqli($db_host, $db_user, $db_pass);
        if($this->connection)
            $this->ready = true;
        // initialise the database if it cannot be selected.
        if(!$this->connection->select_db($db_name))
            $this->init_db();
        // Echo any errors thrown.
        if(mysqli_connect_errno())
            die("Database connect Error : " . mysqli_connect_error($this->connection));
    }
    
    private function create_table($query) {
        $this->query($query);
    }
    
    /**
     * Store the mysqli object.
     *
     * @return object $connection. The stored mysqli object.
     */
    function connect() {
        return $this->connection;
    }
    
    /**
     * Resets all the variables.
     */
    private function flush() {
        $this->insert_id = null;
        $this->affected_rows = null;
        $this->last_result = null;
        $this->error_thrown = false;
        $this->error_message = "";
    }
    
    /**
     * The error handling function
     *
     * @param string $message. The error message. Default "Unknown error".
     */
    private function errorHandler($message = "Unknown error.") {
        $this->error_thrown = true;
        $this->error_message = $message;
    }
    
    /**
     * Escapes special characters in $string for use in the query.
     *
     * @param string $unescaped_string. The unescaped string.
     * @return string. The same string, safe to be used in SQL statements.
     */
    function real_escape_string($unescaped_string) {
        return $this->connection->real_escape_string($unescaped_string);
    }
    
    /**
     * Query the database.
     *
     * @uses mysqli::query()
     * @param string $query. The string query to be executed.
     */
    private function query($query) {
        // Check the connection is ready to be used.
        if(!$this->ready)
            return null;
        // Reset variables before new query.
        $this->flush();
        // Makes the query to the database.
        $this->last_result = $this->connection->query($query);
        // If the query was an insert, set variable of last row added.
        $this->insert_id = $this->connection->insert_id;
        // If query was insert, update, replace or delete, set variable to
        // the number affected from the last query.
        $this->affected_rows = $this->connection->affected_rows;
    }
    
    /**
     * Function used when data is to be selected from the database.
     *
     * @param string $query. The query to be executed.
     * @return array|null. The result set of the query.
     */
    function select($query) {
        // Runs the query.
        $this->query($query);
        return $this->last_result;
    }
    
    /**
     * Function used when data is to be selected from the database.
     *
     * @param string $query. The query to be executed.
     * @return array|null. An associative array of results.
     */
    function select_row($query) {
        // Runs the query.
        $this->query($query);
        if($this->last_result->num_rows == 1) // Make sure there is just one result.
            return $this->last_result->fetch_assoc();
        // Nothing has happened.
        return null;
    }
    
    /**
     * Function used when data is to be inserted into the database.
     *
     * @param string $query. The query to be executed.
     * @return null. Returns null if the insert was unsuccessful.
     */
    function insert($query) {
        $this->query($query);
        if($this->insert_id == null) {
            $this->errorHandler("No rows inserted.");
            return null;
        }
    }
    
    /**
     * Function used when data is to be modifying the database.
     *
     * @param string $query. The query to be executed.
     * @return null. Returns null if the update was unsuccessful.
     */
    function update($query) {
        $this->last_result = $this->query($query);
        if($this->affected_rows === -1) { // No rows where affected.
            $this->errorHandler("No rows were affected.");
            return null;
        }
    }

    /**
     * Function used when data is to be modifying the database.
     *
     * @param string $query. The query to be executed.
     * @return null. Returns null if the update was unsuccessful.
     */
    function empty_trash($table) {
        if($table === 'product')
            $id = 'sku';
        else
            $id = 'id';
        $this->query("DELETE FROM $table WHERE $id IN (SELECT id FROM $table WHERE post_status = 'trash')");
        if($this->affected_rows === -1) { // No rows where affected.
            $this->errorHandler("No rows were affected.");
            return null;
        }
    }

    /**
     * Function to reset all tables to an empty state.
     *
     * @param string $table. The table to be executed. Default is all tables.
     */
    function truncate() {
        // Drop all Foreign Key Constraints
        $this->query("ALTER TABLE $this->db_name.product_order DROP FOREIGN KEY product_order_order_fk");
        $this->query("ALTER TABLE $this->db_name.product_order DROP FOREIGN KEY product_order_product_fk");
        $this->query("ALTER TABLE $this->db_name.product_group DROP FOREIGN KEY product_group_category_fk");
        $this->query("ALTER TABLE $this->db_name.product DROP FOREIGN KEY product_product_group_fk");

        // Truncate all tables
        $this->query("TRUNCATE TABLE $this->db_name.product_order");
        $this->query("TRUNCATE TABLE $this->db_name.product");
        $this->query("TRUNCATE TABLE $this->db_name.product_group");
        $this->query("TRUNCATE TABLE $this->db_name.order");
        $this->query("TRUNCATE TABLE $this->db_name.settings");
        $this->query("TRUNCATE TABLE $this->db_name.category");            

        // Add all Foreign key constraints back
        $this->query("ALTER TABLE $this->db_name.product_order ADD CONSTRAINT product_order_order_fk FOREIGN KEY (ID) REFERENCES $this->db_name.order (ID)");
        $this->query("ALTER TABLE $this->db_name.product_order ADD CONSTRAINT product_order_product_fk FOREIGN KEY (productID) REFERENCES $this->db_name.product (ID)");
        $this->query("ALTER TABLE $this->db_name.product_group ADD CONSTRAINT product_group_category_fk FOREIGN KEY (categoryID) REFERENCES $this->db_name.category (ID)");
        $this->query("ALTER TABLE $this->db_name.product ADD CONSTRAINT product_product_group_fk FOREIGN KEY (sku) REFERENCES $this->db_name.product_group (sku)");

        // Insert basic information.
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_url', '".SITE_ADDRESS."')");
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_name', 'This needs setting')");
        $this->insert("INSERT INTO $this->db_name.category (name, slug, menu_order, post_status) VALUES('Uncategorized', 'uncategorized', -1, 'publish')");
    }

    function delete($query) {
        $this->query($query);
    }

    /**
     * Create the database.
     *
     * @uses db::query()
     * @uses db::create_table()
     * @uses db::default_table_entries()
     */
    private function init_db() {
        $this->query("CREATE DATABASE $this->db_name COLLATE utf8_general_ci");

        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.category 
                            (ID int NOT NULL AUTO_INCREMENT, name varchar(50), slug varchar(50),
                            menu_order int, post_status varchar(50),
                            CONSTRAINT category_pk PRIMARY KEY(ID))"
                           );
        $this->insert("INSERT INTO $this->db_name.category (name, slug, menu_order, post_status) VALUES('Uncategorized', 'uncategorized', -1, 'publish')");
        $this->insert("INSERT INTO $this->db_name.category (name, slug, menu_order, post_status) VALUES('Toys', 'toys', 1, 'publish')");
        $this->insert("INSERT INTO $this->db_name.category (name, slug, menu_order, post_status) VALUES('Cuddly Toys', 'cuddly-toys', 2, 'publish')");
        $this->insert("INSERT INTO $this->db_name.category (name, slug, menu_order, post_status) VALUES('Clothes', 'clothes', 3, 'publish')");

        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.settings 
                            (ID int NOT NULL AUTO_INCREMENT, 
                            name varchar(50),
                            value longtext,
                            CONSTRAINT settings_pk PRIMARY KEY(ID))"
                           );
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_url', '".SITE_ADDRESS."')");
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_name', 'Shop')");

        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.order 
                            (ID int NOT NULL AUTO_INCREMENT, 
                            purchase_date datetime, mail_type varchar(50),
                            CONSTRAINT order_pk PRIMARY KEY(ID))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.product_group 
                            (sku int NOT NULL AUTO_INCREMENT, title varchar(150), content text, price double(10,2),
                            sale_price double(10,2), colour varchar(50), thumbnail varchar(150), post_status varchar(50), 
                            post_date datetime, post_modified datetime, categoryID int,
                            CONSTRAINT product_group_pk PRIMARY KEY(sku),
                            CONSTRAINT product_group_category_fk FOREIGN KEY (categoryID) REFERENCES $this->db_name.category (ID))"
                           );
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Aeroplane','This is a dummy product.','9.99','4.99','','media/default.jpg','publish',NOW(),'2')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Bear','This is a dummy product.','9.99','0.00','Brown','media/default.jpg','publish',NOW(),'3')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Cat','This is a dummy product.','9.99','4.99','Ginger','media/default.jpg','draft',NOW(),'3')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Elephant','This is a dummy product.','9.99','0.00','Grey','media/default.jpg','trash',NOW(),'3')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Radio','This is a dummy product.','9.99','0.00','Red','media/default.jpg','draft',NOW(),'1')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Shirt','This is a dummy product.','9.99','4.99','Orange','media/default.jpg','draft',NOW(),'4')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('T-Shirt','This is a dummy product.','9.99','4.99','Navy','media/default.jpg','publish',NOW(),'4')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('T-Shirt','This is a dummy product.','9.99','0.00','Dark Green','media/default.jpg','publish',NOW(),'4')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Umbrella','This is a dummy product.','9.99','4.99','','media/default.jpg','publish',NOW(),'1')");
        $this->insert("INSERT INTO $this->db_name.product_group (title,content,price,sale_price,colour,thumbnail,post_status,post_date,categoryID) VALUES('Zebra','This is a dummy product.','9.99','0.00','Black & White','media/default.jpg','publish',NOW(),'3')");
        
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.product 
                            (ID int NOT NULL AUTO_INCREMENT, sku int NOT NULL, value varchar(50), stock int,
                            CONSTRAINT product_pk PRIMARY KEY(ID),
                            CONSTRAINT product_product_group_fk FOREIGN KEY (sku) REFERENCES $this->db_name.product_group (sku))"
                           );
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('1','','10')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('2','Small','10')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('2','Medium','11')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('2','Large','12')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('3','Small','8')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('3','Medium','7')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('3','Large','5')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('4','','14')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('5','','16')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('6','Small','14')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('6','Medium','14')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('6','Large','5')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('6','XLarge','12')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('6','XXLarge','42')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('7','Small','43')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('7','Medium','5')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('7','Large','12')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('8','Small','42')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('8','Medium','43')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('8','Large','12')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('9','','12')");
        $this->insert("INSERT INTO $this->db_name.product (sku,value,stock) VALUES('10','','23')");
        
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.product_order 
                            (ID int,
                            quantity int, price double(10,2), productID int,
                            CONSTRAINT product_order_pk PRIMARY KEY(ID, productID),
                            CONSTRAINT product_order_order_fk FOREIGN KEY (ID) REFERENCES $this->db_name.order (ID),
                            CONSTRAINT product_order_product_fk FOREIGN KEY (productID) REFERENCES $this->db_name.product (ID))"
                           );
    }
}

?>