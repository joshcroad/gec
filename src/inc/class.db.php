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
            $this->initDB($db_name);
        // Echo any errors thrown.
        if(mysqli_connect_errno())
            echo("Database connect Error : " . mysqli_connect_error($this->connection));
    }
    
    /**
     * Create the database.
     *
     * @uses db::query()
     * @uses db::create_table()
     */
    private function initDB() {
        $this->query("CREATE DATABASE $this->db_name COLLATE utf8_general_ci");
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.product 
                            (sku int NOT NULL AUTO_INCREMENT, title varchar(150), content text, post_status varchar(50), 
                            post_date datetime, post_modified datetime, price double(10,2), reduced_price double(10,2), 
                            stock int, categoryID int,
                            CONSTRAINT product_pk PRIMARY KEY(sku))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.category 
                            (categoryID int NOT NULL AUTO_INCREMENT, name varchar(50), parent int, post_status varchar(50),
                            CONSTRAINT category_pk PRIMARY KEY(categoryID))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.tag 
                            (tagID int NOT NULL AUTO_INCREMENT, 
                            name varchar(50), value longtext, parent int,
                            CONSTRAINT tag_pk PRIMARY KEY(tagID))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.order 
                            (orderID int NOT NULL AUTO_INCREMENT, 
                            purchase_date datetime, mail_type varchar(50), totalPrice double(10,2),
                            sku int, 
                            CONSTRAINT order_pk PRIMARY KEY(orderID),
                            CONSTRAINT o_product_fk FOREIGN KEY(sku) REFERENCES product(sku))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.order_line 
                            (orderID int NOT NULL, 
                            sku int NOT NULL, 
                            CONSTRAINT order_line_pk PRIMARY KEY(orderID, sku))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.category_line 
                            (categoryID int, 
                            sku int,
                            CONSTRAINT category_line_pk PRIMARY KEY(categoryID, sku))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.tag_line 
                            (tagID int, 
                            sku int,
                            CONSTRAINT tag_line_pk PRIMARY KEY(tagID, sku))"
                           );
        $this->create_table("CREATE TABLE IF NOT EXISTS $this->db_name.settings 
                            (settingsID int NOT NULL AUTO_INCREMENT, 
                            name varchar(50),
                            value longtext,
                            CONSTRAINT settings_pk PRIMARY KEY(settingsID))"
                           );
        $this->default_table_entries();
    }
    
    private function create_table($query) {
        $this->query($query);
    }
    
    private function default_table_entries() {
        $this->insert("INSERT INTO $this->db_name.product 
            (title, content, post_status, post_date, price, reduced_price, stock, categoryID) 
            VALUES
            ('Dummy Product',
            'This is a dummy product, please delete it and start adding your own.',
            'publish',NOW(),'9.99','4.99','1','1')");
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_url', 'http://localhost:8888/Shop/')");
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('site_name', 'Shop')");
        $this->insert("INSERT INTO $this->db_name.settings (name, value) VALUES('description', 'This is a description.')");
        $this->insert("INSERT INTO $this->db_name.category (name, parent, post_status) VALUES('Uncategorized', NULL, 'publish')");
        $this->insert("INSERT INTO $this->db_name.category_line (categoryID,sku) VALUES(1, 1)");
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
        $this->errorThrown = true;
        $this->errorMessage = $message;
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
        $this->last_result = $this->query($query);
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
    
}

?>