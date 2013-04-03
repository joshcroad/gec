var productsEventHandler, getProduct, addProduct, updateProduct, validateInput, showProducts, showList, showPagination;

// Add event listeners to all recently added buttons.
productsEventHandler = function() {
    var pagItems = document.getElementsByClassName("pagItem"),
        twenty = document.getElementById("twenty"),
        all = document.getElementById("all"),
        productItems = document.getElementsByClassName("product-item"),
        updateProductButton = document.querySelector("#edit-product a"),
        addProductButton = document.querySelector("#add-product a");

    function addPaginationLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            showProducts(item.dataset.pageno, item.dataset.perpage);
        }, true);
    }

    function addProductLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            getPage(item.href);
        }, true);
    }

    for(var i=0, len=pagItems.length; i<len; i++) {
        addPaginationLink(pagItems[i]);
    }

    for(var i=0, len=productItems.length; i<len; i++) {
        addProductLink(productItems[i]);
    }

    if(twenty) {
        twenty.addEventListener("click", function(e) {
            showProducts(1, 20);
            e.preventDefault();
        }, true);
    }

    if(all) {
        all.addEventListener("click", function(e) {
            showProducts(1, 200);
            e.preventDefault();
        }, true);
    }

    console.log(updateProductButton);
    console.log(addProductButton);

    if(updateProductButton) {
        updateProductButton.addEventListener("click", function(e) {
            var valid = validateProductInput();
            e.preventDefault();
            if(valid)
                updateProduct(updateProductButton.dataset.sku);
        }, true);
    }

    if(addProductButton) {
        addProductButton.addEventListener("click", function(e) {
            var valid = validateProductInput();
            e.preventDefault();
            if(valid)
                addProduct();
        }, true);
    }
};

/**
 * Populates the page with the given product.
 */
getProduct = function(productID) {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        title = document.getElementById("single-title"),
        desc = document.getElementById("single-desc"),
        price = document.getElementById("single-price"),
        reduced = document.getElementById("single-reduced"),
        stock = document.getElementById("single-stock"),
        status = document.getElementById("single-status"),
        postDate = document.getElementById("date-posted"),
        updateButton = document.querySelector("#edit-product a");

    url = '../api/v.1/search/single-result.php?table=product&id='+productID;

    // Show loader.
    // loading.style.display = 'block';

    success = function() {
        var product = JSON.parse(xhr.responseText);

        if(product.error.thrown) { // If API returns error.
            failed(product.error.message);
        } else { // Otherwise.
            title.value = product.title;
            desc.innerHTML = product.content;
            price.value = product.price;
            reduced.value = product.reduced_price;
            stock.value = product.stock;
            if(product.post_status === 'publish') {
                status.selectedIndex = 0;
            } else if(product.post_status === 'draft') {
                status.selectedIndex = 1;
            }
            postDate.innerHTML = product.post_date;
            updateButton.dataset.sku = product.sku;

            productsEventHandler();
        }

        // Hide loader.
        // loading.style.display = 'none'; 
    }

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

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};

/**
 * Call to update product.
 */
addProduct = function() {
    var success, stateChanged, url, param,
        xhr = new XMLHttpRequest(),
        title = document.getElementById("single-title").value,
        desc = document.getElementById("single-desc").value,
        price = document.getElementById("single-price").value,
        reduced = document.getElementById("single-reduced").value,
        stock = document.getElementById("single-stock").value,
        status_list = document.getElementById("single-status"),
        status_value = status_list.options[status_list.selectedIndex].value;

    console.log("This is called.");

    url = '../api/v.1/add/product.php',
    param = 'title='+title+'&desc='+desc+'&status='+status_value+'&price='+price+'&reduced='+reduced+'&stock='+stock+'',
    
    // loader(true);
    
    success = function() {
        var response = JSON.parse(xhr.responseText),
            message = document.getElementById("message"),
            timeout;

        // loader(false);

        message.innerHTML = response.report.status;
        timeout = setTimeout(function() { message.innerHTML = ''; }, 3000);
    };

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
};

