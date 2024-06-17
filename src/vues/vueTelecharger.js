function vueTelecharger() {
    return `
    <div class="vueTelecharger">
        <img src="Ressources/img/banniereDL.webp" alt="Télécharger" class="fond">
        
        <div class="contenu">
        
            <div class="gauche">
                <h1 class="titreBarre">Téléchargement</h1>
                <h2>Profitez d'une application web polyvalente, intuitive et novatrice. Accessible partout, tout le temps.</h2>
            </div>
            
            <div class="droite">
                <img src="Ressources/img/rocket.png" alt="Fusée">
                <h1>Rejoignez l'aventure FluoGraphiX !</h1>
                <div class="boutonOrange" onclick="downloadSite()">TÉLÉCHARGER MAINTENANT</div>
            </div>
            
        </div>
        
    </div>
    `;
}