function vueAccueil() {
    return `
    <div class="accueilBanniere">
        <img src="Ressources/img/accueil.jpg" alt="banniere">
        <div class="contenu">
            <h1>FluoriGraphix : l'outil de visualisation et de traitement des données issues de fluorimètres</h1>
            <div class="bouton boutonFonce">DÉCOUVRIR</div>
        </div>
    </div>
    
    <div class="accueil">
    
        <div class="text-container"><h1 class="titreBarre">Actions Rapides</h1></div>
    
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
                    <p>Personnalisez tous les paramètres dont vous avez besoin dans le bandeau de la page dédié.</p>
                </div>
                <img src="Ressources/img/screenGraphique.png" alt="">
            </div>
            
            
            <div class="text-container"><h1 class="titreBarre">Automatisation d'actions</h1></div>
            <div class="wrapAccueil">
                <div>
                    <h1>Format de dates automatique</h1>
                    <p>En joignant votre fichier Calibrat.dat, FluoriGraphix en déduit automatiquement quel format de date appliquer à vos données. Vous pouvez également configurer ce paramètre manuellement.</p>
                </div>
            </div>
            
        
    </div>
    

`;
}