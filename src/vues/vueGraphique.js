
function vueGraphique() {
    return `
    
    <br>
    <div class="graphiques">
        <canvas class="graphique" id="graphique"></canvas>
        
        <div class="settings">
            <div class="entete">
                <h2>Paramètres</h2>
                <img src="Ressources/img/reduire.png" alt="Réduire" onclick="reduireSettings()">
        </div>
        
        <div class="details">
            <h3>Charger d'autres fichiers</h3>
            <div>
                <input type="file" id="fileInput" multiple onchange="traiterFichier()">
            </div>
            
            <h3>Gestion du Zoom</h3>
            <div>
                <label>Zoom sur axe X
                <input type="checkbox" checked id="xZoom" onclick="modifierZoom('x')">
                </label>
                <label>Zoom sur axe Y
                <input type="checkbox" checked id="yZoom" onclick="modifierZoom('y')">
                </label>
            </div>
            
            <h3>Format de dates</h3>
            <div>
                <label>Format :<select onchange="modifierFormat(this.value)" id="selectFormatDate">
                    <option value="1">jj/mm/aa</option>
                    <option value="2">aa/mm/jj</option>
                    <option disabled value="0">Automatique</option>
                </select>
                </label>
            </div>
            
            <div>
                <div class="bouton boutonFonce resetZoom" onclick="resetZoom()">Réinitialiser le zoom</div>
             
                <div class="bouton boutonFonce downloadFile" onclick="telechargerFichier()">TÉLÉCHARGER LE FICHIER</div>
                
            </div>
        
        </div>
    </div>
</div>
    
    
`;
}