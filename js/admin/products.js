// Add event listeners to all recently added buttons.
var productsEventHandler = function() {
    var pagItems = document.getElementsByClassName("pagItem"),
        twenty = document.getElementById("twenty"),
        all = document.getElementById("all"),
        productItems = document.getElementsByClassName("product-item"),
        updateProductButton = document.getElementById("update-product-button"),
        addProductButton = document.getElementById("add-product-button"),
        addValueStockButton = document.getElementById("add-value-stock"),
        addValueStockInput = document.getElementById("values-and-stocks");

    function addPaginationLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            showProducts(item.dataset.pageno, item.dataset.perpage);
        }, false);
    }

    function addProductLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            getPage(item.href);
        }, false);
    }

    for(var i=0, len=pagItems.length; i<len; i++) {
        addPaginationLink(pagItems[i]);
    }

    for(var i=0, len=productItems.length; i<len; i++) {
        addProductLink(productItems[i]);
    }

    if(twenty) {
        twenty.addEventListener("click", function(e) {
            showProducts(1, 10);
            e.preventDefault();
        }, false);
    }

    if(all) {
        all.addEventListener("click", function(e) {
            showProducts(1, 200);
            e.preventDefault();
        }, false);
    }

    if(updateProductButton) {
        updateProductButton.addEventListener("click", function(e) {
            var valid = validateProductInput();
            e.preventDefault();
            if(valid)
                updateProduct(updateProductButton.dataset.sku);
        }, false);
    }

    if(addProductButton) {
        addProductButton.addEventListener("click", function(e) {
            var valid = validateProductInput();
            e.preventDefault();
            if(valid)
                addProduct();
        }, false);
    }

    if(addValueStockButton) {
        addValueStockButton.addEventListener("click", function(e){
            var inputValue = document.createElement("input"),
                inputStock = document.createElement("input");

            inputValue.type = "text";
            inputValue.className = "single-values";
            inputValue.placeholder = "Value/Size";
            inputStock.type = "text";
            inputStock.className = "single-stocks";
            inputStock.placeholder = "Stock";

            addValueStockInput.appendChild(inputValue);
            addValueStockInput.appendChild(inputStock);
            e.preventDefault();
        }, false);
    }
},

/**
 * Populates the page with the given product.
 */
getProduct = function(sku) {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        values = [], stock = [], category_id,
        title = document.getElementById("single-title"),
        content = document.getElementById("single-content"),
        price = document.getElementById("single-price"),
        sale = document.getElementById("single-sale"),
        colour = document.getElementById("single-colour"),
        thumbnail = document.getElementById("single-thumbnail"),
        valuesStocks = document.getElementById("values-and-stocks"),
        value_inputs = document.getElementsByClassName("single-values"),
        stock_inputs = document.getElementsByClassName("single-stocks"),
        status = document.getElementById("single-status"),
        postDate = document.getElementById("date-posted"),
        categories = document.getElementsByClassName("category"),
        updateButton = document.getElementById("update-product-button"),

    success = function() {
        var product_group = JSON.parse(xhr.responseText);

        // loader(false);

        if(product_group.error.thrown) { // If API returns error.
            failed(product_group.error.message);
        } else { // Otherwise.
            title.value = product_group.title;
            content.innerHTML = product_group.content;
            price.value = product_group.price;
            sale.value = product_group.sale_price;
            colour.value = product_group.colour;

            for(var i in product_group.product) {
                valuesStocks.innerHTML += '<input type="text" class="single-values" placeholder="Value/Size" />';
                valuesStocks.innerHTML += '<input type="text" class="single-stocks" placeholder="Stock" />';
            }

            for(var i in product_group.product) {
                product = product_group.product[i];
                value_inputs[i].value = product.value;
                stock_inputs[i].value = product.stock;
            }
            

            if(product_group.post_status === 'publish') {
                status.selectedIndex = 0;
            } else if(product_group.post_status === 'draft') {
                status.selectedIndex = 1;
            } else if(product_group.post_status === 'trash') {
                status.selectedIndex = 2;
            }
            postDate.innerHTML = product_group.post_date;
            updateButton.dataset.sku = product_group.sku;

            productsEventHandler();
        }
    },

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    // loader(true);

    url = '../api/v.1/search/single-result.php?table=product_group&id='+sku;

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
},

/**
 * Call to update product.
 */
