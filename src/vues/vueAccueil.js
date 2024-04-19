function vueAccueil() {
    return `
    <div class="accueilBanniere">
        <img src="Ressources/img/accueil.jpg" alt="banniere">
        <div class="contenu">
            <h1>FluoriGraphix : l'outil de visualisation et de traitement des données issues de fluorimètres</h1>
            <a href="#actionsRapides" class="bouton boutonFonce">DÉCOUVRIR</a>
        </div>
    </div>
    
    <div class="accueil">
    
        <div class="text-container"><h1 id="actionsRapides" class="titreBarre">Actions Rapides</h1></div>
    
            <div class="actionsRapides">
                <div class="action" onclick="afficherVue('vueGraphique')">
                    <img src="Ressources/img/grandGraphique.png" alt="icone">
                    <h3>Visualisez les données de vos fichiers sous la forme de graphiques</h3>
                    <span></span>
                </div>
            
                <div class="action" onclick="afficherVue('vueConcentrations')">
                    <img src="Ressources/img/grandsCalculs.png" alt="icone">
                    <h3>Calculez des données de concentrations à partir d'un fichier Calibrat.dat</h3>
                    <span></span>
                </div>
            
                <div class="action" onclick="afficherVue('vueDocumentation')">
                    <img src="Ressources/img/grandeAide.png" alt="icone">
                    <h3>Consultez la documentation pour obtenir des réponses à vos questions</h3>
                    <span></span>
                </div>
           
            </div>
            
            
            
            <div class="text-container"><h1 class="titreBarre">Visualisation de données</h1></div>
            <div class="wrapAccueil">
                <div>
                    <h1>Facilité d'utilisation</h1>
                    <p>Sélectionnez un ou plusieurs fichiers, puis laissez la magie opérer. En l'espace de trois secondes, vos données sont affichées, et c'est un jeu d'enfant.</p>
                    <h1>Personnalisation</h1>
                    <p>Personnalisez tous les paramètres dont vous avez besoin dans le bandeau dédié de la page.</p>
                    <div class="boutonFonce bouton" onclick="afficherVue('vueGraphique')">TESTER</div>
                </div>
                <img class="graphic" src="Ressources/img/screenGraphique.png" alt="">
            </div>
            
            
            <div class="text-container"><h1 class="titreBarre">Automatisation d'actions</h1></div>
            <div class="wrapAccueil">
                <img src="Ressources/img/optimiser.png" alt="">
                <div>
                    <h1>Formats de dates automatiques</h1>
                    <p>En joignant votre fichier Calibrat.dat, FluoriGraphix en déduit automatiquement quel format de date appliquer à vos données. Vous pouvez également configurer ce paramètre manuellement.</p>
                    <h1>Occultation automatique des données constantes</h1>
                    <p>Les données restant constantes dans les graphiques sont occultées, pour vous permettre de vous concentrer sur l'essentiel. Vous pouvez les afficher à nouveau à tout moment.</p>
                </div>
            </div>
            
            
            <div class="text-container"><h1 class="titreBarre">Calculs de concentrations</h1></div>
            <div class="wrapAccueil">
                <div>
                    <h1>Calculs à partir de fichier .dat</h1>
                    <p>En joignant votre fichier Calibrat.dat, FluoriGraphix calcule en l'espace de quelques secondes les concentrations des traceurs joints.</p>
                    <h1>Personnalisation élevée</h1>
                    <p>Afficher les graphiques des concentrations selon vos besoins, et modifiez les valeurs des traceurs qui ne vous plaisent pas en quelques clics.</p>
                    <div class="boutonFonce bouton" onclick="afficherVue('vueConcentrations')">DÉCOUVRIR</div>
                </div>
                <img src="Ressources/img/personnalisation.png" alt="">
            </div>
            
            
            <div class="text-container"><h1 class="titreBarre">Assistance et documentation</h1></div>
            <div class="wrapAccueil">
            <img src="Ressources/img/assistance.png" alt="">
                <div>
                    <h1>Documentation du site</h1>
                    <p>Une large documentation du site pour l'utilisation de ses fonctionnalités est disponible. Suivez les tutoriels et les notes de configuration pour améliorer votre expérience !</p>
                    <h1>Installation</h1>
                    <p>Télécharger l'application dans l'onglet dédié, décompressez les fichiers et ouvrez le fichier index.html. Voilà : vous pouvez utiliser FluoriGraphix sans connexion internet et en local !</p>
                    <div class="boutonFonce bouton" onclick="afficherVue('vueGraphique')">TÉLÉCHARGER</div>
                    <div class="boutonClair bouton" onclick="afficherVue('vueDocumentation')">DOCUMENTATION</div>
                </div>
            </div>
            
        
    </div>
    

`;
}