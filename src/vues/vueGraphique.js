function vueGraphique() {
    return `
    
    <div class="graphiques">
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
        <div class="copier" onclick="copierScreenElement('.graphique')"><img src="Ressources/img/copier.png" alt=""> Copier une image</div>
            <div class="entete">
                <h2>Affichage</h2>
                <div class="bouton boutonFonce" onclick="afficherPopupParametresGraphiques()">
                    CALCULS
                    <img src="Ressources/img/calculatrice.png" alt="Réduire">
                </div>
            </div>
        
       
        <div class="details">
        <div class="wrap">
            <h3>Charger d'autres fichiers</h3>
            <div>
                <input type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple onchange="traiterFichier()">
            </div>
            </div>
            
            <div class="wrap">
            <h3>Gestion du Zoom/déplacement</h3>
            <div>
                <label>Interactions sur axe X
                <input type="checkbox" checked id="xZoom" onclick="modifierZoom('x')">
                </label>
                <label>Interactions sur axe Y
                <input type="checkbox" checked id="yZoom" onclick="modifierZoom('y')">
                </label>
                <div class="bouton boutonFonce resetZoom" onclick="resetZoom()">Réinitialiser le zoom</div>
            </div>
            </div>
            
            <div class="wrap">
            <h3>Format de dates</h3>
            <div class="dates">
                <label>Format :<select onchange="modifierFormat(this.value)" id="selectFormatDate">
                    <option value="1">jj/mm/aa</option>
                    <option value="2">aa/mm/jj</option>
                    <option disabled value="0">Automatique</option>
                </select>
                </label>
            </div>
            </div>
            
            <div class="boutonsGraphique">          
                <div class="bouton boutonFonce downloadFile" onclick="telechargerFichier()">EXPORTER LES DONNÉES</div>
            </div>        
        </div>
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