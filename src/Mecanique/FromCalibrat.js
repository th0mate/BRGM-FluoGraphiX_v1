/**
 * Classe chargée de récupérer les informations nécessaires à partir du fichier Calibrat.dat et de les utiliser pour en effectuer des calculs
 */


let lignesCalibrat = [];
let sectionsCalibrat = [];
let nomsTraceur = [];
let numeroFluorimetre = '';
let traceurs = [];


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE FICHIERS DAT
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Initialise les variables issues du fichier Calibrat.dat nécessaires pour le calcul de la régression linéaire
 */
function init(estDepuisCalibrat = true) {
    if (contenuCalibrat !== '') {

        if (document.querySelector('.boutonDlData')) {
            document.querySelector('.boutonDlData').remove();
        }

        if (document.getElementById('graphiqueTraceur')) {
            document.getElementById('graphiqueTraceur').remove();
        }

        if (document.querySelector('.tableauTraceur')) {
            document.querySelector('.tableauTraceur').remove();
        }

        if (document.querySelector('.selectTraceur')) {
            document.querySelector('.selectTraceur').remove();
        }

        if (document.querySelector('.selectLigne')) {
            document.querySelector('.selectLigne').remove();
        }

        if (estDepuisCalibrat) {
            lignesCalibrat = contenuCalibrat.split('\n');
            sectionsCalibrat = getSectionsCalibrat();
            nomsTraceur = getNomsTraceursCalibrat();
            numeroFluorimetre = getNumeroFluorimetreCalibrat();
            creerTraceurs();
            creerTurbidity();
            contenuCalibrat = convertirEnTexte();
        } else {
            lignesCalibrat = contenuCalibrat.split('\n');
            sectionsCalibrat = getSectionsCalibratTxt();
            nomsTraceur = getNomsTraceursTxt();
            numeroFluorimetre = getNumeroFluorimetreTxt();
            creerTraceurTxt();
        }


        if (document.querySelector('.infosConcentration')) {
            document.querySelector('.infosConcentration').remove();
        }


        for (let i = 0; i < traceurs.length; i++) {
            const traceur = traceurs[i];
            let maxDataLength = 0;
            let maxDataIndex = 0;
            let labels = traceur.echelles;
            for (let i = 1; i <= traceur.data.size; i++) {
                let nbValeurs = 0;
                for (let j = 0; j < labels.length; j++) {
                    const value = traceur.getDataParNom('L' + i + '-' + (j + 1));
                    if (value !== null && value !== 'NaN' && !isNaN(value)) {
                        nbValeurs++;
                    }
                }
                if (nbValeurs > maxDataLength) {
                    maxDataLength = nbValeurs;
                    maxDataIndex = i;
                }

            }
            if (traceur.unite.toLowerCase() !== 'ntu') {
                traceur.lampePrincipale = maxDataIndex;
            } else {
                traceur.lampePrincipale = 4;
            }
        }

        console.log(traceurs);
        afficherSelectTraceurs();
    } else {
        afficherMessageFlash('Erreur : aucune donnée exploitable.', 'danger');
    }
}


/**
 * Récupère le numéro du fluorimètre à partir du fichier Calibrat.dat.
 * @returns {string} le numéro du fluorimètre
 */
function getNumeroFluorimetreCalibrat() {
    const lignes = contenuCalibrat.split('\n');
    const premiereLigne = lignes[0];
    const index = premiereLigne.indexOf('#');
    return premiereLigne.substring(index + 1).trim();
}


/**
 * Récupère la date de la calibration au format aammjj et la renvoie au format jj/mm/aaa
 * @returns {string} la date de la calibration
 */
function getDateCalibrationCalibrat() {
    const section = sectionsCalibrat[0].split('\n');
    const date = section[2].split(': ')[1];
    const jour = date.substring(4, 6);
    const mois = date.substring(2, 4);
    const annee = date.substring(0, 2);
    return jour + '/' + mois + '/' + annee;
}


/**
 * Récupère les sections du fichier Calibrat.dat.
 * @returns {string[]} les sections du fichier Calibrat.dat
 */
