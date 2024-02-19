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