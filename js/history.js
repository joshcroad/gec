var getPage, windowLoaded;

getPage = function(href_) {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        content = document.getElementById("content"),
        href = getPageString(href_);

        url = "./"+href+".html";

    success = function() {
        var obj = xhr.responseText;
        content.innerHTML = obj;

        addDynamicContent();
    };

    stateChanged = function() {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found"); break;
                case 500:
                    failed("500 Internal Server Error"); break;
                default:
                    failed("Unknown Reason"); break;
            }
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
};

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