/**
 * Permet de lire le contenu d'un fichier MV et retourne le contenu du fichier en String
 * @param fichier le fichier à lire
 * @param callback la fonction à appeler une fois le fichier lu
 */
function getStringDepuisFichierMV(fichier, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsText(fichier);
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