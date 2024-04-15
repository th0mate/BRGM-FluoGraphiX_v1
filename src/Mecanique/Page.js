/**
 * Gestion des popups d'information
 */


if (window.location.protocol === "file:" && navigator.onLine) {
    setTimeout(() => {
        afficherPopup('<img src="Ressources/img/attention.png" alt="Attention">', 'Vous êtes connecté à internet et utilisez ce site en local', 'Pour obtenir de meilleures performances et une meilleure expérience utilisateur, il est recommandé d\'utiliser ce site via internet.', '<div class="bouton boutonFonce" onclick="ouvrirInternet()">Aller sur le site</div><div class="bouton boutonFonce" onclick="fermerPopup()">Continuer en local</div>\n');
    }, 3000);
}

if (window.location.protocol !== "file:" && navigator.onLine) {
    //TODO : downloadSite
    const random = Math.floor(Math.random() * 7);
    if (random === 1) {
        setTimeout(() => {
            afficherPopup('<img src="Ressources/img/information.png" alt="info">', 'Le saviez vous ? Vous pouvez utiliser ce site hors-ligne !', 'Vous pouvez télécharger ce site et l\'utiliser normalement en local sur votre machine, et sans internet.', '<div class="bouton boutonFonce" onclick="fermerPopup()">Fermer</div>\n' +
                '<div class="bouton boutonFonce" onclick="downloadSite()">En Savoir Plus</div>');
        }, 3000);
    }
}


if (cookieExists()) {
    afficherVue(getCookie());
} else {
    afficherVue('vueAccueil');
}


/**
 * Redirige l'utilisateur vers le site en ligne
 */
function ouvrirInternet() {
    window.open('https://webinfo.iutmontp.univ-montp2.fr/~loyet/BRGM/', '_blank');
}


/**
 * Affiche dans l'élément #contenu de ../index.html le fichier html passé en paramètres, se trouvant dans src/vues
 * @param nomFichier{string} le nom du fichier à afficher
 */
function afficherVue(nomFichier) {
    if (!window[nomFichier]) {
        afficherMessageFlash('Erreur 404 : La page demandée n\'existe pas', 'danger');
        afficherVue('vueAccueil');
        return;
    }
    createCookie(nomFichier);
    document.querySelector('#contenu').innerHTML = window[nomFichier]();

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

