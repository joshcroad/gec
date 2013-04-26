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
        // Display content.
        content.innerHTML = response;
        // Add the page content.
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

    url = filename+'.php';

    // Open & send request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Adding dynamic content and event listeners
function addDynamicContent () {
    var home = document.getElementById('home'),
        category = document.getElementById('category'), 
        product = document.getElementById('product'),
        search = document.getElementById('search'),
        basket = document.getElementById('basket'), hold;

    if(home) {
        displayRecentProducts();
    }

    // If a category page.
    if(category) {
        // Hold execution, just to ensure the DOM is loaded.
        hold = setTimeout(function() {
            addEventListeners('products');
            showProducts('publish', getEntityInformation(document.URL, 'category'), getViewCriteria(document.URL), getCategory(document.URL));
        }, 100);
    }

    // If an individual product page.
    if(product) {
        getProduct(getEntityInformation(document.URL, 'product'));
    }

    // If user has search for something
    if(search) {
        searchProducts(getEntityInformation(document.URL, 'search'));
    }

    // If the user requests to see the basket
    if(basket) {
        displayBasket();
    }
}

// Ruturns the file to load, from a hypertext reference.
function getFilenameAsString (_href) {
    // Split and splice href, removing the host etc.
    var href = _href.split("/"), href = href.splice(4,4), filename;
    // href should now be a non-empty array.
    if(href[0] === '')
        filename = 'home';
    else if(href[0] === 'product' || href[0] === 'basket' || href[0] === 'search' || href[0] === 'home') {
        filename = href[0];
    } else {
        filename = 'category';
    }
    // Return the page.
    return filename;
}

// Ruturns the file to load, from a hypertext reference.
function getCategory (_href) {
    // Split and splice href, removing the host etc.
    var href = _href.split("/"), href = href.splice(4,4), category;
    // href should now be a non-empty array.
    if(href[0] === '')
        category = 'home';
    else
        category = href[0];
    // Return the page.
    return category;
}

// Returns the page number (if any), from a hypertext reference.
function getEntityInformation (_href, entity) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(5,5), info;
    // If nothing is left.
    if(href.length < 1 && entity !== 'category') {
        info = '';
    } else {
        switch(entity) {
            case 'product':
                info = href[0]; break;
            case 'basket':
                info = href[0].split("id=").pop(); break;
            case 'search':
                info = href[0].split("q=").pop(); break;
            case 'category':
                info = getPageAsString(document.URL); break;
        }
    }
    // Return the category.
    return info;
}