function getSectionsCalibrat() {
    const sections = [];
    let section = '';
    for (let i = 0; i < lignesCalibrat.length; i++) {
        if (lignesCalibrat[i].startsWith('----------------')) {
            sections.push(section);
            section = '';
        } else {
            section += lignesCalibrat[i] + '\n';
        }
    }
    return sections;
}


/**
 * Récupère les noms des traceurs du fichier Calibrat.dat.
 * @returns {string[]} les noms des traceurs
 */
function getNomsTraceursCalibrat() {
    const noms = [];
    for (let i = 0; i < 3; i++) {
        const section = sectionsCalibrat[i];
        noms.push(section[0].split(' ').slice(1).join(' '));
    }
    return noms;
}


/**
 * Crée des objets de type Traceur à partir des données du fichier Calibrat.dat
 * C'est également ici que sont définis les attributs LX-2, hormis pour l'eau et la turbidité
 * @returns {Traceur[]} les objets Traceur créés
 */
function creerTraceurs() {
    traceurs = [];
    for (let i = 1; i <= 4; i++) {
        const section = sectionsCalibrat[i].split('\n');
        const nom = section[0].trim();
        let traceur;

        if (i === 1) {
            traceur = new Traceur(nom, getDateCalibrationCalibrat(), '');
        } else {
            traceur = new Traceur(nom, getDateCalibrationCalibrat(), 'ppb');
        }

        traceur.echelles.push(arrondirSansVirgule(sectionsCalibrat[14].split('  ')[0]));


        for (let j = 0; j < 4; j++) {
            const ligne = section[j + 1].split(/\s+/);
            traceur.addData(ligne[0] + '-1', parseFloat(ligne[1]));
        }

        if (i !== 1) {
            const sectionConcentration = sectionsCalibrat[7 + i].split('\n');
            const nbLignes = parseInt(sectionConcentration[0].charAt(0));

            let valeuraRemplacer = 0;
            let valeurRemplacement = [];
            for (let k = nbLignes - 1; k >= 0; k--) {
                const ligne = sectionConcentration[k + 1].split(/\s+/);

                if (!traceur.echelles.includes(calculerEchelle(parseFloat(ligne[0])))) {
                    traceur.echelles.push(calculerEchelle(parseFloat(ligne[0])));
                }
                if (traceur.getLabelParValeur(parseFloat(ligne[1])).substring(3, 4) === '1') {
                    valeuraRemplacer = parseFloat(ligne[1]);
                } else {
                    valeurRemplacement.push(parseFloat(ligne[1]));
                }
            }

            for (let j = 0; j < valeurRemplacement.length; j++) {
                for (let k = 1; k <= 4; k++) {
                    if (valeuraRemplacer) {
                        const idValeuraModifier = traceur.getLabelParValeur(valeuraRemplacer).substring(1, 2);
                        if (k === parseFloat(idValeuraModifier)) {
                            traceur.addData('L' + parseFloat(idValeuraModifier) + `-${2 + j}`, valeurRemplacement[j]);
                        } else {
                            traceur.addData('L' + k + `-${2 + j}`, 'NaN');
                        }
                    } else {
                        if (i - 1 === k) {
                            traceur.addData('L' + k + `-${2 + j}`, valeurRemplacement[j]);
                        } else {
                            traceur.addData('L' + k + `-${2 + j}`, 'NaN');
                        }
                    }
                }
            }

        }

        traceurs.push(traceur);
    }
}


/**
 * Calcule une échelle en ppb à partir de la puissance de dix passée en paramètre
 * @param puissanceDix la puissance de dix
 * @returns {number} l'échelle en ppb
 */
function calculerEchelle(puissanceDix) {
    return arrondirSansVirgule((Math.pow(10, puissanceDix)) * (Math.pow(10, 9)));
}


/**
 * Arrondit un nombre à aucun chiffre après la virgule
 */
function arrondirSansVirgule(number) {
    return Math.round(number);
}


/**
 * Crée un objet Traceur de type Turbidité à partir des données du fichier Calibrat.dat
 */
