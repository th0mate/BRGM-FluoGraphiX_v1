/**
 * Ce fichier JavaScript contient toutes les fonctions utiles pour les paramètres supplémentaires proposés dans la partie "visualisation" de FluoriGraphix
 * Se trouvent ici les fonctions d'affichage du popup, de calcul et d'interactions en lien avec les fonctionnalités de calculs de :
 * Correction de la turbidité / laison des labels de calibration avec les noms de courbes / correction des interférences / conversion en concentrations / correction du bruit de fond
 * /!\ ATTENTION : sont utilisées des fonctions de Graphiques.js ; calculsCourbesCalibration.js; utils.js: dispenserVisualisation.js
 * Ce fichier est très long, il m'a pris énormément de temps à coder. Bon courage ;)
 */


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * DECLARATION DES VARIABLES GLOBALES
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Le niveau de correction à appliquer pour la correction de la turbidité
 * @type {number} un nombre compris entre 0 et 2
 */
let niveauCorrection = 1;

/**
 * Liste des lampes à corriger pour la correction de la turbidité
 * @type {*[]} un tableau contenant les ID des lampes à corriger
 */
let listeLampesACorriger = [];

/**
 * Le traceur à traiter pour la conversion en concentration
 * @type {Traceur} un objet Traceur
 */
let traceurATraiter;

/**
 * Liste des calculs effectués pour les courbes de correction de la turbidité et de conversion en concentration. Utilisés ensuite lors de l'export en CSV
 * @type {*[]} un tableau contenant les objets Calculs
 */
let listeCalculs = [];

/**
 * Le traceur, en concentration, à exporter au format CSV pour TRAC
 * @type {Traceur} un objet Traceur
 */
let traceurAExporter;

/**
 * La date d'injection à renseigner pour l'export TRAC
 * @type {string} une date au format 'yyyy-MM-dd'
 */
let dateInjection;




/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE L'AFFICHAGE DU POPUP DE PARAMETRES ET FONCTIONS UTILES
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Affiche les paramètres supplémentaires pour la visualisation des parasites sous la forme d'un popup
 */
