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
            ten.addEventListener('click', function (e) {
                showProducts(getFilterCriteria(document.URL), 1, 10);
                e.preventDefault();
            }, false);
            all.addEventListener('click', function (e) {
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
                addProductChangeEvent(productsStatus[i]);
            }
            function addProductChangeEvent (elem) {
                elem.addEventListener('change', function (e) {
                    updateProductStatus(elem);
                }, false);
            }
            break;

        case 'update-product':
            var updateProductButton = document.getElementById("update-product-button"),
                addValueStockButton = document.getElementById("add-value-stock");
            // When the user specifies the product is to be updated,
            // check the data being posted is valid, and then make the request.
            updateProductButton.addEventListener('click', function (e) {
                var valid = validateProductInput();
                if(valid)
                    updateProduct(updateProductButton.dataset.sku);
                e.preventDefault();
            }, false);
            // Add two new inputs, one for a new size and one for a new stock,
            // by calling a function to do the heavy work.
            addValueStockButton.addEventListener("click", function (e) {
                addValueStockInputs();
                e.preventDefault();
            }, false);
            break;

        case 'add-product':
            var addProductButton = document.getElementById("add-product-button"),
                addValueStockButton = document.getElementById("add-value-stock");
            // When the user specifier the product is to be added,
            // check the data being posted is valid, and then make the request.
            addProductButton.addEventListener("click", function (e) {
                var valid = validateProductInput();
                if(valid)
                    addProduct();
                e.preventDefault();
            }, false);
            // Add two new inputs, one for a new size and one for a new stock,
            // by calling a function to do the heavy work.
            addValueStockButton.addEventListener("click", function (e) {
                addValueStockInputs();
                e.preventDefault();
            }, false);
            break;

        case 'categories': 
            var categoryFilter = document.getElementsByClassName("filter-table"),
                status = document.getElementsByClassName("category-status");
            
            for(var i=0, len=categoryFilter.length; i<len; i++) {
                addListenerGetPage(categoryFilter[i]);
            }
            for(var i=0, len=status.length; i<len; i++) {
                addCategoryChangeEvent(status[i]);
            }
            function addCategoryChangeEvent (elem) {
                elem.addEventListener("change", function (e) {
                    updateCategoryStatus(elem);
                }, false);
            }
            break;

        case 'add-category':
            var addCategoryButton = document.getElementById("add-cat-button");

            // Event listener to listen for when the user wants to add a category.
            addCategoryButton.addEventListener('click', function (e) {
                var valid = validateCategoryInput();
                if(valid)
                    addCategory();
                e.preventDefault();
            }, false);
            break;

        case 'settings':
            var companyName = document.getElementById('site-name'),
                resetDB = document.getElementById("reset-database"),
                setDefault = document.getElementById("set-default-picture");

            companyName.addEventListener('keydown', function (e) {
                if(e.keyCode === 13 && companyName.value !== '') {
                    setCompanyName();
                }
            }, false);

            // Event to fire when default picture is pressed.
            setDefault.addEventListener('click', function (e) {
                setDefaultPicture();
                e.preventDefault();
            }, false);
            
            // The event to fire when the user requests 
            resetDB.addEventListener('click', function (e) {
                if (confirm('You are about to wipe the database clean, are you sure?')) {
                    truncateDbTables();
                }
                e.preventDefault();
            }, false);

        default: break;
    }
}