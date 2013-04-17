// eventHandler.js

function addEventListeners (eventsFor) {
    // If events are for product pagination, apply those.
    switch(eventsFor) {
        case 'navigation':
            getSiteTitle();
            getNavigation();
            break;

        case 'navigation-links':
            var links = document.getElementsByClassName('nav-list-link');
            // Loop through links
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
            function addLink(elem) {
                elem.addEventListener('click', function (e) {
                    history.pushState(null, null, 'product/'+elem.dataset.sku);
                    e.preventDefault();
                }, false);
            }
            // Loop through products.
            for(var i=0, len=productItems.length; i<len; i++) {
                addLink(productItems[i]);
            }
            break;

        default: break;
    }
}