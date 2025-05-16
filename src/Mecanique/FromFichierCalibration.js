/**
 * Ce fichier JavaScript contient toutes les fonctions permettant de lire, puis de traiter les fichiers de calibration pour la partie "calibration" du site.
 * C'est ici que sont affichées les tableaux et les courbes des traceurs, et que sont exportés les fichiers CSV de calibration
 */

/**
 * Lignes du fichier de calibration
 * @type {string[]} lignesCalibrat
 */
let lignesCalibrat = [];

/**
 * Sections du fichier de calibration
 * @type {*[]} sectionsCalibrat
 */
let sectionsCalibrat = [];

/**
 * Tableau contenant les noms des traceurs
 * @type {*[]} nomsTraceur
 */
let nomsTraceur = [];

/**
 * Numéro du fluorimètre dans le fichier de calibration
 * @type {string} numéro
 */
let numeroFluorimetre = '';

/**
 * Tableau contenant tous les objets Traceur créés
 * @type {Traceur[]} traceurs
 */
let traceurs = [];


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * INITIALISATION
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Initialise les variables issues du fichier de calibration.
 * Prend en charge les fichiers de calibration CSV et DAT
 * @param estFichierDat - true si le fichier est un DAT, false si c'est un CSV
 * @param estDepuisCalibration - true si l'initialisation est faite depuis la page de calibration, false si c'est depuis une autre page
 */
function initFichierCalibration(estFichierDat = true, estDepuisCalibration = true) {

    if (contenuFichierCalibration !== '') {

        if (document.querySelector('.boutonDlData')) {
            document.querySelector('.boutonDlData').remove();
        }

        if (document.getElementById('graphiqueTraceur')) {
            document.getElementById('graphiqueTraceur').remove();
        }

        if (document.querySelector('.tableauTraceur')) {
            document.querySelector('.tableauTraceur').remove();
        }

        if (estFichierDat) {
            lignesCalibrat = contenuFichierCalibration.split('\n');
            sectionsCalibrat = getSectionsCalibrat();
            nomsTraceur = getNomsTraceursCalibrat();
            numeroFluorimetre = getNumeroFluorimetreCalibrat();
            creerTraceurs();
            creerTurbidity();
            contenuFichierCalibration = convertirEnTexte();
        } else {
            lignesCalibrat = contenuFichierCalibration.split('\n');
            sectionsCalibrat = getSectionsCalibratCSV();
            nomsTraceur = getNomsTraceursCSV();
            numeroFluorimetre = getNumeroFluorimetreCSV();
            creerTraceurCSV();
        }


        if (document.querySelector('.infosConcentration')) {
            document.querySelector('.infosConcentration').remove();
        }

        console.log(traceurs);

        if (estDepuisCalibration) {
            ajouterTraceurDansListe();
            document.querySelector('.equationPannel').style.display = 'flex';
        } else {
            if (contenuFichierMesures.includes('A145') && contenuFichierMesures.includes('A146') && contenuFichierMesures.includes('A147') && contenuFichierMesures.includes('A148')) {
                for (let i = 0; i < traceurs.length; i++) {
                    remplacerDonneesFichier(`A${145 + i}`, `L${1 + i}`);
                }
            }
            testerTousTraceurs();
        }

    } else {
        afficherMessageFlash('Erreur : aucune donnée exploitable.', 'danger');
    }
}


/**
 * Crée un graphique invisible et affiche la courbe de calculs pour chaque lampe de chaque traceur, permettant d'afficher un popup si une erreur dans les données est constatée.
 * Cette fonction est utilisée dans la partie visualisation, pour alerter l'utilisateur si ses données de calibration sont suspectées incorrectes.
 */
function testerTousTraceurs() {
    donneesCorrompues = false;
    for (let i = 0; i < traceurs.length; i++) {
        for (let j = 1; j <= 4; j++) {
            afficherGraphiqueTraceur(traceurs[i], j);
            initialiserCalculsCourbes(j, traceurs[i]);
        }
    }
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS POUR LES FICHIERS .DAT
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Récupère le numéro du fluorimètre à partir du fichier Calibrat.dat.
 * @returns {string} le numéro du fluorimètre
 */
function getNumeroFluorimetreCalibrat() {
    const lignes = contenuFichierCalibration.split('\n');
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

        } else {
            traceur.lampePrincipale = 'NaN';
        }

        traceurs.push(traceur);
    }
}


