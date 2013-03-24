var showProducts, showPagination, eventsFired = 0;

showProducts = function(pageNo, perPage) {
    var products_content = document.getElementById("products_content");
    if(products_content) {
        showList(pageNo, perPage);
        showPagination(pageNo, perPage);
        // This prevents mulitple event listenered from being added.
        if(eventsFired === 0)
            productsEventHandler();
    }
};

productsEventHandler = function() {
    var pagItems = document.getElementsByClassName("pagItem"),
        twenty = document.getElementById("twenty"),
        all = document.getElementById("all");

    eventsFired++;

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
            history.pushState(null, null, item.href);
            showProducts(item.dataset.pageno, item.dataset.perpage);
        }, true);
    }

    for(var i=0, len=pagItems.length; i<len; i++) {
        addLink(pagItems[i]);
    }
}


// Display list of products.
showList = function(pageNo, perPage) {
    console.log(pageNo, perPage);
    var success, stateChanged, start = '', url = '',
        xhr = new XMLHttpRequest(),
        content = document.getElementById("products_content"),
        loading = document.getElementById("loading");

    // Initialising variables if not already.
    if (perPage === undefined)
        perPage = 10;
    if (pageNo === undefined)
        start = 0;
    else
        start = (pageNo - 1) * perPage;

    url = '../api/v.1/view/range.php?start='+start+'&show='+perPage,

    // Show loader.
    // loading.style.display = 'block';

    success = function() {
        var response = JSON.parse(xhr.responseText), tbody = '';

        if(response.error.thrown) { // If API returns error.
            failed('No results found.');
        } else { // Otherwise.
            // Loop through each result.
            for(i in response.product) {
                product = response.product[i];
                // Set up table body.
                tbody += '<tr class="body_row">';
                tbody += '<td>' + product.sku + '</td>';
                tbody += '<td><a href="" class="product-item" data-sku="' + product.sku + '">' + product.title + '</a></td>';
                if (product.reduced_price != 0.00) {
                    tbody += '<td>' + product.reduced_price;
                    tbody += ' <span class="strike">' + product.price + '</span></td>';
                } else {
                    tbody += '<td>' + product.price + '</td>';
                }
                tbody += '<td>' + product.stock + '</td>';
                tbody += '<td>' + product.post_status + '</td>';
                tbody += '</tr>';
            }
        }

        // Hide loader.
        // loading.style.display = 'none';

        content.innerHTML = tbody;
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

// So pagination links.
showPagination = function(pageNo, perPage) {
    var success, stateChanged,
        url = '../api/v.1/view/count.php?show=product';
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

        pagNav = '<li><a href="#1" class="pagItem" data-pageNo="1" data-perPage="'+perPage+'">&laquo;</a></li>';
        if (pageNo === 1)
            pagNav += '<li>&#139;</li>';
        else
            pagNav += '<li><a href="#'+(pageNo-1)+'" class="pagItem" data-pageNo="'+(pageNo-1)+'" data-perPage="'+perPage+'">&#139;</a></li>';

        for(var i=0; i<pages; i++) {
            var currentPage = (i+1), active = '';

            if (currentPage === pageNo)
                active = 'active';

            if (currentPage >= (pageNo-3) && currentPage <= pageNo || currentPage <= (pageNo+3) && currentPage >= pageNo)
                pagNav += '<li><a href="#'+currentPage+'" class="pagItem '+active+'" data-pageNo="'+currentPage+'" data-perPage="'+perPage+'">' + currentPage + '</a></li>';
        }

        if(pageNo === pages)
            pagNav += '<li>&#155;</li>';
        else
            pagNav += '<li><a href="#'+(pageNo+1)+'" class="pagItem" data-pageNo="'+(pageNo+1)+'" data-perPage="'+perPage+'">&#155;</a></li>';

        pagNav += '<li><a href="#'+pages+'" class="pagItem" data-pageNo="'+pages+'" data-perPage="'+perPage+'">&raquo;</a></li>';
        pagNav += '</ul>';

        ul.innerHTML = pagNav;
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

if(window.addEventListener) {
    window.addEventListener("popstate", function() {
        var page = document.location.href.split("#").pop();
        if(!page || 0 === page.length)
            page = '1';
        showProducts(page, 20);
    });
}