function vueConcentrations() {
    return `
    <div class="temp">
    <input type="file" id="calibratInput" onchange="traiterCalibrat()">
        <p>Zone de tests sur les fichiers Calibrat.</p>
        <button onclick="downloadSite()">Test dl</button>
        
    </div>`;
}