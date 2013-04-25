// load.js

// If browser understands the .addEventListener function.
if(window.addEventListener) {
    // Listen to when the window has loaded.
    window.addEventListener('load', function () {
        // Set event listeners to elements ALWAYS present
        var navigation = document.querySelectorAll('nav a'),
            searchBox = document.getElementById('search-products');

        // Loop through all navigation links, adding the listener.
        for(var i=0, len=navigation.length; i<len; i++) {
            addListenerGetPage(navigation[i]);
        }

        // Add event listener for the search box.
        searchBox.addEventListener('keydown', function (e) {
            if(e.keyCode === 13 && searchBox.value !== '') {
                href = searchBox.baseURI+'search/q='+searchBox.value;
                history.pushState(null, null, href);
                loadPage(href);
            }
        }, false);
    }, false);

    // Listen to when popstate is fired.
    window.addEventListener('popstate', function () {
        // Retrieve the page to be displayed.
        loadPage(document.URL);
    }, false);
}