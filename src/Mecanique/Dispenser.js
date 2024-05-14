/**
 * Gère le lien entre le HTML et le back
 * @type {boolean} si l'optimisation est activée ou non
 */


let isOptimise = false;
let contenuFichier = "";
let nbLignes = 0;
let premiereDate = "";
let contenuCalibrat = "";


/**
 * Traite le fichier sélectionné par l'utilisateur et redirige le contenu du fichier vers la fonction de traitement appropriée
 */
async function traiterFichier() {
    const inputFichier = document.getElementById('fileInput');
    let fichiers = Array.from(inputFichier.files);
    afficherPopup('<img class="loading" src="Ressources/img/loading.gif" alt="">', 'Veuillez Patienter', 'Traitement des données en cours - Veuillez patienter...', '' )


    if (fichiers.length > 1) {
        for (let i = 0; i < fichiers.length; i++) {
            if (fichiers[i].name === "Calibrat.dat") {
                const calibrat = fichiers[i];
                fichiers.splice(i, 1);
                fichiers.unshift(calibrat);
                break;
            }
        }
    }

    contenuFichier = "";
    contenuCalibrat = "";
    nbLignes = 0;
    document.querySelector('#selectFormatDate').disabled = false;
    let derniereDate;

    for (let i = 0; i < fichiers.length; i++) {
        const fichier = fichiers[i];
        derniereDate = getLastDate();

        if (fichier) {
            if (fichier.name.split('.').pop() === "xml") {
                const reader = new FileReader();
                reader.readAsText(fichier);
                await new Promise((resolve) => {
                    reader.onload = function () {
                        const xmlString = reader.result;
                        const mvContent = convertirXMLenMV(xmlString);
                        contenuFichier += mvContent;
                        resolve();
                    };
                });
            } else if (fichier.name.split('.').pop() === "txt") {
                await new Promise((resolve) => {
                    chargerTexteFichier(fichier, function (txtContent) {
                        if (txtContent !== '') {
                            const mvContent = convertirTexteenMV(txtContent);
                            contenuFichier += mvContent;
                            resolve();
                        } else {
                            afficherMessageFlash("Erreur de lecture fichier TXT : fichier invalide.", 'danger');
                        }
                    });
                });

            } else if (fichier.name.split('.').pop() === "mv") {
                await new Promise((resolve) => {
                    getStringDepuisFichierMV(fichier, function (mvContent) {
                        if (mvContent !== '') {
                            contenuFichier += mvContent;
                            resolve();
                        } else {
                            afficherMessageFlash("Erreur de lecture fichier MV : fichier invalide.", 'danger');
                        }
                    });
                });
            } else if (fichier.name.split('.').pop() === "dat") {
                const reader = new FileReader();
                reader.readAsText(fichier);
                await new Promise((resolve) => {
                    reader.onload = function () {
                        parametrerSiteDepuisCalibrat(reader.result);
                        contenuCalibrat = reader.result;
                        resolve();
                    };
                });
            } else if (fichier.name.split('.').pop() === "csv") {
                const reader = new FileReader();
                reader.readAsText(fichier);
                await new Promise((resolve) => {
                    reader.onload = function () {
                        if (reader.result.split('\n')[0].includes('FluoriGraphix')) {
                            reader.result = reader.result.split('\n').slice(2).join('\n');
                        }
                        contenuFichier += reader.result;
                        resolve();
                    };
                });
            } else {
                afficherMessageFlash("Erreur : type de fichier non pris en charge.", 'danger');
            }
        } else {
            afficherMessageFlash("Aucun fichier n'a été join.", 'warning');
        }
    }

    if (contenuFichier !== "") {
        if (estPlusDeUnJour(derniereDate, premiereDate)) {
            afficherMessageFlash("Trop grand écart entre les dates de fichiers : les données sont corrompues.", 'warning');
        } else {
            try {
                inputFichier.value = "";
                console.log(contenuFichier);
                afficherGraphique(contenuFichier);
                afficherMessageFlash("Données traitées avec succès.", 'success');
                document.querySelector('.downloadFile').style.display = 'block';
            } catch (e) {
                setTimeout(() => {
                    document.querySelector('.graphique').style.display = 'none';
                    contenuFichier = "";
                    inputFichier.value = "";
                    fichiers = [];
                    afficherPopup('<img src="Ressources/img/perteConnexion.png" alt="">', "Erreur lors de l'affichage des données", "Une erreur est survenue lors de l'affichage des données. Peut-être avez-vous mal configuré le format de date dans les paramètres ?", "<div class='bouton boutonFonce' onclick='fermerPopup()'>FERMER</div>");

                }, 500);
            }

        }
    } else if (contenuCalibrat !== "") {
        afficherMessageFlash("Fichier Calibrat.dat détecté. Redirection.", 'info');
        afficherVue('vueConcentrations');
        init();
    } else {
        afficherMessageFlash("Erreur : aucune donnée exploitable.", 'danger');
    }
    fermerPopup();
}


