var getPage, winLoaded;

getPage = function(href) {
    var success, failed, stateChanged,
        url = "./template/"+href.split("/").pop()+".html",
        xhr = new XMLHttpRequest(),
        content = document.getElementById("content");

    success = function () {
        var obj = xhr.responseText;
        content.innerHTML = obj;
        if(href.split("/").pop() === 'products') {
            showProducts(1, 20);
        }
    };

    stateChanged = function () {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200:
                    success(); break;
                case 404:
                    failed("404 Not found"); break;
                case 403:
                    failed("403 Forbidden"); break;
                case 304:
                    failed("304 Not modified"); break;
                case 0:
                    failed("Successful, however 0 returned"); break;
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
    var a = document.getElementsByClassName("nav");

    function addLink(link) {
        link.addEventListener("click", function(e) {
            history.pushState(null, null, link.href);
            getPage(link.href);
            e.preventDefault();
        }, false);
    }

    for(var i=0, len=a.length; i<len; i++) {
        addLink(a[i]);
    }
};

if(window.addEventListener) {
    window.addEventListener("load", windowLoaded, false);

    window.addEventListener("popstate", function() {
        var href = document.location.href.split("/").pop();
        if(!href || 0 === href.length)
            href = 'home';
        getPage(href);
    });
}