function afficherPopupParametresGraphiques() {
    if (contenuFichier !== '') {
        fermerPopupParametres();

        let estFichierDat = true;
        if (contenuCalibrat.split('\n')[0].includes('FluoriGraphix')) {
            estFichierDat = false;
        }

        if (traceurs.length === 0) {
            init(estFichierDat, false);
        }

        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        document.body.style.overflowY = 'hidden';

        let message = '';

        if (contenuCalibrat === '') {
            message = '<span class="calibratAbsent"><img src="Ressources/img/attentionOrange.png" alt="Perte de connexion">Aucun fichier de calibration n\'a été importé. <input type="file" id="inputCalibrat" accept=".dat,.csv" onchange="initParasites()"></span>';
        }

        let popupHTML = "";
        popupHTML += `
        <div class='grandPopup'>
            <div class="entete">
                <h2>Paramètres supplémentaires</h2>
                <img src="Ressources/img/close.png" class="close" onclick="fermerPopupParametres()" alt="fermer">
            </div>
            ${message}
            
        <div class="ongletsParam">
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(1)">Renommer les courbes</div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(2)">Corriger la turbidité</div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(3)">Convertir en concentrations</div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(4)">Corriger les interférences</div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(5)">Corriger le bruit de fond</div>
        </div>
        
        <div class="ongletParam onglet1" id="1"><br><h2>Renommer les labels des courbes</h2>`;


        if (calibrationEstLieGraphiques()) {
            popupHTML += `<img src="Ressources/img/goodNew.png" alt="Succès"><h4>Les courbes ont été liées aux labels du fichier de calibration automatiquement. Aucune action n'est requise de votre part.</h4>`;
        } else {
            popupHTML += `
           
            <h4>Veuillez lier les labels du fichier de calibration à des courbes :</h4>
            <table class="">
                <tr>
                    <th>Label</th>
                    <th>Courbe</th>
                </tr>`;

            for (let i = 0; i < traceurs.length; i++) {
                const traceur = traceurs[i];
                if (isNaN(traceur.lampePrincipale)) {
                    continue;
                }

                popupHTML += `
                <tr>
                    <td>L${traceur.lampePrincipale}</td>
                    <td>
                        <select onchange="remplacerDonneesFichier(this.value, 'L${traceur.lampePrincipale}')">
                        <option value="" selected disabled>Sélectionner</option>
                            `;
                const lignes = contenuFichier.split('\n');
                const header = lignes[2].split(';').splice(2);

                for (let j = 0; j < header.length; j++) {
                    popupHTML += `<option value="${header[j]}">${header[j]}</option>`;
                }

                popupHTML += `
                        </select>
                    </td>
                </tr>`;
            }

            popupHTML += `</table>
            `;
        }

        let checkBoxBoutons = '';

        for (let i = 0; i < traceurs.length; i++) {
            const traceur = traceurs[i];
            if (traceur.lampePrincipale !== '' && !isNaN(traceur.lampePrincipale) && traceur.unite.toLowerCase() !== 'ntu') {
                checkBoxBoutons += `<label><input type="checkbox" onchange="modifierListeLampe(this.value)" value="${traceur.lampePrincipale}">L${traceur.lampePrincipale}</label>`;
            }
        }

        popupHTML += `</div>
        <div class="ongletParam" id="2">
            <br>
            <h2>Correction de la turbidité</h2>
            <br>
            <h4>Choisissez le niveau de correction de la turbidité à appliquer :</h4>
        
            <div class='range'>
                <input id="inputRange" type="range" min='0' max='2' step='0.1' />
                <span>1</span>
            </div>
            <br>
                        
            <h4>Sélectionner les lampes à corriger :</h4>
            
            <div class="checkBoxLampes">
                ${checkBoxBoutons}
            </div>
            
            <div class="boutonFonce bouton boutonOrange" onclick="lancerCorrectionTurbidite()">TERMINER</div></div>
        
        
        <div class="ongletParam" id="3">
            <br>
            <h2>Calcul de concentrations de traceurs</h2>
            <br>
            <h4>Sélectionner le traceur à afficher :</h4>
            <select class="selectOrange" onchange="metAJourTraceurAModifier(this.value)">
            <option value="" selected disabled>Sélectionner...</option>`;


        for (let i = 0; i < traceurs.length; i++) {
            const traceur = traceurs[i];
            if (traceur.lampePrincipale !== '' && !isNaN(traceur.lampePrincipale)) {
                popupHTML += `
                <option value="${traceur.nom}">${traceur.nom}</option>
                `;
            }
        }

        popupHTML += `</select><div class="boutonFonce bouton boutonOrange" onclick="ajouterCourbeConcentrationTraceur(traceurATraiter)">TERMINER</div></div>`;


        const nbTraceurs = traceurs.length - 2;

        let selectNbTraceurs = '<select class="selectOrange" onchange="mettreAJourNbTraceurs(this.value)"><option selected disabled value="">Sélectionnez une valeur...</option>';
        for (let i = 0; i < nbTraceurs; i++) {
            let s = '';
            if (i + 1 > 1) {
                s = 's';
            }
            selectNbTraceurs += `<option value="${i + 1}">${i + 1} Traceur${s}</option>`;
        }
        selectNbTraceurs += '</select>';

        popupHTML += `<div class="ongletParam" id="4">
            <br>
            <h2>Correction des interférences</h2>
            <br>
            
            <h4>Choisissez le nombre de traceurs présents :</h4>
       
            ${selectNbTraceurs}
            
            <div class="listeSelectsTraceurs">
            </div>
            
            <div class="boutonFonce bouton boutonOrange" onclick="ajouterCourbeConcentrationTraceur(traceurATraiter)">TERMINER</div>
        </div>
        
        
        <div class="ongletParam" id="5">
            <br>
            <h2>Correction du bruit de fond</h2>
            <br>
            <h4 class="texteZoneSelection"></h4>
            <br>
            <div class="boutonFonce bouton boutonOrange" onclick="selectionnerZoneGraphique()">SELECTIONNER</div>
        </div>
    
        
        
    </div>

    


    `;
        overlay.innerHTML += popupHTML;
        afficherOngletParametre(1);
    }
}


