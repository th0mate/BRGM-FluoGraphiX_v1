/**
 * Affiche les paramètres supplémentaires pour la visualisation des parasites sous la forme d'un popup
 */
function afficherParametresParasites() {
    if (contenuFichier !== '') {
        fermerPopupParametres();
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        document.body.style.overflowY = 'hidden';

        let message = '';

        if (contenuCalibrat === '') {
            message = '<span class="calibratAbsent"><img src="Ressources/img/attentionOrange.png" alt="Perte de connexion">Aucun fichier de calibration n\'a été importé. <input type="file" id="inputCalibrat" accept=".dat,.csv" onchange="initParasites()"></span>';
        }


        let popupHTML = "";
        popupHTML += `
    <div class='grandPopup'>
        <div class="entete">
            <h2>Paramètres supplémentaires</h2>
            <img src="Ressources/img/close.png" class="close" onclick="fermerPopupParametres()" alt="fermer">
        </div>
        ${message}
        <div class="ongletsParam">
            <div class="bouton boutonFonce">Renommer les courbes</div>
            <div class="bouton boutonFonce">Corriger la turbidité</div>
            <div class="bouton boutonFonce">Convertir en concentrations</div>
        </div>
        
        <div class="conteneurBoutons"><div class="boutonFonce bouton">TERMINER</div></div>
    </div>`;
        overlay.innerHTML += popupHTML;
    }
}


/**
 * Ferme le popup des paramètres
 */
function fermerPopupParametres() {
    if (document.querySelector('.grandPopup') !== null) {
        document.querySelector('.grandPopup').remove();
        document.body.style.overflow = 'auto';
    }
    if (document.querySelector('div[style*="z-index: 1000"]') !== null) {
        document.querySelector('div[style*="z-index: 1000"]').remove();
    }
}


/**
 * Lit le fichier de calibration et initialise les données, sans afficher les tableaux et les courbes de la partie calibration
 */
function initParasites() {
    const inputFichier = document.getElementById('inputCalibrat');
    const reader = new FileReader();
    reader.readAsText(inputFichier.files[0]);

    let estFichierDat = false;

    if (inputFichier.files[0].name.split('.').pop() === "dat") {
        estFichierDat = true;
    }

    reader.onload = function () {
        contenuCalibrat = reader.result;
        init(estFichierDat, false);
        afficherMessageFlash("Fichier Calibrat.dat importé avec succès.", 'success');
        document.querySelector('.calibratAbsent').remove();
    };

}


/**
 * Tente de lier automatiquement les labels des courbes aux labels des lampes du fichier de calibration.
 */
function lierCalibratetGraphiqueAuto() {
    const lignes = contenuFichier.split('\n');
    const header = lignes[2].split(';').splice(2);
    let headerCalibrat = [];

    for (let i = 0; i < traceurs.length; i++) {
        const traceur = traceurs[i];

        if (traceur.lampePrincipale !== '') {
            headerCalibrat.push(traceur.lampePrincipale);
        }
    }

    let estIdentique = true;
    for (let i = 0; i < headerCalibrat.length; i++) {
        if (!header.includes(headerCalibrat[i])) {
            estIdentique = false;
        }
    }

    if (estIdentique) {
        //TODO
    } else {

    }
}


/**
 * Affiche l'onglet correspondant aux paramètres supplémentaires de visualisation
 * @param idOnglet ID de l'onglet à afficher
 * @param e Événement
 */
function afficherOngletParametre(idOnglet, e) {
    e.target.classList.add('active');

    const onglets = document.querySelectorAll('.ongletsParam div');
    for (let i = 0; i < onglets.length; i++) {
        onglets[i].style.display = 'none';
    }
    onglets[idOnglet].style.display = 'flex';
}