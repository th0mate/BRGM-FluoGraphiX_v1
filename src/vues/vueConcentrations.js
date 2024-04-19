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
            <img src="Ressources/img/image4.jpg.webp" alt="Sources">
            <div class="contenu">
                <p><span onclick="afficherVue('vueAccueil')"><span></span>Accueil</span> <strong> / Concentrations</strong></p>
                <h1>Concentrations</h1>
            </div>
        </div>
        
        <div class="bandeau">
            <h2>Données à afficher</h2>
            <div class="wrap">
                <div>
                    <h4>Fichier de données</h4>
                    <input type="file" accept=".dat" id="calibratInput" onchange="traiterCalibrat()">
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
            </div>
        </div>
        
        <div class="descriptionConcentration"></div>
        
        <div class="donnees">
            <div class="infosConcentration">
                <img src="Ressources/img/data.png" alt="">
                <h2>Visualisez et calculez en un clin d'oeil</h2>
                <p>Importez un fichier .dat, puis sélectionner le traceur désiré et la ligne que vous souhaitez visualiser, et laissez la magie opérer.</p>             
            </div>
        </div>
        
    
        
        
        
    </div>

`;
}