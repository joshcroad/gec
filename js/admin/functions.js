// functions.js

// Takes a hypertext reference, breaks down the string
// and loads the relevant page. 
function loadPage (_href) {
    // Set local variables.
    var filename = getFilenameAsString(_href),
        xhr = new XMLHttpRequest(), url,
    // On success, add request response to content.
    // Then call dynamic content.
    success = function () {
        var response = xhr.responseText,
            content = document.getElementById('content');
        content.innerHTML = response;
        addDynamicContent();
    },
    // Once ready state is changed, check status.
    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage('Status '+xhr.status+' returned.', 'error'); break;
            }
        }
    };
    // Set url.
    url = './'+filename+'.php';
    // Open & send request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Adding dynamic content and event listeners
function addDynamicContent () {
    // The page container elements.
    var products = document.getElementById("products"),
        categories = document.getElementById("categories"),
        tags = document.getElementById("tags"),
        editProduct = document.getElementById("edit-product"),
        addProduct = document.getElementById("add-product"),
        editCategory = document.getElementById("edit-category"),
        addCategory = document.getElementById("add-category"),
        editTag = document.getElementById("edit-tag"),
        addTag = document.getElementById("add-tag"),
        pageNumber, status, view, productID;

    // If the page is the Products page.
    if(products) {
        // Get url criteria.
        pageNo = getPageNumberAsString(document.URL);
        status = getFilterCriteria(document.URL);
        view = getViewCriteria(document.URL);
        // Show products.
        showProducts(status, pageNo, view);
        addEventListeners('products');
    }

    if(editProduct) {
        // Get products from id set in url.
        getProduct(getPageNumberAsString(document.URL));
    }

    if(addProduct) {
        addEventListeners('add-product');
    }
}

// Ruturns the file to load, from a hypertext reference.
function getFilenameAsString (_href) {
    // Split and splice href, removing the host etc.
    var href = _href.split("/"), href = href.splice(4,4), filename;
    // href should now be a non-empty array.
    // Example: ["admin", "products", "page=1&filter=publish"]
    // Check admin area.
    if(href[0] === 'admin') {
        filename = href[1];
        if(filename === '')
            filename = 'home';
    }
    else {}
    // Return the page.
    return filename;
}

// Returns the page number (if any), from a hypertext reference.
function getPageNumberAsString (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(6,6), pageNumber;
    // If nothing is left.
    if(href.length < 1) {
        pageNumber = 1;
    } else {
        pageNumber = href[0].split("&");
        pageNumber = pageNumber[0].split("page=").pop();
    }
    // Return the page number.
    return pageNumber;
}

// Returns the filter criteria (if any), from a hypertext reference.
// If none set, returns 'not-trash'.
function getFilterCriteria (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(6,6), filter;
    // If nothing is left.
    if(href.length < 1) {
        filter = 'not-trash';
    } else {
        filter = href[0].split('&');
        if(filter[1] !== undefined){
            filter = filter[1].split('=');
            if(filter[0] !== 'view')
                filter = filter[1];
            else
                filter = 'not-trash';
        } else {
            filter = 'not-trash';
        }
    }
    // Return the filter information.
    return filter;
}

// Returns the view criteria (if any), from a hypertext reference.
// If none set, returns 10.
function getViewCriteria (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(6,6), view;
    // If nothing is left.
    if(href.length < 1) {
        view = 10;
    } else {
        view = href[0].split('&');
        if(view[2] !== undefined) {
            view = view[2].split('view=').pop();
        } else if(view[1] !== undefined) {
            view = view[1].split('=');
            if(view[0] !== 'filter')
                view = view[1];
            else
                view = 10;
        } else {
            view = 10;
        }
    }
    // Return the view information.
    return view;
}

// Returns the product identifier, from a hypertext reference.
function getProductID (_href) {}

// Function closure
// Adding a listener to an element (on click),
// to get a page.
function addListenerGetPage (elem) {
    elem.addEventListener('click', function (e) {
        console.log('load: ' + elem.href);
        history.pushState(null, null, elem.href);
        loadPage(elem.href);
        e.preventDefault();
    }, false);
}

// Add the value ans stock inputs to the document.
function addValueStockInputs () {
    var inputValue = document.createElement("input"),
        inputStock = document.createElement("input"),
        addValueStockInput = document.getElementById("values-and-stocks");

    // Input for values and sizes
    inputValue.type = "text";
    inputValue.className = "single-values";
    inputValue.placeholder = "Value/Size";
    // Input for stock
    inputStock.type = "text";
    inputStock.className = "single-stocks";
    inputStock.placeholder = "Stock";
    // Append these to the window.
    addValueStockInput.appendChild(inputValue);
    addValueStockInput.appendChild(inputStock);
}

// Display a message to the document.
function showMessage (message, classname) {
    // Get message element from document.
    var requestMessage = document.getElementById("request-message"), timeout;
    if(classname === undefined)
        classname = "success";
    // Set the classification of the message.
    requestMessage.setAttribute("class", classname);
    // Set the message.
    requestMessage.innerHTML = message;
    // Display the message.
    requestMessage.style.display = "block";
    // Reset the message after 3 seconds.
    timeout = setTimeout(function() {
        requestMessage.style.display = "none";
        requestMessage.innerHTML = "";
    }, 3000);
}

// Sets the loader's visibility (boolean).
function loader (visible) {
    // Get loader container from the document.
    var loader = document.getElementById("loader-container");
    // If visible is true, display loader, else hide.
    if(visible)
        loader.style.display = 'block';
    else
        loader.style.display = 'none'; // Hide loader.
}

// Function to validate product field input.
function validateProductInput () {
    var isValid = 0;
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        stockInputs = document.getElementsByClassName("single-stocks"),
        requestMessage = document.getElementById("request-message"),
        titleMessage = document.getElementById("title-message"),
        contentMessage = document.getElementById("content-message"),
        priceMessage = document.getElementById("price-message"),
        saleMessage = document.getElementById("sale-message"),
        stockMessage = document.getElementById("stock-message");

    titleMessage.innerHTML = '';
    contentMessage.innerHTML = '';
    priceMessage.innerHTML = '';
    saleMessage.innerHTML = '';
    stockMessage.innerHTML = '';

    // Check required fields are not empty.
    if(!title) {
        titleMessage.innerHTML = '<p>Please fill in title.</p>'; isValid++;
    }
    if(!content) {
        contentMessage.innerHTML = '<p>Please fill in product description.</p>'; isValid++;
    }
    if(!price) {
        priceMessage.innerHTML = '<p>Please fill in price.</p>'; isValid++;
    }
    if(!stockInputs[0].value) {
        stockMessage.innerHTML = '<p>Please add stock.</p>'; isValid++;
    }
    // Check the sale price is not bigger than the original price.
    if(parseInt(price) < parseInt(sale)) {
        saleMessage.innerHTML = '<p>Please make sure the sale price is less than the actual price.</p>'; isValid++;
    }
    // Check the stock is positive.
    for(var i in stockInputs) {
        if(stockInputs[i].value < 0) {
            stockMessage.innerHTML = '<p>Please make sure all stock are non-negative.</p>'; isValid++;
        }
    }
    // If isValid equals 0, nothing has been flagged. Return True.
    if(isValid === 0) { return true; }
    else { return false; }
}