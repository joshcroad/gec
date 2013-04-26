// eventHandler.js

function addEventListeners (eventsFor) {
    // If events are for product pagination, apply those.
    switch(eventsFor) {
        // Function called on page load, loads the site title,
        // and the navigation menu.
        case 'navigation':
            getSiteTitle();
            getNavigation();
            break;

        // Events for the main navigation.
        case 'navigation-links':
            var links = document.getElementsByClassName('nav-list-link');
            // Loop through navigation links
            for(var i=0, len=links.length; i<len; i++) {
                addListenerGetPage(links[i]);
            }
            break;

        // The events for the individual product items.
        case 'product-items':
            var productItems = document.getElementsByClassName('products-list-item');
            // Add event listener to all.
            function addProductLink (elem) {
                elem.addEventListener('click', function (e) {
                    // As the div is not an anchor, href has to be created,
                    // elem.baseURI gets the elements base uri,
                    // e.g. http://localhost/[name]/
                    href = elem.baseURI+'product/'+elem.dataset.sku;
                    history.pushState(null, null, href);
                    // Load the page.
                    loadPage(href);
                    e.preventDefault();
                }, false);
            }
            // Loop through products.
            for(var i=0, len=productItems.length; i<len; i++) {
                addProductLink(productItems[i]);
            }
            break;

        // Events for the pagination for products.
        case 'products-pagination':
            var pagItems = document.getElementsByClassName('pagItem');

            function addPagLink (elem) {
                elem.addEventListener('click', function (e) {
                    history.pushState(null, null, elem.href);
                    loadPage(elem.href);
                    e.preventDefault();
                })
            }

            for(var i=0, len=pagItems.length; i<len; i++) {
                addPagLink(pagItems[i]);
            }
            break;

        // The events for a single product item
        case 'product-item':
            // When size option is changed, fire event to get stock for selected item.
            var addBasket = document.getElementById('product-add-basket');

            // Need to do event listener for adding to basket.
            addBasket.addEventListener('click', function (e) {
                addToBasket(addBasket.dataset.id, addBasket.dataset.sku);
                e.preventDefault();
            }, false);
            break;

        // The events that occur when a size option is changed
        case 'size-quantity-option':
            var productSize = document.getElementsByClassName('size-radio'),
                quantity = document.getElementById('product-quantity'),
                addBasket = document.getElementById('product-add-basket');

            // Loop through list.
            for(var i=0, len=productSize.length; i<len; i++) {
                onCheckedEvent(productSize[i]);
            }
            // Add event listener for on checked.
            function onCheckedEvent (elem) {
                elem.addEventListener('click', function () {
                    var url, xhr = new XMLHttpRequest(),

                    success = function () {
                        var response = JSON.parse(xhr.responseText);
                        // Reset options
                        quantity.innerHTML = '';

                        if(response.stock > 10) {
                            for(var j=0; j<10; j++) {
                                quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                            }
                        } else {
                            for(var j=0, jen=response.stock; j<jen; j++) {
                                quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                            }
                        }
                    },

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

                    addBasket.dataset.id = elem.dataset.id;

                    url = 'api/v.1/search/stock.php?id='+elem.dataset.id;

                    xhr.open("GET", url, true);
                    xhr.send(null);
                    xhr.onreadystatechange = stateChanged;
                }, false);
            }
            break;

        case 'basket':
            var removeChecks = document.getElementsByClassName('remove'),
                confirmOrderBtn = document.getElementById('confirm-order');

            for(var i=0, len=removeChecks.length; i<len; i++) {
                addCheckedEventListener(removeChecks[i], i);
            }
            function addCheckedEventListener(elem, index) {
                elem.addEventListener('click', function () {
                    removeProduct(sessionStorage.key((index-1)));
                }, false);
            }

            confirmOrderBtn.addEventListener('click', function (e) {
                history.pushState(null, null, confirmOrderBtn.href);
                confirmOrder();
                e.preventDefault();
            }, false);
            break;

        default: break;
    }
}