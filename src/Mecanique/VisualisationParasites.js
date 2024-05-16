/**
 * Affiche les paramètres supplémentaires pour la visualisation des parasites sous la forme d'un popup
 */
function afficherParametresParasites() {
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
        message = '<span><img src="Ressources/img/attentionOrange.png" alt="Perte de connexion">Aucun fichier de calibration n\'a été importé. <input type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple onchange="traiterFichier()"></span>';
    }


    let popupHTML = "";
    popupHTML += `
    <div class='grandPopup'>
        <div class="entete">
            <h2>Paramètres supplémentaires</h2>
            <img src="Ressources/img/close.png" class="close" onclick="fermerPopupParametres()" alt="fermer">
        </div>
        ${message}
        <h2>tt</h2><h4>tt</h4>
        <div class="conteneurBoutons"><div class="boutonFonce bouton">TERMINER</div></div>
    </div>`;
    overlay.innerHTML += popupHTML;
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