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
        editTag = document.getElementById("edit-tag"),
        addTag = document.getElementById("add-tag"),
        settings = document.getElementById("settings"),
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
        // Populate list of categories
        getCategories();
        // Get products from id set in url.
        getProduct(getPageNumberAsString(document.URL));
    }

    if(addProduct) {
        // Populate list of categories
        getCategories();
        // Add listeners
        addEventListeners('add-product');
    }

    if(categories) {
        // Display list of current categories
        // Add event listeners.
        addEventListeners('add-category');
        status = getFilterCriteria(document.URL);
        showCategoryList(status);
    }

    if(settings) {
        getCompanyName();
        getDefaultPicture();
        addEventListeners('settings');
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
    }
    else {
        filename = href[0];
    }
    if(filename === '')
        filename = 'home';
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
    var href = _href.split("/"), href = href.splice(6,6), filter = undefined,
        filterCriteria, _filter;
    // If nothing is left.
    if(href.length < 1) {
        filterCriteria = 'not-trash';
    } else {
        filter = href[0].split('&');
        for(var i in filter) {
            _filter = filter[i].split('=');
            if(_filter[0] === 'filter')
                filterCriteria = _filter[1];
        }
        if(filterCriteria === undefined)
            filterCriteria = 'not-trash';
    }
    // Return the filter information.
    return filterCriteria;
}

// Returns the view criteria (if any), from a hypertext reference.
// If none set, returns 10.
function getViewCriteria (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(6,6), view = undefined,
        viewCriteria, _view;
    // If nothing is left.
    if(href.length < 1) {
        viewCriteria = 10;
    } else {
        view = href[0].split('&');
        for(var i in view) {
            _view = view[i].split('=');
            if(_view[0] === 'view')
                viewCriteria = _view[1];
        }
        if(viewCriteria === undefined)
            viewCriteria = 10;
    }
    // Return the view information.
    return viewCriteria;
}

// Function closure
// Adding a listener to an element (on click),
// to get a page.
function addListenerGetPage (elem) {
    elem.addEventListener('click', function (e) {
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
    inputValue.placeholder = "Size (optional)";
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
    var isValid = 0, checked,
        titleInput = document.getElementById("single-title"),
        contentInput = document.getElementById("single-content"),
        priceInput = document.getElementById("single-price"),
        saleInput = document.getElementById("single-sale"),
        stockInputs = document.getElementsByClassName("single-stocks"),
        categorySection = document.getElementsByClassName('product-category'),
        categoryRadio = document.getElementsByClassName("category-radio");

    categorySection[0].style.border = '1px solid rgba(150,150,150,0.2)';
    titleInput.style.border = '';
    contentInput.style.border = '';
    priceInput.style.border = '';
    saleInput.style.border = '';
    stockInputs[0].style.border = '';

    for(var i=0, len=categoryRadio.length; i<len; i++) {
        if(categoryRadio[i].checked) {
            checked = true;
        }
    }

    // Check a catgeory is selected.
    if(!checked) {
        categorySection[0].style.border = '1px solid red';
        isValid++;
    }

    // Check required fields are not empty.
    if(!titleInput.value) {
        titleInput.style.border = '1px solid red';
        isValid++;
    }


    if(!contentInput.value) {
        contentInput.style.border = '1px solid red';
        isValid++;
    }

    if(!priceInput.value) {
        priceInput.style.border = '1px solid red';
        isValid++;
    }

    if(!stockInputs[0].value) {
        stockInputs[0].style.border = '1px solid red';
        isValid++;
    }
    
    // Check the user has not entered a '£' before.
    if(isNaN(priceInput.value)) {
        priceInput.style.border = '1px solid red';
        showMessage("Please do not add symbols, such as '£'", 'error');
        isValid++;
    }
    if(isNaN(saleInput.value)) {
        saleInput.style.border = '1px solid red';
        showMessage("Please do not add symbols, such as '£'", 'error');
        isValid++;
    }

    // Check the sale price is not bigger than the original price.
    if(parseInt(priceInput.value) < parseInt(saleInput.value)) {
        saleInput.style.border = '1px solid red';
        isValid++;
    }

    // Check the stock is positive.
    for(var i=0, len=stockInputs.length; i<len; i++) {
        if(stockInputs[i].value < 0) {
            isValid++;
        }
        if(isNaN(stockInputs[i].value)) {
            isValid++;
        }
    }

    // If isValid equals 0, nothing has been flagged. Return True.
    if(isValid === 0) { return true; }
    else { return false; }
}

// Function to validate product field input.
function validateCategoryInput () {
    var isValid = 0,
        name = document.getElementById("cat-name"),
        menuOrder = document.getElementById("cat-menu-order");
    console.log(name, menuOrder);

    // Initialise borders
    name.style.border = '';
    menuOrder.style.border = '';

    // Check required fields are not empty.
    if(!name.value) {
        name.style.border = '1px solid red';
        isValid++;
    }
    if(name.value.toLowerCase() == 'admin') {
        name.style.border = '1px solid red';
        showMessage("'Admin' is a reserved word", "error");
        isValid++;
    }
    if(!menuOrder.value) {
        menuOrder.style.border = '1px solid red';
        isValid++;
    }
    // Check the value is an integer (including negative.) - NEEDS IMPROVING: '1w' is accepted.
    if(isNaN(parseInt(menuOrder.value))) {
        menuOrder.style.border = '1px solid red';
        isValid++;
    }
    // If isValid equals 0, nothing has been flagged. Return True.
    if(isValid === 0) { return true; }
    else { return false; }
}


// SETTINGS

function getCompanyName () {
    var url, xhr = new XMLHttpRequest(),
        companyName = document.getElementById('site-name');

    // Request successful, display response.
    success = function () {
        var response = JSON.parse(xhr.responseText);
        // Hide loader.
        loader(false);
        // if error thrown.
        if(!response.error.thrown) {
            // Show message of update failure.
            companyName.value = response.site_name;
        }
    },

    // Once state is changed, check status.
    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); break;
            }
        }
    };

    // Show loader before request is sent.
    loader(true);

    // Set URL and parameters to be sent.
    url = '../api/v.1/admin/view/settings.php';

    // Open, set headers & post request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Function to set the company name
