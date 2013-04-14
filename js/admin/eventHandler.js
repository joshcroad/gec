// eventHandler.js

function addEventListeners (eventsFor) {
    // If events are for product pagination, apply those.
    switch(eventsFor) {
        case 'products':
            // The new elements to add listeners to.
            var ten = document.getElementById('ten'),
                all = document.getElementById('all'),
                addProductSection = document.getElementById('add-product-section'),
                filterButtons = document.getElementsByClassName("filter-table");
            // Loop through the filter buttons, adding listeners.
            for(var i=0, len=filterButtons.length; i<len; i++) {
                addListenerGetPage(filterButtons[i]);
            }
            // Add event listeners to the other buttons on the page.
            ten.addEventListener('click', function(e) {
                showProducts(getFilterCriteria(document.URL), 1, 10);
                e.preventDefault();
            }, false);
            all.addEventListener('click', function(e) {
                showProducts(getFilterCriteria(document.URL), 1, 9999);
                e.preventDefault();
            }, false);
            addListenerGetPage(addProductSection);
            break;

        case 'products-pagination':
            var pagItems = document.getElementsByClassName('pagItem');
            for(var i=0, len=pagItems.length; i<len; i++) {
                addListenerGetPage(pagItems[i]);
            }
            break;

        case 'products-list':
            var productItems = document.getElementsByClassName('product-item'),
                productsStatus = document.getElementsByClassName('products-status');
            // SINGLE PRODUCT LINKS
            for(var i=0, len=productItems.length; i<len; i++) {
                addListenerGetPage(productItems[i]);
            }
            // EVENT FOR CHANGING OPTION ON DROPDOWN
            for(var i=0, len=productsStatus.length; i<len; i++) {
                addOptionChangeEvent(productsStatus[i]);
            }
            function addOptionChangeEvent(elem) {
                elem.addEventListener('change', function(e) {
                    updateProductStatus(elem);
                }, false);
            }
            break;

        case 'update-product':
            var updateProductButton = document.getElementById("update-product-button"),
                addValueStockButton = document.getElementById("add-value-stock");
            // When the user specifies the product is to be updated,
            // check the data being posted is valid, and then make the request.
            updateProductButton.addEventListener('click', function(e) {
                var valid = validateProductInput();
                if(valid)
                    updateProduct(updateProductButton.dataset.sku);
                e.preventDefault();
            }, false);
            // Add two new inputs, one for a new size and one for a new stock,
            // by calling a function to do the heavy work.
            addValueStockButton.addEventListener("click", function(e) {
                addValueStockInputs();
                e.preventDefault();
            }, false);
            break;

        case 'add-product':
            var addProductButton = document.getElementById("add-product-button"),
                addValueStockButton = document.getElementById("add-value-stock");
            // When the user specifier the product is to be added,
            // check the data being posted is valid, and then make the request.
            addProductButton.addEventListener("click", function(e) {
                var valid = validateProductInput();
                if(valid)
                    addProduct();
                e.preventDefault();
            }, false);
            // Add two new inputs, one for a new size and one for a new stock,
            // by calling a function to do the heavy work.
            addValueStockButton.addEventListener("click", function(e) {
                addValueStockInputs();
                e.preventDefault();
            }, false);
            break;

        default: break;
    }
}