/**
 * Paramètre le site en fonction du contenu du fichier Calibrat.dat fourni
 * @param string le contenu du fichier Calibrat.dat
 */
function parametrerSiteDepuisCalibrat(string) {
    const lignes = string.split('\n');
    const derniereLigne = lignes[lignes.length - 2];
    const caractere = derniereLigne.charAt(0);

    document.querySelector('#selectFormatDate').value = '0';
    let formatTexte = '';

    if (caractere === '2') {
        format = 1;
        formatTexte = 'jj/mm/aa';
    } else {
        format = 2;
        formatTexte = 'aa/mm/jj';
    }
    if (contenuFichier !== '') {
        afficherMessageFlash(`Nouveau format de date détecté : ${formatTexte}`, 'info');
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