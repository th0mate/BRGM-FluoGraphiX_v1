function vueAccueil() {
    return `
    <div class="accueilBanniere">
        <img src="Ressources/img/accueil.jpg" alt="banniere">
        <div class="contenu">
            <h1>FluoriGraphix : l'outil de visualisation et de traitement des données issues de fluorimètres</h1>
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
            
            <div class="text-container"><h1 class="titreBarre">Présentation</h1></div>
            <div class="bannierePage">
                <img src="Ressources/img/traceurs.jpg.webp" alt="Sources">
                <div class="contenu">
                    <h2>FluoriGraphix est un outil polyvalent et innovant, vous permettant de vous concentrer sur l'essentiel de vos données, tout en évitant les erreurs d'interprétation.</h2>
                </div>
            </div>
            
            
            <div class="text-container"><h1 class="titreBarre">Fonctionnalités phares</h1></div>
            <div class="wrapAccueil actions">
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandConvertir.png" alt="icone">
                    <h3>Visualisez vos données de mesures avec horodatage, et convertissez-les en concentrations</h3>
                </div>
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandGraphique.png" alt="icone">
                    <h3>Visualisez vos données de calibration avec tableaux et graphiques</h3>
                </div>
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandCalibration.png" alt="icone">
                    <h3>Calculez vos courbes de calibration</h3>
                </div>
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandCSV.png" alt="icone">
                    <h3>Exportez toutes vos données au format CSV standard et TRAC</h3>
                </div>
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandCourbes.png" alt="icone">
                    <h3>Corriger vos courbes en fonction de la turbidité et des interférences entre traceurs</h3>
                </div>
                <div id="actionsRapides" class="action">
                    <img src="Ressources/img/grandBruit.png" alt="icone">
                    <h3>Corrigez vos courbes en fonction du bruit de fond naturel</h3>
                </div>
            </div>
            
            <div class="text-container"><h1 class="titreBarre">Visualisation de données</h1></div>
            <div class="wrapAccueil">
                <div>
                    <h1>Facilité d'utilisation</h1>
                    <p>Sélectionnez un ou plusieurs fichiers, puis laissez la magie opérer. En l'espace de quelques secondes, vos données sont affichées, et c'est un jeu d'enfant.</p>
                    <h1>Personnalisation</h1>
                    <p>Personnalisez tous les paramètres dont vous avez besoin dans le bandeau dédié de la page.</p>
                    <h1>Calculs novateurs</h1>
                    <p>Corriger des courbes et convertir des données, c'est possible grâce aux calculs récents utilisés dans FluoriGraphix.</p>
                    <div class="boutonFonce bouton" onclick="afficherVue('vueGraphique')">DÉCOUVRIR</div>
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