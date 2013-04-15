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

    if(filename === 'home') {
        url = './'+filename+'.php';
    } else {
        url = './category.php';
    }
    // Set url.
    
    // Open & send request.
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}

// Adding dynamic content and event listeners
function addDynamicContent () {
    // Frontend content.
}

// Ruturns the file to load, from a hypertext reference.
function getFilenameAsString (_href) {
    // Split and splice href, removing the host etc.
    var href = _href.split("/"), href = href.splice(4,4), filename;
    // href should now be a non-empty array.
    // Example: ["admin", "products", "page=1&filter=publish"]
    // Check admin area.
    if(href[0] === 'admin') {
        filename = href[1];
    }
    else {
        if(href[0] === 'home' || href[0] === '')
            filename = 'home';
        else
            filename = href[0];
    }
    if(filename === '')
        filename = 'home';
    console.log(filename);
    // Return the page.
    return filename;
}

// Returns the page number (if any), from a hypertext reference.
function getPageNumberAsString (_href) {
    // Split and splice href, removing the host, admin & page.
    var href = _href.split("/"), href = href.splice(6,6), pageNumber;
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
    var href = _href.split("/"), href = href.splice(6,6), filter = undefined,
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
    var href = _href.split("/"), href = href.splice(6,6), view = undefined,
        viewCriteria, _view;
    // If nothing is left.
    if(href.length < 1) {
        viewCriteria = 10;
    } else {
        view = href[0].split('&');
        for(var i in view) {
            _view = view[i].split('=');
            if(_view[0] === 'view')
                viewCriteria = _view[1];
        }
        if(viewCriteria === undefined)
            viewCriteria = 10;
    }
    // Return the view information.
    return viewCriteria;
}

// Function closure
// Adding a listener to an element (on click),
// to get a page.
function addListenerGetPage (elem) {
    elem.addEventListener('click', function (e) {
        console.log('load: ' + elem.href);
        history.pushState(null, null, elem.href);
        loadPage(elem.href);
        e.preventDefault();
    }, false);
}

// Display a message to the document.
function showMessage (message, classname) {
    // Get message element from document.
    var requestMessage = document.getElementById("request-message"), timeout;
    if(classname === undefined)
        classname = "success";
    // Set the classification of the message.
    requestMessage.setAttribute("class", classname);
    // Set the message.
    requestMessage.innerHTML = message;
    // Display the message.
    requestMessage.style.display = "block";
    // Reset the message after 3 seconds.
    timeout = setTimeout(function() {
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