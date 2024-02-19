
/**
 * Ajoute des espaces pour aligner les chiffres
 * @param n le nombre à aligner
 * @param e le nombre d'espaces à ajouter au maximum
 * @returns {string} le nombre aligné avec le bon nombre d'espaces
 */
function setEspaces(n, e) {
    let string = "";
    for (let i = 0; i < e-n.toString().length; i++) {
        string += " ";
    }
    return string + n;
}

/**
 * Convertit une date ISO en date et heure au format "dd/mm/yy-hh:mm:ss"
 * @param string la date ISO à convertir
 * @returns {string} la date et l'heure au format attendu
 */
function getTime(string) {
    let date = new Date(string);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().slice(2, 4);
    let hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds();
    return `${day}/${month}/${year}-${hour}:${minutes}:${seconds}`;
}

/**
 * Vérifie le nombre de décimales et ajoute des zéros si nécessaire pour avoir 2 décimales après la virgule en arrondissant
 * @param double le nombre à traiter
 * @returns {number|string} le nombre avec 2 décimales après la virgule
 */
function around(double) {
    const trait =  Math.round(double * 100) / 100;
    const parts = trait.toString().split(".");

    if (parts.length < 2 || parts[1].length < 2) {
        return trait.toFixed(2);
    }
    return trait;
}

