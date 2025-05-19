function vueConcentrations() {
    return `    
    
    <div id="tooltip" style="display: none; position: absolute;"></div>
    
    <div class="concentrations">
        
        <div class="wrapBandeauCalibration">
            <h2 class="orange">Données à afficher</h2>
            
            <div class="bandeauCalibration">
                <div class="wrapTraceursCalibration">
                    
                </div>
            
                <span class="separatorCalibration"></span>
            
                <div class="wrapLampesCalibration">
                    
                </div>
            
                <span class="separatorCalibration"></span>
            
                <div>
                    <div class="boutonOrange boutonFonce boutonBandeauCalibration" onclick="ouvrirChoisirFichierCalibration()">IMPORTER FICHIER<img src="Ressources/img/importer.png"><span>IMPORTER UN AUTRE FICHIER</span></div>
                    <div class="boutonOrange boutonFonce boutonBandeauCalibration" onclick="reinitialiserZoomGraphiqueConcentrations()">ZOOM<img src="Ressources/img/circulaire.png"><span>RÉINITIALISER LE ZOOM</span></div>
                    <div class="boutonOrange boutonFonce boutonBandeauCalibration" onclick="telechargerFichierCSV()">EXPORTER<img src="Ressources/img/dl.png"><span>EXPORTER EN CSV</span></div>
                    <div class="boutonOrange boutonFonce boutonBandeauCalibration" onclick="copierScreenElement('.donnees')"><img src="Ressources/img/copier.png"><span>CAPTURE D'ÉCRAN</span></div>
                </div>
            
            </div>
            
        </div>
        
        <div class="bandeau">
            <input type="file" accept=".dat, .csv" id="calibratInput" onchange="traiterCalibrat()">
        </div>
        
        <div class="descriptionConcentration"></div>
                
        <div class="donnees">
            <div class="tableau"></div>
            
            <div class="infosConcentration">
            
                <div class="cotesInfos">
                <img src="Ressources/img/illuQuali1.png" alt="Graphique">
                
                <div class="bulles bl1">
                    <span>Alertes d'incohérences</span>
                    <p>FluoGraphiX vous alerte dès que des données aberrantes ont été détectées, pour vous éviter les mauvaises surprises.</p>
                </div>
            </div>
            
            <div class="mainInfos">
                <h1 class="titreBarre">Calibration</h1>
                <h2 class="orange">Vérifiez la validité de vos données en un coup d'œil</h2>
                <br>
                <p>Types de fichiers pris en charge : .dat, .csv.</p>
                <p>Vos fichiers sont automatiquement convertis au format .csv, pour faciliter ensuite leur lecture et leur modification.</p>
                <p>Vous pouvez également importer ces fichiers dans la partie "graphiques" de FluoGraphiX.</p>
                <p>Un seul fichier sélectionné au maximum.</p>
                
                <br>               
                <br>
                <p>Sélectionnez un fichier :</p>
                <br>
                
                <div class="elementCentre">
                    <div id="start" class="bouton boutonFonce" onclick="ouvrirChoisirFichierCalibration()">COMMENCER</div>
                </div>
            </div>
            
            <div class="cotesInfos">
                <img src="Ressources/img/illuQuali2.png" alt="Graphique">
                
                <div class="bulles bl2">
                    <span>Affichage lisible des données</span>
                    <p>Vos données sont affichées dans un tableau et dans un graphique, pour afficher tous les détails.</p>
                </div>
                
            </div>
            
            </div>
        </div>
        
        
        
        
        
        <div class="equationPannel">
            <div class="gomette" onclick="afficherEquation()">
                <img src="Ressources/img/equation.png" alt="">
            </div>
        
            <img class="cross" src="Ressources/img/close.png" alt="Fermer" onclick="fermerEquation()">
            <h2>Équation de la droite de calibration</h2>
        
            <div class="equation">
                <span>Aucune équation à afficher pour le moment.</span>
            </div>
        
            <div class="boutonOrange boutonFonce boutonBandeauCalibration" onclick="copierTexte('.equation')">
                <span>Copier</span>
                <img src="Ressources/img/copier.png" alt="Copier">
            </div>
        </div>
        
    
     
        
    </div>

`;
}