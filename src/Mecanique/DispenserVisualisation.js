/**
 * Ce fichier JavaScript permet de distribuer les données importées depuis un fichier de mesures vers les différentes fonctions de traitement, en fonction du type de fichier
 * Distribue également les données vers la partie "visualisation" ou "calibration" en fonction de leur contenu
 */


/**
 * Contenu du fichier importé par l'utilisateur
 * @type {string} le contenu du fichier
 */
let contenuFichierMesures = "";

/**
 * Le contenu du ou des fichiers de mesure initial
 * @type {string} le contenu du fichier
 */
let contenuMesuresInitial = "";

/**
 * Le nombre de lignes total du fichier importé par l'utilisateur
 * @type {number} le nombre de lignes
 */
let nbLignes = 0;

/**
 * La date de la première ligne du fichier importé par l'utilisateur
 * @type {string} la date de la première ligne
 */
let premiereDate = "";

/**
 * Le contenu du fichier de calibration importé par l'utilisateur
 * @type {string}
 */
let contenuFichierCalibration = "";

/**
 * Une liste contenant toutes les coubes supprimées par l'utilisateur
 */
let courbesSupprimees = [];


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * DISTRIBUTION DES DONNEES VERS LES FONCTIONS APPROPRIEES
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Traite le fichier sélectionné par l'utilisateur et redirige le contenu du fichier vers la fonction de traitement appropriée
 */
