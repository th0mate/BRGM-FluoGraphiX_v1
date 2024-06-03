/**
 * Ce fichier JavaScript contient toutes les fonctions pour gérer la navigation sur le site
 * C'est ici que sont gérées les redirections, les affichages de vues, les popups, etc.
 */


/**
 * Affiche une popup d'information
 */
if (window.location.protocol === "file:" && navigator.onLine) {
    setTimeout(() => {
        afficherPopup('<img src="Ressources/img/attention.png" alt="Attention">', 'Vous êtes connecté à internet et utilisez ce site en local', 'Pour obtenir de meilleures performances et une meilleure expérience utilisateur, il est recommandé d\'utiliser ce site via internet.', '<div class="bouton boutonFonce" onclick="ouvrirInternet()">Aller sur le site</div><div class="bouton boutonFonce" onclick="fermerPopup()">Continuer en local</div>\n');
    }, 3000);
}


/**
 * Affiche une popup d'information
 */
if (window.location.protocol !== "file:" && navigator.onLine) {
    //TODO : downloadSite
    const random = Math.floor(Math.random() * 15);
    if (random === 1) {
        setTimeout(() => {
            afficherPopup('<img src="Ressources/img/information.png" alt="info">', 'Le saviez vous ? Vous pouvez utiliser ce site hors-ligne !', 'Vous pouvez télécharger ce site et l\'utiliser normalement en local sur votre machine, et sans internet.', '<div class="bouton boutonFonce" onclick="fermerPopup()">Fermer</div>\n' +
                '<div class="bouton boutonFonce" onclick="afficherVue(`vueTelecharger`)">En Savoir Plus</div>');
        }, 3000);
    }
}


/**
 * Affiche la catégorie 'télécharger' si l'utilisateur est connecté à internet
 */
if (window.location.protocol !== "file:") {
    let parentElement = document.querySelector('.redirections');
    let middleIndex = Math.floor(parentElement.children.length / 2);
    let middleChild = parentElement.children[middleIndex];

    middleChild.insertAdjacentHTML('beforebegin', `<div onclick="afficherVue('vueTelecharger')" class="action">
            <img src="Ressources/img/dl.png" alt="aide">
            TÉLÉCHARGER
            <span></span>
        </div>`);

    let parentMenu = document.querySelector('.menu');
    let middleIndexMenu = Math.floor(parentMenu.children.length / 2);
    let middleChildMenu = parentMenu.children[middleIndexMenu];
    middleChildMenu.insertAdjacentHTML('beforebegin', `
        <div class="action" onclick="afficherVue('vueTelecharger')">
            <div>
                <img src="Ressources/img/dl.png" alt="aide">
                <h3>TÉLÉCHARGER</h3>
            </div>
            <img src="Ressources/img/droite.png" alt="flèche">
        </div>`);
}


/**
 * Affiche la catégorie 'télécharger' dans la page d'accueil si l'utilisateur est connecté à internet
 */
if (cookieExists()) {
    afficherVue(getCookie());
} else {
    afficherVue('vueAccueil');
}


/**
 * Ajoute des éléments spécifiques dans la page d'accueil
 */
function afficherDl() {
    if (navigator.onLine) {

        document.querySelector('.actionsRapides').innerHTML += `
                <div class="action" onclick="afficherVue('vueTelecharger')">
                    <img src="Ressources/img/dl.png" alt="icone">
                    <h3>Téléchargez la dernière version de FluoriGraphix sur votre ordinateur</h3>
                    <span></span>
                </div>`;
    } else {
        document.querySelector('.actionsRapides').innerHTML += `
                <a target="_blank" href="https://brgm.thomasloye.fr" class="action">
                    <img src="Ressources/img/dl.png" alt="icone">
                    <h3>Se rendre sur le site en ligne pour télécharger la dernière version de FluoriGraphix</h3>
                    <span></span>
                </a>`;
    }
}


/**
 * Redirige l'utilisateur vers le site en ligne
 */
function ouvrirInternet() {
    window.open('https://brgm.thomasloye.fr', '_blank');
}


/**
 * Affiche dans l'élément #contenu de ../index.html le contenu du fichier JS, don le nom est passé en paramètre, se trouvant dans src/vues
 * @param nomFichier{string} le nom du fichier à afficher
 */
function afficherVue(nomFichier) {

    if (!window[nomFichier]) {
        afficherVue('vueErreur');
        return;
    }

    fermerMenu();
    window.pageActuelle = nomFichier;
    creerCookieOuStockageLocal(nomFichier);
    document.querySelector('#contenu').innerHTML = window[nomFichier]();
    window.scrollTo(0, 0);
    if (nomFichier === 'vueAccueil') {
        afficherDl();
    }

    const element = document.querySelector(`[onclick="afficherVue('${nomFichier}')"]`);
    if (element) {
        element.classList.add('active');
        document.querySelectorAll('.active').forEach(e => {
            if (e !== element) {
                e.classList.remove('active');
            }
        })
    }
}


Object.defineProperty(window, 'pageActuelle', {
    get() {
        return pageActuelle;
    },
    set(value) {
        if (value === 'vueDocumentation') {
            setTimeout(() => {
                scrollDocumentation();
            }, 2000);
        }
    }
});


/**
 * Affiche l'explorateur de fichier pour choisir un fichier à traiter
 */
function ouvrirChoisirFichier() {
    const inputFichier = document.querySelector('#fileInput');
    inputFichier.click();
}


/**
 * Télécharge les fichiers du site en .zip
 */
async function downloadSite() {
    const jszip = new JSZip();
    const files = ['index.html', 'Ressources/', 'Ressources/img/', 'src/libs/', 'src/Mecanique/', 'src/Modele/DataObjetc/', 'src/Modele/HTTP/', 'src/vues/'];

    for (const file of files) {
        const response = await fetch(file);
        const blob = await response.blob();
        jszip.file(file, blob);
    }

    const zip = await jszip.generateAsync({type: 'blob'});
    saveAs(zip, 'FluoriGraphix.zip');
}


/**
 * Affiche le menu pour les utilisateurs mobiles
 */
function afficherMenu() {
    document.querySelector('.menu').style.display = 'flex';
}

/**
 * Ferme le menu s'il est ouvert
 */
function fermerMenu() {
    if (document.querySelector('.menu').style.display === 'flex') {
        document.querySelector('.menu').style.display = 'none';
    }
}

window.addEventListener('popstate', function (event) {
    if (getCookie() !== 'vueAccueil') {
        afficherVue('vueAccueil');
    }
});



/**
 * Redirige l'utilisateur vers un élément de la page
 * @param anchorId - L'ID ou l'élément vers lequel rediriger l'utilisateur
 * @param isElement précise si anchorId est un élément ou un ID
 */
function redirectTo(anchorId, isElement = false) {
    let element;
    if (!isElement) {
        element = document.getElementById(anchorId);
    } else {
        element = anchorId;
    }

    if (element) {
        if (window.innerWidth < 800) {
            fermerSommaire();
        }
        element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    } else {
        afficherMessageFlash("Erreur : L'élément demandé n'existe pas.", "danger");
    }
}


/**
 * Signature
 */
console.log('%c Made with ❤️ by Thomas Loye (2024) - thomasloye.fr', 'color: #ff0000; font-size: 1.5em; font-weight: bold; text-shadow: 2px 2px 0 #000000;)');