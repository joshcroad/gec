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
            var links = document.getElementsByClassName('nav-list-link'),
            for(var i=0, len=links.length; i<len; i++) {
                addListenerGetPage(links[i]);
            }
            break;
        // The products page, filter, view buttons.
        case 'products':
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

        case 'product-item':
            // When size option is changed, fire event to get stock for selected item.
            var productSizeRadio = document.getElementsByClassName('size-radio');
            // Loop through list.
            for(var i=0, len=productSizeRadio.length; i<len; i++) {
                onCheckedEvent(productSizeRadio[i]);
            }
            // Add event listener for on checked.
            function onCheckedEvent (elem) {
                elem.addEventListener('click', function () {
                    getStock(elem.dataset.id);
                }, false)
            }

            // Need to do event listener for adding to basket.
            break;

        default: break;
    }
}