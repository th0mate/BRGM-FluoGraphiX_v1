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
    afficherMessageFlash(`Nouveau format de date détecté : ${formatTexte}`, 'info');
}