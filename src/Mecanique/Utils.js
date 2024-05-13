/**
 * Ajoute des espaces pour aligner les chiffres
 * @param n le nombre à aligner
 * @param e le nombre d'espaces à ajouter au maximum
 * @returns {string} le nombre aligné avec le bon nombre d'espaces
 */
function setEspaces(n, e) {
    let string = "";
    for (let i = 0; i < e - n.toString().length; i++) {
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
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString().substring(2, 4);
    let hour = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year}-${hour}:${minutes}:${seconds}`;
}


/**
 * Convertit une date au format dd/mm/yy-hh:mm:ss ou yy/mm/dd-hh:mm:ss en date au format dd/mm/yy-hh:mm:ss
 * format = 0 : le format donné est dd/mm/yy-hh:mm:ss
 * format = 1 : le format donné est dd/mm/yy-hh:mm:ss
 * format = 2 : le format donné est yy/mm/dd-hh:mm:ss
 * @param string la date à convertir
 */
function getTimeFromMV(string) {
    if (format.toString() === '0') {
        afficherMessageFlash("Erreur : La détection du format de date a échoué. Veuillez réessayer sans le fichier Calibrat.dat.", 'danger');
        throw new Error("Erreur : La détection du format de date a échoué. Veuillez réessayer sans le fichier Calibrat.dat.");
    } else if (format.toString() === '1') {
        return string;
    } else if (format.toString() === '2') {
        const date = string.substring(0, 8);
        const hour = string.substring(9, 17);
        return date.substring(6, 8) + "/" + date.substring(3, 5) + "/" + date.substring(0, 2) + "-" + hour;
    }
}

/**
 * Vérifie le nombre de décimales et ajoute des zéros si nécessaire pour avoir 2 décimales après la virgule en arrondissant
 * @param double le nombre à traiter
 * @returns {number|string} le nombre avec 2 décimales après la virgule
 */
function around(double) {
    if (double === 0.001) {
        return double;
    }
    const trait = Math.round(double * 100) / 100;
    const parts = trait.toString().split(".");

    if (trait.toString().length === 7) {
        return trait.toFixed(1);
    }
    if (trait.toString().length > 7) {
        return Math.round(trait);
    } else if (parts.length < 2 || parts[1].length < 2) {
        return trait.toFixed(2);
    } else {
        return trait;
    }
}

/**
 * Retourne la date d'aujourd'hui en toutes lettres en français
 * @returns {string} la date en question
 */
function getDateAujourdhui() {
    const date = new Date();
    const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()}`;
}


/**
 * Retourne un tableau contenant la date au format dd/mm/yyyy et l'heure au format hh:mm:ss depuis le format dd/mm/yyyy-hh:mm:ss
 */
function getDateHeure(date) {
    const dateHeure = date.split('-');
    return [dateHeure[0], dateHeure[1]];
}
