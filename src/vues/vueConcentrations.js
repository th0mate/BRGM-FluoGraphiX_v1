function vueConcentrations() {
    return `    
    
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
                    <input type="file" id="calibratInput" onchange="traiterCalibrat()">
                </div>
                
                <div id="selectTraceur">
                    <h4>Traceur à analyser</h4>
                </div>
                
                <div id="selectLigne">
                    <h4>Signaux à afficher</h4>
                </div>
            </div>
        </div>
        
        <div class="donnees">
        
        </div>
        
    
        
        
        
    </div>

`;
}