/**
 * Calcule une échelle en ppb à partir de la puissance de dix, passée en paramètre
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
        turbidite.lampePrincipale = 4;


        for (let j = 0; j < 4; j++) {
            const ligne = section[j + 1].split(/\s+/);
            turbidite.addData(ligne[0] + `-${k}`, parseFloat(ligne[1]));
        }
        k++;
    }
    traceurs.push(turbidite);
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS UTILITAIRES
 * ---------------------------------------------------------------------------------------------------------------------
 */


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
function ajouterTraceurDansListe() {

    const divTraceurs = document.querySelector('.wrapTraceursCalibration');

    for (let i = 0; i < traceurs.length; i++) {

        if (document.querySelector('#traceur' + traceurs[i].nom)) {
            document.querySelector('#traceur' + traceurs[i].nom).remove();
        }


        if (traceurs[i].unite !== '') {
            const span = document.createElement('span');
            span.textContent = traceurs[i].nom;
            span.id = 'traceur' + traceurs[i].nom;
            span.classList.add('traceurElement');

            if (i === 1) {
                span.classList.add('traceurActive');
                const traceur = traceurs[i];

                afficherTableauTraceur(traceur);
                ajouterLigneTraceurDansListe(traceur.lampePrincipale, traceur);
                afficherGraphiqueTraceur(traceur, traceur.lampePrincipale);
                setBandeauCalibration(traceur.lampePrincipale, traceur);
            }

            span.addEventListener('click', () => {
                const traceur = recupererTraceurParNom(span.textContent);
                afficherTableauTraceur(traceur);
                ajouterLigneTraceurDansListe(traceur.lampePrincipale, traceur);
                afficherGraphiqueTraceur(traceur, traceur.lampePrincipale);
                setBandeauCalibration(traceur.lampePrincipale, traceur);
            });

            divTraceurs.appendChild(span);
        }
    }
}


/**
 * Affiche un sélect pour choisir une ligne parmi L1, L2, L3 et L4, avec comme valeur par défaut idData
 * @param idData la valeur par défaut
 * @param traceur le traceur
 */
function ajouterLigneTraceurDansListe(idData, traceur) {

    const div = document.querySelector('.wrapLampesCalibration');


    for (let i = 1; i <= 4; i++) {

        if (document.querySelector('#lampe' + i)) {
            document.querySelector('#lampe' + i).remove();
        }

        const span = document.createElement('span');
        span.textContent = 'L' + i;
        span.id = 'lampe' + i;
        span.classList.add('ligneElement');

        if (i === idData) {
            span.classList.add('lampeActive');
        }

        span.addEventListener('click', () => {
            afficherGraphiqueTraceur(traceur, i);
            setBandeauCalibration(i, traceur);
        });
        div.appendChild(span);
    }
}


/**
 * Paramètre le bouton de calcul
 * @param idLampe l'id de la lampe à traiter
 * @param Traceur le traceur à traiter
 */
