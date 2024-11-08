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
                    <h1 class="orange"><img class="icon" src="Ressources/img/accessible.png" alt="Accueil"><br>Accessible partout, tout le temps</h1>
                    <h2 class="light">Que ce soit sur le terrain, sans connexion internet, sur téléphone portable ou sur ordinateur, FluoGraphiX vous accompagne toujours au plus près de vos données.</h2>
                </div>
            </div>
            
            <span class="titreAccueil"><h2 class="orange">Des fonctionnalités innovantes</h2></span>
            
            <div class="rowPresentation">
                <div class="elementPresentation">
                    <img src="Ressources/img/accessible.png" alt="Accueil">
                    <h3>Mobile, comme vous</h3>
                    <p>Utilisable sur PC, tablette et smartphone, même sans connexion</p>
                </div>
                
                <div class="elementPresentation">
                    <img src="Ressources/img/polyvalence.png" alt="Accueil">
                    <h3>Polyvalent</h3>
                    <p>Gestion des données de calibration et des données de mesure</p>
                </div>
                
                <div class="elementPresentation">
                    <img src="Ressources/img/outils.png" alt="Accueil">
                    <h3>Pensé pour vos outils</h3>
                    <p>Exports compatibles avec le logiciel TRAC</p>
                </div>
                
                <div class="elementPresentation">
                    <img src="Ressources/img/compteur-de-vitesse.png" alt="Accueil">
                    <h3>Hautes performances</h3>
                    <p>Des performances optimales, même avec des fichiers volumineux</p>
                </div>
            </div>
            
            <div class="wrapAccueil reduce">
                <img src="Ressources/img/iphone.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/installer.png" alt="Accueil"><br>Installation rapide et facile</h1>
                    <img src="Ressources/img/guideInstallation.png" class="illu" alt="Accueil">
                </div>
            </div>
            
            <div class="wrapAccueil classic reverted bigPicture">
                <img src="Ressources/img/shots_yuirhdkjf.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/charts.png" alt="Accueil"><br>Graphique de données de mesure</h1>
                    <h2 class="light">Consultez vos données mesurées dans des graphiques réactifs. Profitez du zoom et du déplacement pour analyser vos données dans les moindres détails.</h2>
                </div>
            </div>
            
            <div class="wrapAccueil classic">
                <img src="Ressources/img/907shots_so.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/calculates.png" alt="Accueil"><br>Nombreux calculs possibles</h1>
                    <h2 class="light">Avec FluoGraphiX, vous pouvez corriger l'influence de la turbidité sur vos traceurs, corriger le bruit de fond naturel, convertir vos traceurs en concentration, et corriger les interférences entre vos traceurs, le tout en quelques clics.</h2>
                </div>
            </div>
            
            <div class="wrapAccueil classic reverted">
                <img src="Ressources/img/calibrationPicture.png" alt="Accueil">
                <div class="contenuWithIcon">
                    <h1 class="orange"><img class="icon" src="Ressources/img/outils.png" alt="Accueil"><br>Données de calibration</h1>
                    <h2 class="light">Parcourez les valeurs de calibration de vos différents traceurs, soyez avertis des valeurs aberrantes, dessinez vos courbes de calibration, et convertissez vos fichiers au format CSV.</h2>
                </div>
            </div>
            
        
    </div>
    

`;
}