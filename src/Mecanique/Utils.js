/**
 * Ce fichier JavaScript contient des fonctions utilitaires, utilisées dans tout le site.
 */


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

    if (double === '') {
        return '';
    }

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


/**
 * Est appelée lorsqu'un fichier CSV est chargé.
 * Permet de 'nettoyer' le fichier pour supprimer les points virgules superflus et remplacer les virgules par des points pour rendre les données lisibles en JS
 */
function nettoyerFichierCSV(contenuFichier) {
    let contenuCalibrat1 = contenuFichier.split('\n');
    for (let i = 0; i < contenuCalibrat1.length; i++) {
        contenuCalibrat1[i] = contenuCalibrat1[i].replace(/;{2,}/g, '');
        contenuCalibrat1[i] = contenuCalibrat1[i].replace(/,/g, '.');
        contenuCalibrat1[i] = contenuCalibrat1[i].trim();
        if (contenuCalibrat1[i].charAt(contenuCalibrat1[i].length - 1) === ';') {
            contenuCalibrat1[i] = contenuCalibrat1[i].substring(0, contenuCalibrat1[i].length - 1);
        }
    }

    return contenuCalibrat1.join('\n');
}


/**
 * Arrondi le chiffre passé en paramètre à 2 décimales
 * @param chiffre le chiffre à arrondir
 * @returns {number} le chiffre arrondi à 2 décimales
 */
function arrondirA2Decimales(chiffre) {
    return Math.round(chiffre * 100) / 100;
}


/**
 * Supprime les colonnes et l'en-tête du fichier CSV correspondant à un label d'en-tête donné
 * @param labelEnTete le label de l'en-tête à supprimer
 * @param lignes les lignes du fichier CSV
 */
function supprimerColonneParEnTete(labelEnTete, lignes) {
    let header = lignes[2].replace(/[\n\r]/g, '').split(';');
    if (header.includes(labelEnTete)) {
        for (let k = 3; k < lignes.length - 1; k++) {
            const colonnes = lignes[k].split(';');
            colonnes.splice(header.indexOf(labelEnTete), 1);
            lignes[k] = colonnes.join(';');
        }
    }

    return lignes;

}



