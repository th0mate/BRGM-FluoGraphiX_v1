function vueGraphique() {
    return `
    <div id="tooltip" style="display: none; position: absolute;"></div>
   
    <div class="graphiques">
    
        <div class="bandeauGraphiques">
        
            <img class="extend" src="Ressources/img/extend.png" alt="etendre" onclick="etendreBandeau()">
            
            <div class="separator"><span></span><span class="text">CALCULS SUPPLÉMENTAIRES</span><span></span></div>

            <div class="elementBandeau" onclick="afficherPopupParametresGraphiques()">
                <span>OUVRIR LE PANNEAU DE CALCULS</span>
                <img src="Ressources/img/grandCalibration.png" alt="Ajouter">
            </div>
            
            <div class="separator"><span></span><span class="text">IMPORTATION DE FICHIERS</span><span></span></div>
            
            <div class="elementBandeau" onclick="ouvrirChoisirFichier()">
                <span>IMPORTER DES NOUVEAUX FICHIERS</span>
                <img src="Ressources/img/importer.png" alt="Ajouter">
            </div>
            
            <div class="separator"><span></span><span class="text">GESTION ZOOM/DEPLACEMENTS</span><span></span></div>
            
            <div class="elementBandeau" onclick="modifierZoom('x')">
                <span>INTERACTIONS ET ZOOM SUR AXE X</span>
                <img src="Ressources/img/x_axis.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" onclick="modifierZoom('y')">
                <span>INTERACTIONS ET ZOOM SUR AXE Y</span>
                <img src="Ressources/img/y_axis.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" onclick="resetZoom()">
                <span>RÉINITIALISER ZOOM ET POSITION</span>
                <img src="Ressources/img/circulaire.png" alt="Ajouter">
            </div>
            
            <div class="separator"><span></span><span class="text">FORMATS DE DATES</span><span></span></div>

            <div class="elementBandeau" onclick="modifierFormat('jj/mm/aa')">
                <span>FORMAT JOUR/MOIS/ANNÉE</span>
                <img src="Ressources/img/format_jma.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" onclick="modifierFormat('aa/mm/jj')">
                <span>FORMAT ANNÉE/MOIS/JOUR</span>
                <img src="Ressources/img/format_amj.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" onclick="modifierFormat('auto')">
                <span>DÉTECTION AUTOMATIQUE</span>
                <img src="Ressources/img/automatique.png" alt="Ajouter">
            </div>
            
            <div class="separator"><span></span><span class="text">EXPORT DES DONNÉES</span><span></span></div>
            
            <div class="elementBandeau" onclick="preparerTelechargement()">
                <span>EXPORTER LES DONNÉES</span>
                <img src="Ressources/img/dl.png" alt="Ajouter">
            </div>
            
            <div class="separator"><span></span><span class="text">EXPORT D'IMAGES</span><span></span></div>
            
            <div class="elementBandeau" onclick="copierScreenElement('.graphique')">
                <span>CAPTURE D'ÉCRAN</span>
                <img src="Ressources/img/copier.png" alt="Ajouter">
            </div>
            
        </div>
    
    
    
        <canvas class="graphique" id="graphique"></canvas>
        <div class="infos">
            <img src="Ressources/img/graphiqueIllu.png" alt="Graphique">
            <h1 class="titreBarre" style="margin-bottom: 30px">Graphiques</h1>
            <h2>Importez un fichier et prenez le contrôle de vos données.</h2>
            <p>Types de fichiers pris en charge : .mv, .txt, .xml, .csv, .dat (fichiers de calibration).</p>
            <p>Possibilité de sélectionner plusieurs fichiers.</p>
            <h4>Paramétrez ensuite vos données selon vos besoins avec le bandeau dédié.</h4>
            <div id="start" class="bouton boutonFonce" onclick="ouvrirChoisirFichier()">COMMENCER</div>
        </div>
        
        
        
        <div class="settings">
                <input type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple onchange="traiterFichier()">
        </div>
        
        <div class="annonce">
            <img src="Ressources/img/perteConnexion.png" alt="Perte de connexion">
            <h2>Votre appareil n'est pas pris en charge</h2>
            <h4>L'appareil avec lequel vous utilisez ce site n'a pas un écran suffisamment large pour afficher les données de façon lisible</h4>
            <h4>Si vous êtes sur ordinateur et que votre fenêtre de votre navigateur est réduite, agrandissez-la au maximum.</h4>
        </div>
        <div class="donnees" style="display: none;"></div>
    </div>
</div>

`;
}