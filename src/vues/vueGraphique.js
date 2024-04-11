
function vueGraphique() {
    return `<input type="file" id="fileInput" multiple onchange="traiterFichier()">
    <button onclick="resetZoom()">RÉINITIALISER LE ZOOM</button>
    <button class="downloadFile" onclick="telechargerFichier()">Télécharger le fichier</button>
    <label for="xZoom">Zoom sur axe X</label>
    <input type="checkbox" checked id="xZoom" onclick="modifierZoom('x')">
    <label for="yZoom">Zoom sur axe Y</label>
    <input type="checkbox" checked id="yZoom" onclick="modifierZoom('y')">
    

    <label for="selectFormatDate">Format Date</label><select onchange="modifierFormat(this.value)" id="selectFormatDate">
        <option value="1">jj/mm/aa</option>
        <option value="2">aa/mm/jj</option>
        <option disabled value="0">Automatique</option>
    </select>
    <br>
    <div class="graphiques">
        <canvas class="graphique" id="graphique"></canvas>
    </div>`;
}