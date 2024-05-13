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
 * Convertit un fichier texte en fichier .mv
 * @param texte le contenu du fichier texte
 * @returns {string} le contenu du fichier .mv
 */
function convertirTexteenMV(texte) {
    const lignes = texte.split('\n');

    let stringFinal = "";
    if (nbLignes === 0) {
        stringFinal = `                   FluoriGraphix - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        stringFinal += "                           -------------------------------------------\n";
    }

    const colonnes = lignes[0].split('\t');
    let header = "Date;Time";
    let indicesColonnesValides = [];
    for (let i = 0; i < colonnes.length; i++) {

        if (lignes[1].split('\t')[i] !== undefined && !isNaN(lignes[1].split('\t')[i]) && colonnes[i] !== 'Timestamp') {
            if (colonnes[i] === 'T [�C]') {
                header += `;T`;
            } else {
                header += `;${colonnes[i]}`;
            }
            indicesColonnesValides.push(i);
        }

    }

    indicesColonnesValides = indicesColonnesValides.filter(e => e !== 56);

    stringFinal += header + "\n";

    for (let i = 1; i < lignes.length; i++) {
        if (lignes[i].length < 3 || /^\s+$/.test(lignes[i]) || /^\t+$/.test(lignes[i])) {
            continue;
        }

        const colonnes = lignes[i].split('\t');
        const timeValue = lignes[i].substring(3, 32);

        if (getTime(timeValue) === "NaN/NaN/N-NaN:NaN:NaN") {
            problemes = true;
            continue;
        }

        if (i === 0) {
            premiereDate = getTime(timeValue);
        }

        let line = `${getDateHeure(getTime(timeValue))[0]};${getDateHeure(getTime(timeValue))[1]}`;

        for (let j = 0; j < indicesColonnesValides.length; j++) {
            line += `;${around(colonnes[indicesColonnesValides[j]])}`;

        }

        stringFinal += line + "\n";
    }

    if (problemes) {
        afficherMessageFlash('Certaines données sont corrompues : erreur de dates', 'warning');
    }

    return stringFinal;
}