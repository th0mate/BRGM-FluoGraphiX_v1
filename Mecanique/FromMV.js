
/**
 * Permet de lire le contenu d'un fichier MV et retourne le contenu du fichier en String
 * On refait tous les chiffres et nombres pour les aligner correctement
 * @param fichier le fichier à lire
 * @param callback la fonction à appeler une fois le fichier lu
 */
function getStringDepuisFichierMV(fichier, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const lignes = e.target.result.split('\n');
        let mvContent = "";

        for (let i = 1; i < lignes.length; i++) {

            const colonnes = lignes[i].split(/\s+/);
            const timeValue = colonnes[2];
            const a145Value = colonnes[4];
            const a146Value = colonnes[5];
            const a147Value = colonnes[6];
            const a148Value = colonnes[7];
            const a144Value = colonnes[8];


            mvContent += ` ${setEspaces(i, 4)} ${timeValue} 0 ${setEspaces(around(a145Value), 7)}    ${setEspaces(around(a146Value), 6)}    ${setEspaces(around(a147Value), 6)}   ${setEspaces(around(a148Value), 6)}    ${setEspaces(around(a144Value), 6)}     13.20     10.63     0.000\n`;
        }

        callback(mvContent);
    };
    reader.readAsText(fichier);
}

