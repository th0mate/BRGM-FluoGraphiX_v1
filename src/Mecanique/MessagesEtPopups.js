/**
 * Ce fichier JavaScript contient toutes les fonctions pour l'affichage et la destruction des messages flash et popups
 */


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * MESSAGES FLASH
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Fonction qui crée un message flash
 * @param message{string} : le message à afficher
 * @param type{string} : le type de message (success, danger, warning, info)
 * @returns {HTMLDivElement} : le message flash
 */
function creerMessageFlash(message, type) {
    var div = document.createElement('div');
    div.className = 'alert alert-' + type;
    var img = document.createElement('img');
    img.src = 'Ressources/img/' + type + '.png';
    img.alt = type;
    var txt = document.createElement('p');
    txt.innerHTML = message;
    div.appendChild(img);
    div.appendChild(txt);
    div.id = 'flash';
    div.style.top = '-100px';

    return div;
}

/**
 * Fonction qui affiche un message flash
 * @param message{string} : le message à afficher
 * @param type{string} : le type de message (success, danger, warning, info)
 */
function afficherMessageFlash(message, type) {
    if (document.getElementById('flash')) {
        setTimeout(() => afficherMessageFlash(message, type), 200);
    } else {
        var flash = creerMessageFlash(message, type);
        document.body.appendChild(flash);

        setTimeout(() => animateDown(flash), 100);
        flash.addEventListener('click', () => {
            animateUp(flash);
        });
    }
}


/**
 * Crée une animation pour l'affichage de messages flash
 * @param element{element} : l'élément à animer
 */
function animateDown(element) {
    element.style.transition = 'top 1s ease-in-out';
    element.style.top = '50px';
    setTimeout(() => {
        animateUp(element);
    }, 3500);
}

/**
 * Crée une animation pour la disparition de messages flash
 * @param element{element} : l'élément à animer
 */
function animateUp(element) {
    element.style.top = '-100px';
    setTimeout(() => {
        element.remove();
    }, 1000);
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * POPUPS
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * Affiche un popup avec les éléments correspondants
 * @param imageHTML{string} : le code HTML de l'image à afficher
 * @param titre{string} : le titre du popup en format texte
 * @param contenu{string} : le contenu du popup en format texte
 * @param boutonsHTML{string} : le code HTML des boutons à afficher
 * @returns {string} : le code HTML du popup
 */
function afficherPopup(imageHTML, titre, contenu, boutonsHTML) {
    fermerPopup();

    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.classList.add('overlayPetit');
    document.body.appendChild(overlay);

    document.body.style.overflowY = 'hidden';


    let popupHTML = "";
    popupHTML += `<div class='popup'><div class="entete"><img src="Ressources/img/close.png" class="close" onclick="fermerPopup()" alt="fermer"></div> ${imageHTML}<h2>${titre}</h2><h4>${contenu}</h4><div class="conteneurBoutons">${boutonsHTML}</div></div>`;
    overlay.innerHTML += popupHTML;
}

/**
 * Ferme le popup
 */
function fermerPopup() {
    if (document.querySelector('.popup') !== null) {
        document.querySelector('.popup').remove();
    }
    if (document.querySelector('.overlayPetit') !== null) {
        document.querySelector('.overlayPetit').remove();
    }

    document.body.style.overflow = 'auto';
}