function creerTurbidity() {
    const turbidite = new Traceur('Turbidité', getDateCalibrationCalibrat(), 'NTU');
    let k = 1;
    for (let i = 5; i <= 7; i++) {
        const section = sectionsCalibrat[i].split('\n');

        const premierLigne = section[0].split(' ');
        turbidite.echelles.push(parseFloat(premierLigne[0]));


        for (let j = 0; j < 4; j++) {
            const ligne = section[j + 1].split(/\s+/);
            turbidite.addData(ligne[0] + `-${k}`, parseFloat(ligne[1]));
        }
        k++;
    }
    traceurs.push(turbidite);
}

/**
 * Récupère un objet traceur par son nom
 * @param nom le nom du traceur
 * @returns {*} l'objet traceur
 */
function recupererTraceurParNom(nom) {
    return traceurs.find(traceur => traceur.nom === nom);
}

/**
 * Récupère l'objet traceur Eau, qui est le seul à ne pas avoir d'unité
 */
function recupererTraceurEau() {
    return traceurs.find(traceur => traceur.unite === '');
}


/**
 * Affiche dans un div un select permettant de choisir un traceur
 */
function afficherSelectTraceurs() {

    const select = document.createElement('select');
    select.id = 'selectTraceur';
    select.classList.add('selectTraceur');
    select.addEventListener('change', () => {
        const nom = select.value;
        const traceur = recupererTraceurParNom(nom);

        if (document.querySelector('.boutonDlData')) {
            document.querySelector('.boutonDlData').remove();
        }
        afficherTableauTraceur(traceur);
        afficherSelectLigne(traceur.lampePrincipale, traceur);
        afficherGraphiqueTraceur(traceur, traceur.lampePrincipale);
        setBoutonCalculer(traceur.lampePrincipale, traceur);
    });



    for (let i = 0; i < traceurs.length; i++) {
        if (traceurs[i].unite !== '') {
            const option = document.createElement('option');
            option.value = traceurs[i].nom;
            option.textContent = traceurs[i].nom;

            if (i === 1) {
                option.selected = true;
                const nom = traceurs[i].nom;
                const traceur = traceurs[i];

                let labels = traceur.echelles;

                afficherTableauTraceur(traceur);
                afficherSelectLigne(traceur.lampePrincipale, traceur);
                afficherGraphiqueTraceur(traceur, traceur.lampePrincipale);
                setBoutonCalculer(traceur.lampePrincipale, traceur);
            }
            select.appendChild(option);
        }
    }

    document.querySelector('#selectTraceur').appendChild(select);
}

/**
 * Affiche un sélect pour choisir une ligne parmi L1, L2, L3 et L4, avec comme valeur par défaut idData
 * @param idData la valeur par défaut
 * @param traceur le traceur
 */
function afficherSelectLigne(idData, traceur) {
    if (document.querySelector('.selectLigne')) {
        document.querySelector('.selectLigne').remove();
    }

    const select = document.createElement('select');
    select.id = 'selectLigne';
    select.classList.add('selectLigne');
    select.addEventListener('change', () => {
        const idData = parseInt(select.value);
        afficherGraphiqueTraceur(traceur, idData);
        setBoutonCalculer(idData, traceur);
    });

    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = 'L' + i;
        if (i === idData) {
            option.selected = true;
        }
        select.appendChild(option);
    }

    document.querySelector('#selectLigne').appendChild(select);
}

/**
 * Paramètre le bouton de calcul
 * @param idLampe l'id de la lampe à traiter
 * @param Traceur le traceur à traiter
 */
function setBoutonCalculer(idLampe, Traceur) {
    let boutonCalculer = document.querySelector('#boutonCalculer');
    document.querySelector('#boutonResetZoom').classList.remove('disabled');

    let boutonCalculerClone = boutonCalculer.cloneNode(true);
    boutonCalculer.parentNode.replaceChild(boutonCalculerClone, boutonCalculer);

    boutonCalculer = boutonCalculerClone;

    boutonCalculer.addEventListener('click', () => {
        calculerConcentration(idLampe, Traceur)
    });

    boutonCalculer.classList.remove('disabled');
}


/**
 * Affiche dans une div un tableau contenant les données d'un traceur : 4 lignes de L1 à L4, et plusieurs colonnes pour tous les Y de LX-Y
 * @param traceur
 */