/**
 * Ferme le popup des paramètres
 */
function fermerPopupParametres() {
    if (document.querySelector('.grandPopup') !== null) {
        document.querySelector('.grandPopup').remove();
        document.body.style.overflow = 'auto';
    }
    if (document.querySelector('div[style*="z-index: 1000"]') !== null) {
        document.querySelector('div[style*="z-index: 1000"]').remove();
    }
}


/**
 * Lit le fichier de calibration et initialise les données, sans afficher les tableaux et les courbes de la partie calibration
 */
function initParasites() {
    listeCalculs = [];
    const inputFichier = document.getElementById('inputCalibrat');
    const reader = new FileReader();
    reader.readAsText(inputFichier.files[0]);

    let estFichierDat = false;

    if (inputFichier.files[0].name.split('.').pop() === "dat") {
        estFichierDat = true;
    }

    reader.onload = function () {
        contenuCalibrat = nettoyerFichierCSV(reader.result);
        init(estFichierDat, false);
        afficherMessageFlash("Fichier Calibrat.dat importé avec succès.", 'success');
        document.querySelector('.calibratAbsent').remove();
    };

    fermerPopupParametres();
    setTimeout(() => {
        afficherPopupParametresGraphiques();
    }, 500);

}


/**
 * Détecte si les noms des courbes correspondent aux labels du fichier de calibration
 * @returns {boolean} true si les labels correspondent, false sinon
 */
function calibrationEstLieGraphiques() {
    const lignes = contenuFichier.split('\n');
    const header = lignes[2].split(';').splice(2);

    for (let i = 0; i < header.length; i++) {
        header[i] = header[i].replace(/[\n\r]/g, '');
    }

    let headerCalibrat = [];

    for (let i = 0; i < traceurs.length; i++) {
        const traceur = traceurs[i];

        if (traceur.lampePrincipale !== '') {
            headerCalibrat.push('L' + traceur.lampePrincipale);
        }
    }

    let estIdentique = true;
    for (let i = 0; i < headerCalibrat.length; i++) {

        if (headerCalibrat[i] === 'LNaN') {
            continue;
        }

        if (!header.includes(headerCalibrat[i])) {
            estIdentique = false;
        }
    }

    return estIdentique;
}


/**
 * Affiche l'onglet correspondant aux paramètres supplémentaires de visualisation
 * @param idOnglet ID de l'onglet à afficher
 */
function afficherOngletParametre(idOnglet) {
    const onglets1 = document.querySelectorAll('.ongletsParam .bouton');

    for (let i = 0; i < onglets1.length; i++) {
        onglets1[i].classList.remove('active');
    }
    onglets1[idOnglet - 1].classList.add('active');

    const onglets = document.querySelectorAll('.ongletParam');

    for (let i = 0; i < onglets.length; i++) {
        onglets[i].style.display = 'none';
    }
    onglets[idOnglet - 1].style.display = 'flex';

    if (idOnglet === 2) {
        preparerInputRange();
    }
}


/**
 * Remplace une suite de caractère par une autre dans contenuFichier, et affiche à nouveau le graphique à partir de ces nouvelles données
 * @param ancien Ancien label à remplacer
 * @param nouveau Nouveau label à ajouter
 */
function remplacerDonneesFichier(ancien, nouveau) {
    let lignes = contenuFichier.split('\n');
    let header = lignes[2].split(';');

    for (let i = 0; i < header.length; i++) {
        if (header[i] === ancien) {
            header[i] = nouveau;
        }

        if (header[i] === 'L' + ancien) {
            header[i] = 'L' + nouveau;
        }
    }

    lignes[2] = header.join(';');

    contenuFichier = lignes.join('\n');
    afficherGraphique(contenuFichier);

    if (calibrationEstLieGraphiques()) {
        document.querySelector('.onglet1').innerHTML = `<img src="Ressources/img/goodNew.png" alt="Succès"> <h4>Les courbes ont été liées aux labels du fichier de calibration avec succès.</h4>`;
    }
}




