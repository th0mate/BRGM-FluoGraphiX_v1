/**
 * Gestion des popups d'information
 */



if (window.location.protocol === "file:" && navigator.onLine) {
    afficherPopup('<img src="Ressources/img/attention.png" alt="Attention">', 'Vous êtes connecté à internet et utilisez ce site en local', 'Pour obtenir de meilleures performances et une meilleure expérience utilisateur, il est recommandé d\'utiliser ce site via internet.', '<div class="bouton boutonFonce" onclick="ouvrirInternet()">Aller sur le site</div><div class="bouton boutonFonce" onclick="fermerPopup()">Continuer en local</div>\n');
}

if (window.location.protocol !== "file:" && navigator.onLine) {
    //TODO : downloadSite
    const random = Math.floor(Math.random() * 4);
    if (random === 1) {
        afficherPopup('<img src="Ressources/img/information.png" alt="info">', 'Le saviez vous ? Vous pouvez utiliser ce site hors-ligne !', 'Vous pouvez télécharger ce site et l\'utiliser normalement en local sur votre machine, et sans internet.', '<div class="bouton boutonFonce" onclick="fermerPopup()">Continuer en ligne</div>\n' +
            '<div class="bouton boutonFonce" onclick="downloadSite()">Télécharger</div>');
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
    window.open('https://brgm.thomasloye.fr', '_blank');
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

