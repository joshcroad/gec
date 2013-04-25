// basket.js

function addToBasket (sessionID, productCode) {
    // Retrieve data for purchase for product from elements on site
    var xhr = new XMLHttpRequest(), url,
        _productQuantity = document.getElementById('product-quantity'),
        productQuantity = parseInt(_productQuantity.options[_productQuantity.selectedIndex].value),
        _productSize = document.getElementsByClassName('size-radio'), productSizeID,
        success, stateChanged;

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
    product.code = productCode;
    product.quantity = productQuantity;

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

        updateBasketInformation();

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
                product.sizeID = response.product[i].id;
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
    var totalPrice = 0.00, ul = '',
        basket = document.getElementById('basket');

    // Start basket table.
    ul += '<ul class="basket-table">';
    ul += '<li class="thead">';
    ul += '<div class="sku">SKU</div>';
    ul += '<div class="name">Name</div>';
    ul += '<div class="size">Size</div>';
    ul += '<div class="quantity">Quantity</div>';
    ul += '<div class="price">Price</div>';
    ul += '<div class="remove">Remove</div>';
    ul += '</li>';

    // Lopp through objects in session
    for(var i=0, len=sessionStorage.length; i<len; i++) {
        var product = JSON.parse(sessionStorage.getItem(sessionStorage.key(i))),
        colour = '';

        totalPrice += parseFloat(product.price) * product.quantity;

        if(product.colour != '')
            colour = ' <em>('+product.colour+')</em>';

        ul += '<li class="tbody">';
        ul += '<div class="sku">'+product.code+'</div>';
        ul += '<div class="name">'+product.name+colour+'</div>';
        if(product.size != undefined)
            ul += '<div class="size">'+product.size+'</div>';
        else
            ul += '<div class="size"></div>';
        ul += '<div class="quantity">'+product.quantity+'</div>';
        ul += '<div class="price">£'+product.price+'</div>';
        ul += '<div class="remove"><input type="checkbox" class="remove-item-basket" /></div>';
        ul += '</li>';
    }

    ul += '<li class="tfoot">';
    ul += '<div class="sku"></div>';
    ul += '<div class="name"></div>';
    ul += '<div class="size"></div>';
    ul += '<div class="quantity"></div>';
    ul += '<div class="price">£'+totalPrice.toFixed(2)+'</div>';
    ul += '<div class="remove"></div>';
    ul += '</li>';

    // Display total for order.
    basket.innerHTML = ul;

    addEventListeners('basket');
}

// Clear basket
// Remove single product

function removeProduct(sessionKey) {
    // Remove from session storage.
    sessionStorage.removeItem(sessionKey);
    //Update the basket information in the header.
    updateBasketInformation();
    // Reload page.
    loadPage(document.URL);
}

// Begin order.
function checkout () {

}

// Finish order.
function confirmOrder () {

    // Loop through objects in session
    // adding them to the order table in the database.

}

function updateBasketInformation () {
    var basketItems = document.getElementById('basket-items'),
        basketValue = document.getElementById('basket-value'),
        totalPrice = 0.00;

    basketItems.innerHTML = sessionStorage.length + ' items';

    // Set the total price.
    for(var i=0, len=sessionStorage.length; i<len; i++) {
        var currentId = sessionStorage.key(i),
            currentProduct = JSON.parse(sessionStorage.getItem(currentId));
        totalPrice += parseFloat(currentProduct.price) * currentProduct.quantity;
    }
    basketValue.innerHTML = '£' + totalPrice.toFixed(2);
}