function vueGraphique() {
    return `
    
    <br>
    <div class="graphiques">
        <canvas class="graphique" id="graphique"></canvas>
        
        <div class="waiting">
            <img src="Ressources/img/loading.gif" alt="Chargement">
            <h2>Veuillez Patienter</h2>
            <p>Traitement des données en cours - Veuillez patienter...</p>
        </div>
        
        <div class="infos">
            <img src="Ressources/img/graphiqueIllu.png" alt="Graphique">
            <h2>Importez un fichier et prenez le contrôle de vos données.</h2>
            <p>Types de fichiers pris en charge : .mv, .txt, .xml, Calibrat.dat.</p>
            <p>Possibilité de sélectionner plusieurs fichiers.</p>
            <h4>Paramétrez ensuite vos données selon vos besoins avec le bandeau dédié.</h4>
            <div id="start" class="bouton boutonFonce" onclick="ouvrirChoisirFichier()">COMMENCER</div>
        </div>
        
        
        
        <div class="settings">
            <div class="entete">
                <h2>Paramètres</h2>
                <img src="Ressources/img/aide.png" alt="Réduire" onclick="afficherVue('vueAccueil')">
            </div>
        
       
        <div class="details">
        <div class="wrap">
            <h3>Charger d'autres fichiers</h3>
            <div>
                <input type="file" id="fileInput" multiple onchange="traiterFichier()">
            </div>
            </div>
            
            <div class="wrap">
            <h3>Gestion du Zoom</h3>
            <div>
                <label>Zoom sur axe X
                <input type="checkbox" checked id="xZoom" onclick="modifierZoom('x')">
                </label>
                <label>Zoom sur axe Y
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
            
            <div>          
                <div class="bouton boutonFonce downloadFile" onclick="telechargerFichier()">TÉLÉCHARGER LE FICHIER</div>
            </div>        
        </div>
    </div>
    <div class="annonce">
        <img src="Ressources/img/perteConnexion.png" alt="Perte de connexion">
        <h2>Votre appareil n'est pas pris en charge</h2>
        <h4>L'appareil avec lequel vous utilisez ce site n'a pas un écran suffisamment large pour afficher les données de façon lisible</h4>
        <h4>Si vous êtes sur ordinateur et que votre fenêtre de votre navigateur est réduite, agrandissez-la au maximum.</h4>
    </div>
</div>
</div>

`;
}