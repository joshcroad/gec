var showProducts, productsEventHandler, showPagination, eventsFired = 0;

getProduct = function(productID) {
    // Ajax call to get single product information.
}

showProducts = function(pageNo, perPage) {
    showPagination(pageNo, perPage);
};

// Add event listeners to all recently added buttons.
productsEventHandler = function() {
    var pagItems = document.getElementsByClassName("pagItem"),
        twenty = document.getElementById("twenty"),
        all = document.getElementById("all");

    if(twenty)
        twenty.addEventListener("click", function(e) {
            showProducts(1, 20);
            e.preventDefault();
        }, true);

    if(all)
        all.addEventListener("click", function(e) {
            showProducts(1, 200);
            e.preventDefault();
        }, true);

    function addLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            showProducts(item.dataset.pageno, item.dataset.perpage);
        }, true);
    }

    for(var i=0, len=pagItems.length; i<len; i++) {
        addLink(pagItems[i]);
    }
};

// Display list of products.
showList = function(pageNo, perPage, table, status) {
    var success, stateChanged, start = '', url = '',
        xhr = new XMLHttpRequest(),
        content = document.getElementById("products_list"),
        loading = document.getElementById("loading");

    // Initialising variables if not already.
    if (perPage === undefined)
        perPage = 10;
    if (pageNo === undefined)
        start = 0;
    else
        start = (pageNo - 1) * perPage;

    url = '../api/v.1/view/range.php';
    url += '?show='+table+'&status='+status+'&start='+start+'&show='+perPage;

    // Show loader.
    // loading.style.display = 'block';

    success = function() {
        var response = JSON.parse(xhr.responseText), li = '';

        if(response.error.thrown) { // If API returns error.
            failed('No results found.');
        } else { // Otherwise.
            li += '<li class="product-list thead">';
            li += '<div class="product-sku">SKU</div>';
            li += '<div class="product-title">Title</div>';
            li += '<div class="product-price">Price</div>';
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
                li += '<div class="product-stock">' + product.stock + '</div>';
                li += '<div class="product-post-status">' + product.post_status + '</div>';
                li += '</li>';
            }
        }

        // Hide loader.
        // loading.style.display = 'none';

        content.innerHTML = li;
    };

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found."); break;
                case 403:
                    failed("403 Forbidden."); break;
                case 304:
                    failed("304 Not modified"); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                case 0:
                    failed("Request successful, however 0 returned."); break;
                default:
                    failed("Unknown reason for failure."); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;

    productsEventHandler();

};

// So pagination links.
showPagination = function(pageNo, perPage) {
    var success, stateChanged,
        url = '../api/v.1/view/count.php';
        url += '?show=product';
        xhr = new XMLHttpRequest(),
        pageNo = parseInt(pageNo);

    if(perPage === undefined)
        perPage = 20; // Default items per page.
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
                case 403:
                    failed("403 Forbidden."); break;
                case 304:
                    failed("304 Not modified"); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                case 0:
                    failed("Request successful, however 0 returned."); break;
                default:
                    failed("Unknown reason for failure."); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};