addProduct = function() {
    var success, stateChanged, url, param,
        xhr = new XMLHttpRequest(),
        valuesArray = [], stocksArray = [],
        values, stocks, category_id, 
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        colour = document.getElementById("single-colour").value,
        thumbnail = document.getElementById("single-thumbnail"),
        value_inputs = document.getElementsByClassName("single-values"),
        stock_inputs = document.getElementsByClassName("single-stocks"),
        status_list = document.getElementById("single-status"),
        status_value = status_list.options[status_list.selectedIndex].value,
        categories = document.getElementsByClassName("category"),
    
    success = function() {
        var response = JSON.parse(xhr.responseText),
            message = document.getElementById("message"),
            timeout;

        // loader(false);

        message.innerHTML = response.report.status;
        timeout = setTimeout(function() { message.innerHTML = ''; }, 3000);
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

    // loader(true);

    // Populate stocks array with stocks from page
    for(var i=0, len=stock_inputs.length; i<len; i++) {
        if(stock_inputs[i].value != "") {
            valuesArray[i] = value_inputs[i].value;
            stocksArray[i] = stock_inputs[i].value;
        }
    }

    values = JSON.stringify(valuesArray);
    stocks = JSON.stringify(stocksArray);

    // Get the ID of the category selected
    // for(var i=0, len=categories.length; i<len; i++) {
    //     if(categories[i].checked) {
    //         category_id = categories[i].dataset.id;
    //     }
    // }

    url = '../api/v.1/add/product.php',
    param = 'title='+title+'&content='+content+'&price='+price+'&sale='+sale+
                '&colour='+colour+'&thumbnail='+thumbnail+'&values='+values+'&stocks='+stocks+
                '&status='+status_value+'&category_id=1';

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},

/**
 * Call to update product.
 */
updateProduct = function(sku) {
    var success, stateChanged, url, param,
        xhr = new XMLHttpRequest(),
        valuesArray = [], stocksArray = [],
        values, stocks, category_id, 
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        colour = document.getElementById("single-colour").value,
        thumbnail = document.getElementById("single-thumbnail"),
        value_inputs = document.getElementsByClassName("single-values"),
        stock_inputs = document.getElementsByClassName("single-stocks"),
        status_list = document.getElementById("single-status"),
        status_value = status_list.options[status_list.selectedIndex].value,
        categories = document.getElementsByClassName("category"),
    
    success = function() {
        var response = JSON.parse(xhr.responseText),
            message = document.getElementById("message"),
            timeout;

        // loader(false);

        message.innerHTML = response.report.status;
        timeout = setTimeout(function() { message.innerHTML = ''; }, 3000);
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

    console.log(status_value);

    // loader(true);

    // Populate values array with values from page
    for(var i=0, len=stock_inputs.length; i<len; i++) {
        if(stock_inputs[i].value != "") {
            valuesArray[i] = value_inputs[i].value;
            stocksArray[i] = stock_inputs[i].value;
        }
    }

    values = JSON.stringify(valuesArray);
    stocks = JSON.stringify(stocksArray);

    // Get the ID of the category selected
    // for(var i=0, len=categories.length; i<len; i++) {
    //     if(categories[i].checked) {
    //         category_id = categories[i].dataset.id;
    //     }
    // }

    // Request url
    url = '../api/v.1/edit/product.php';
    // Request parameters.
    param = 'sku='+sku+'&title='+title+'&content='+content+'&price='+price+'&sale='+sale+
                '&colour='+colour+'&thumbnail='+thumbnail+'&values='+values+'&stocks='+stocks+
                '&status='+status_value+'&category_id=1';

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},

showProducts = function(pageNo, perPage) {
    showPagination(pageNo, perPage);
},

// Display list of products.
showList = function(pageNo, perPage, table, status) {
    var success, stateChanged, start = '', url = '',
        xhr = new XMLHttpRequest(),
        content = document.getElementById("products_list");

    // Initialising variables if not already.
    if(perPage === undefined)
        perPage = 10;
    if(pageNo === undefined)
        start = 0;
    else
        start = (pageNo - 1) * perPage;

    url = '../api/v.1/view/range.php';
    url += '?show='+table+'&status='+status+'&start='+start+'&show='+perPage;

    // loader(true);

    success = function() {
        var response = JSON.parse(xhr.responseText), li = '', colourString,
            publishOption, draftOption, trashOption;

        if(response.error.thrown) { // If API returns error.
            failed(response.error.message);
        } else { // Otherwise.
            li += '<li class="product-list thead">';
            li += '<div class="product-sku">SKU</div>';
            li += '<div class="product-title">Title</div>';
            li += '<div class="product-value">Value</div>';
            li += '<div class="product-stock">Stock</div>';
            li += '<div class="product-post-status">Status</div>';
            li += '</li>';
            // Loop through each result.
            for(i in response.product_group) {
                product_group = response.product_group[i];
                publishOption = ""; draftOption = ""; trashOption = "";
                // Set up table body.
                li += '<li class="product-list '+product_group.sku+'">';
                li += '<div class="product-sku">' + product_group.sku + '</div>';
                colourString = product_group.colour !== "" ? ' <em>(' + product_group.colour + ')</em>' : '';
                li += '<div class="product-title"><a href="product/'+product_group.sku+'" class="product-item" data-sku="' + product_group.sku + '">' + product_group.title + colourString + '</a></div>';
                li += '<div class="product-value"><ul>'
                for(i in product_group.product) {
                    product = product_group.product[i];
                    if(product.value === '')
                        li += '<li>-</li>';
                    else
                        li += '<li>' + product.value + '</li>';
                }
                li += '</ul></div>';
                li += '<div class="product-stock"><ul>';
                for(i in product_group.product) {
                    product = product_group.product[i];
                    li += '<li>' + product.stock + '</li>';
                }
                li += '</ul></div>';
                li += '<div class="product-post-status"><select id="status">';

                switch(product_group.post_status) {
                    case 'publish':
                        publishOption = "selected"; break;
                    case 'draft':
                        draftOption = "selected"; break;
                    case 'trash':
                        trashOption = "selected"; break;
                    default:
                        publishOption = "selected"; break;
                }

                console.log(product_group.post_status);
                li += '<option value="publish" ' + publishOption + '>Publish</option>';
                li += '<option value="draft" ' + draftOption + '>Draft</option>';
                li += '<option value="trash"' + trashOption + '>Trash</option>';

                li += '</select></div>'
                li += '</li>';
            }
        }

        // loader(false);

        content.innerHTML = li;

        // Fire events for all links now presented.
        // Has to be fired now to prevent events being fired,
        // Before DOM has fully loaded.
        productsEventHandler();
    };

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

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
},

// So pagination links.
showPagination = function(pageNo, perPage) {
    var success, stateChanged,
        url = '../api/v.1/view/count.php';
        url += '?show=product&status=not-trash';
        xhr = new XMLHttpRequest(),
        pageNo = parseInt(pageNo),

    success = function() {
        var response = JSON.parse(xhr.responseText),
            pagNav = '',
            ul = document.getElementById('pagination'),
            pages = Math.ceil(response.count / perPage);

        if (pageNo === 1) {
            pagNav += '<li class="pagItemInactive">&laquo;</li>';
            pagNav += '<li class="pagItemInactive">&#139;</li>';
        } else {
            pagNav += '<li><a href="products/page/1" class="pagItem" data-pageNo="1" data-perPage="'+perPage+'">&laquo;</a></li>';
            pagNav += '<li><a href="products/page/'+(pageNo-1)+'" class="pagItem" data-pageNo="'+(pageNo-1)+'" data-perPage="'+perPage+'">&#139;</a></li>';
        }

        for(var i=0; i<pages; i++) {
            var currentPage = (i+1), active = '';

            if (currentPage === pageNo)
                active = 'active';

            if (currentPage >= (pageNo-3) && currentPage <= pageNo || currentPage <= (pageNo+3) && currentPage >= pageNo)
                pagNav += '<li><a href="products/page/'+currentPage+'" class="pagItem '+active+'" data-pageNo="'+currentPage+'" data-perPage="'+perPage+'">' + currentPage + '</a></li>';
        }

        if(pageNo === pages) {
            pagNav += '<li class="pagItemInactive">&#155;</li>';
            pagNav += '<li>&raquo;</li>';
        } else {
            pagNav += '<li><a href="products/page/'+(pageNo+1)+'" class="pagItem" data-pageNo="'+(pageNo+1)+'" data-perPage="'+perPage+'">&#155;</a></li>';
            pagNav += '<li><a href="products/page/'+pages+'" class="pagItem" data-pageNo="'+pages+'" data-perPage="'+perPage+'">&raquo;</a></li>';
        }
        
        pagNav += '</ul>';

        ul.innerHTML = pagNav;

        showList(pageNo, perPage, response.show, response.status);
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

    if(perPage === undefined)
        perPage = 10; // Default items per page.
    if(pageNo === undefined)
        pageNo = 1; // Default page number.

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};