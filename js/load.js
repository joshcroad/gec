// load.js

// If browser understands the .addEventListener function
if(window.addEventListener) {
    // Listen to when the window has loaded.
    window.addEventListener('load', function () {
        init();
    }, false);

    // Listen to when popstate is fired
    window.addEventListener('popstate', function () {
        init();
    }, false);

    function init () {
        // Set event listeners to elements ALWAYS present
        var siteName = document.getElementById('site-name'),
            adminNavigation = document.querySelectorAll('nav a'),
            searchBox = document.getElementById('search-products'),
            basketItems = document.getElementById('basket-items'),
            basketValue = document.getElementById('basket-value'),
            basketLink = document.getElementById('basket-link'),
            navigation = document.getElementById('navigation'),
            totalPrice = 0.00;

        // Loop through all navigation links, adding the listener
        for(var i=0, len=adminNavigation.length; i<len; i++) {
            if(adminNavigation[i].id != 'site') {
                addListenerGetPage(adminNavigation[i]);
                loadPage(document.URL);
            }
        }

        // Add event listener for the search box
        if(searchBox) {
            searchBox.addEventListener('keydown', function (e) {
                if(e.keyCode === 13 && searchBox.value !== '') {
                    href = searchBox.baseURI+'search/q='+searchBox.value;
                    history.pushState(null, null, href);
                    loadPage(href);
                }
            }, false);
        }

        // Add event listener for when user views basket
        if(basketLink) {
            addListenerGetPage(basketLink);
            // Update the basket information in the header.
            updateBasketInformation();
        }

        // If the navigation.
        if(navigation) {
            getSiteTitle();
            getNavigation();
        }
    }
}