function afficherTableauTraceur(traceur) {

    if (document.querySelector('.tableauTraceur')) {
        document.querySelector('.tableauTraceur').remove();
    }

    const tableau = document.createElement('table');
    tableau.classList.add('tableauTraceur');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = traceur.nom;
    tr.appendChild(th);

    const eau = recupererTraceurEau();
    const th1 = document.createElement('th');
    th1.textContent = eau.nom;
    tr.appendChild(th1);

    /**
     * Les colonnes
     */
    let echellesTableau = [];
    for (let i = 0; i < traceur.echelles.length; i++) {
        echellesTableau.push(traceur.echelles[i]);
    }

    echellesTableau.sort((a, b) => a - b);
    const nbColonnes = traceur.data.size / 4;
    for (let i = 0; i < nbColonnes; i++) {
        const th = document.createElement('th');
        th.textContent = echellesTableau[i] + traceur.unite;
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    tableau.appendChild(thead);

    let data = [];
    for (let i = 1; i <= 4; i++) {
        let rowData = [];
        for (let j = 1; j <= nbColonnes; j++) {
            rowData.push({value: traceur.getDataParNom('L' + i + '-' + j), index: j});
        }
        data.push(rowData);
    }

    let transposedData = data[0].map((_, i) => data.map(row => row[i]));

    transposedData.sort((a, b) => a[0].value - b[0].value);

    let sortedData = transposedData[0].map((_, i) => transposedData.map(row => row[i]));

    for (let i = 0; i < 4; i++) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = 'L' + (i + 1);
        tr.appendChild(th);

        for (let j = 0; j < nbColonnes + 1; j++) {
            const td = document.createElement('td');
            if (j === 0) {
                td.textContent = eau.getDataParNom('L' + (i + 1) + '-' + 1);
            } else {
                td.textContent = sortedData[i][j - 1].value;
            }
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    document.querySelector('.descriptionConcentration').innerHTML = `<h2>Données de l'appareil <span>${numeroFluorimetre}</span> du <span>${traceur.dateMesure}</span> :</h2>`;
    tableau.appendChild(tbody);
    tableau.insertAdjacentHTML('afterbegin', `<caption>Signaux en mV du traceur ${traceur.nom}</caption>`);
    document.querySelector('.donnees').appendChild(tableau);
    document.querySelector('.lesBoutons').insertAdjacentHTML('beforeend', '<div class="bouton boutonClair boutonDlData" onclick="telechargerFichierTxt()">TÉLÉCHARGER LES DONNÉES</div>');
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE EXPORT
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Exporte les données du fichier Calibrat sous la forme d'un fichier texte
 * @return {string} le contenu du fichier texte
 */
function convertirEnTexte() {
    let texte = `FluoriGraphix - Export du ${getDateAujourdhui()} - Appareil n°${numeroFluorimetre}\n\n`;
    texte += `/!\\ Par convention, la turbidité doit toujours se trouver en dernière position dans le fichier, et l'eau en première position..\n`;
    texte += `Pour plus d'informations sur le fonctionnement de ce fichier, visitez la rubrique 'Documentation' du site FluoriGraphix.\n\n`;
    texte += `----------------------------------------------------------------\n`;

    for (let i = 0; i < traceurs.length; i++) {
        texte += `${traceurs[i].nom}\n`;
        texte += `${traceurs[i].dateMesure}\n`;

        let echelles = traceurs[i].echelles.map((echelle, index) => ({echelle, index}));

        if (traceurs[i].unite !== '') {

            texte += `${traceurs[i].unite}\n\n`;

            echelles.sort((a, b) => a.echelle - b.echelle);

            texte += '         ';
            for (let j = 0; j < echelles.length; j++) {
                texte += `${setEspaces(echelles[j].echelle, 5)}       `;
            }
            texte += '\n';
        } else {
            texte += '\n\n\n';
        }

        for (let j = 1; j <= 4; j++) {
            texte += `L${j}`;
            for (let k = 0; k < echelles.length; k++) {
                const dataValue = traceurs[i].getDataParNom('L' + j + '-' + (echelles[k].index + 1));
                if (dataValue !== undefined) {
                    texte += `     ${setEspaces(dataValue, 7)}`;
                }
            }
            texte += '\n';
        }

        texte += `----------------------------------------------------------------\n`;
    }
    return texte;
}


/**
 * Télécharge un fichier txt contenant les données de contenuCalibrat
 */
function telechargerFichierTxt() {
    if (contenuCalibrat !== '') {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenuCalibrat));
        element.setAttribute('download', 'ExportConcentrations-' + new Date().toLocaleString().replace(/\/|:|,|\s/g, '-') + '.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        afficherMessageFlash('Fichier téléchargé avec succès.', 'success');
    } else {
        afficherMessageFlash('Erreur : aucune donnée à télécharger.', 'danger');
    }
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE FICHIERS TXT
 * ---------------------------------------------------------------------------------------------------------------------
 */

/**
 * Récupère la date d'aujourd'hui au format jj/mm/aaaa
 * @return {string}
 */
function getNumeroFluorimetreTxt() {
    const lignes = contenuCalibrat.split('\n');
    const premiereLigne = lignes[0];
    const index = premiereLigne.indexOf('Appareil n°');
    return premiereLigne.substring(index + 11).trim();
}


/**
 * Récupère les sections du fichier txt.
 * @return {string[]} les sections du fichier txt
 */
function getSectionsCalibratTxt() {
    return contenuCalibrat.split('----------------------------------------------------------------');
}


/**
 * Récupère les noms des traceurs du fichier txt.
 * @return {*[]} les noms des traceurs
 */
function getNomsTraceursTxt() {
    const noms = [];
    const sections = getSectionsCalibrat();
    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const nom = section.split('\n')[1].trim();
        noms.push(nom);
    }
    return noms;
}


/**
 * Crée des objets de type Traceur à partir des données du fichier txt
 * @returns {Traceur[]} les objets Traceur créés
 */
function creerTraceurTxt() {
    traceurs = [];
    const sections = getSectionsCalibratTxt();
    for (let i = 1; i < sections.length - 2; i++) {
        if (sections[i] !== '' && sections[i] !== ' ') {
            const section = sections[i].split('\n');
            const nom = section[1].trim();
            let traceur = new Traceur(nom, section[2].trim(), section[3].trim());

            let futuresEchelles = [];
            if (section[3].trim() !== '') {
                futuresEchelles = section[5].split(/\s+/);
                futuresEchelles = futuresEchelles.filter(echelle => echelle !== '');
            } else {
                futuresEchelles.push(100);
            }

            const nbColonnes = futuresEchelles.length;

            for (let j = 0; j < nbColonnes; j++) {
                traceur.echelles.push(parseFloat(futuresEchelles[j]));
            }

            for (let j = 0; j < 4; j++) {
                const ligne = section[j + 6].split(/\s+/);
                for (let k = 0; k < nbColonnes; k++) {
                    traceur.addData(ligne[0] + `-${k + 1}`, parseFloat(ligne[k + 1]));
                }
            }

            traceurs.push(traceur);
        }
    }
    creerTurbidityTxt();
}


/**
 * Crée un objet Traceur de type Turbidité à partir des données du fichier txt.
 * La turbidité est la dernière section du fichier txt
 */
function creerTurbidityTxt() {
    const sections = getSectionsCalibratTxt();
    const section = sections[sections.length - 2].split('\n');

    const turbidite = new Traceur('Turbidité', section[2].trim(), section[3].trim());
    let futuresEchelles = section[5].split(/\s+/);
    futuresEchelles = futuresEchelles.filter(echelle => echelle !== '');
    const nbColonnes = futuresEchelles.length;

    for (let i = 0; i < nbColonnes; i++) {
        turbidite.echelles.push(parseFloat(futuresEchelles[i]));
    }

    for (let i = 0; i < 4; i++) {
        const ligne = section[i + 6].split(/\s+/);
        for (let j = 0; j < nbColonnes; j++) {
            turbidite.addData(ligne[0] + `-${j + 1}`, parseFloat(ligne[j + 1]));
        }
    }
    traceurs.push(turbidite);
}

