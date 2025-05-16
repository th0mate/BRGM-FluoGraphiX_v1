/**
 * Paramètre le site en fonction du contenu du fichier Calibrat.dat fourni
 * @param string le contenu du fichier Calibrat.dat
 */
function parametrerSiteDepuisCalibrat(string) {
    const lignes = string.split('\n');
    const derniereLigne = lignes[lignes.length - 2];
    const caractere = derniereLigne.charAt(0);

    document.querySelector('#auto').classList.add('active');

    if (document.querySelector('#amj').classList.contains('active')) {
        document.querySelector('#amj').classList.remove('active');
    }

    if (document.querySelector('#jma').classList.contains('active')) {
        document.querySelector('#jma').classList.remove('active');
    }

    let formatTexte = '';

    if (caractere === '2') {
        format = 1;
        formatTexte = 'jj/mm/aa';
    } else {
        format = 2;
        formatTexte = 'aa/mm/jj';
    }

    const inputFichier = document.getElementById('fileInput');
    let fichiers = Array.from(inputFichier.files);
    if (fichiers.length > 1) {
        afficherMessageFlash(`Nouveau format de date détecté : ${formatTexte}`, 'info');
    }

    //On renomme les fichiers XML pour les faire correspondre aux fichiers de calibration
    if (contenuFichierMesures.includes('A145') && contenuFichierMesures.includes('A146') && contenuFichierMesures.includes('A147') && contenuFichierMesures.includes('A148')) {
        for (let i = 0; i < traceurs.length; i++) {
            remplacerDonneesFichier(`A${145 + i}`, `L${1 + i}`);
        }
    }
}

/**
 * Modifie le zoom du graphique en fonction de la lettre passée en paramètre
 * Zoom en x uniquement
 * Zoom en y uniquement
 * Zoom en x et y
 * Aucun zoom
 * @param letter{string} la lettre (x,y) correspondant au zoom à modifier
 */
function modifierZoom(letter) {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);

    const bouton = document.getElementById('axe' + letter.toUpperCase());

    if (bouton.classList.contains('active')) {
        bouton.classList.remove('active');
    } else {
        bouton.classList.add('active');
    }

    if (zoom.includes(letter)) {
        zoom = zoom.replace(letter, '');
    } else {
        zoom += letter;
    }

    if (existingChart) {
        existingChart.options.plugins.zoom.zoom.mode = zoom;
        existingChart.options.plugins.zoom.pan.mode = zoom;

        existingChart.update();
    }
}