/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE LA CORRECTION DE LA TURBIDITE
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Affiche une courbe de correction de la turbidité pour une lampe donnée sur le graphique de la partie visualisation
 */
function corrigerTurbidite(idLampe, TS = niveauCorrection) {
    const eau = traceurs.find(traceur => traceur.unite === '');
    const turbidite = traceurs.find(traceur => traceur.unite.toLowerCase() === 'ntu');

    const resultat = effectuerCalculsCourbes(idLampe, turbidite);
    const calcul = new Calculs(`Correction de turbidité (L${idLampe})`, 'oui');

    if (!listeCalculs.includes(calcul)) {
        for (let i = 0; i < resultat.length; i++) {
            calcul.ajouterParametreCalcul(`a${i}`, resultat[0][i]);
        }
        calcul.ajouterParametreCalcul(`TS`, TS);
        listeCalculs.push(calcul);
    }

    const data = {
        label: `L${idLampe}Corr`,
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: getRandomColor(),
        borderWidth: 2,
        pointRadius: 0
    };

    let contenu = [];
    const lignes = contenuFichier.split('\n');
    let colonnes = lignes[2].split(';');
    let indexLampe = 0;
    let indexTurb = 0;

    colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));

    for (let j = 0; j < colonnes.length; j++) {
        if (colonnes[j] === `L${idLampe}`) {
            indexLampe = j;
        }
        if (colonnes[j] === `L4`) {
            indexTurb = j;
        }
    }

    for (let i = 3; i < lignes.length - 1; i++) {
        const colonnes = lignes[i].split(';');

        if (colonnes[indexLampe] !== '' && colonnes[indexTurb] !== '') {
            const ligne = [];
            ligne.push(colonnes[0] + '-' + colonnes[1]);
            ligne.push(colonnes[indexLampe].replace(/[\n\r]/g, ''));
            ligne.push(colonnes[indexTurb].replace(/[\n\r]/g, ''));
            contenu.push(ligne);
        }
    }

    let colonneFinale = [];


    if (resultat[0].length === 3) {

        for (let i = 0; i < contenu.length; i++) {
            if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                colonneFinale.push(contenu[i][1])
            } else {
                const log = Math.log(parseFloat(contenu[i][2]) - parseFloat(eau.getDataParNom('L4-1')));
                const log2 = Math.log(parseFloat(contenu[i][2]) - parseFloat(eau.getDataParNom('L4-1'))) ** 2;
                const exp = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * log + parseFloat(resultat[0][2]) * log2);
                const valeur = parseFloat(contenu[i][1]) - TS * exp;

                colonneFinale.push(valeur);
            }
        }

    } else if (resultat[0].length === 2) {

        for (let i = 0; i < contenu.length; i++) {
            if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                colonneFinale.push(contenu[i][1])
            } else {
                const log = Math.log(parseFloat(contenu[i][2]) - parseFloat(eau.getDataParNom('L4-1')));
                const exp = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * log);
                const valeur = parseFloat(contenu[i][1]) - TS * exp;

                colonneFinale.push(valeur);
            }
        }
    } else {

        for (let i = 0; i < contenu.length; i++) {
            if (contenu[i][2] <= eau.getDataParNom('L4-1')) {
                colonneFinale.push(contenu[i][1])
            } else {
                const valeur = parseFloat(contenu[i][1]) - TS * parseFloat(resultat[0][0]);
                colonneFinale.push(valeur);
            }
        }
    }


    const header = lignes[2].replace(/[\n\r]/g, '').split(';');
    header.push(`L${idLampe}Corr`);
    lignes[2] = header.join(';');

    for (let i = 0; i < contenu.length; i++) {
        const timeDate = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
        const timestamp = timeDate.toMillis();

        lignes[i + 3] = lignes[i + 3].replace(/[\n\r]/g, '');
        lignes[i + 3] += `;${arrondirA2Decimales(colonneFinale[i])}`;


        data.data.push({x: timestamp, y: colonneFinale[i]});
    }

    contenuFichier = lignes.join('\n');

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);

    for (let i = 0; i < existingChart.data.datasets.length; i++) {
        if (existingChart.data.datasets[i].label === `L${idLampe}Corr`) {
            existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${idLampe}Corr`);
        }
    }

    if (existingChart) {
        existingChart.data.datasets.push(data);
        existingChart.update();
    }

}


/**
 * Prépare le visuel pour le choix du niveau de correction de la turbidité
 */
function preparerInputRange() {
    document.querySelector('#inputRange').addEventListener('input', function () {
        document.querySelector('.range span').innerText = this.value;
        niveauCorrection = this.value;
    });
}



/**
 * Ajoute ou supprime un id de lampe dans la liste des lampes à corriger
 */
function modifierListeLampe(idLampe) {
    if (listeLampesACorriger.includes(idLampe)) {
        listeLampesACorriger = listeLampesACorriger.filter(lampe => lampe !== idLampe);
    } else {
        listeLampesACorriger.push(idLampe);
    }
}


/**
 * Lance la correction de la turbidité pour les lampes sélectionnées
 */
function lancerCorrectionTurbidite() {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);

    for (let i = 0; i < traceurs.length; i++) {
        if (existingChart.data.datasets.find(dataset => dataset.label === `L${traceurs[i].lampePrincipale}Corr`)) {
            existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceurs[i].lampePrincipale}Corr`);
        }
    }


    for (let i = 0; i < listeLampesACorriger.length; i++) {
        corrigerTurbidite(listeLampesACorriger[i]);

        existingChart.data.datasets.forEach((dataset, index) => {
            if (dataset.label !== `L${listeLampesACorriger[i]}` && dataset.label !== `L${listeLampesACorriger[i]}Corr`) {
                dataset.hidden = true;
                if (existingChart.isDatasetVisible(index)) {
                    existingChart.toggleDataVisibility(index);
                }
            }
        });
    }
    listeLampesACorriger = [];
    fermerPopupParametres();
}


