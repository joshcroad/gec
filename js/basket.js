// basket.js

function addToBasket (sessionID, productCode) {
    // Retrieve data for purchase for product from elements on site
    var xhr = new XMLHttpRequest(), url,
        _productQuantity = document.getElementById('product-quantity'),
        productQuantity = parseInt(_productQuantity.options[_productQuantity.selectedIndex].value),
        _productSize = document.getElementsByClassName('size-radio'), productSizeID,
        success, stateChanged;

    // Check stock.

    if(_productSize) {
        for (var i=0, len=_productSize.length; i<len; i++) {
            if (_productSize[i].checked) {
                productSizeID = _productSize[i].dataset.id;
            }
        }
    }

    // Contain information about the product.
    product = new Object();
    product.id = sessionID;
    product.sku = productCode;
    product.quantity = parseInt(productQuantity);

    function addToSessionStorage () {
        // Try and find exisitng product in basket.
        var existingProduct = JSON.parse(sessionStorage.getItem(sessionID));

        // Check to see if the product is already there.
        if(!existingProduct) {
            // Not in basket, add product
            sessionStorage.setItem(sessionID, JSON.stringify(product));
        } else {
            // Already there! Increase quantity
            product.quantity = existingProduct.quantity + productQuantity;
            // Remove old
            sessionStorage.removeItem(sessionID);
            // Add new product to the basket
            sessionStorage.setItem(sessionID, JSON.stringify(product));
        }
        // Update the basket content in the header.
        updateBasketInformation();

        // Update the stock on the database.
        updateStock(sessionID, product.quantity, 'minus');

        showMessage('Successfully added to basket', 'success');
    }

    // On request success
    success = function () {
        // Add more info into the object
        var response = JSON.parse(xhr.responseText);

        // Add more information to the basket
        product.name = response.title;
        product.colour = response.colour;
        // Add correct price
        if(response.sale_price === '0.00' || response.sale_price === '') {
            product.price = response.price;
        } else {
            product.price = response.sale_price;
        }

        for(var i=0, len=response.product.length; i<len; i++) {
            if(response.product[i].id === productSizeID) {
                product.size = response.product[i].value;
            }
        }

        // Then add to storage.
        addToSessionStorage();
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

    url = 'api/v.1/search/single-result.php?table=product_group&id='+productCode;

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

function displayBasket () {
    var totalPrice = 0.00, ul = '', price = '',
        basket = document.getElementById('basket-table'),
        subprice = document.getElementById('subprice'),
        confirmOrderBtn = document.createElement('a'),
        name = document.createElement('input');

    // Start basket table.
    ul += '<li class="thead">';
    ul += '<div class="sku">SKU</div>';
    ul += '<div class="name">Name</div>';
    ul += '<div class="size">Size</div>';
    ul += '<div class="quantity">Quantity</div>';
    ul += '<div class="price">Price</div>';
    ul += '<div class="remove">Delete</div>';
    ul += '</li>';

    // Lopp through objects in session
    for(var i=0, len=sessionStorage.length; i<len; i++) {
        var product = JSON.parse(sessionStorage.getItem(sessionStorage.key(i))),
        colour = '';

        totalPrice += parseFloat(product.price) * product.quantity;

        if(product.colour != '')
            colour = ' <em>('+product.colour+')</em>';

        ul += '<li class="tbody">';
        ul += '<div class="sku">'+product.sku+'</div>';
        ul += '<div class="name"><a href="product/'+product.sku+'">'+product.name+colour+'</a></div>';
        if(product.size != undefined)
            ul += '<div class="size">'+product.size+'</div>';
        else
            ul += '<div class="size"></div>';
        ul += '<div class="quantity">'+product.quantity+'</div>';
        ul += '<div class="price">£'+product.price+'</div>';
        ul += '<div class="remove"><input type="checkbox" class="remove-item-basket" /></div>';
        ul += '</li>';
    }

    price += 'Subtotal £'+totalPrice.toFixed(2);

    // Display total for order.
    basket.innerHTML = ul;
    subprice.innerHTML = price;

    if(sessionStorage.length > 0) {
        name.type = 'text';
        name.placeholder = 'Please enter your name';
        name.id = 'customer-name';
        insertAfter(subprice, name);
        // Create to confirm order button to make the order.
        confirmOrderBtn.innerHTML = 'Confirm Order';
        confirmOrderBtn.href = 'basket';
        confirmOrderBtn.id = 'confirm-order';
        // Add it in after the last element on the site.
        insertAfter(name, confirmOrderBtn);
    } else {
        // Create to confirm order button to make the order.
        confirmOrderBtn.innerHTML = 'Continue Shopping';
        confirmOrderBtn.href = 'home';
        confirmOrderBtn.id = 'continue-shopping';
        // Add it in after the last element on the site.
        insertAfter(subprice, confirmOrderBtn);
    }
    
    // Inserts an element after a given element.
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    addEventListeners('basket');
}

// Clear basket
// Remove single product

function removeProduct(sessionKey) {
    var item = JSON.parse(sessionStorage.getItem(sessionKey));
    // Update stock levels in database to reflect.
    updateStock(sessionKey, item.quantity, 'add');
    // Remove from session storage.
    sessionStorage.removeItem(sessionKey);
    //Update the basket information in the header.
    updateBasketInformation();
    // Reload page.
    loadPage(document.URL);
}

// Update the stock (remove and add).
function updateStock (productID, quantity, operation) {
    var xhr = new XMLHttpRequest(), url, param;
    // Set up url and parameters
    url = 'api/v.1/edit/stock.php';
    param = 'productID='+productID+'&quantity='+quantity+'&operation='+operation;
    // Open & post request.
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
}

// Confirm order and save to the database.
function confirmOrder () {
    // Loop through objects in session
    // adding them to the order table in the database
    var url, param, xhr = new XMLHttpRequest(),
        id = [], quantity = [], price = [],
        currentProduct, content = document.getElementById('basket'),
        customerName = document.getElementById('customer-name'),

    // Request successful, display response
    success = function () {
        var response = JSON.parse(xhr.responseText);
        // Hide loader
        loader(false);
        // if error thrown
        if(response.error.thrown) {
            // Show message of update failure
            content.innerHTML = "<h2>There was a problem with your order. Please try again.</h2>";
        } else {
            // Clear session storage
            // Display congrates
            content.innerHTML = "<h2>"+response.report.message+"</h2>";
            // Clear the basket
            sessionStorage.clear();
            // Update the basket information in the header
            updateBasketInformation();
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
    // Show loader before request is sent
    loader(true);

    // Add values to arrays
    for(var i=0, len=sessionStorage.length; i<len; i++) {
        // Get the current product from the session using the key
        currentProduct = JSON.parse(sessionStorage.getItem(sessionStorage.key(i)));
        // Push the data to the array
        id.push(currentProduct.id);
        quantity.push(currentProduct.quantity);
        price.push(currentProduct.price);
    }

    // Stringify the arrays to allow them to be passed through AJAX.
    id = JSON.stringify(id);
    quantity = JSON.stringify(quantity);
    price = JSON.stringify(price);

    // Request parameters
    param = new FormData();
    param.append('id', id);
    param.append('quantity', quantity);
    param.append('price', price);
    param.append('customer_name', customerName.value);

    // Set URL and parameters to be sent
    url = 'api/v.1/add/confirm-order.php';

    // Open, set headers & post request
    xhr.open("POST", url, true);
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
}

// Updates the basket content in the header.
function updateBasketInformation () {
    var basketItems = document.getElementById('basket-items'),
        basketValue = document.getElementById('basket-value'),
        totalPrice = 0.00, totalQuantity = 0;

    // Set the total price
    for(var i=0, len=sessionStorage.length; i<len; i++) {
        var currentId = sessionStorage.key(i),
            currentProduct = JSON.parse(sessionStorage.getItem(currentId));
        totalPrice += parseFloat(currentProduct.price) * currentProduct.quantity;
        totalQuantity += currentProduct.quantity
    }
    basketItems.innerHTML = totalQuantity + ' items';
    basketValue.innerHTML = '£' + totalPrice.toFixed(2);
}