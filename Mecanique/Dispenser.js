/**
 * Traite le fichier sélectionné par l'utilisateur
 */
function traiterFichierXML() {
    const inputFichier = document.getElementById('fileInput');
    const fichier = inputFichier.files[0];

    if (fichier) {

        if (fichier.name.split('.').pop() === "xml") {

            const reader = new FileReader();
            reader.readAsText(fichier);

            reader.onload = function () {
                const xmlString = reader.result;
                const mvContent = convertirXMLenMV(xmlString);
                console.log(mvContent);
            };
        } else if (fichier.name.split('.').pop() === "txt") {
            chargerTexteFichier(fichier, function (contenuFichier) {
                const mvContent = convertirTexteenMV(contenuFichier);
                if (mvContent) {
                    console.log(mvContent);
                } else {
                    console.error("Erreur lors du traitement du fichier texte.");
                }
            });
        }
        else {
            console.error("Ce type de fichier n'est pas pris en charge");
        }
    } else {
        console.error("Aucun fichier sélectionné.");
    }
}