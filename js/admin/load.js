// load.js

// If browser understands the .addEventListener function.
if(window.addEventListener) {
    // Listen to when the window has loaded.
    window.addEventListener('load', function () {
        // Set event listeners to elements ALWAYS present
        var navigation = document.querySelectorAll('nav a');

        // Loop through all navigation links, adding the listener.
        for(var i=0, len=navigation.length; i<len; i++) {
            addListenerGetPage(navigation[i]);
        }
    }, false);

    // Listen to when popstate is fired.
    window.addEventListener('popstate', function () {
        // Retrieve the page to be displayed.
        loadPage(document.URL);
    }, false);
}