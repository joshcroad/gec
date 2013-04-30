// Get list of categories and output them in a list.

var 

addCategory = function () {
    // Get values from inputs on document.
    var catName = document.getElementById("cat-name").value,
        catMenuOrder = document.getElementById("cat-menu-order").value,
        statusList = document.getElementById("cat-status"),
        statusValue = statusList.options[statusList.selectedIndex].value,
        url, xhr = new XMLHttpRequest(), param;

    success = function () {
        var response = JSON.parse(xhr.responseText);

        if(response.error.thrown) {
            // Show error message.
            showMessage(response.report.message, 'error');
        } else {
            // Show success message.
            showMessage(response.report.message, 'success');
            // Reload any changes.
            loadPage(document.URL);
        }
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
    };

    url = '../api/v.1/add/category.php';
    param = 'name='+catName+'&menu_order='+catMenuOrder+'&status='+statusValue;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
}

// Quick update the status of a specific category.
updateCategoryStatus = function (elem) {
    var url = '../api/v.1/edit/category-status.php',
        param = 'id='+elem.dataset.id+'&status='+elem.options[elem.selectedIndex].value,
        xhr = new XMLHttpRequest();
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
    loader(true);
    // Open, set header & post request.
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(param);
    xhr.onreadystatechange = stateChanged;
},

getCategories = function () {
    var url, xhr = new XMLHttpRequest(),

    success = function () {
        var response = JSON.parse(xhr.responseText), li = '',
            content = document.getElementById("single-category-list");

        if(response.error.thrown) {
            content.innerHTML = response.report.message;
        } else {
            // Loop through each result.
            for(i in response.category) {
                category = response.category[i],
                // Set up table body.
                li += '<li class="category-list-item">';
                li += '<div class="category_radio_div"><input type="radio" name="category-radio" class="category-radio" data-id="'+category.id+'"" /></div>';
                li += '<div class="category-menu-order">' + category.menu_order + '</div>';
                li += '<div class="category-name">' + category.name + '</div>';
                li += '</li>';
            }
        }
        // Fill content with new data.
        content.innerHTML = li;
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
    url = '../api/v.1/view/categories.php?status=publish';

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

showCategoryList = function (status) {
    var url, xhr = new XMLHttpRequest(),

    success = function () {
        var response = JSON.parse(xhr.responseText), li = '',
            category, publishOption, draftOption, trashOption,
            content = document.getElementById("category-list");

        if(response.error.thrown) {
            showMessage(response.error.message, 'error');
        } else {
            li += '<li class="category-list thead">';
            li += '<div class="category-id">ID</div>';
            li += '<div class="category-name">Name</div>';
            li += '<div class="category-menu-order">Menu Order</div>';
            li += '<div class="category-post-status">Status</div>';
            li += '</li>';
            // Loop through each result.
            for(i in response.category) {
                category = response.category[i],
                publishOption = ""; draftOption = ""; trashOption = "";
                // Set up table body.
                li += '<li class="category-list">';
                li += '<div class="category-id">' + category.id + '</div>';
                li += '<div class="category-name">' + category.name + '</div>';
                li += '<div class="category-menu-order">' + category.menu_order + '</div>';
                li += '<div class="category-post-status"><select class="category-status" data-id="' + category.id + '">';
                // Find which option should be selected.
                switch(category.post_status) {
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
        addEventListeners('categories');
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
    // Display loader will request is sent and retrieved.
    loader(true);
    url = '../api/v.1/view/categories.php?status='+status;

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}