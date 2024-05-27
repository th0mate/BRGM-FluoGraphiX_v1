/**
 * Crée un cookie avec le nom "page" et la valeur passée en paramètre si aucun cookie avec le nom "page" n'existe
 * Sinon, on modifie la valeur du cookie "page" par la valeur passée en paramètre
 */
function creerCookieOuStockageLocal(nomPage) {
    if (window.location.protocol !== "file:") {
        if (!cookieExists()) {
            document.cookie = "page=" + nomPage;
        } else {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith("page=")) {
                    document.cookie = "page=" + nomPage;
                    return;
                }
            }
        }
    } else {
        localStorage.setItem('page', nomPage);
    }
}


/**
 * Récupère la valeur du cookie "page" s'il existe
 * @returns {string} la valeur du cookie "page"
 * @returns {null} si le cookie n'existe pas
 */
function getCookie() {
    if (window.location.protocol !== "file:") {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith("page=")) {
                return cookie.split('=')[1];
            }
        }
    } else {
        return localStorage.getItem('page');
    }
    return null;
}

/**
 * Retourne true si un cookie avec le nom "session" existe, false sinon
 * @returns {boolean} la valeur correspondante
 */
function cookieExists() {
    if (window.location.protocol !== "file:") {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith("page=")) {
                return true;
            }
        }
    } else {
        return localStorage.getItem('page') !== null;
    }
    return false;
}
