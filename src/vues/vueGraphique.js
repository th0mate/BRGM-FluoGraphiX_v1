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

    <div class="arrow" onclick="agrandirSettings()">
        <img src="Ressources/img/flecheOrange.png" alt="Flèche">
    </div>
    
`;
}

let html;

/**
 * Réduit la taille des paramètres pour afficher le graphique en plus grand
 */
function reduireSettings() {
    const graphique = document.querySelector('.graphique');
    const settings = document.querySelector('.settings');

    graphique.style.width = '100%';
    graphique.style.transition = 'width 0.5s ease';
    settings.style.width = '0';
    settings.style.overflow = 'hidden';
    settings.style.transition = 'width 0.5s ease';
    html = settings.innerHTML;
    settings.innerHTML = '';

    setTimeout(() => {
        document.querySelector('.arrow').style.display = 'flex';
    }, 450);
}

/**
 * Agrandit la taille des paramètres pour afficher le graphique en plus petit
 */
function agrandirSettings() {
    const graphique = document.querySelector('.graphique');
    const settings = document.querySelector('.settings');

    graphique.style.maxwidth = '70%';
    graphique.style.transition = 'width 0.5s ease';
    settings.style.width = '300px';
    settings.style.overflow = 'auto';
    settings.style.transition = 'width 0.5s ease';
    document.querySelector('.arrow').style.display = 'none';
    settings.innerHTML = html;
}