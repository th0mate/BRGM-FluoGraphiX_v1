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
        const colonnes = lignes[2].split(/\s+/).splice(4);

        let texteFinal = "";
        if (nbLignes === 0) {
            texteFinal = `                   FluoGraphiX - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
            texteFinal += "                           -------------------------------------------\n";

            texteFinal += getLabelsColonnes(colonnes).join(';') + "\n";
        }

        for (let i = 3; i < lignes.length; i++) {

            if (lignes[i].length < 3 || /^\s+$/.test(lignes[i]) || /^\t+$/.test(lignes[i])) {
                continue;
            }

            const colonnesLigne = lignes[i].split(/\s+/);
            const timeValue = colonnesLigne[2];

            if (i === 1) {
                premiereDate = getTimeFromMV(timeValue);
            }

            let ligne = `${getDateHeure(getTimeFromMV(timeValue))[0]};${getDateHeure(getTimeFromMV(timeValue))[1]}`;

            for (let i = 4; i < colonnesLigne.length; i++) {
                if (around(around(colonnesLigne[i]) !== '')) {
                    ligne += `;${around(colonnesLigne[i])}`;
                }
            }
            ligne += '\n';
            texteFinal += ligne;

        }

        nbLignes += lignes.length - 1;

        callback(texteFinal);
    };
    reader.readAsText(fichier);
}


/**
 * Retourne les labels des colonnes du fichier original
 */
function getLabelsColonnes(ligneColonne) {
    let labels = [];
    labels.push('Date');
    labels.push('Time');

    let label = '';
    for (let i = 0; i < ligneColonne.length; i++) {
        if (ligneColonne[i].length > 1) {
            if (label !== '') {
                labels.push(label);
            }
            label = ligneColonne[i];
        } else {
            if (ligneColonne[i] === 'T') {
                labels.push(label);
                label = 'Conductiv';
                labels.push('T[°C]');
            } else {
                label += ligneColonne[i];
            }
        }
    }

    return labels;
}
