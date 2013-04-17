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
        content.innerHTML = response;
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
    var navigation = document.getElementById('navigation'),
        category = document.getElementById('category'), hold;

    if(navigation) {
        addEventListeners('navigation');
    }

    if(category) {
        // Hold execution, just to ensure the DOM is loaded.
        hold = setTimeout(function() {
            addEventListeners('products')
            showProducts('publish', getPageAsString(document.URL), getViewCriteria(document.URL), getCategory(document.URL));
        }, 100);
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
    if(href.length < 1) {
        info = '';
    } else {
        if(entity === 'product') {
            info = href[0];
        } else if(entity === 'basket') {
            info = href[0].split("id=").pop();
        } else if(entity === 'search') {
            info = href[0].split("q=").pop();
        } else if(entity === 'category') {
            info = getPageAsString(document.URL);
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

// Returns the filter criteria (if any), from a hypertext reference.
// If none set, returns 'not-trash'.
function getFilterCriteria (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(5,5), filter = undefined,
        filterCriteria, _filter;
    // If nothing is left.
    if(href.length < 1) {
        filterCriteria = 'not-trash';
    } else {
        filter = href[0].split('&');
        for(var i in filter) {
            _filter = filter[i].split('=');
            if(_filter[0] === 'filter')
                filterCriteria = _filter[1];
        }
        if(filterCriteria === undefined)
            filterCriteria = 'not-trash';
    }
    // Return the filter information.
    return filterCriteria;
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
            siteTitle = document.getElementById('site-name');

        if(response.error.thrown) {
            showMessage(response.error.message);
        } else {
            siteTitle.innerHTML = '<a href="home">'+response.site_name+'</a>';
        }
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
                category = response.category[i],
                // Set up table body.
                li += '<li class="nav-list-item"><a href="'+category.name.toLowerCase()+'" class="nav-list-link" id="category-'+category.name.toLowerCase()+'" data-id="'+category.id+'">' + category.name + '</a></li>';
            }
        }
        // Fill content with new data.
        content.innerHTML = li;
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

function showProducts (status, pageNo, perPage, category) {
    // Now, load the list of products.
    showProductList(status, pageNo, perPage, category);
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
                    colourString = ' ('+product_group.colour+')';
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