function setBandeauCalibration(idLampe, Traceur) {
    document.querySelector('.wrapBandeauCalibration').style.display = 'flex';

    const spans = document.querySelectorAll('.wrapLampesCalibration span');
    spans.forEach(span => {
        span.classList.remove('lampeActive');
    });

    if (document.querySelector('#lampe' + idLampe)) {
        document.querySelector('#lampe' + idLampe).classList.add('lampeActive');
    }

    //on fait pareil pour les traceurs
    const spansTraceurs = document.querySelectorAll('.wrapTraceursCalibration span');

    spansTraceurs.forEach(span => {
        span.classList.remove('traceurActive');
    });

    if (document.querySelector('#traceur' + Traceur.nom)) {
        document.querySelector('#traceur' + Traceur.nom).classList.add('traceurActive');
    }

    initialiserCalculsCourbes(idLampe, Traceur);
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * AFFICHAGE DES DONNEES (TABLEAU)
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Affiche dans une div un tableau contenant les données d'un traceur : 4 lignes de L1 à L4, et plusieurs colonnes pour tous les Y de LX-Y
 * @param traceur le traceur à partir duquel les données doivent être affichées
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

    let dataMap = new Map();
    for (let i = 0; i < traceur.echelles.length; i++) {
        let echelle = traceur.echelles[i];
        let data = [];
        for (let j = 1; j <= 4; j++) {
            data.push(traceur.getDataParNom('L' + j + '-' + (i + 1)));
        }
        dataMap.set(echelle, data);
    }

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
                let echelle = echellesTableau[j - 1];
                let data = dataMap.get(echelle);
                if (data[i] !== undefined && data[i] !== null) {
                    td.textContent = data[i].toString();
                }
            }
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    document.querySelector('.descriptionConcentration').style.display = 'block';
    document.querySelector('.descriptionConcentration').innerHTML = `<h2>Données de l'appareil <span>${numeroFluorimetre}</span> du <span>${traceur.dateMesure}</span> :</h2>`;
    tableau.appendChild(tbody);
    tableau.insertAdjacentHTML('afterbegin', `<caption>Signal en mV du traceur ${traceur.nom}</caption>`);
    document.querySelector('.donnees').appendChild(tableau);
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE EXPORT
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Exporte les données du fichier Calibrat sous la forme d'un fichier CSV
 * @return {string} le contenu du fichier texte
 */
function convertirEnTexte() {
    let texte = `FluoGraphiX - Export du ${getDateAujourdhui()} - Appareil ${numeroFluorimetre}\n\n`;
    texte += `/!\\ Par convention, la turbidité doit toujours se trouver en dernière position dans le fichier, et l'eau en première position.\n`;
    texte += `Pour plus d'informations sur le fonctionnement de ce fichier, visitez la rubrique 'Documentation' du site FluoGraphiX.\n\n`;
    texte += `----------------------------------------------------------------------------------------\n`;

    for (let i = 0; i < traceurs.length; i++) {
        texte += `${traceurs[i].nom}\n`;
        texte += `${traceurs[i].dateMesure}\n`;

        let echelles = traceurs[i].echelles.map((echelle, index) => ({echelle, index}));

        if (traceurs[i].unite !== '') {

            texte += `${traceurs[i].unite}\n`;
            texte += `L${traceurs[i].lampePrincipale}\n\n`;

            echelles.sort((a, b) => a.echelle - b.echelle);

            texte += '';
            for (let j = 0; j < echelles.length; j++) {
                texte += `;${echelles[j].echelle}`;
            }
            texte += '\n';
        } else {
            texte += '\n\n\n\n';
        }

        for (let j = 1; j <= 4; j++) {
            texte += `L${j}`;
            for (let k = 0; k < echelles.length; k++) {
                const dataValue = traceurs[i].getDataParNom('L' + j + '-' + (echelles[k].index + 1));
                if (dataValue !== undefined) {
                    texte += `;${dataValue}`;
                }
            }
            texte += '\n';
        }

        texte += `----------------------------------------------------------------------------------------\n`;
    }
    return texte;
}


/**
 * Télécharge un fichier CSV contenant les données de contenuCalibrat, donc du fichier originel
 */
