/**
 * Function to display and hide the loader.
 */
function loader(visible) {
    var loader = document.getElementById("loader");
    if(visible)
        loader.style.display = 'block'; // Show loader.
    else
        loader.style.display = 'none'; // Hide loader.
}

/**
 * Function called if a XMLHttpRequest fails.
 */
function failed(message) {
    content.innerHTML = '<p class="error">' + message + '.';
}

/**
 * This gets the page as string.
 */
function getPageString(href) {
    var base = href.split(window.location.host + "/gec").pop(),
        isAdmin = base.split("/");

    if(isAdmin[1] === "admin")
        if(!isAdmin[2] || isAdmin[2] === "")
            page = "home";
        else
            page = isAdmin[2];
    else
        page = isAdmin[1];

    return page;
}

/**
 * This gets the page as string from the URL.
 */
function getPaginationPage(href) {
    var base = href.split(window.location.host + "/gec").pop(),
        isAdmin = base.split("/");

    if(isAdmin[1] === "admin") {
        if(isAdmin[3] === 'page') {
            page = isAdmin[4];
        } else {
            page = "1";
        }
    } else {
        if(isAdmin[2] === 'page') {
            page = isAdmin[3];
        } else {
            page = "1";
        }
    }

    return page;
}

/**
 * This gets the product ID from the URL.
 */
function getProductID(href) {
    var base = href.split(window.location.host + "/gec").pop(),
        rest = base.split("/");

    if(rest[1] === "admin") {
        if(rest[2] === 'product') {
            productID = rest[3];
        } else {
            productID = "0";
        }
    } else {
        if(rest[1] === 'product') {
            productID = rest[2];
        } else {
            productID = "0";
        }
    }

    return productID;
}

/**
 * Firing functions to add page content.
 */
function addDynamicContent() {
    // If these elements are found, content needs to be added dynamically.
    var products = document.getElementById("products"),
        editProduct = document.getElementById("edit-product"),
        addProduct = document.getElementById("add-product");

    // The admin products page.
    if(products) {
        var page = getPaginationPage(document.URL);
        showProducts(page, 10);
    }

    // The admin edit products page.
    if(editProduct) {
        var productID = getProductID(document.URL);
        getProduct(productID);
    }

    // The admin edit products page.
    if(addProduct) {
        productsEventHandler();
    }
}

/**
 * Displays a page, given the hypertext reference.
 */
function getPage(href_) {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        content = document.getElementById("content"),
        href = getPageString(href_),

    success = function() {
        var obj = xhr.responseText;
        content.innerHTML = obj;
        addDynamicContent();
    },

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    url = "./"+href+".php";

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

/**
 * Function to validate product field input.
 */
function validateProductInput() {
    var isValid = 0;
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        value_inputs = document.getElementsByClassName("single-values"),
        stock_inputs = document.getElementsByClassName("single-stocks"),
        message = document.getElementById("message");

    message.innerHTML = '';
    // Check required fields are not empty.
    if(!title || !content || !price || !stock_inputs[0]) {
        message.innerHTML += "<p>Please fill in fields with a *.</p>";
        isValid++;
    }
    // Check the sale price is not bigger than the original price.
    if(parseInt(price) < parseInt(sale)) {
        message.innerHTML += "<p>Please make sure the sale price is less than the actual price.</p>";
        isValid++;
    }
    // Check the stock is positive.
    for(var i in stock_inputs) {
        if(parseInt(stock_inputs[i]) < 0) {
            message.innerHTML += "<p>Please make sure the stock is non-negative.</p>";
            isValid++;
        }
    }

    if(isValid === 0) {
        return true;
    } else {
        return false;
    }
}

function truncateDbTables() {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        message = document.getElementById('message'),

    success = function() {
        var product = JSON.parse(xhr.responseText);

        if(product.error.thrown) { // If API returns error.
            failed(product.error.message);
        } else { // Otherwise.
            message.innerHTML = product.status;
        }
    },

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    url = '../api/v.1/admin/delete/empty.db.php';

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}