function setCompanyName () {
    var url, param, xhr = new XMLHttpRequest(),
        companyName = document.getElementById('site-name').value;

    // Request successful, display response.
    success = function () {
        var response = JSON.parse(xhr.responseText);
        // Hide loader.
        loader(false);
        // if error thrown.
        if(response.error.thrown) {
            // Show message of update failure.
            showMessage(response.report.status, "error");
        } else {
            // Show message of update success.
            showMessage(response.report.status, "success");
        }
    },

    // Once state is changed, check status.
    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); break;
            }
        }
    };

    // Show loader before request is sent.
    loader(true);

    // Request parameters.
    param = new FormData();
    param.append('site_name', companyName);

    // Set URL and parameters to be sent.
    url = '../api/v.1/admin/edit/site-name.php';

    // Open, set headers & post request.
    xhr.open("POST", url, true);
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
}

// Function to set the company name
function getDefaultPicture () {
    var url, param, xhr = new XMLHttpRequest(),
        thumbnailPreview = document.getElementById('single-thumbnail-preview');

    thumbnailPreview.innerHTML = '<img src="../media/default.jpg" alt="The default picture set for products." />';
}

// Function to set the default picture.
function setDefaultPicture () {
    var url, param, xhr = new XMLHttpRequest(), thumbnail,
        thumbnailElem = document.getElementById("default-picture"),

    // Request successful, display response.
    success = function () {
        var response = JSON.parse(xhr.responseText),
            setDefault = document.getElementById("set-default-picture");
        // Hide loader.
        loader(false);
        // if error thrown.
        if(response.error.thrown) {
            // Show message of update failure.
            showMessage(response.report.status, "error");
        } else {
            // Show message of update success.
            showMessage(response.report.status, "success");
            history.pushState(null, null, setDefault.href);
            loadPage(setDefault.href);
        }
    },

    // Once state is changed, check status.
    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); break;
            }
        }
    };

    // Show loader before request is sent.
    loader(true);

    // Takes the file and posts it.
    thumbnail = thumbnailElem.files[0];
    // Request parameters.
    param = new FormData();
    param.append('thumbnail', thumbnail);

    // Set URL and parameters to be sent.
    url = '../api/v.1/admin/add/default-thumb.php';

    // Open, set headers & post request.
    xhr.open("POST", url, true);
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
}

// Ajax call to empty database.
function truncateDbTables () {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        message = document.getElementById('message'),

    success = function () {
        var response = JSON.parse(xhr.responseText);
        // If API returns error.
        if(response.error.thrown) {
            showMessage(response.report.message, 'error');
        } else {
            showMessage(response.report.message, 'success');
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