function truncateDbTables() {
    var success, stateChanged, url,
        xhr = new XMLHttpRequest(),
        message = document.getElementById('message'),

    success = function() {
        var product = JSON.parse(xhr.responseText);

        if(product.error.thrown) { // If API returns error.
            failed(product.error.message);
        } else { // Otherwise.
            message.innerHTML = product.status;
        }
    },

    stateChanged = function() {
        if(xhr.readyState === 4) {
            switch(xhr.status) {
                case 200:
                    success(); break;
                default:
                    failed("Status "+xhr.status+" returned."); break;
            }
        }
    };

    url = '../api/v.1/admin/delete/empty.db.php';

    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = stateChanged;
}