/**
 * Met dans la variable globale l'objet traceur récupéré à partir de son nom
 * @param nomTraceur Nom du traceur à récupérer
 */
function metAJourTraceurAModifier(nomTraceur) {
    traceurATraiter = traceurs.find(traceur => traceur.nom === nomTraceur);
}



/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE LA CONVERSION D'UN TRACEUR EN CONCENTRATION
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Ajoute dans le graphique la courbe de concentration pour le traceur sélectionné, à partir des calculs effectués
 * @param traceur Traceur dont la concentration doit être affichée
 */
function ajouterCourbeConcentrationTraceur(traceur) {
    if (traceur) {
        const eau = traceurs.find(t => t.unite === '');
        const resultat = effectuerCalculsCourbes(traceur.lampePrincipale, traceur);
        const calcul = new Calculs(`${traceur.nom}: Coefficients mV->${traceur.unite}`, 'oui');

        if (!listeCalculs.includes(calcul)) {
            for (let i = 0; i < resultat.length; i++) {
                calcul.ajouterParametreCalcul(`a${i}`, resultat[0][i]);
            }
            listeCalculs.push(calcul);
        }

        const data = {
            label: `${traceur.nom}`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        };

        const contenu = [];
        const lignes = contenuFichier.split('\n');
        let colonnes = lignes[2].split(';');
        let indexLampe = -1;

        colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);

        if (existingChart.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr`)) {
            afficherMessageFlash('Courbe de correction de la turbidité associée détectée', 'info');

            for (let i = 0; i < existingChart.data.datasets.length; i++) {
                if (existingChart.data.datasets[i].label === `L${traceur.lampePrincipale}Corr`) {
                    const dataset = existingChart.data.datasets[i];
                    for (let j = 0; j < dataset.data.length; j++) {
                        const timeDate = DateTime.fromMillis(dataset.data[j].x, {zone: 'UTC'});
                        const timestamp = timeDate.toFormat('dd/MM/yy-HH:mm:ss');
                        contenu.push([timestamp, dataset.data[j].y]);
                    }
                }
            }

        } else {

            for (let j = 0; j < colonnes.length; j++) {

                if (colonnes[j] === `L${traceur.lampePrincipale}`) {
                    indexLampe = j;
                    break;
                }
            }


            for (let i = 3; i < lignes.length - 1; i++) {
                const colonnes = lignes[i].split(';');
                if (colonnes[indexLampe] !== '') {
                    const ligne = [];
                    ligne.push(colonnes[0] + '-' + colonnes[1]);
                    ligne.push(parseFloat(colonnes[indexLampe].replace(/[\n\r]/g, '')));
                    contenu.push(ligne);
                }
            }
        }

        const header = lignes[2].replace(/[\n\r]/g, '').split(';');
        header.push(`${traceur.nom}`);
        lignes[2] = header.join(';');

        for (let i = 0; i < contenu.length; i++) {
            const timestamp = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            const mVValue = contenu[i][1];

            if (!isNaN(mVValue)) {
                const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                if (!isNaN(eauValue) && mVValue > eauValue) {

                    const logValue = Math.log(mVValue - eauValue);

                    if (resultat[0].length === 3) {
                        const log2Value = logValue ** 2;
                        const concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue + parseFloat(resultat[0][2]) * log2Value);
                        data.data.push({x: timestamp, y: concentration});
                        lignes[i + 3] = lignes[i + 3].replace(/[\n\r]/g, '');
                        lignes[i + 3] += `;${arrondirA2Decimales(concentration)}`;

                    } else if (resultat[0].length === 2) {
                        const concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue);
                        data.data.push({x: timestamp, y: concentration});
                        lignes[i + 3] = lignes[i + 3].replace(/[\n\r]/g, '');
                        lignes[i + 3] += `;${arrondirA2Decimales(concentration)}`;

                    } else if (resultat[0].length === 1) {
                        const concentration = parseFloat(resultat[0][0]) * mVValue;
                        data.data.push({x: timestamp, y: concentration});
                        lignes[i + 3] = lignes[i + 3].replace(/[\n\r]/g, '');
                        lignes[i + 3] += `;${arrondirA2Decimales(concentration)}`;
                    }
                }
            }
        }

        contenuFichier = lignes.join('\n');

        existingChart.data.datasets.forEach((dataset, index) => {
            if (dataset.label !== `L${traceur.lampePrincipale}` && dataset.label !== `L${traceur.lampePrincipale}Corr` && dataset.label !== `${traceur.nom}`) {
                dataset.hidden = true;
                if (existingChart.isDatasetVisible(index)) {
                    existingChart.toggleDataVisibility(index);
                }
            }
        });

        existingChart.data.datasets.push(data);
        existingChart.update();

        document.querySelector('.downloadFile').onclick = function () {
            afficherPopupTelecharger();
        }

        fermerPopupParametres();
    }
}



/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE L'EXPORT TRAC ET CSV
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Affiche un pop-up permettant de choisir entre un export normal et un export TRAC
 */
function afficherPopupTelecharger() {
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    document.body.style.overflowY = 'hidden';

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    const dateMin = 'min=' + DateTime.fromMillis(existingChart.data.datasets[0].data[0].x, {zone: 'UTC'}).toFormat('yyyy-MM-dd');
    const dateMax = 'max=' + DateTime.fromMillis(existingChart.data.datasets[0].data[existingChart.data.datasets[0].data.length - 1].x, {zone: 'UTC'}).toFormat('yyyy-MM-dd');

    const listeTraceursConcentration = [];
    for (let i = 0; i < existingChart.data.datasets.length; i++) {
        for (let j = 0; j < traceurs.length; j++) {
            if (existingChart.data.datasets[i].label === traceurs[j].nom) {
                listeTraceursConcentration.push(traceurs[j]);
            }
        }
    }

    let select = '';
    let border = '';
    if (listeTraceursConcentration.length > 1) {
        select = '<h4>Choisissez le traceur à exporter</h4>';
        select += '<select class="selectOrange" id="selectTraceurExport">';
        select += '<option value="" selected disabled>Sélectionner...</option>';

        for (let i = 0; i < listeTraceursConcentration.length; i++) {
            select += `<option value="${listeTraceursConcentration[i].nom}">${listeTraceursConcentration[i].nom}</option>`;
        }
        select += '</select>';
    } else {
        border = 'style="border: none;"';
        traceurAExporter = listeTraceursConcentration[0];
    }


    let popupHTML = `
<div class='grandPopup'>
    <div class="entete">
        <h2>Exporter les données</h2>
        <img src="Ressources/img/close.png" class="close" onclick="fermerPopupTelecharger()" alt="fermer">
    </div>
    <h2 style="color: white">Choisissez le format d'export :</h2>
    <h3>Format Standard CSV</h3>
    <div class="boutonFonce bouton boutonOrange dl" onclick="telechargerFichier()">EXPORTER LES DONNÉES</div>
    <br>
    <br>
    <h3>Format TRAC</h3>
    <div class="separateur">
    <span ${border}>
    <h4>Choisissez la date d'injection</h4>
    <input type="date" id="dateInjection" ${dateMin} ${dateMax} onchange="dateInjection = this.value;">
    </span>
    <br>
    <span>
    ${select}
    </span>
    </div>
    <div class="boutonFonce bouton boutonOrange dl" onclick="telechargerTRAC(dateInjection, traceurAExporter);">EXPORTER VERS TRAC</div>
</div>
`;

    overlay.innerHTML += popupHTML;

    if (document.querySelector('#selectTraceurExport')) {
        document.querySelector('#selectTraceurExport').onchange = function () {
            traceurAExporter = listeTraceursConcentration.find(t => t.nom === this.value);
        }
    }

}


/**
 * Ferme le popup de téléchargement
 */
function fermerPopupTelecharger() {
    if (document.querySelector('.grandPopup') !== null) {
        document.querySelector('.grandPopup').remove();
        document.body.style.overflow = 'auto';
    }
    if (document.querySelector('div[style*="z-index: 1000"]') !== null) {
        document.querySelector('div[style*="z-index: 1000"]').remove();
    }
}


/**
 * Télécharge les données au format TRAC
 */
function telechargerTRAC(dateInjection, traceur) {
    let contenuCSVTRAC = 'j;ppb';

    const lignes = contenuFichier.split('\n');
    const header = lignes[2].split(';');
    let indexTraceur = -1;

    for (let i = 0; i < header.length; i++) {
        if (header[i] === traceur.nom) {
            indexTraceur = i;
        }
    }

    for (let i = 3; i < lignes.length - 1; i++) {
        const colonnes = lignes[i].split(';');

        if (colonnes.length < header.length) {
            continue;
        }

        const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', { zone: 'UTC' });
        console.log(timeDate);

        if (!timeDate.isValid) {
            console.error('Date invalide à la ligne:', i + 1);
            continue;
        }

        const timestamp = timeDate.toFormat('dd/MM/yy-HH:mm:ss');
        const date = DateTime.fromFormat(timestamp, 'dd/MM/yy-HH:mm:ss', { zone: 'UTC' });
        const dateInjectionObj = DateTime.fromFormat(dateInjection, 'yyyy-MM-dd', { zone: 'UTC' });
        const diff = date.diff(dateInjectionObj, 'days').toObject();
        const diffString = diff.days + (diff.months || 0) * 30 + (diff.years || 0) * 365;

        if (diffString < 0) {
            continue;
        }

        contenuCSVTRAC += '\n' + diffString + ';' + colonnes[indexTraceur];
    }

    const universalBOM = "\uFEFF";
    const blob = new Blob([universalBOM + contenuCSVTRAC], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exportTRAC-${traceur.nom}-${new Date().toLocaleString().replace(/\/|:|,|\s/g, '-')}.csv`;
    a.click();
    afficherMessageFlash('Fichier téléchargé avec succès.', 'success');
    URL.revokeObjectURL(url);
    fermerPopupTelecharger();
}



/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DES INTERFERENCES SUR UN OU PLUSIEURS TRACEURS
 * ---------------------------------------------------------------------------------------------------------------------
 */



/**
 * Modifie l'affichage du popup en fonction du nombre de traceurs à corriger (interférences)
 */
function mettreAJourNbTraceurs(nb) {
    const div = document.querySelector('.listeSelectsTraceurs');
    let txt = '';

    for (let i = 0; i < nb; i++) {
        let span = '';
        if (i !== nb -1) {
            span = '<span></span>';
        }
        txt += `<div class="separateurSelect">
                <h4>Traceur ${i + 1}</h4>
                <select class="selectOrange" id="selectTraceur${i + 1}">
                <option value="" selected disabled>Sélectionner...</option>
                `;
        for (let j = 0; j < traceurs.length; j++) {
            if (traceurs[j].lampePrincipale !== '' && !isNaN(traceurs[j].lampePrincipale)) {
                txt += `<option value="${traceurs[j].nom}">${traceurs[j].nom}</option>`;
            }
        }
        txt += `</select></div>${span}`;
        div.innerHTML = txt;
    }
}




/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE LA SELECTION D'UNE ZONE SUR LE GRAPHIQUE
 * ---------------------------------------------------------------------------------------------------------------------
 */



/**
 * Permet à l'utilisateur de sélectionner une zone sur le graphique. Retourne les valeurs minimales et maximale de l'axe X de la zone sélectionnée.
 * Met en couleur la zone sélectionnée aussi
 * @returns {Array} Tableau contenant les valeurs minimales et maximales de l'axe X (des dates) de la zone sélectionnée
 */
function selectionnerZoneGraphique() {
    const canvas = document.getElementById('graphique');
    const myChart = Chart.getChart(canvas);

    if (!myChart) return;
    let flag = true;

    myChart.options.plugins.zoom.pan.enabled = false;
    myChart.options.plugins.zoom.zoom.wheel.enabled = false;
    fermerPopupParametres();
    afficherPopup('<img alt="" src="Ressources/img/select.png">', 'Sélectionnez une zone sur le graphique', 'Commencez par sélectionner la zone à étudier en cliquant et en maintenant le clic gauche sur le graphique, puis en relâchant le clic à la fin de la zone à sélectionner.', '<div class="bouton boutonFonce" onclick="fermerPopup()">COMMENCER</div>')

    let isSelecting = false;
    let startX = null;
    let currentX = null;

    canvas.addEventListener('mousedown', function(e) {
        if (flag) {
            isSelecting = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            currentX = startX;
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isSelecting && flag) {
            currentX = e.clientX - canvas.getBoundingClientRect().left;

            const width = Math.abs(currentX - startX);

            myChart.options.plugins.annotation.annotations = [{
                type: 'box',
                xMin: myChart.scales['x'].getValueForPixel(Math.min(startX, currentX)),
                xMax: myChart.scales['x'].getValueForPixel(Math.max(startX, currentX)),
                yMin: -Infinity,
                yMax: Infinity,
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }];
            myChart.update();

            const xMin = Math.min(startX, currentX);
            const xMax = Math.max(startX, currentX);
            const startDate = new Date(myChart.scales['x'].getValueForPixel(xMin));
            const endDate = new Date(myChart.scales['x'].getValueForPixel(xMax));
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        if (isSelecting && flag) {
            isSelecting = false;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const xMin = Math.min(startX, x);
            const xMax = Math.max(startX, x);

            const startDate = DateTime.fromMillis(myChart.scales['x'].getValueForPixel(xMin), {zone: 'UTC'}).toFormat('dd/MM/yyyy-HH:mm:ss');
            const endDate = DateTime.fromMillis(myChart.scales['x'].getValueForPixel(xMax), {zone: 'UTC'}).toFormat('dd/MM/yyyy-HH:mm:ss');

            myChart.options.plugins.annotation.annotations = [];
            myChart.update();

            canvas.removeEventListener('mousedown', function() {});
            canvas.removeEventListener('mousemove', function() {});
            canvas.removeEventListener('mouseup', function() {});
            flag = false;


            myChart.options.plugins.zoom.pan.enabled = true;
            myChart.options.plugins.zoom.zoom.wheel.enabled = true;

            afficherPopupParametresGraphiques();
            afficherOngletParametre(5);
            document.querySelector('.texteZoneSelection').innerText = `Zone sélectionnée: ${startDate} - ${endDate}`;


            return [startDate, endDate];
        }
    });
}