// Returns the page number (if any), from a hypertext reference.
function getPageAsString (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(5,5), pageNumber;
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

// Returns the view criteria (if any), from a hypertext reference.
// If none set, returns 10.
function getViewCriteria (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(5,5), view = undefined,
        viewCriteria, _view;
    // If nothing is left.
    if(href.length < 1) {
        viewCriteria = 16;
    } else {
        view = href[0].split('&');
        for(var i in view) {
            _view = view[i].split('=');
            if(_view[0] === 'view')
                viewCriteria = _view[1];
        }
        if(viewCriteria === undefined)
            viewCriteria = 16;
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

// Display a message to the document.
function showMessage (message, classname) {
    // Get message element from document.
    var requestMessage = document.getElementById("global-message"), timeout;
    if(classname === undefined)
        classname = "success";
    // Set the classification of the message.
    requestMessage.setAttribute("class", classname);
    // Set the message.
    requestMessage.innerHTML = message;
    // Display the message.
    requestMessage.style.display = "block";
    // Reset the message after 3 seconds.
    timeout = setTimeout(function () {
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

function getSiteTitle () {
    var url, xhr = new XMLHttpRequest(),

    success = function () {
        var response = JSON.parse(xhr.responseText),
            siteTitle = document.getElementById('site-name'),
            anchor;

        if(response.error.thrown) {
            showMessage(response.error.message);
        } else {
            siteTitle.innerHTML = '<a href="home" id="site-name-anchor">'+response.site_name+'</a>';
        }

        anchor = document.getElementById('site-name-anchor');

        addListenerGetPage(anchor);
    },

    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); 
                    return null; break;
            }
        }
    };

    url = 'api/v.1/view/settings.php';

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}


// Get the list of categories for the menu.
function getNavigation () {
    var url, xhr = new XMLHttpRequest(),

    success = function () {
        var response = JSON.parse(xhr.responseText), li = '',
            content = document.getElementById("navigation");

        if(response.error.thrown) {
            content.innerHTML = response.report.message;
        } else {
            // Loop through each result.
            for(i in response.category) {
                category = response.category[i];
                // Set up table body.
                li += '<li class="nav-list-item"><a href="'+category.slug+'" class="nav-list-link" id="category-'+category.slug+'" data-id="'+category.id+'">' + category.name + '</a></li>';
            }
        }
        // Fill content with new data.
        content.innerHTML = li;
        // Now the navigation has loaded, load the page.
        loadPage(document.URL);
        // add event listeners
        addEventListeners('navigation-links');
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

    url = 'api/v.1/view/categories.php?status=publish&menu=true';

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}


// API call for products based on query.
function searchProducts (query) {
    var url = 'api/v.1/search/products.php?q='+query,
        xhr = new XMLHttpRequest(),

    success = function () {
        var response = JSON.parse(xhr.responseText), li = '',
            container = document.getElementById("search"),
            content = document.getElementById("products-list"),
            product_group, colourString;
        // If API returns error.
        if(response.error.thrown) {
            container.innerHTML = "No products matching your search '" + query + "'";
        } else {
            for(var i in response.product_group) {
                colourString = '';
                product_group = response.product_group[i];
                li += '<div class="products-list-item" data-sku="'+product_group.sku+'">';
                li += '<div class="product-image">';
                li += '<img src="'+product_group.thumbnail+'" alt="'+product_group.title+'" />';
                li += '</div>';
                if(product_group.colour !== '') {
                    colourString = ' <em>('+product_group.colour+')</em>';
                }
                li += '<div class="product-name">'+product_group.title+colourString+'</div>';
                li += '<div class="price-group">';
                if(product_group.sale_price === '0.00' || product_group.sale_price == null) {
                    li += '<div class="product-price">£'+product_group.price+'</div>';
                } else {
                    li += '<div class="product-sale-price">£'+product_group.sale_price+'</div>';
                    li += '<div class="product-price"><del>£'+product_group.price+'</del></div>';
                }
                li += '</div>';
                li += '</div>';
            }
        }
        // Hide loader before content is filled.
        loader(false);
        // Paint to the document.
        content.innerHTML = li;
        // add events
        addEventListeners('product-items');
    }

    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); break;
            }
        }
    }

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Display the 5 most recently added products
function displayRecentProducts () {
    var xhr = new XMLHttpRequest(), url,
    // Request was successful, display retrieved data.
    success = function () {
        // Parse JSON array.
        var products = JSON.parse(xhr.responseText),
            product, div,
            container = document.getElementById('recent-products');

        loader(false);

        div = '<h3>Recently Added</h3>'

        for(var i=0, len=products.product_group.length; i<len; i++) {
            product = products.product_group[i];
            div += '<div class="products-list-item" data-sku="'+product.sku+'">';

            div += '<img src="'+product.thumbnail+'" alt="'+product.title+'" />';
            div += '<div class="title">'+product.title+'</div>';
            if(product.sale_price != '0.00') {
                div += '<div class="price">£'+product.sale_price+'</div>';
                div += '<div class="price"><del>was £'+product.price+'</del></div>';
            } else {
                div += '<div class="price">£'+product.price+'</div>';
            }

            div += '</div>';
        }

        container.innerHTML = div;
        // Add events for added products.
        addEventListeners("product-items");
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

    // Show loader.
    loader(true);
    // Set url of API, with parameters.
    url = 'api/v.1/search/recent-products.php';
    // Open & send the request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;

}


// Function get and display the product
function getProduct (sku) {
    var url, xhr = new XMLHttpRequest(),
    // Request was successful, display retrieved data.
    success = function () {
        // Parse JSON array.
        var product_group = JSON.parse(xhr.responseText),
            thumbnail = document.getElementById("product-image"),
            title = document.getElementById("product-title"),
            sku = document.getElementById("product-sku"),
            price = document.getElementById("product-price"),
            colour = document.getElementById("product-colour"),
            content = document.getElementById("product-content"),
            size = document.getElementById("product-sizes"),
            stock = document.getElementById("product-stock"),
            basket = document.getElementById("product-basket"),
            quantity = document.getElementById("product-quantity"),
            addToBasket = document.getElementById("product-add-basket"),
            product, sizeElem, sizeElemLabel, j = 0, li = '', checked,
            disabled, outOfStock, stockLevel;

        loader(false);

        if(product_group.error.thrown) {
            title.innerHTML = "No product found."
        } else {

            // Get thumbnail image.
            thumbnail.innerHTML = '<img src="'+product_group.thumbnail+'" alt="'+product_group.title+'" />';
            // Populate title.
            title.innerHTML = '<h2>'+product_group.title+'</h2>';
            // Put the sku number.
            sku.innerHTML = 'Product code: '+product_group.sku;
            // Display the colour, if there is a colour set.
            if(product_group.colour.length > 0)
                colour.innerHTML = 'Colour: '+product_group.colour;
            // Display the sale price, if one is set, else just display the normal price.
            if(product_group.sale_price !== "0.00") {
                price.innerHTML += 'Price: £'+product_group.sale_price;
                price.innerHTML += ' <del>was £'+product_group.price+'</del>';
            } else {
                price.innerHTML = 'Price: £'+product_group.price;
            }
            // Put the content in.
            content.innerHTML = '<h3>Description</h3><p>'+product_group.content+'</p>';

            // SIZES.
            if(product_group.product.length > 0) {
                for(var i in product_group.product) {
                    // Get individual product.
                    product = product_group.product[i],
                    checked = '';
                    disabled = '';
                    outOfStock = '';
                    // Checks to see if there is a value set (size set)
                    if(product.value.length != '') {
                        // If the item comes in different sizes...
                        if(j == 0 && product.stock != 0) {
                            checked = 'checked';
                            if(product.stock > 10) {
                                for(var j=0; j<10; j++) {
                                    quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                                }
                            } else {
                                for(var j=0, jen=product.stock; j<jen; j++) {
                                    quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                                }
                            }
                            addToBasket.dataset.id = product.id;
                            j++;
                        }
                        if(product.stock == 0) {
                            disabled = ' disabled';
                            outOfStock = ' <em>Out of Stock</em>';
                        }

                        li += '<li class="product-size">';

                        li += '<div class="product-size-radio">';
                        li += '<input type="radio" class="size-radio" data-id="'+product.id+'" name="size" '+checked+disabled+' />';
                        li += '</div>';

                        li += '<div class="size-radio-label">'+product.value+outOfStock+'</div>';

                        li += '</li>';
                    } else {
                        // If the item does not come in different sizes.
                        // Set up the quantity select boxes.
                        // If stock level is greater than 10, set limit to 10, else set limit to max stock level.
                        if(product.stock > 10) {
                            for(var j=0; j<10; j++) {
                                quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                            }
                        } else {
                            for(var j=0, jen=product.stock; j<jen; j++) {
                                quantity.innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
                            }
                        }
                        addToBasket.dataset.id = product.id;
                    }
                }
                addToBasket.dataset.sku = product_group.sku;
                size.innerHTML = li;
            }

            // Setting the number of options in the quantity, depending on what option is selected.
            addEventListeners("size-quantity-option");
        }

        addEventListeners("product-item");
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

    // Show loader.
    loader(true);
    // Set url of API, with parameters.
    url = 'api/v.1/search/single-result.php?table=product_group&id='+sku+'&status=publish';
    // Open & send the request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// The function called to display both a list of products and
// the pagination links.
function showProducts (status, pageNo, perPage, category) {
    // Now, load the list of products.
    showProductList(status, pageNo, perPage, category);
    //Now, load the pagination
    showPagination(status, pageNo, perPage, category);
}


// Show product list.
function showProductList (status, pageNo, perPage, category) {
    var start = '', url, xhr = new XMLHttpRequest(),
        categoryID = document.getElementById("category-"+category),

    // On success, add request response to content.
    success = function () {
        var response = JSON.parse(xhr.responseText), li = '',
            content = document.getElementById("products-list"),
            product_group, colourString;
        // If API returns error.
        if(response.error.thrown) {
            showMessage(response.error.message, "error");
        } else {
            for(var i in response.product_group) {
                colourString = '';
                product_group = response.product_group[i];
                li += '<div class="products-list-item" data-sku="'+product_group.sku+'">';
                li += '<div class="product-image">';
                li += '<img src="'+product_group.thumbnail+'" alt="'+product_group.title+'" />';
                li += '</div>';
                if(product_group.colour !== '') {
                    colourString = ' <em>('+product_group.colour+')</em>';
                }
                li += '<div class="product-name">'+product_group.title+colourString+'</div>';
                li += '<div class="price-group">';
                if(product_group.sale_price === '0.00' || product_group.sale_price == null) {
                    li += '<div class="product-price">£'+product_group.price+'</div>';
                } else {
                    li += '<div class="product-sale-price">£'+product_group.sale_price+'</div>';
                    li += '<div class="product-price"><del>£'+product_group.price+'</del></div>';
                }
                li += '</div>';
                li += '</div>';
            }
        }
        // Hide loader before content is filled.
        loader(false);
        // Paint to the document.
        content.innerHTML = li;
        // add events
        addEventListeners('product-items');
    },
    // Once ready state is changed, check status.
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
    // Display loader will request is sent and retrieved.
    loader(true);
    // Initialise where the API should start getting records from.
    start = (pageNo - 1) * perPage;
    // Get category ID from dataset.
    categoryID = parseInt(categoryID.dataset.id);

    url = 'api/v.1/view/range.php';
    url += '?status='+status+'&start='+start+'&show='+perPage+'&category='+categoryID;

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Display the pagination for a category.
function showPagination (status, pageNo, perPage, category) {
    var pageNo = parseInt(pageNo),
        url, xhr = new XMLHttpRequest(),
        categoryID = document.getElementById("category-"+category),

    success = function () {
        var response = JSON.parse(xhr.responseText),
            pagNav = '', filter = '',
            ul = document.getElementById('pagination'),
            pages = Math.ceil(response.count / perPage);

        // Request complete, hide loader.
        loader(false);

        // If page number is 1, do NOT apply anchors to first 2 elements.
        if (pageNo === 1) {
            pagNav += '<li class="pagItemInactive">&laquo;</li>';
            pagNav += '<li class="pagItemInactive">&#139;</li>';
        } else {
            pagNav += '<li><a href="'+category+'/page=1" class="pagItem" data-pageNo="1" data-perPage="'+perPage+'">&laquo;</a></li>';
            pagNav += '<li><a href="'+category+'/page='+(pageNo-1)+'" class="pagItem" data-pageNo="'+(pageNo-1)+'" data-perPage="'+perPage+'">&#139;</a></li>';
        }
        // Loop through pages, adding numeric anchors.
        for(var i=0; i<pages; i++) {
            var currentPage = (i+1), active = '';
            // Set the current page classification.
            if (currentPage === pageNo)
                active = 'active';
            // Display ONLY 3 numbers before and after the current page.
            if (currentPage >= (pageNo-3) && currentPage <= pageNo || currentPage <= (pageNo+3) && currentPage >= pageNo)
                pagNav += '<li><a href="'+category+'/page='+currentPage+'" class="pagItem '+active+'" data-pageNo="'+currentPage+'" data-perPage="'+perPage+'">' + currentPage + '</a></li>';
        }
        // If page last page, do NOT apply anchors to last 2 elements.
        if(pageNo === pages) {
            pagNav += '<li class="pagItemInactive">&#155;</li>';
            pagNav += '<li class="pagItemInactive">&raquo;</li>';
        } else {
            pagNav += '<li><a href="'+category+'/page='+(pageNo+1)+'" class="pagItem" data-pageNo="'+(pageNo+1)+'" data-perPage="'+perPage+'">&#155;</a></li>';
            pagNav += '<li><a href="'+category+'/page='+pages+'" class="pagItem" data-pageNo="'+pages+'" data-perPage="'+perPage+'">&raquo;</a></li>';
        }
        // Add the new list elements to the document.
        ul.innerHTML = pagNav;
        // Display the pagination block after it has loaded,
        // Without this a dark grey, empty box displays quickly
        // before the content is added. Very annoying.
        ul.style.display = 'block';
        // Add event listeners for these newly added elements.
        addEventListeners('products-pagination');
    }

    stateChanged = function () {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    showMessage("Status "+xhr.status+" returned.", "error"); break;
            }
        }
    }

    // Get category ID from dataset.
    categoryID = parseInt(categoryID.dataset.id);

    url = 'api/v.1/view/count.php';
    url += '?show=product_group&status='+status+'&category='+categoryID;

    // Display loader.
    loader(true);
    // Open & send request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}