function telechargerFichierCSV() {
    if (contenuFichierCalibration !== '') {
        const element = document.createElement('a');
        const universalBOM = "\uFEFF";
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(universalBOM + contenuFichierCalibration));
        element.setAttribute('download', 'ExportCalibration-' + new Date().toLocaleString().replace(/\/|:|,|\s/g, '-') + '.csv');
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
 * PARTIE FICHIERS CSV
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Récupère le numéro du fluorimètre depuis le fichier CSV
 * @return {string}
 */
function getNumeroFluorimetreCSV() {
    const lignes = contenuFichierCalibration.split('\n');
    const premiereLigne = lignes[0];
    const index = premiereLigne.indexOf('Appareil');
    return supprimerPointVirgule(premiereLigne.substring(index + 9).trim());
}


/**
 * Récupère les sections du fichier CSV, séparées par une suite de tirets.
 * @return {string[]} les sections du fichier txt
 */
function getSectionsCalibratCSV() {
    return contenuFichierCalibration.split('----------------------------------------------------------------------------------------');
}


/**
 * Récupère les noms des traceurs du fichier CSV.
 * @return {*[]} les noms des traceurs
 */
function getNomsTraceursCSV() {
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
 * Crée des objets de type Traceur à partir des données du fichier CSV
 * @returns {Traceur[]} les objets Traceur créés
 */
function creerTraceurCSV() {
    traceurs = [];
    const sections = getSectionsCalibratCSV();
    for (let i = 1; i < sections.length - 2; i++) {
        if (sections[i] !== '' && sections[i] !== ' ') {
            const section = sections[i].split('\n');
            const nom = supprimerPointVirgule(section[1].trim());
            let traceur = new Traceur(nom, supprimerPointVirgule(section[2].trim()), supprimerPointVirgule(section[3].trim()));
            traceur.lampePrincipale = parseFloat(section[4].charAt(1));

            let futuresEchelles = [];
            if (section[3].trim() !== '') {
                futuresEchelles = section[6].split(';');
                futuresEchelles = futuresEchelles.filter(echelle => echelle !== '');
            } else {
                futuresEchelles.push(100);
            }

            const nbColonnes = futuresEchelles.length;

            for (let j = 0; j < nbColonnes; j++) {
                if (!isNaN(parseFloat(futuresEchelles[j]))) {
                    traceur.echelles.push(parseFloat(futuresEchelles[j]));
                }
            }

            for (let j = 0; j < 4; j++) {
                const ligne = section[j + 7].split(';');
                for (let k = 0; k < nbColonnes; k++) {
                    traceur.addData(ligne[0] + `-${k + 1}`, parseFloat(ligne[k + 1]));
                }
            }

            traceurs.push(traceur);
        }
    }
    creerTurbidityCSV();
}


/**
 * Crée un objet Traceur de type Turbidité à partir des données du fichier CSV.
 * La turbidité est la dernière section du fichier txt
 */
function creerTurbidityCSV() {
    const sections = getSectionsCalibratCSV();
    const section = sections[sections.length - 2].split('\n');

    const turbidite = new Traceur('Turbidité', supprimerPointVirgule(section[2].trim()), supprimerPointVirgule(section[3].trim()));
    turbidite.lampePrincipale = 4;
    let futuresEchelles = section[6].split(';');
    futuresEchelles = futuresEchelles.filter(echelle => echelle !== '');
    const nbColonnes = futuresEchelles.length;

    for (let i = 0; i < nbColonnes; i++) {
        turbidite.echelles.push(parseFloat(futuresEchelles[i]));
    }

    for (let i = 0; i < 4; i++) {
        const ligne = section[i + 7].split(';');
        for (let j = 0; j < nbColonnes; j++) {
            turbidite.addData(ligne[0] + `-${j + 1}`, parseFloat(ligne[j + 1]));
        }
    }
    traceurs.push(turbidite);
}


/**
 * Supprime tous les ';' d'un texte passé en paramètre
 * @param texte le texte à modifier
 * @return {string} le texte sans les ';'
 */
function supprimerPointVirgule(texte) {
    return texte.replace(/;/g, '');
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE L'AFFICHAGE DU BANDEAU
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Affiche les détails d'un élément du bandeau lorsque l'utilisateur le survole
 */
function setEventListeneresBandeauCalibration() {
    const tooltip = document.getElementById('tooltip');

    document.querySelectorAll('.boutonBandeauCalibration').forEach(element => {
        element.addEventListener('mouseover', (event) => {
            tooltip.textContent = element.querySelector('span').textContent;
            tooltip.style.display = 'block';
        });

        element.addEventListener('mousemove', (event) => {
            if (event && event.pageX !== undefined && event.pageY !== undefined) {
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            }
        });

        element.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });
    });
}


window.addEventListener('DOMContentLoaded', (event) => {

    if (getCookie() === 'vueConcentrations') {
        setEventListeneresBandeauCalibration();
    }

});




function afficherEquation() {
    document.querySelector('.equationPannel').style.right = '0';
}

function fermerEquation() {
    document.querySelector('.equationPannel').style.right = '-350px';
}