/**
 * Call to update product.
 */
updateProduct = function(sku) {
    var success, stateChanged, url, param,
        xhr = new XMLHttpRequest(),
        title = document.getElementById("single-title").value,
        desc = document.getElementById("single-desc").value,
        price = document.getElementById("single-price").value,
        reduced = document.getElementById("single-reduced").value,
        stock = document.getElementById("single-stock").value,
        status_list = document.getElementById("single-status"),
        status_value = status_list.options[status_list.selectedIndex].value;

    url = '../api/v.1/edit/product.php',
    param = 'sku='+sku+'&title='+title+'&desc='+desc+'&status='+status_value+'&price='+price+'&reduced='+reduced+'&stock='+stock+'',
    
    // loader(true);
    
    success = function() {
        var response = JSON.parse(xhr.responseText),
            message = document.getElementById("message"),
            timeout;

        // loader(false);

        message.innerHTML = response.report.status;
        timeout = setTimeout(function() { message.innerHTML = ''; }, 3000);
    };

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
};

showProducts = function(pageNo, perPage) {
    showPagination(pageNo, perPage);
};

// Display list of products.
showList = function(pageNo, perPage, table, status) {
    var success, stateChanged, start = '', url = '',
        xhr = new XMLHttpRequest(),
        content = document.getElementById("products_list");

    // Initialising variables if not already.
    if (perPage === undefined)
        perPage = 10;
    if (pageNo === undefined)
        start = 0;
    else
        start = (pageNo - 1) * perPage;

    url = '../api/v.1/view/range.php';
    url += '?show='+table+'&status='+status+'&start='+start+'&show='+perPage;

    // loader(true);

    success = function() {
        var response = JSON.parse(xhr.responseText), li = '';

        if(response.error.thrown) { // If API returns error.
            failed(response.error.message);
        } else { // Otherwise.
            li += '<li class="product-list thead">';
            li += '<div class="product-sku">SKU</div>';
            li += '<div class="product-title">Title</div>';
            li += '<div class="product-price">Price (£)</div>';
            li += '<div class="product-size">Size</div>';
            li += '<div class="product-stock">Stock</div>';
            li += '<div class="product-post-status">Status</div>';
            li += '</li>';
            // Loop through each result.
            for(i in response.product) {
                product = response.product[i];
                // Set up table body.
                li += '<li class="product-list '+product.sku+'">';
                li += '<div class="product-sku">' + product.sku + '</div>';
                li += '<div class="product-title"><a href="product/'+product.sku+'" class="product-item" data-sku="' + product.sku + '">' + product.title + '</a></div>';
                if (product.reduced_price != 0.00) {
                    li += '<div class="product-price">' + product.reduced_price;
                    li += ' <del>' + product.price + '</del></div>';
                } else {
                    li += '<div class="product-price">' + product.price + '</div>';
                }

                li += '<div class="product-size"><ul>'
                for(i in product.stock) {
                    stock = product.stock[i];
                    if(stock.size === '')
                        li += '<li>-</li>';
                    else
                        li += '<li>' + stock.size + '</li>';
                }
                li += '</ul></div>';
                li += '<div class="product-stock"><ul>';
                for(i in product.stock) {
                    stock = product.stock[i];
                    li += '<li>' + stock.stock + '</li>';
                }
                li += '</ul></div>';

                li += '<div class="product-post-status">' + product.post_status + '</div>';
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
                case 404:
                    failed("404 Not found."); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};

// So pagination links.
showPagination = function(pageNo, perPage) {
    var success, stateChanged,
        url = '../api/v.1/view/count.php';
        url += '?show=product&status=not-trash';
        xhr = new XMLHttpRequest(),
        pageNo = parseInt(pageNo);

    if(perPage === undefined)
        perPage = 10; // Default items per page.
    if(pageNo === undefined)
        pageNo = 1; // Default page number.

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
    };

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};