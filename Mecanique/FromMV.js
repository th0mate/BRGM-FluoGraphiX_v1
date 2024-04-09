/**
 * Permet de lire le contenu d'un fichier MV et retourne le contenu du fichier en String
 * On refait tous les chiffres et nombres pour les aligner correctement
 * @param fichier le fichier à lire
 * @param callback la fonction à appeler une fois le fichier lu
 */
function getStringDepuisFichierMV(fichier, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        let lignes = e.target.result.split('\n');

        lignes.splice(0, 3);
        lignes.pop();

        let texteFinal = "";
        if (nbLignes === 0) {
            texteFinal = "                           GGUN-FL Fluorometer #453  -   Signals in mV\n";
            texteFinal += "                           -------------------------------------------\n";
            texteFinal += "    #  Time             R  Tracer 1  Tracer 2  Tracer 3 Turbidity  Baseline Battery V     T    Conductiv\n";
        }

        for (let i = 1; i < lignes.length; i++) {

            if (lignes[i].length < 3 || /^\s+$/.test(lignes[i]) || /^\t+$/.test(lignes[i])) {
                continue;
            }

            const colonnes = lignes[i].split(/\s+/);
            const timeValue = colonnes[2];
            const a145Value = colonnes[4];
            const a146Value = colonnes[5];
            const a147Value = colonnes[6];
            const a148Value = colonnes[7];
            const a144Value = colonnes[8];

            texteFinal += ` ${setEspaces((nbLignes + i), 4)} ${getTimeFromMV(timeValue)} 0 ${setEspaces(around(a145Value), 7)}    ${setEspaces(around(a146Value), 6)}    ${setEspaces(around(a147Value), 6)}    ${setEspaces(around(a148Value), 6)}    ${setEspaces(around(a144Value), 6)}     13.20     10.63     0.000\n`;

        }

        nbLignes += lignes.length - 1;

        callback(texteFinal);
    };
    reader.readAsText(fichier);
}

