windowLoaded = function() {
    var navLinks = document.querySelectorAll("nav a");

    function addLink(item) {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            history.pushState(null, null, item.href);
            getPage(item.href);
        })
    }

    for(var i=0, len=navLinks.length; i<len; i++) {
        addLink(navLinks[i]);
    }
};

if(window.addEventListener) {
    window.addEventListener("load", windowLoaded, false);

    window.addEventListener("popstate", function(e) {
       getPage(document.URL);
    }, false);
}