/**
 * Traite un fichier Calibrat.dat seul
 */
function traiterCalibrat() {
    const inputFichier = document.getElementById('calibratInput');
    let fichier = inputFichier.files[0];
    contenuCalibrat = "";
    if (fichier) {
        if (fichier.name.split('.').pop() === "dat"){
            const reader = new FileReader();
            reader.readAsText(fichier);
            reader.onload = function () {
                contenuCalibrat = reader.result;
                init();
                afficherMessageFlash("Fichier Calibrat.dat traité avec succès.", 'success');
            };
        } else if (fichier.name.split('.').pop() === "txt") {
            const reader = new FileReader();
            reader.readAsText(fichier);
            reader.onload = function () {
                contenuCalibrat = reader.result;
                init(false);
                afficherMessageFlash("Fichier Calibrat.dat traité avec succès.", 'success');
            };
        } else {
            afficherMessageFlash("Erreur : type de fichier non pris en charge.", 'danger')
        }
    } else {
        afficherMessageFlash("Aucun fichier n'a été join.", 'warning');
    }

}


/**
 * Réinitialise le zoom du graphique comme il était d'origine
 */
function resetZoom() {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.resetZoom();
        afficherMessageFlash("Zoom réinitialisé.", 'info');
    } else {
        afficherMessageFlash("Erreur : Aucun graphique à modifier.", 'warning');
    }
}


/**
 * Télécharge un fichier .txt contenant le contenu de la variable globale contenuFichier
 */
function telechargerFichier() {
    if (contenuFichier !== "") {
        const element = document.createElement('a');
        const file = new Blob([contenuFichier], {type: 'csv'});
        element.href = URL.createObjectURL(file);
        element.download = 'export-' + new Date().toLocaleString().replace(/\/|:|,|\s/g, '-') + '.csv';
        document.body.appendChild(element);
        element.click();
        afficherMessageFlash("Fichier téléchargé avec succès.", 'success');
    } else {
        afficherMessageFlash("Aucun fichier à télécharger : aucune donnée à exporter.", 'warning');
    }
}


/**
 * Permet de modifier le format de la date
 * 0 : dd/mm/yy-hh:mm:ss
 * 1 : dd/mm/yy-hh:mm:ss
 * 2 : yy/mm/dd-hh:mm:ss
 * @param cle la clé du format
 */
function modifierFormat(cle) {
    format = cle;
}


/**
 * Retourne la dernière date de contenuFichier
 */
function getLastDate() {
    if (contenuFichier !== "") {
        const lignes = contenuFichier.split('\n');
        const lastLine = lignes[lignes.length - 2];
        return lastLine.substring(6, 26);
    }
    return "";
}


/**
 * Retourne true si la différence entre deux dates est supérieure à 1 jour
 * @param date1 la première date au format dd/mm/yy-hh:mm:ss
 * @param date2 la deuxième date au format dd/mm/yy-hh:mm:ss
 */
function estPlusDeUnJour(date1, date2) {
    if (date1 === "" || date2 === "") {
        return false;
    }

    const date1Parts = date1.split('/');
    const date2Parts = date2.split('/');

    const date1Day = parseInt(date1Parts[0]);
    const date2Day = parseInt(date2Parts[0]);

    const date1Month = parseInt(date1Parts[1]);
    const date2Month = parseInt(date2Parts[1]);

    const date1Year = parseInt(date1Parts[2].substring(0, 2));
    const date2Year = parseInt(date2Parts[2].substring(0, 2));

    if (date1Year !== date2Year) {
        return true;
    }

    if (date1Month !== date2Month) {
        return true;
    }

    return date2Day - date1Day > 9;
}

