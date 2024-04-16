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
            <div class="action">
                <img src="Ressources/img/grandGraphique.png" alt="icone">
                <h3>Visualisez les données de vos fichiers sous la forme de graphiques</h3>
                <span></span>
            </div>
            
            <div class="action">
                <img src="Ressources/img/grandsCalculs.png" alt="icone">
                <h3>Calculez des données de concentrations à partir d'un fichier Calibrat.dat</h3>
                <span></span>
            </div>
            
            <div class="action">
                <img src="Ressources/img/grandeAide.png" alt="icone">
                <h3>Consultez la documentation pour obtenir des réponses à vos questions</h3>
                <span></span>
            </div>
           
        </div>
        
    </div>
    

`;
}