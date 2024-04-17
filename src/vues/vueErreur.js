function vueErreur() {
    return`
    <div class="erreur">
        <img src="Ressources/img/404.png" alt="Erreur">
        <h1>Erreur 404</h1>
        <h3>La page demandée n'a pas été trouvée</h3>
        <div class="boutonFonce bouton" onclick="afficherVue('vueAccueil')">RETOUR A L'ACCUEIL</div>
    </div>
    `;
}