async function traiterFichier() {
    traceurs = [];
    listeCalculs = [];
    const inputFichier = document.getElementById('fileInput');
    let fichiers = Array.from(inputFichier.files);
    afficherPopup('<img class="loading" src="Ressources/img/loading.gif" alt="">', 'Veuillez Patienter', 'Traitement des données en cours - Veuillez patienter...', '')


    if (fichiers.length > 1) {
        for (let i = 0; i < fichiers.length; i++) {
            if ((fichiers[i].name.split('.').pop() === "dat") || (fichiers[i].name.split('.').pop() === "csv" && fichiers[i].name.split('\n')[0].includes('Appareil'))) {
                const calibrat = fichiers[i];
                fichiers.splice(i, 1);
                fichiers.unshift(calibrat);
                break;
            }
        }
    }

    contenuFichierMesures = "";
    contenuFichierCalibration = "";
    nbLignes = 0;
    courbesSupprimees = [];
    let derniereDate;

    let fichierCalibrationFormatDat = true;

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
                        contenuFichierMesures += mvContent;
                        resolve();
                    };
                });
            } else if (fichier.name.split('.').pop() === "txt") {
                await new Promise((resolve) => {
                    chargerTexteFichier(fichier, function (txtContent) {
                        if (txtContent !== '') {
                            const mvContent = convertirTexteenMV(txtContent);
                            contenuFichierMesures += mvContent;
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
                            contenuFichierMesures += mvContent;
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
                        contenuFichierCalibration = reader.result;
                        resolve();
                    };
                });
            } else if (fichier.name.split('.').pop() === "csv") {
                const reader = new FileReader();
                reader.readAsText(fichier);
                await new Promise((resolve) => {
                    reader.onload = function () {
                        if (reader.result.split('\n')[0].includes('FluoriGraphix') || reader.result.split('\n')[0].includes('FluoGraphiX')) {
                            reader.result = reader.result.split('\n').slice(2).join('\n');
                        }

                        if (!reader.result.split('\n')[0].includes('Appareil')) {
                            contenuFichierMesures += nettoyerFichierCSV(reader.result);
                        } else {
                            fichierCalibrationFormatDat = false;
                            contenuFichierCalibration = nettoyerFichierCSV(reader.result);
                        }
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

    if (contenuFichierMesures !== "") {
        if (estPlusDeUnJour(derniereDate, premiereDate)) {
            afficherMessageFlash("Trop grand écart entre les dates de fichiers : les données sont corrompues.", 'warning');
        } else {
            try {
                inputFichier.value = "";
                contenuFichierMesures = nettoyerFichierCSV(contenuFichierMesures);
                contenuMesuresInitial = contenuFichierMesures;
                afficherGraphique(contenuFichierMesures);
                afficherMessageFlash("Données traitées avec succès.", 'success');
            } catch (e) {
                setTimeout(() => {
                    document.querySelector('.graphique').style.display = 'none';
                    document.querySelector('.bandeauGraphiques').style.display = 'none';
                    contenuFichierMesures = "";
                    inputFichier.value = "";
                    fichiers = [];
                    afficherPopup('<img src="Ressources/img/perteConnexion.png" alt="">', "Erreur lors de l'affichage des données", "Une erreur est survenue lors de l'affichage des données. Peut-être avez-vous mal configuré le format de date dans les paramètres ?", "<div class='bouton boutonFonce' onclick='fermerPopup()'>FERMER</div>");
                    console.error(e);

                }, 500);
            }

        }
    } else if (contenuFichierCalibration !== "") {
        afficherMessageFlash("Fichier Calibrat.dat détecté. Redirection.", 'info');
        afficherVue('vueConcentrations');
        initFichierCalibration(fichierCalibrationFormatDat);
    } else {
        afficherMessageFlash("Erreur : aucune donnée exploitable.", 'danger');
    }
    fermerPopup();
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * TRAITEMENT DES FICHIERS DE CALIBRATION
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Traite un fichier Calibrat.dat seul
 */
function traiterCalibrat() {
    const inputFichier = document.getElementById('calibratInput');
    let fichier = inputFichier.files[0];
    contenuFichierCalibration = "";
    if (fichier) {
        if (fichier.name.split('.').pop() === "dat") {
            const reader = new FileReader();
            reader.readAsText(fichier);
            reader.onload = function () {
                contenuFichierCalibration = reader.result;
                initFichierCalibration(true);
                afficherMessageFlash("Fichier Calibrat.dat traité avec succès.", 'success');
            };
        } else if (fichier.name.split('.').pop() === "csv") {
            const reader = new FileReader();
            reader.readAsText(fichier);
            reader.onload = function () {
                contenuFichierCalibration = nettoyerFichierCSV(reader.result);
                initFichierCalibration(false);
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
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS UTILITAIRES
 * ---------------------------------------------------------------------------------------------------------------------
 */


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
 * Permet de modifier le format de la date
 * 0 : dd/mm/yy-hh:mm:ss
 * 1 : dd/mm/yy-hh:mm:ss
 * 2 : yy/mm/dd-hh:mm:ss
 * @param cle la clé du format
 */
function modifierFormat(cle) {

    format = cle;

    if (cle === '0' && document.querySelector('#auto').classList.contains('disabled')) {
        return;
    }

    if (!document.querySelector('#auto')) {
        return;
    }

    if (document.querySelector('#amj').classList.contains('active')) {
        document.querySelector('#amj').classList.remove('active');
    }

    if (document.querySelector('#jma').classList.contains('active')) {
        document.querySelector('#jma').classList.remove('active');
    }

    if (document.querySelector('#auto').classList.contains('active')) {
        document.querySelector('#auto').classList.remove('active');
    }

    if (cle === '1') {
        document.querySelector('#jma').classList.add('active');
    } else if (cle === '2') {
        document.querySelector('#amj').classList.add('active');
    } else {
        document.querySelector('#auto').classList.add('active');

    }
}


/**
 * Retourne la dernière date de contenuFichier
 */
function getLastDate() {
    if (contenuFichierMesures !== "") {
        const lignes = contenuFichierMesures.split('\n');
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

    let date1Year;
    let date2Year;

    try {
        date1Year = parseInt(date1Parts[2].substring(0, 2));
        date2Year = parseInt(date2Parts[2].substring(0, 2));
    } catch (e) {
        console.warn("Erreur lors de la vérification de dates initiale  - cette erreur ne bloque pas la suite du processus.");
        return false;
    }

    if (date1Year !== date2Year) {
        return true;
    }

    if (date1Month !== date2Month) {
        return true;
    }

    return date2Day - date1Day > 9;
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * TELECHARGEMENT DU FICHIER CSV POUR EXPORT
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * En fonction des éventuels calculs effectués par l'utilisateur, affiche un pop-up permettant à l'utilisateur de choisir les données à exporter
 */
function preparerTelechargement() {
    if (listeCalculs.length > 0) {
        afficherPopup('<img src="Ressources/img/select.png" alt="Attention">', 'Choisissez les données à exporter', 'Vous avez effectué des calculs sur FluoGraphiX. Pour avoir la liste de ces calculs, ainsi que de leurs paramètres, sélectionnez l\'option correspondante. ', '<div class="bouton boutonFonce" onclick="telechargerFichier()">CSV uniquement</div><div class="bouton boutonFonce" onclick="telechargerFichierEtCalculs()">CSV + calculs</div>');

    } else {
        telechargerFichier();
        fermerPopup();
    }
}


/**
 * Lance le téléchargement du fichier CSV et du fichier TXT contenant les calculs en même temps
 */
function telechargerFichierEtCalculs() {
    setTimeout(() => {
        telechargerFichier();
    }, 500);
    telechargerCalculs();
    fermerPopup();
}


/**
 * Télécharge un fichier txt contenant la liste de tous les calculs et de leurs paramètres
 */
function telechargerCalculs() {
    let contenuCalculs = `FluoGraphiX - Données des calculs effectués le ${getDateAujourdhui()} \n`;
    contenuCalculs += "-------------------------------------------------------------------\n\n";
    listeCalculs.forEach(calcul => {
        contenuCalculs += calcul.toString();
    });

    const element = document.createElement('a');
    const universalBOM = "\uFEFF";
    const txt = universalBOM + contenuCalculs;
    element.setAttribute('href', 'data:text/txt;charset=utf-8,' + encodeURIComponent(txt));
    element.download = 'FluoGraphiX-ExportCalculs-' + new Date().toLocaleString().replace(/\/|:|,|\s/g, '-') + '.txt';
    document.body.appendChild(element);
    element.click();
}


/**
 * Télécharge un fichier .csv contenant le contenu de la variable globale contenuFichier
 */
function telechargerFichier() {
    if (contenuFichierMesures !== "") {
        fermerPopup();

        const lignes = contenuFichierMesures.split('\n');

        if (lignes[0].includes('FluoriGraphix') || lignes[0].includes('FluoGraphiX')) {
            contenuFichierMesures = lignes.slice(2).join('\n');
        }

        let temp = contenuFichierMesures;
        contenuFichierMesures = `                   FluoGraphiX - Export du ${getDateAujourdhui()}\n`;
        contenuFichierMesures += "                           -------------------------------------------\n";

        const nbColonnes = temp.split('\n')[0].split(';').length;
        let ligne = temp.split('\n')[1];
        ligne = ligne.replace(/[\n\r]/g, '');
        const colonnes = ligne.split(';');
        colonnes.splice(nbColonnes, colonnes.length - nbColonnes);
        ligne = colonnes.join(';');
        ligne += '\n';

        contenuFichierMesures += temp.split('\n')[0] + '\n';
        contenuFichierMesures += ligne;
        contenuFichierMesures += temp.split('\n').slice(2).join('\n');

        const lignesFichier = contenuFichierMesures.split('\n');
        const header = lignesFichier[2].split(';');

        // Récupérer les indices des colonnes à supprimer
        const indicesASupprimer = courbesSupprimees
            .map(courbe => header.indexOf(courbe))
            .filter(index => index !== -1);

        // Supprimer les colonnes dans l'ordre inverse
        indicesASupprimer.sort((a, b) => b - a);
        indicesASupprimer.forEach(index => {
            lignesFichier.forEach((ligne, i) => {
                const colonnes = ligne.split(';');
                colonnes.splice(index, 1);
                lignesFichier[i] = colonnes.join(';');
            });
        });

        contenuFichierMesures = lignesFichier.join('\n');

        const element = document.createElement('a');
        const universalBOM = "\uFEFF";
        const csv = universalBOM + contenuFichierMesures;
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.download = 'FluoGraphiX-ExportDonnees-' + new Date().toLocaleString().replace(/\/|:|,|\s/g, '-') + '.csv';
        document.body.appendChild(element);
        element.click();
        afficherMessageFlash("Fichier téléchargé avec succès.", 'success');
    } else {
        afficherMessageFlash("Aucun fichier à télécharger : aucune donnée à exporter.", 'warning');
    }
}


