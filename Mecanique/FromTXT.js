/**
 * Permet de charger un fichier texte et de le lire
 * @param fichier le fichier à charger
 * @param callback la fonction à appeler une fois le fichier chargé
 */
function chargerTexteFichier(fichier, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsText(fichier);
}

/**
 * Traite le fichier sélectionné par l'utilisateur
 * @returns {string} le contenu du fichier .mv
 */
function traiterFichierTexte() {
    const inputFichier = document.getElementById('textFileInput');
    const fichier = inputFichier.files[0];

    if (fichier) {
        chargerTexteFichier(fichier, function (contenuFichier) {
            const mvContent = convertirTexteenMV(contenuFichier);
            if (mvContent) {
                return mvContent;
            } else {
                console.error("Erreur lors du traitement du fichier texte.");
            }
        });
    } else {
        console.error("Aucun fichier sélectionné.");
    }
    return null;
}

/**
 * Convertit un fichier texte en fichier .mv pour le GGUN-FL Fluorometer #453
 * @param texte le contenu du fichier texte
 * @returns {string} le contenu du fichier .mv
 */
function convertirTexteenMV(texte) {
    const lignes = texte.split('\n');
    let mvContent = " GGUN-FL Fluorometer #453  -   Signals in mV\n";
    mvContent += "                           -------------------------------------------\n";
    mvContent += "    #  Time             R  Tracer 1  Tracer 2  Tracer 3 Turbidity  Baseline Battery V     T    Conductiv\n";

    for (let i = 1; i < lignes.length; i++) {
        const colonnes = lignes[i].split('\t');
        const timeValue = colonnes[0]/* + ' ' + colonnes[1]*/; // la colonne 1 contient un long nombre étrange
        const a145Value = colonnes[3];
        const a146Value = colonnes[4];
        const a147Value = colonnes[5];
        const a148Value = colonnes[6];
        const a144Value = colonnes[7];
        //Dans le fichier txt d'exemple fourni, les autres colonnes sont vides. Elles sont pas utilisées ici.


        if (getTime(timeValue) === "NaN/NaN/N-NaN:NaN:NaN") {
            continue;
        }

        mvContent += ` ${setEspaces(i, 4)} ${getTime(timeValue)} 0   ${setEspaces(around(a145Value), 5)}     ${setEspaces(around(a146Value), 5)}     ${setEspaces(around(a147Value), 5)}    ${setEspaces(around(a148Value), 5)}     ${setEspaces(around(a144Value), 5)}     13.20     10.63     0.000\n`;
    }

    return mvContent;
}