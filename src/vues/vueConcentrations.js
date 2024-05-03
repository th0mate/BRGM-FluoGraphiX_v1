function vueConcentrations() {
    return `    
    
    <script>
        window.onload = function() {
            if (contenuCalibrat !== '') {
                traiterCalibrat();
            }
        }
    </script>
    
    <div class="concentrations">
    
        <div class="bannierePage">
            <img src="Ressources/img/traceurs.jpg.webp" alt="Sources">
            <div class="contenu">
                <p><span onclick="afficherVue('vueAccueil')"><span></span>Accueil</span> <strong> / Calibration</strong></p>
                <h1>Calibration</h1>
                <span class="auteur"><img src="Ressources/img/auteur.png" alt=""> <h3>© BRGM - Bertrand Aunay, La Réunion, 2010.</h3></span>
            </div>
        </div>
        
        <div class="bandeau">
            <h2>Données à afficher</h2>
            <div class="wrap">
                <div class="lesBoutons">
                    <h4>Fichier de données</h4>
                    <input type="file" accept=".dat, .txt" id="calibratInput" onchange="traiterCalibrat()">
                </div>
                
                <div id="selectTraceur">
                    <h4>Traceur à analyser</h4>
                    <select disabled class="selectTraceur">
                        <option disabled selected>Importez un fichier d'abord</option>
                    </select>
                </div>
                
                <div id="selectLigne">
                    <h4>Signaux à afficher</h4>
                    <select disabled class="selectLigne">
                        <option disabled selected>Importez un fichier d'abord</option>
                    </select>
                </div>
                
                <div id="selectLigne">
                    <h4>Calculs / Gestion du Zoom</h4>
                    <div id="boutonCalculer" class="bouton boutonClair disabled">CALCULER</div>
                    <div onclick="reinitialiserZoomGraphiqueConcentrations()" id="boutonResetZoom" class="bouton boutonClair disabled">RÉINITIALISER LE ZOOM</div>
                    
                </div>
            </div>
        </div>
        
        <div class="descriptionConcentration"></div>
        
        <div class="donnees">
            <div class="tableau"></div>
            <div class="infosConcentration">
                <img src="Ressources/img/data.png" alt="">
                <h2>Visualisez et calculez en un clin d'oeil</h2>
                <p>Importez un fichier .dat, puis sélectionner le traceur désiré et la ligne que vous souhaitez visualiser, et laissez la magie opérer.</p>             
            </div>
        </div>
        
    
        
        
        
    </div>

`;
}