function vueAccueil() {
    return `
    <div class="accueilBanniere">
        <img src="Ressources/img/accueil.jpg" alt="banniere">
        <div class="contenu">
            <h1>FluoGraphiX : l'outil de visualisation et de traitement des données issues de fluorimètres</h1>
            <div onclick="redirectTo('actionsRapides')" class="bouton boutonFonce">DÉCOUVRIR</div>
        </div>
    </div>
    
    <div class="accueil">
    
    
            <div class="text-container"><h1 class="titreBarre">Actions Rapides</h1></div>
    
            <div class="actionsRapides">
                <div id="actionsRapides" class="action" onclick="afficherVue('vueGraphique')">
                    <img src="Ressources/img/grandGraphique.png" alt="icone">
                    <h3>Visualisez, corrigez et convertissez vos données de mesures</h3>
                    <span></span>
                </div>
            
                <div class="action" onclick="afficherVue('vueConcentrations')">
                    <img src="Ressources/img/grandsCalculs.png" alt="icone">
                    <h3>Consultez vos données de calibration et vérifiez leur conformité</h3>
                    <span></span>
                </div>
            
                <div class="action" onclick="afficherVue('vueDocumentation')">
                    <img src="Ressources/img/grandeAide.png" alt="icone">
                    <h3>Consultez la documentation pour obtenir des réponses à vos questions</h3>
                    <span></span>
                </div>
           
            </div>
            
            <div class="wrapAccueil base">
                <img src="Ressources/img/bandeauFluographix.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/salut.png" alt="Accueil"><br>Bienvenue sur FluoGraphiX !</h1>
                    <h2 class="light">Une nouvelle façon de visualiser vos données de traçage.</h2>
                </div>
            </div>
            
            <div class="wrapAccueil classic">
                <img src="Ressources/img/586_1x_shots_so.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/salut.png" alt="Accueil"><br>Accessible partout, tout le temps</h1>
                    <h2 class="light">Que ce soit sur le terrain, sans connexion internet, sur téléphone portable ou sur ordinateur, FluoGraphiX vous accompagne toujours au plus près de vos données.</h2>
                </div>
            </div>
            
            
            
        
    </div>
    

`;
}