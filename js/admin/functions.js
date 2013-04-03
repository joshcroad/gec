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
        href = getPageString(href_);

        url = "./"+href+".php";

    success = function() {
        var obj = xhr.responseText;
        content.innerHTML = obj;
        addDynamicContent();
    };

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

/**
 * Function to validate product field input.
 */
function validateProductInput() {
    var isValid = 0,
        title = document.getElementById("single-title").value,
        desc = document.getElementById("single-desc").value,
        price = document.getElementById("single-price").value,
        reduced = document.getElementById("single-reduced").value,
        stock = document.getElementById("single-stock").value,
        message = document.getElementById("message");

    message.innerHTML = '';
    // Check required fields are not empty.
    if(!title || !desc || !price || !stock) {
        message.innerHTML += "<p>Please fill in fields with a *.</p>";
        isValid++;
    }
    // Check the reduced price is not bigger than the original price.
    if(parseInt(price) < parseInt(reduced)) {
        message.innerHTML += "<p>Please make sure the reduced price is less than the actual price.</p>";
        isValid++;
    }
    // Check the stock is positive.
    if(parseInt(stock) < 0) {
        message.innerHTML += "<p>Please make sure the stock is positive.</p>";
        isValid++;
    }

    if(isValid === 0) {
        return true;
    } else {
        return false;
    }
}