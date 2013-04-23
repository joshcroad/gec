// products.js
var 

// Get a product, with a given sku.
getProduct = function(sku) {
    var xhr = new XMLHttpRequest(), url,
        
    // Request was successful, display retrieved data.
    success = function () {
        // Parse JSON array.
        var product_group = JSON.parse(xhr.responseText),
            updateButton = document.getElementById("update-product-button"),
            title = document.getElementById("single-title"),
            content = document.getElementById("single-content"),
            price = document.getElementById("single-price"),
            sale = document.getElementById("single-sale"),
            colour = document.getElementById("single-colour"),
            thumbnail = document.getElementById("single-thumbnail"),
            thumbnailPreview = document.getElementById('single-thumbnail-preview'),
            valuesStocks = document.getElementById("values-and-stocks"),
            valueInputs = document.getElementsByClassName("single-values"),
            stockInputs = document.getElementsByClassName("single-stocks"),
            status = document.getElementById("single-status"),
            postDate = document.getElementById("date-posted"),
            categoryRadio = document.getElementsByClassName("category-radio"),
            categoryRadioArray;

        // Hide loader.
        loader(false);
        // If API returns error.
        if(product_group.error.thrown) {
            showMessage(product_group.error.message, "error");
        } else { // Otherwise.
            // Set variables as information from request.
            title.value = product_group.title;
            content.innerHTML = product_group.content;
            price.value = product_group.price;
            // Leave blank if not set.
            console.log(sale.value);
            if(sale.value !== '')
                sale.value = product_group.sale_price;
            colour.value = product_group.colour;

            thumbnailPreview.innerHTML = '<img src="../'+product_group.thumbnail+'" alt="'+product_group.title+'" />';

            // loop through all products.
            for(var i in product_group.product) {
                valuesStocks.innerHTML += '<input type="text" class="single-values" placeholder="Size" />';
                valuesStocks.innerHTML += '<input type="text" class="single-stocks" placeholder="Stock" />';
            }
            for(var i in product_group.product) {
                product = product_group.product[i];
                valueInputs[i].value = product.value;
                stockInputs[i].value = product.stock;
            }
            // Set the option that should be selected.
            if(product_group.post_status === 'publish') {
                status.selectedIndex = 0;
            } else if(product_group.post_status === 'draft') {
                status.selectedIndex = 1;
            } else if(product_group.post_status === 'trash') {
                status.selectedIndex = 2;
            }
            // Timeout set here to fix bug of loading radio buttons
            // once they are set on the DOM.
            timeout = setTimeout(function() {
                for(var i=0, len=categoryRadio.length; i<len; i++) {
                    if(categoryRadio[i].dataset.id == product_group.categoryID) {
                        categoryRadio[i].checked = true;
                    }
                }
            }, 50);
            // Set date to the date original product was created.
            postDate.innerHTML = 'Date created: <em>' + product_group.post_date + '</em>';
            // Update the data-sku for the update button to reflect
            // the current product.
            updateButton.dataset.sku = product_group.sku;
            // Add event listeners to new elements.
            addEventListeners('update-product');
        }
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
    url = '../api/v.1/search/single-result.php?table=product_group&id='+sku;
    // Open & send the request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
},

// Call to add product.
addProduct = function () {
    var url, param, xhr = new XMLHttpRequest(),
        valuesArray = [], stocksArray = [],
        values, stocks, categoryId, thumbnail,
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        colour = document.getElementById("single-colour").value,
        thumbnailElem = document.getElementById("single-thumbnail"),
        valueInputs = document.getElementsByClassName("single-values"),
        stockInputs = document.getElementsByClassName("single-stocks"),
        statusList = document.getElementById("single-status"),
        statusValue = statusList.options[statusList.selectedIndex].value,
        categoryRadio = document.getElementsByClassName("category-radio"),

    // Request successful, display response.
    success = function () {
        var response = JSON.parse(xhr.responseText),
            addProductButton = document.getElementById("add-product-button");
        // Hide loader.
        loader(false);
        // if error thrown.
        if(response.error.thrown) {
            // Show message of update failure.
            showMessage(response.report.status, "error");
        } else {
            // Show message of update success.
            showMessage(response.report.status, "success");
            // 
            addProductButton.href = addProductButton.href + response.report.inserted_id;
            history.pushState(null, null, addProductButton.href);
            loadPage(addProductButton.href);
        }
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
    // Show loader before request is sent.
    loader(true);

    // Get selected category.
    for(var i=0, len=categoryRadio.length; i<len; i++) {
        if(categoryRadio[i].checked) {
            categoryId = categoryRadio[i].dataset.id;
        }
    }
    // Populate stocks array with stocks from page
    for(var i=0, len=stockInputs.length; i<len; i++) {
        if(stockInputs[i].value != "") {
            valuesArray[i] = valueInputs[i].value;
            stocksArray[i] = stockInputs[i].value;
        }
    }
    // Stringify array ready for parameter.
    values = JSON.stringify(valuesArray);
    stocks = JSON.stringify(stocksArray);

    // Takes the file and posts it.
    thumbnail = thumbnailElem.files[0];
    // Request parameters.
    param = new FormData();
    param.append('title', title);
    param.append('content', content);
    param.append('price', price);
    param.append('sale', sale);
    param.append('colour', colour);
    param.append('thumbnail', thumbnail);
    param.append('values', values);
    param.append('stocks', stocks);
    param.append('status', statusValue);
    param.append('category_id', categoryId);

    // Set URL and parameters to be sent.
    url = '../api/v.1/add/product.php';

    // Open, set headers & post request.
    xhr.open("POST", url, true);
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},

// Call to update a product, with the given sku.
updateProduct = function (sku) {
    var url, param, xhr = new XMLHttpRequest(),
        valuesArray = [], stocksArray = [],
        values, stocks, categoryId, thumbnail,
        title = document.getElementById("single-title").value,
        content = document.getElementById("single-content").value,
        price = document.getElementById("single-price").value,
        sale = document.getElementById("single-sale").value,
        colour = document.getElementById("single-colour").value,
        thumbnailElem = document.getElementById("single-thumbnail"),
        valueInputs = document.getElementsByClassName("single-values"),
        stockInputs = document.getElementsByClassName("single-stocks"),
        statusList = document.getElementById("single-status"),
        statusValue = statusList.options[statusList.selectedIndex].value,
        categoryRadio = document.getElementsByClassName("category-radio");

    // Request was successful, fill content.
    success = function () {
        // The retrieved data.
        var response = JSON.parse(xhr.responseText);
        // Hide the loader.
        loader(false);
        // if error thrown.
        if(response.error.thrown) {
            // Show message of update failure.
            showMessage(response.report.status, "error");
        } else {
            // Show message of update success.
            showMessage(response.report.status, "success");
        }

        loadPage(document.URL);
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

    // Get selected category.
    for(var i=0, len=categoryRadio.length; i<len; i++) {
        if(categoryRadio[i].checked) {
            categoryId = categoryRadio[i].dataset.id;
        }
    }

    // Populate values array with values from document.
    for(var i=0, len=stockInputs.length; i<len; i++) {
        // Because stock is required, check it isn't empty.
        if(stockInputs[i].value != "") {
            valuesArray[i] = valueInputs[i].value;
            stocksArray[i] = stockInputs[i].value;
        }
    }
    // Stringify array to send in parameter.
    values = JSON.stringify(valuesArray);
    stocks = JSON.stringify(stocksArray);

    // Takes the file and posts it.
    thumbnail = thumbnailElem.files[0];
    // Request parameters.
    param = new FormData();
    param.append('sku', sku);
    param.append('title', title);
    param.append('content', content);
    param.append('price', price);
    param.append('sale', sale);
    param.append('colour', colour);
    param.append('thumbnail', thumbnail);
    param.append('values', values);
    param.append('stocks', stocks);
    param.append('status', statusValue);
    param.append('category_id', categoryId);

    // Request url.
    url = '../api/v.1/edit/product.php';
    
    // Open, set header & post request.
    xhr.open("POST", url, true);
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},
// Quick update the status of a specific product.
updateProductStatus = function (elem) {
    var url = '../api/v.1/edit/product-status.php',
        param = 'sku='+elem.dataset.sku+'&status='+elem.options[elem.selectedIndex].value,
        xhr = new XMLHttpRequest(),
    // If the request is successful.
    success = function () {
        // Response from the request.
        var response = JSON.parse(xhr.responseText);
        // Hide loader as request was successful.
        loader(false);
        // Display a message to the user signalling update
        // was successful.
        showMessage(response.report.status, "success");
        // Reload the page to update the list.
        loadPage(document.URL);
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
    // Show loader before request is sent.
    loader(true);
    // Open, set header & post request.
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},

// Display products and pagination.
showProducts = function (status, pageNo, perPage) {
    // Load the paginaton for the products to be displayed.
    showProductPagination(status, pageNo, perPage);
    // Now, load the list of products.
    showProductList(status, pageNo, perPage);
},
// Show product pagination.
showProductPagination = function (status, pageNo, perPage) {
    var pageNo = parseInt(pageNo),
        url = '../api/v.1/view/count.php';
        url += '?show=product_group&status='+status;
        xhr = new XMLHttpRequest(),

    // If the request is successful.
    success = function () {
        var response = JSON.parse(xhr.responseText),
            pagNav = '', filter = '',
            ul = document.getElementById('pagination'),
            pages = Math.ceil(response.count / perPage);

        // Request complete, hide loader.
        loader(false);

        // Set the filter, (if any).
        if(status !== 'not-trash')
            filter = '&filter='+status;
        // If page number is 1, do NOT apply anchors to first 2 elements.
        if (pageNo === 1) {
            pagNav += '<li class="pagItemInactive">&laquo;</li>';
            pagNav += '<li class="pagItemInactive">&#139;</li>';
        } else {
            pagNav += '<li><a href="products/page=1'+filter+'" class="pagItem" data-pageNo="1" data-perPage="'+perPage+'">&laquo;</a></li>';
            pagNav += '<li><a href="products/page='+(pageNo-1)+filter+'" class="pagItem" data-pageNo="'+(pageNo-1)+'" data-perPage="'+perPage+'">&#139;</a></li>';
        }
        // Loop through pages, adding numeric anchors.
        for(var i=0; i<pages; i++) {
            var currentPage = (i+1), active = '';
            // Set the current page classification.
            if (currentPage === pageNo)
                active = 'active';
            // Display ONLY 3 numbers before and after the current page.
            if (currentPage >= (pageNo-3) && currentPage <= pageNo || currentPage <= (pageNo+3) && currentPage >= pageNo)
                pagNav += '<li><a href="products/page='+currentPage+filter+'" class="pagItem '+active+'" data-pageNo="'+currentPage+'" data-perPage="'+perPage+'">' + currentPage + '</a></li>';
        }
        // If page last page, do NOT apply anchors to last 2 elements.
        if(pageNo === pages) {
            pagNav += '<li class="pagItemInactive">&#155;</li>';
            pagNav += '<li class="pagItemInactive">&raquo;</li>';
        } else {
            pagNav += '<li><a href="products/page='+(pageNo+1)+filter+'" class="pagItem" data-pageNo="'+(pageNo+1)+'" data-perPage="'+perPage+'">&#155;</a></li>';
            pagNav += '<li><a href="products/page='+pages+filter+'" class="pagItem" data-pageNo="'+pages+'" data-perPage="'+perPage+'">&raquo;</a></li>';
        }
        // Add the new list elements to the document.
        ul.innerHTML = pagNav;
        // Add event listeners for these newly added elements.
        addEventListeners('products-pagination');
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
    // Before request is sent, display loader.
    loader(true);
    // Open & send request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
},
// Show product list.
showProductList = function (status, pageNo, perPage) {
    var start = '', url, xhr = new XMLHttpRequest(),
    // On success, add request response to content.
    success = function () {
        var response = JSON.parse(xhr.responseText), li = '', colourString,
            content = document.getElementById("products_list"),
            publishOption, draftOption, trashOption, product_group;
        // If API returns error.
        if(response.error.thrown) {
            showMessage(response.error.message, "error");
        } else {
            li += '<li class="product-list thead">';
            li += '<div class="product-sku">Sku</div>';
            li += '<div class="product-title">Title</div>';
            li += '<div class="product-quantity">Quantity</div>';
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
                li += '<div class="product-title"><a href="product/'+product_group.sku+'" class="product-item" data-sku="' + product_group.sku + '">' + product_group.title + '</a>'+colourString+'</div>';
                li += '<div class="product-quantity"><ul>';
                for(i in product_group.product) {
                    var product = product_group.product[i],
                        lowClass = '';
                    if(product.stock<10)
                        lowClass = 'low';
                    li += '<li class="'+lowClass+'">'+ product.stock + ' <em>' + product.value + '</em></li>';
                }
                li += '</ul></div>';
                li += '<div class="product-post-status"><select class="products-status" data-sku="' + product_group.sku + '">';
                // Find which option should be selected.
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
                li += '<option value="publish" ' + publishOption + '>Publish</option>';
                li += '<option value="draft" ' + draftOption + '>Draft</option>';
                li += '<option value="trash"' + trashOption + '>Trash</option>';
                li += '</select></div>'
                li += '</li>';
            }
        }
        // Hide loader before content is filled.
        loader(false);
        // Fill content with new data.
        content.innerHTML = li;
        // Add event listeners for these newly added elements.
        addEventListeners('products-list');
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

    url = '../api/v.1/view/range.php';
    url += '?status='+status+'&start='+start+'&show='+perPage;

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};