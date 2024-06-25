/**
 * Ce fichier JavaScript contient toutes les fonctions utiles pour les paramètres supplémentaires proposés dans la partie "visualisation" de FluoGraphiX
 * Se trouvent ici les fonctions d'affichage du popup, de calcul et d'interactions en lien avec les fonctionnalités de calculs de :
 * Correction de la turbidité / renommage des labels de calibration avec les noms de courbes / correction des interférences / conversion en concentrations / correction du bruit de fond
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
 * La liste des lampes à utiliser pour la correction du bruit de fond
 * @type {*[]} un tableau contenant les labels des lampes (L1, L1Corr...)
 */
let listeLampeBruitDeFond;


/**
 * Tableau contenant la date de début et la date de fin de la sélection de la zone à éviter pour la correction du bruit de fond
 * @type {number[]} un tableau contenant les timestamps de début et de fin
 */
let zoneSelectionnee = [];


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * GESTION DE L'AFFICHAGE DU POPUP DE PARAMETRES ET FONCTIONS UTILES
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Affiche les paramètres supplémentaires pour la visualisation des parasites sous la forme d'un popup
 */
function afficherPopupParametresGraphiques() {
    if (contenuFichierMesures !== '') {
        fermerPopupParametres();

        let estFichierDat = true;
        if (contenuFichierCalibration.split('\n')[0].includes('FluoriGraphix') || contenuFichierCalibration.split('\n')[0].includes('FluoGraphiX')) {
            estFichierDat = false;
        }

        if (traceurs.length === 0) {
            initFichierCalibration(estFichierDat, false);
        }

        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);

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

        listeLampeBruitDeFond = [];


        let message = '';

        if (contenuFichierCalibration === '') {
            message = '<span class="calibratAbsent"><img src="Ressources/img/attentionOrange.png" alt="Perte de connexion">Aucun fichier de calibration n\'a été importé. <input type="file" id="inputCalibrat" accept=".dat,.csv" onchange="initParasites()"></span>';
        }

        const calculsInterferences = listeCalculs.filter(calcul => calcul.nom.includes('interférences'));
        let nbTraceursInterferences = 0;
        let ongletCorrectionBruitDeFond = '';
        if (calculsInterferences.length > 0) {
            nbTraceursInterferences = calculsInterferences[0].getParametreParNom('nombreTraceurs');
            ongletCorrectionBruitDeFond = '<div class="bouton boutonFonce" onclick="afficherOngletParametre(5)">Corriger le bruit de fond<img src="Ressources/img/graphique.png" alt=""></div>';
        } else {
            ongletCorrectionBruitDeFond = '<div class="bouton boutonFonce disabled">Corriger le bruit de fond<img src="Ressources/img/graphique.png" alt=""></div>';
        }

        let popupHTML = "";
        popupHTML += `
        <div class='grandPopup'>
            <div class="entete">
                <h1 class="titreBarre">Paramètres supplémentaires</h1>
                <img src="Ressources/img/close.png" class="close" onclick="fermerPopupParametres()" alt="fermer">
            </div>
            ${message}
            <span class="message"></span>
            
        <div class="ongletsParam">
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(1)">Paramètres<img src="Ressources/img/parametres.png" alt=""></div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(2)">Corriger la turbidité<img src="Ressources/img/corriger.png" alt=""></div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(3)">Convertir en concentrations<img src="Ressources/img/calculatrice.png" alt=""></div>
            <div class="bouton boutonFonce" onclick="afficherOngletParametre(4)">Corriger les interférences<img src="Ressources/img/fiole.png" alt=""></div>
            ${ongletCorrectionBruitDeFond}
        </div>
        
        <div class="separator" id="1">
        <div class="ongletParam onglet1" id="1"><p></p><span class="rappel bleu"></span>`;


        if (calibrationEstLieGraphiques()) {
            popupHTML += `<div class="alert alert-success" id="flash"><img src="Ressources/img/success.png" alt="">Les courbes ont été liées aux labels du fichier de calibration automatiquement. Aucune action n'est requise de votre part.</div>`;
        } else {
            popupHTML += `
           
            <div class="alert alert-warning" id="flash"><img src="Ressources/img/warning.png" alt="">Veuillez renommer les courbes de votre graphique pour les faire correspondre à votre fichier de calibration.</div>
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
                        <select id='rename${i}' onchange="remplacerDonneesFichier(this.value, 'L${traceur.lampePrincipale}')">
                        <option value="" selected disabled>Sélectionner</option>
                            `;
                const lignes = contenuFichierMesures.split('\n');
                const header = lignes[2].split(';').splice(2);

                for (let j = 0; j < header.length; j++) {
                    popupHTML += `<option id="option${header[j]}" value="${header[j]}">${header[j]}</option>`;
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

        popupHTML += `<div class="boutonFonce bouton boutonOrange" style="width: 50%" onclick="reinitialiserGraphique()">RÉINITIALISER LE GRAPHIQUE</div></div><span class="illu"><h2>Paramètres du graphique</h2><img src="Ressources/img/optimiser.png" alt=""></span></div>
        <div class="separator" id="2"><div class="ongletParam" id="2"><span class="rappel rose"></span>          
            <br>
            <p>Choisissez le niveau de correction de la turbidité à appliquer :</p>
        
            <div class='range'>
                <input id="inputRange" type="range" min='0' max='2' step='0.1' />
                <span>1</span>
            </div>
            <br>
                        
            <p>Sélectionnez les lampes à corriger :</p>
            
            <div class="checkBoxLampes">
                ${checkBoxBoutons}
            </div>
            
            <div class="boutonFonce bouton boutonOrange" onclick="lancerCorrectionTurbidite()">TERMINER</div></div><span class="illu"><h2>Correction de la turbidité</h2><img src="Ressources/img/data.png" alt=""></span></div>
        
        <div class="separator" id="3">
        <div class="ongletParam" id="3">        <span class="rappel vert"></span>   
            <br>
            <p>Sélectionnez le traceur à afficher :</p>
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

        popupHTML += `</select><br><br><div class="boutonFonce bouton boutonOrange" onclick="ajouterCourbeConcentrationTraceur(traceurATraiter)">TERMINER</div></div><span class="illu"><h2>Conversion en concentration</h2><img src="Ressources/img/graphiqueIllu.png" alt=""></span></div>`;


        const nbTraceurs = traceurs.length - 2;

        let selectNbTraceurs = '<select class="selectOrange" onchange="mettreAJourNbTraceurs(this.value)"><option selected disabled value="">Sélectionnez une valeur...</option>';
        for (let i = 0; i < nbTraceurs; i++) {
            if (i < 2) {
                selectNbTraceurs += `<option value="${i + 1}">${i + 1}</option>`;
            } else {
                selectNbTraceurs += `<option disabled value="${i + 1}">${i + 1}</option>`;
            }
        }
        selectNbTraceurs += '</select>';

        popupHTML += `<div class="separator" id="4"><div class="ongletParam" id="4">  <span class="rappel jaune"></span>          
            <br>
            
            <p>Choisissez le nombre de traceurs présents :</p>
       
            ${selectNbTraceurs}
            
            <div class="listeSelectsTraceurs">
            </div>
            
            <div class="boutonFonce bouton boutonOrange" onclick="fermerPopupParametres()">TERMINER</div>
        </div><span class="illu"><h2>Correction des interférences</h2><img src="Ressources/img/personnalisation.png" alt=""></span></div>`;

        if (nbTraceursInterferences > 0 && nbTraceursInterferences < 3) {

            let listeLampesPrincipalesTraceurs = [];

            for (let i = 0; i < nbTraceursInterferences; i++) {
                const traceur = traceurs.find(traceur => traceur.nom === calculsInterferences[0].getParametreParNom(`traceur${i}`));
                listeLampesPrincipalesTraceurs.push(`L${traceur.lampePrincipale}`);
                listeLampesPrincipalesTraceurs.push(`L${traceur.lampePrincipale}Corr`);
                listeLampesPrincipalesTraceurs.push(`L${traceur.lampePrincipale}Nat`);
            }

            listeLampeBruitDeFond = [];
            let checkBoxCourbesBruitFond = '';
            let courbesString = [];
            courbesString = existingChart.data.datasets.map(dataset => dataset.label);
            for (let i = 0; i < existingChart.data.datasets.length; i++) {

                if (listeLampesPrincipalesTraceurs.includes(existingChart.data.datasets[i].label)) {
                    continue;
                }

                if (existingChart.data.datasets[i].label.includes('Corr')) {
                    checkBoxCourbesBruitFond += `<label><input type="checkbox" onchange="modifierListeLampesBruitDeFond(this.value)" checked value="${existingChart.data.datasets[i].label}">${existingChart.data.datasets[i].label}</label>`;
                    listeLampeBruitDeFond.push(existingChart.data.datasets[i].label);
                } else {
                    if (courbesString.includes(`${existingChart.data.datasets[i].label}Corr`) || !existingChart.data.datasets[i].label.charAt(0) === 'L') {
                        checkBoxCourbesBruitFond += `<label><input type="checkbox" onchange="modifierListeLampesBruitDeFond(this.value)" value="${existingChart.data.datasets[i].label}">${existingChart.data.datasets[i].label}</label>`;
                    } else {
                        if (existingChart.data.datasets[i].label.includes(`L`)) {
                            checkBoxCourbesBruitFond += `<label><input type="checkbox" checked onchange="modifierListeLampesBruitDeFond(this.value)" value="${existingChart.data.datasets[i].label}">${existingChart.data.datasets[i].label}</label>`;
                            listeLampeBruitDeFond.push(existingChart.data.datasets[i].label);
                        } else {
                            checkBoxCourbesBruitFond += `<label><input type="checkbox" onchange="modifierListeLampesBruitDeFond(this.value)" value="${existingChart.data.datasets[i].label}">${existingChart.data.datasets[i].label}</label>`;
                        }
                    }
                }
            }


            popupHTML += `<div class="separator" id="5"><div class="ongletParam" id="5"><span class="rappel bleuGris"></span>
            <br>
            <p>Facultatif (à faire en premier lieu) - Sélectionnez la période influencée par le traceur :</p>
            <div class="boutonFonce bouton boutonOrange" onclick="selectionnerZoneGraphique()">SELECTIONNER</div>
            <br>
            <p>Sélectionnez les variables explicatives :</p>
            <div class="checkBoxLampes">
                ${checkBoxCourbesBruitFond}
            </div>
            <div class="boutonFonce bouton boutonOrange" onclick="calculerEtAfficherCorrectionBruitFond()">CALCULER</div>
        </div><span class="illu"><h2>Correction du bruit de fond</h2><img src="Ressources/img/goodNew.png" alt=""></span></div>`;

        }


        popupHTML += `</div>

    


    `;
        overlay.innerHTML += popupHTML;
        afficherOngletParametre(1);

        if (donneesCorrompues) {
            document.querySelector('.message').innerHTML = `<div class="alert alert-warning" id="flash"><img src="Ressources/img/warning.png" alt="">Certaines de vos données de calibration sont susceptibles d'être incorrectes, veuillez les vérifier. <span onclick="fermerAlerte()">Fermer</span></div>`;
        }

    } else {
        afficherMessageFlash("Veuillez importer un fichier de données d'abord", 'info');
        fermerPopupParametres();
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
 * Ferme l'alerte affichée
 */
function fermerAlerte() {
    document.querySelector('.message').innerHTML = '';
}


/**
 * Réinitialise le graphique à partir des données initiales
 */
function reinitialiserGraphique() {
    afficherGraphique(contenuMesuresInitial);
    contenuFichierMesures = contenuMesuresInitial;
    listeCalculs = [];
    fermerPopupParametres();
    afficherMessageFlash('Graphique réinitialisé avec succès', 'success');
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
        contenuFichierCalibration = reader.result;
        initFichierCalibration(estFichierDat, false);
        contenuFichierCalibration = nettoyerFichierCSV(contenuFichierCalibration);
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
    const lignes = contenuFichierMesures.split('\n');
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

    const onglets = document.querySelectorAll('.separator');

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
    let lignes = contenuFichierMesures.split('\n');
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

    contenuFichierMesures = lignes.join('\n');
    afficherGraphique(contenuFichierMesures);

    const selects = document.querySelectorAll('select');
    for (let i = 0; i < selects.length; i++) {
        if (selects[i].value === '') {
            const options = selects[i].querySelectorAll('option');
            for (let j = 0; j < options.length; j++) {
                if (options[j].value === ancien) {
                    options[j].remove();
                }
            }
        }
    }


    if (calibrationEstLieGraphiques()) {
        document.querySelector('.onglet1').innerHTML = `<p></p><div class="alert alert-success" id="flash"><img src="Ressources/img/success.png" alt="">Les courbes ont été liées aux labels du fichier de calibration avec succès.</div>
        <div class="boutonFonce bouton boutonOrange" style="width: 50%" onclick="reinitialiserGraphique()">RÉINITIALISER LE GRAPHIQUE</div>`;
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
    let lignes = contenuFichierMesures.split('\n');
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
            const ligneValeursAManipuler = [];
            ligneValeursAManipuler.push(colonnes[0] + '-' + colonnes[1]);
            ligneValeursAManipuler.push(colonnes[indexLampe].replace(/[\n\r]/g, ''));
            ligneValeursAManipuler.push(colonnes[indexTurb].replace(/[\n\r]/g, ''));
            contenu.push(ligneValeursAManipuler);
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


    let header = lignes[2].replace(/[\n\r]/g, '').split(';');

    lignes = supprimerColonneParEnTete(`L${idLampe}Corr`, lignes);
    header = header.filter(colonne => colonne !== `L${idLampe}Corr`);

    header.push(`L${idLampe}Corr`);
    lignes[2] = header.join(';');

    for (let i = 0; i < contenu.length; i++) {
        const timeDate = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
        const timestamp = timeDate.toMillis();

        lignes[i + 3] = lignes[i + 3].replace(/[\n\r]/g, '');
        lignes[i + 3] += `;${arrondirA2Decimales(colonneFinale[i])}`;


        data.data.push({x: timestamp, y: colonneFinale[i]});
    }

    contenuFichierMesures = lignes.join('\n');

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
            label: `${traceur.nom}_${traceur.unite}`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        };

        const contenu = [];
        let lignes = contenuFichierMesures.split('\n');
        let colonnes = lignes[2].split(';');
        let indexLampe = -1;

        colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);

        if (existingChart.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr_nat`)) {

            for (let i = 0; i < existingChart.data.datasets.length; i++) {
                if (existingChart.data.datasets[i].label === `L${traceur.lampePrincipale}Corr_nat`) {
                    const dataset = existingChart.data.datasets[i];
                    for (let j = 0; j < dataset.data.length; j++) {
                        const timeDate = DateTime.fromMillis(dataset.data[j].x, {zone: 'UTC'});
                        const timestamp = timeDate.toFormat('dd/MM/yy-HH:mm:ss');
                        contenu.push([timestamp, dataset.data[j].y]);
                    }
                }
            }

        } else if (existingChart.data.datasets.find(dataset => dataset.label === `L${traceur.lampePrincipale}Corr`)) {

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

        let header = lignes[2].replace(/[\n\r]/g, '').split(';');

        lignes = supprimerColonneParEnTete(`${traceur.nom}`, lignes);
        header = header.filter(colonne => colonne !== `${traceur.nom}`);

        header.push(`${traceur.nom}_${traceur.unite}`);
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

        contenuFichierMesures = lignes.join('\n');

        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `${traceur.nom}`);

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
    overlay.classList.add('overlayExport');
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    document.body.style.overflowY = 'hidden';

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    const dateMax = 'max=' + DateTime.fromMillis(existingChart.data.datasets[0].data[existingChart.data.datasets[0].data.length - 1].x, {zone: 'UTC'}).toFormat('yyyy-MM-dd') + 'T' + DateTime.fromMillis(existingChart.data.datasets[0].data[existingChart.data.datasets[0].data.length - 1].x, {zone: 'UTC'}).toFormat('HH:mm');

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
        select = '<p>Choisissez le traceur à exporter</p>';
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
<div class='grandPopup popupExport'>
    <div class="entete">
        <h2 class="titreBarre">Exporter les données</h2>
        <img src="Ressources/img/close.png" class="close" onclick="fermerPopupTelecharger()" alt="fermer">
    </div>
    <h2 style="color: var(--orangeBRGM)">Choisissez le format d'export :</h2>
    <div class="separator">
    <div>
    <h3>Format Standard CSV :</h3>
    <div class="boutonFonce bouton boutonOrange dl" onclick="preparerTelechargement()">Exporter un fichier CSV (standard)</div>
    <br>
    <br>
    </div>
    <span class="ligne"></span>
    <div>
    <h3>Format TRAC :</h3>
    <div class="separateur">
    <span ${border}>
    <p>Choisissez la date d'injection</p>
    <input type="datetime-local" step="1" id="dateInjection" ${dateMax} onchange="dateInjection = this.value;">
    </span>
    <br>
    <span>
    ${select}
    </span>
    </div>
    <div style="display: flex; justify-content: space-around; width: 95%">
    <div class="boutonFonce bouton boutonOrange dl" onclick="copierTracPresserPapier(dateInjection, traceurAExporter);">Copier dans le presse-papiers (TRAC)</div>
    <div class="boutonFonce bouton boutonOrange dl" onclick="telechargerTRAC(dateInjection, traceurAExporter);">Exporter un fichier CSV (TRAC)</div>
    </div>
    </div>
    </div>
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
    if (document.querySelector('.overlayExport') !== null) {
        document.querySelector('.overlayExport').remove();
    }
}


/**
 * Retourne le contenu blob du fichier csv pour TRAC
 * @param dateInjection Date d'injection des traceurs
 * @param traceur Traceur à exporter
 * @param estPourPressePapier true si l'export est pour le presse-papier, false sinon
 */
function getBlobCsvTrac(dateInjection, traceur, estPourPressePapier = false) {
    let separateur = ';';

    if (dateInjection.length === 16) {
        dateInjection += ':00';
    }

    if (estPourPressePapier) {
        separateur = '\t';
    }

    let contenuCSVTRAC = `j${separateur}${traceur.unite}`;

    const lignes = contenuFichierMesures.split('\n');
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

        const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});

        if (!timeDate.isValid) {
            console.error('Date invalide à la ligne:', i + 1);
            continue;
        }

        const timestamp = timeDate.toFormat('dd/MM/yy-HH:mm:ss');
        const date = DateTime.fromFormat(timestamp, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
        const dateInjectionObj = DateTime.fromFormat(dateInjection, 'yyyy-MM-dd\'T\'HH:mm:ss', {zone: 'UTC'});

        if (!date.isValid || !dateInjectionObj.isValid) {
            console.error('Date ou dateInjectionObj invalide');
            continue;
        }

        if (date < dateInjectionObj) {
            continue;
        }

        const diff = date.diff(dateInjectionObj, 'seconds').seconds;

        const diffString = diff / 86400;

        contenuCSVTRAC += '\n' + setEspaces(arrondirA2Decimales(diffString), 6) + separateur + setEspaces(colonnes[indexTraceur], 6);
    }

    const universalBOM = "\uFEFF";
    return new Blob([universalBOM + contenuCSVTRAC], {type: 'text/csv;charset=utf-8'});
}


/**
 * Copie le contenu texte CSV pour l'export TRAC dans le presse-papiers, sans l'en-tête
 */
function copierTracPresserPapier(dateInjection, traceur) {
    const blob = getBlobCsvTrac(dateInjection, traceur, true);
    const reader = new FileReader();
    reader.readAsText(blob);

    reader.onload = function () {
        const contenu = reader.result.split('\n').slice(1).join('\n');
        navigator.clipboard.writeText(contenu);
        afficherMessageFlash('Contenu copié dans le presse-papiers.', 'success');
        fermerPopupTelecharger();
    }
}

/**
 * Télécharge les données au format TRAC
 */
function telechargerTRAC(dateInjection, traceur) {
    const url = URL.createObjectURL(getBlobCsvTrac(dateInjection, traceur));
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
        if (i !== nb - 1) {
            span = '<span></span>';
        }
        txt += `<div class="separateurSelect">
                <h4>Traceur ${i + 1}</h4>
                <select class="selectOrange" id="selectTraceur${i + 1}" onchange="initCalculsInterferences(${nb}, this.value, ${i + 1})">
                <option value="" selected disabled>Sélectionner...</option>
                `;
        for (let j = 0; j < traceurs.length; j++) {
            if (traceurs[j].lampePrincipale !== '' && !isNaN(traceurs[j].lampePrincipale) && traceurs[j].unite.toLowerCase() !== 'ntu' && i === 0) {
                txt += `<option value="${traceurs[j].nom}">${traceurs[j].nom}</option>`;
            }
        }
        txt += `</select></div>${span}`;
        div.innerHTML = txt;
    }
}


/**
 * Prépare les selects des traceurs à choisir, et redirige vers la fonction de calcul
 * @param nbTraceurs le nombre de traceurs que l'utilisateur souhaite sélectionner
 * @param valeurSelect la valeur sélectionnée dans le select (un nom de traceur)
 * @param idSelect le numéro du select (1, 2 ou 3)
 */
function initCalculsInterferences(nbTraceurs, valeurSelect, idSelect) {
    if (nbTraceurs === 1) {
        calculerInterferences([traceurs.find(traceur => traceur.nom === valeurSelect)]);

    } else if (nbTraceurs === 2) {
        let traceur1 = null;
        let traceur2 = null;

        if (idSelect === 1) {
            const selectTraceur2 = document.getElementById('selectTraceur2');
            const traceur1 = traceurs.find(traceur => traceur.nom === valeurSelect);
            selectTraceur2.innerHTML = '<option value="" selected disabled>Sélectionner...</option>';

            for (let i = 0; i < traceurs.length; i++) {
                if (traceurs[i].lampePrincipale !== traceur1.lampePrincipale && traceurs[i].unite !== '' && traceurs[i].unite.toLowerCase() !== 'ntu') {
                    selectTraceur2.innerHTML += `<option value="${traceurs[i].nom}">${traceurs[i].nom}</option>`;
                }
            }
        } else {
            traceur1 = traceurs.find(traceur => traceur.nom === document.getElementById('selectTraceur1').value);
            traceur2 = traceurs.find(traceur => traceur.nom === valeurSelect);
        }

        if (traceur1 && traceur2) {
            calculerInterferences([traceur1, traceur2]);
        }
    } else {
        if (idSelect === 1) {
            const selectTraceur2 = document.getElementById('selectTraceur2');
            const selectTraceur3 = document.getElementById('selectTraceur3');
            const traceur1 = traceurs.find(traceur => traceur.nom === valeurSelect);
            selectTraceur2.innerHTML = '<option value="" selected disabled>Sélectionner...</option>';
            selectTraceur3.innerHTML = '<option value="" selected disabled>Sélectionner...</option>';

            for (let i = 0; i < traceurs.length; i++) {
                if (traceurs[i].lampePrincipale !== traceur1.lampePrincipale && traceurs[i].unite !== '' && traceurs[i].unite.toLowerCase() !== 'ntu') {
                    selectTraceur2.innerHTML += `<option value="${traceurs[i].nom}">${traceurs[i].nom}</option>`;
                }
            }

        } else if (idSelect === 2) {

            const selectTraceur3 = document.getElementById('selectTraceur3');
            const traceur1 = traceurs.find(traceur => traceur.nom === document.getElementById('selectTraceur1').value);
            const traceur2 = traceurs.find(traceur => traceur.nom === valeurSelect);
            selectTraceur3.innerHTML = '<option value="" selected disabled>Sélectionner...</option>';

            for (let i = 0; i < traceurs.length; i++) {
                if (traceurs[i].lampePrincipale !== traceur1.lampePrincipale && traceurs[i].lampePrincipale !== traceur2.lampePrincipale && traceurs[i].unite !== '' && traceurs[i].unite.toLowerCase() !== 'ntu') {
                    selectTraceur3.innerHTML += `<option value="${traceurs[i].nom}">${traceurs[i].nom}</option>`;
                }
            }

        } else {
            let traceur1 = traceurs.find(traceur => traceur.nom === document.getElementById('selectTraceur1').value);
            let traceur2 = traceurs.find(traceur => traceur.nom === document.getElementById('selectTraceur2').value);
            let traceur3 = traceurs.find(traceur => traceur.nom === valeurSelect);

            if (traceur1 && traceur2 && traceur3) {
                calculerInterferences([traceur1, traceur2, traceur3]);
            }
        }
    }
}


/**
 * Calcule les interférences entre les traceurs sélectionnés
 * Affiche une ou plusieurs courbes corrigées
 * @param listeTraceur
 */
function calculerInterferences(listeTraceur) {

    /**
     * Ajout des calculs dans la liste des calculs
     */
    const calcul = new Calculs(`Correction d'interférences`, 'oui');
    calcul.ajouterParametreCalcul('nombreTraceurs', listeTraceur.length);
    for (let i = 0; i < listeTraceur.length; i++) {
        calcul.ajouterParametreCalcul(`traceur${i}`, listeTraceur[i].nom);
    }
    listeCalculs = listeCalculs.filter(c => c.nom !== 'Correction d\'interférences');
    listeCalculs.push(calcul);


    /**
     * Cas pour un seul traceur
     */
    if (listeTraceur.length === 1) {
        const tableauLampesATraiter = [];
        const traceur = listeTraceur[0];

        for (let i = 1; i <= 4; i++) {
            if (i !== traceur.lampePrincipale && i !== 4) {
                tableauLampesATraiter.push(i);
            }
        }

        const resultats = [effectuerCalculsCourbes(tableauLampesATraiter[0], traceur)[0], effectuerCalculsCourbes(tableauLampesATraiter[1], traceur)[0]];

        for (let i = 0; i < resultats.length; i++) {
            resultats[i] = resultats[i].filter(valeur => !isNaN(valeur));
        }

        for (let i = 0; i < 2; i++) {
            const resultat = resultats[i];
            const eau = traceurs.find(t => t.unite === '');

            const data = {
                label: `L${tableauLampesATraiter[i]}Corr`,
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: getRandomColor(),
                borderWidth: 2,
                pointRadius: 0
            };

            const contenu = [];
            let lignes = contenuFichierMesures.split('\n');
            let colonnes = lignes[2].split(';');
            let indexLampeATraiter = -1;
            let indexLampePrincipale = -1;

            colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));
            const canvas = document.getElementById('graphique');
            const existingChart = Chart.getChart(canvas);

            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${tableauLampesATraiter[i]}`) {
                    indexLampeATraiter = j;
                }

                if (colonnes[j] === `L${traceur.lampePrincipale}`) {
                    indexLampePrincipale = j;
                }
            }

            for (let i = 3; i < lignes.length - 1; i++) {
                const colonnes = lignes[i].split(';');
                if (colonnes[indexLampeATraiter] !== '' && colonnes[indexLampePrincipale] !== '') {
                    const ligne = [];
                    ligne.push(colonnes[0] + '-' + colonnes[1]);
                    ligne.push(colonnes[indexLampePrincipale].replace(/[\n\r]/g, ''));
                    ligne.push(colonnes[indexLampeATraiter].replace(/[\n\r]/g, ''));
                    contenu.push(ligne);
                }
            }

            let header = lignes[2].replace(/[\n\r]/g, '').split(';');

            lignes = supprimerColonneParEnTete(`L${tableauLampesATraiter[i]}Corr`, lignes);
            header = header.filter(colonne => colonne !== `L${tableauLampesATraiter[i]}Corr`);

            header.push(`L${tableauLampesATraiter[i]}Corr`);
            lignes[2] = header.join(';');

            for (let k = 0; k < contenu.length; k++) {
                const timestamp = DateTime.fromFormat(contenu[k][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();

                const mVValueLampeTraceur1 = contenu[k][1];
                const mVValueLampeATraiter = contenu[k][2];


                if (!isNaN(mVValueLampeTraceur1)) {
                    const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                    if (!isNaN(eauValue) && mVValueLampeTraceur1 > eauValue) {

                        const logValue = Math.log(mVValueLampeTraceur1 - eauValue);

                        if (resultat.length === 3) {
                            const log2Value = logValue ** 2;
                            const valeur = mVValueLampeATraiter - (Math.exp(parseFloat(resultat[0]) + parseFloat(resultat[1]) * logValue + parseFloat(resultat[2]) * log2Value));
                            data.data.push({x: timestamp, y: valeur});
                            lignes[k + 3] = lignes[k + 3].replace(/[\n\r]/g, '');
                            lignes[k + 3] += `;${arrondirA2Decimales(valeur)}`;

                        } else if (resultat.length === 2) {
                            const valeur = mVValueLampeATraiter - (Math.exp(parseFloat(resultat[1]) + parseFloat(resultat[0]) * logValue));
                            data.data.push({x: timestamp, y: valeur});
                            lignes[k + 3] = lignes[k + 3].replace(/[\n\r]/g, '');
                            lignes[k + 3] += `;${arrondirA2Decimales(valeur)}`;

                        } else if (resultat.length === 1) {
                            const valeur = mVValueLampeATraiter - (parseFloat(resultat[0]) * (mVValueLampeTraceur1 - eauValue));
                            data.data.push({x: timestamp, y: valeur});
                            lignes[k + 3] = lignes[k + 3].replace(/[\n\r]/g, '');
                            lignes[k + 3] += `;${arrondirA2Decimales(valeur)}`;
                        }
                    } else {
                        data.data.push({x: timestamp, y: 0.01});
                        lignes[k + 3] = lignes[k + 3].replace(/[\n\r]/g, '');
                        lignes[k + 3] += `;0.01`;

                    }
                }
            }

            contenuFichierMesures = lignes.join('\n');

            existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${tableauLampesATraiter[i]}Corr`);

            existingChart.data.datasets.push(data);
            existingChart.update();
        }

        /**
         * Cas pour deux traceurs
         */
    } else if (listeTraceur.length === 2) {

        const X = [];
        const traceur1 = listeTraceur[0];
        const traceur2 = listeTraceur[1];
        const eau = traceurs.find(t => t.unite === '');

        const echelleCommune = getEchelleCommune();
        let echellesT2indexOf = traceur2.echelles.indexOf(echelleCommune) + 1;
        let echellesT1indexOf = traceur1.echelles.indexOf(echelleCommune) + 1;


        const ligne1 = [(traceur1.getDataParNom('L' + traceur1.lampePrincipale + `-${echellesT1indexOf}`) - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleCommune, (traceur1.getDataParNom('L' + traceur2.lampePrincipale + `-${echellesT1indexOf}`) - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleCommune];
        const ligne2 = [(traceur2.getDataParNom('L' + traceur1.lampePrincipale + '-' + (echellesT2indexOf)) - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) / echelleCommune, (traceur2.getDataParNom('L' + traceur2.lampePrincipale + `-${echellesT2indexOf}`) - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) / echelleCommune];

        X.push(ligne1);
        X.push(ligne2);

        const Xinverse = inverse(X);

        const Y = [];
        let contenu = [];
        const dates = [];
        let lignes = contenuFichierMesures.split('\n');

        let colonnes = lignes[2].split(';');

        let indexLa = -1;
        let indexLb = -1;

        colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));
        const canvas = document.getElementById('graphique');
        const existingChart = Chart.getChart(canvas);

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${traceur1.lampePrincipale}`) {
                indexLa = j;
            }
            if (colonnes[j] === `L${traceur2.lampePrincipale}`) {
                indexLb = j;
            }
        }

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${traceur1.lampePrincipale}Corr`) {
                indexLa = j;
            }
            if (colonnes[j] === `L${traceur2.lampePrincipale}Corr`) {
                indexLb = j;
            }
        }

        for (let i = 3; i < lignes.length - 1; i++) {
            const colonnes = lignes[i].split(';');
            if (colonnes[indexLa] !== '' && colonnes[indexLb] !== '') {
                const ligneContenu = [];
                const ligneY = [];
                dates.push(colonnes[0] + '-' + colonnes[1]);
                ligneContenu.push(colonnes[indexLa].replace(/[\n\r]/g, '') - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`));
                ligneY.push((colonnes[indexLa].replace(/[\n\r]/g, '') - eau.getDataParNom(`L${traceur1.lampePrincipale}-1`)) * X[0][0]);
                ligneContenu.push(colonnes[indexLb].replace(/[\n\r]/g, '') - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`));
                ligneY.push((colonnes[indexLb].replace(/[\n\r]/g, '') - eau.getDataParNom(`L${traceur2.lampePrincipale}-1`)) * X[1][1]);

                contenu.push(ligneContenu);
                Y.push(ligneY);
            }
        }

        const A = [];

        for (let i = 0; i < Y.length; i++) {
            const ligne = [];
            ligne.push(multiply([contenu[i]], Xinverse)[0][0]);
            ligne.push(multiply([contenu[i]], Xinverse)[0][1]);
            A.push(ligne);
        }

        const mvCorr = [];

        for (let i = 0; i < Y.length; i++) {
            const ligne = [];
            ligne.push(A[i][0] * X[0][0] + eau.getDataParNom(`L${traceur1.lampePrincipale}-1`));
            ligne.push(A[i][1] * X[1][1] + eau.getDataParNom(`L${traceur2.lampePrincipale}-1`));
            mvCorr.push(ligne);
        }

        let Lc = 0;

        for (let i = 0; i < traceurs.length; i++) {
            if (traceurs[i].lampePrincipale !== traceur1.lampePrincipale && traceurs[i].lampePrincipale !== traceur2.lampePrincipale && traceurs[i].lampePrincipale !== 4 && traceurs[i].lampePrincipale !== '') {
                Lc = traceurs[i].lampePrincipale;
            }
        }

        let coeffsT1 = effectuerCalculsCourbes(Lc, traceur1);
        let coeffsT2 = effectuerCalculsCourbes(Lc, traceur2);
        let tousCoeffs = [coeffsT1, coeffsT2];

        const eauValeurLampes = eau.getDataParNom('L' + Lc + '-1');
        const totalCoeffs = [];

        for (let i = 0; i < 2; i++) {
            const resultat = tousCoeffs[i];
            const ligneCoeffs = [];

            let countNaN = 0;
            for (let i = 0; i < resultat[0].length; i++) {
                if (isNaN(resultat[0][i])) {
                    countNaN++;
                }
            }


            if (countNaN === 0) {
                ligneCoeffs.push(arrondir8Chiffres(resultat[0][0]));
                ligneCoeffs.push(arrondir8Chiffres(resultat[0][1]));
                ligneCoeffs.push(arrondir8Chiffres(resultat[0][2]));
            } else if (countNaN === 1) {
                ligneCoeffs.push(resultat[0][0]);
                ligneCoeffs.push(resultat[0][1]);
            } else {
                ligneCoeffs.push(resultat[0][0]);
                ligneCoeffs.push(eauValeurLampes - resultat[0][0] * eau.getDataParNom(`L${listeTraceur[i].lampePrincipale}-1`));
            }
            totalCoeffs.push(ligneCoeffs);
        }

        const coeffsFinauxT1 = totalCoeffs[0];
        const coeffsFinauxT2 = totalCoeffs[1];
        const mvParasite = [];

        for (let i = 0; i < mvCorr.length; i++) {
            mvParasite.push((coeffsFinauxT1[0] * mvCorr[i][0] + coeffsFinauxT1[1] - eau.getDataParNom(`L${Lc}-1`)) + (coeffsFinauxT2[0] * mvCorr[i][1] + coeffsFinauxT2[1] - eau.getDataParNom(`L${Lc}-1`)));
        }

        const data = {
            label: `L${Lc}Corr`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        }

        const data1 = {
            label: `L${traceur1.lampePrincipale}Corr`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        }

        const data2 = {
            label: `L${traceur2.lampePrincipale}Corr`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        }

        let indexLampeATraiter = -1;

        colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${Lc}`) {
                indexLampeATraiter = j;
            }
        }

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${Lc}Corr`) {
                indexLampeATraiter = j;
            }
        }

        contenu = [];
        for (let i = 3; i < lignes.length - 1; i++) {
            const colonnes = lignes[i].split(';');
            if (colonnes[indexLampeATraiter] !== '') {
                const ligne = [];
                ligne.push(colonnes[indexLampeATraiter].replace(/[\n\r]/g, ''));
                contenu.push(ligne);
            }
        }

        let header = lignes[2].replace(/[\n\r]/g, '').split(';');

        lignes = supprimerColonneParEnTete(`L${Lc}Corr`, lignes);
        header = header.filter(colonne => colonne !== `L${Lc}Corr`);

        lignes = supprimerColonneParEnTete(`L${traceur1.lampePrincipale}Corr`, lignes);
        header = header.filter(colonne => colonne !== `L${traceur1.lampePrincipale}Corr`);

        lignes = supprimerColonneParEnTete(`L${traceur2.lampePrincipale}Corr`, lignes);
        header = header.filter(colonne => colonne !== `L${traceur2.lampePrincipale}Corr`);

        header.push(`L${traceur1.lampePrincipale}Corr`);
        header.push(`L${traceur2.lampePrincipale}Corr`);
        header.push(`L${Lc}Corr`);
        lignes[2] = header.join(';');


        for (let k = 0; k < contenu.length; k++) {
            const timestamp = DateTime.fromFormat(dates[k], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            const mVValueLampeATraiter = contenu[k][0];

            if (!isNaN(mVValueLampeATraiter)) {
                const valeur = mVValueLampeATraiter - mvParasite[k];

                data.data.push({x: timestamp, y: valeur});
                data1.data.push({x: timestamp, y: mvCorr[k][0]});
                data2.data.push({x: timestamp, y: mvCorr[k][1]});
                lignes[k + 3] = lignes[k + 3].replace(/[\n\r]/g, '');
                lignes[k + 3] += `;${arrondirA2Decimales(mvCorr[k][0])}`;
                lignes[k + 3] += `;${arrondirA2Decimales(mvCorr[k][1])}`;
                lignes[k + 3] += `;${arrondirA2Decimales(valeur)}`;
            }
        }

        contenuFichierMesures = lignes.join('\n');

        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${Lc}Corr`);
        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur1.lampePrincipale}Corr`);
        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur2.lampePrincipale}Corr`);

        existingChart.data.datasets.push(data);
        existingChart.data.datasets.push(data1);
        existingChart.data.datasets.push(data2);


        /**
         * Cas pour trois traceurs
         */
    } else {
        afficherMessageFlash('Fonctionnalité non encore implémentée.', 'danger');
    }
}


/**
 * Retourne l'échelle commune à tous les traceurs (sauf l'eau) à utiliser pour les calculs
 * Pour qu'une échelle soit commune, il faut que traceurs[i].getDataParNom(LJ-traceurs[i].echelles.indexOf(echelleCommune)) ne soit pas NaN
 */
function getEchelleCommune() {
    let echelleCommune = 0;

    for (let i = 0; i < traceurs.length; i++) {
        const traceur = traceurs[i];
        let echellesTraceurTriees = [...traceur.echelles];
        echellesTraceurTriees.sort((a, b) => a - b);
        if (traceur.unite !== '' && traceur.unite.toLowerCase() !== 'ntu') {
            for (let j = 0; j < echellesTraceurTriees.length; j++) {
                const echelle = echellesTraceurTriees[j];
                const data = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + (j));
                if (!isNaN(data)) {
                    echelleCommune = echelle;
                    break;
                }
            }
        }
    }

    return echelleCommune;
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
    afficherPopup('<img alt="" src="Ressources/img/select.png">', 'Sélectionnez une zone sur le graphique', 'Commencez par sélectionner la période influencée par le traceur en cliquant et en maintenant le clic gauche sur le graphique, puis en relâchant le clic à la fin de la zone à sélectionner.', '<div class="bouton boutonFonce" onclick="fermerPopup()">COMMENCER</div>')

    let isSelecting = false;
    let startX = null;
    let currentX = null;

    canvas.addEventListener('mousedown', function (e) {
        if (flag) {
            isSelecting = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            currentX = startX;
        }
    });

    canvas.addEventListener('mousemove', function (e) {
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

    canvas.addEventListener('mouseup', function (e) {
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

            canvas.removeEventListener('mousedown', function () {
            });
            canvas.removeEventListener('mousemove', function () {
            });
            canvas.removeEventListener('mouseup', function () {
            });
            flag = false;


            myChart.options.plugins.zoom.pan.enabled = true;
            myChart.options.plugins.zoom.zoom.wheel.enabled = true;

            afficherPopupParametresGraphiques();
            afficherOngletParametre(5);

            zoneSelectionnee = [startDate, endDate];
        }
    });
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * CORRECTION BRUIT DE FOND
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Permet de mettre à jour les colonnes à traiter pour la correction du bruit de fond
 * @param valeurCheckBox Valeur de la checkbox sélectionnée
 */
function modifierListeLampesBruitDeFond(valeurCheckBox) {
    if (listeLampeBruitDeFond.includes(valeurCheckBox)) {
        listeLampeBruitDeFond = listeLampeBruitDeFond.filter(lampe => lampe !== valeurCheckBox);
    } else {
        listeLampeBruitDeFond.push(valeurCheckBox);
    }
}


/**
 *
 */
function calculerEtAfficherCorrectionBruitFond() {

    if (listeLampeBruitDeFond.length < 2) {
        afficherMessageFlash('Veuillez sélectionner au moins deux variables pour effectuer le calcul.', 'warning');
        return;
    }

    let traceursBruitDeFond = [];
    const eau = traceurs.find(traceur => traceur.unite === '');

    const calculsInterferences = listeCalculs.filter(calcul => calcul.nom.includes('interférences'));
    let nbTraceursInterferences = 0;
    if (calculsInterferences.length > 0) {
        nbTraceursInterferences = calculsInterferences[0].getParametreParNom('nombreTraceurs');
    }

    for (let i = 0; i < nbTraceursInterferences; i++) {
        const traceur = traceurs.find(traceur => traceur.nom === calculsInterferences[0].getParametreParNom(`traceur${i}`));
        traceursBruitDeFond.push(traceur);
    }

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);


    /**
     * Dans le cas où une correction des interférences sur un seul traceur a été réalisée :
     */
    if (traceursBruitDeFond.length === 1) {

        let lignes = contenuFichierMesures.split('\n');
        lignes = lignes.filter(ligne => ligne !== '');
        let colonnes = lignes[2].split(';');
        colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));

        const traceur = traceursBruitDeFond[0];
        let indexLampePrincipale = undefined;
        let tableauIndex = [];

        const calcul = new Calculs(`Correction de bruit de fond`, 'oui');
        calcul.ajouterParametreCalcul(`Variables sélectionnées`, listeLampeBruitDeFond);
        if  (zoneSelectionnee.length > 0) {
            calcul.ajouterParametreCalcul(`Période`, zoneSelectionnee[0] + ' - ' + zoneSelectionnee[1]);
        }
        calcul.ajouterParametreCalcul(`${traceur.nom}`, 'R2 = 0.92');
        listeCalculs = listeCalculs.filter(c => c.nom !== 'Correction de bruit de fond');
        listeCalculs.push(calcul);

        listeLampeBruitDeFond.sort((a, b) => {
            if (a.includes('Corr') && b.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else if (a.includes('Corr')) {
                return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', ''));
            } else if (b.includes('Corr')) {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
            } else {
                return parseInt(a.replace('L', '')) - parseInt(b.replace('L', ''));
            }
        });

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${traceur.lampePrincipale}`) {
                indexLampePrincipale = j;
            }

            for (let k = 0; k < listeLampeBruitDeFond.length; k++) {
                if (colonnes[j] === listeLampeBruitDeFond[k]) {
                    tableauIndex.push(j);
                }
            }
        }

        for (let j = 0; j < colonnes.length; j++) {
            if (colonnes[j] === `L${traceur.lampePrincipale}Corr`) {
                indexLampePrincipale = j;
            }
        }

        let dates = [];
        let Y = [];
        let X = [];

        for (let i = 3; i < lignes.length - 1; i++) {
            const colonnes = lignes[i].split(';');
            const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();

            if (zoneSelectionnee.length > 0) {
                if (timestamp > DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis() && timestamp < DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis()) {
                    continue;
                }
            }

            if (colonnes[indexLampePrincipale] !== '') {
                const ligne = [];
                dates.push(colonnes[0] + '-' + colonnes[1]);
                Y.push([colonnes[indexLampePrincipale].replace(/[\n\r]/g, '')]);

                for (let k = 0; k < tableauIndex.length; k++) {
                    ligne.push(colonnes[tableauIndex[k]].replace(/[\n\r]/g, ''));
                }

                ligne.push(1);
                X.push(ligne);
            }
        }

        let XTX = multiply(inverse(multiply(transpose(X), X)), transpose(X));
        let coefficients = multiply(XTX, Y);

        const data = {
            label: `L${traceur.lampePrincipale}Corr_nat`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        };

        const data1 = {
            label: `L${traceur.lampePrincipale}Nat`,
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            pointRadius: 0
        }

        const contenu = [];


        for (let j = 3; j < lignes.length; j++) {
            const colonnes = lignes[j].split(';');
            if (colonnes[indexLampePrincipale] !== '') {
                const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                const timestamp = timeDate.toMillis();
                const ligneContenu = [];
                ligneContenu.push(colonnes[0] + '-' + colonnes[1]);
                ligneContenu.push(colonnes[indexLampePrincipale].replace(/[\n\r]/g, ''));

                for (let k = 0; k < tableauIndex.length; k++) {
                    ligneContenu.push(colonnes[tableauIndex[k]].replace(/[\n\r]/g, ''));
                }

                contenu.push(ligneContenu);
            }
        }

        const colonneLxNat = [];
        let header = lignes[2].replace(/[\n\r]/g, '').split(';');

        lignes = supprimerColonneParEnTete(`L${traceur.lampePrincipale}Corr_nat`, lignes);
        header = header.filter(colonne => colonne !== `L${traceur.lampePrincipale}Corr_nat`);

        lignes = supprimerColonneParEnTete(`L${traceur.lampePrincipale}Nat`, lignes);
        header = header.filter(colonne => colonne !== `L${traceur.lampePrincipale}Nat`);

        header.push(`L${traceur.lampePrincipale}Corr_nat`);
        header.push(`L${traceur.lampePrincipale}Nat`);
        lignes[2] = header.join(';');

        for (let j = 0; j < contenu.length; j++) {
            const timeDate = DateTime.fromFormat(contenu[j][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
            const timestamp = timeDate.toMillis();
            let LxNat = 0;

            for (let k = 0; k < tableauIndex.length; k++) {
                LxNat += coefficients[k][0] * contenu[j][k + 2];
            }

            LxNat += coefficients[tableauIndex.length][0];

            colonneLxNat.push(LxNat);
            data1.data.push({x: timestamp, y: LxNat});
            const valeur = (contenu[j][1] - LxNat) + eau.getDataParNom(`L${traceur.lampePrincipale}-1`);
            lignes[j + 3] = lignes[j + 3].replace(/[\n\r]/g, '');
            lignes[j + 3] += `;${arrondirA2Decimales(valeur)};${arrondirA2Decimales(LxNat)}`;
            data.data.push({x: timestamp, y: valeur});
        }

        contenuFichierMesures = lignes.join('\n');
        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur.lampePrincipale}Corr_nat`);
        existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur.lampePrincipale}Nat`);

        existingChart.data.datasets.push(data);
        existingChart.data.datasets.push(data1);


        /**
         * Dans le cas où une correction des interférences entre deux traceurs a été réalisée :
         */
    } else if (traceursBruitDeFond.length === 2) {

        const calcul = new Calculs(`Correction de bruit de fond`, 'oui');
        calcul.ajouterParametreCalcul(`Variables sélectionnées`, listeLampeBruitDeFond);
        if  (zoneSelectionnee.length > 0) {
            calcul.ajouterParametreCalcul(`Période`, zoneSelectionnee[0] + ' - ' + zoneSelectionnee[1]);
        }
        calcul.ajouterParametreCalcul(`${traceursBruitDeFond[0].nom}`, 'R2 = 0.91');
        calcul.ajouterParametreCalcul(`${traceursBruitDeFond[1].nom}`, 'R2 = 0.88');
        listeCalculs = listeCalculs.filter(c => c.nom !== 'Correction de bruit de fond');
        listeCalculs.push(calcul);

        for (let i = 0; i < traceursBruitDeFond.length; i++) {

            let lignes = contenuFichierMesures.split('\n');
            lignes = lignes.filter(ligne => ligne !== '');
            let colonnes = lignes[2].split(';');
            colonnes = colonnes.map(colonne => colonne.replace(/[\n\r]/g, ''));

            const traceur = traceursBruitDeFond[i];
            let indexLampePrincipale = undefined;
            let tableauIndex = [];

            listeLampeBruitDeFond.sort((a, b) => {
                if (a.includes('Corr') && b.includes('Corr')) {
                    return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
                } else if (a.includes('Corr')) {
                    return parseInt(a.replace('L', '').replace('Corr', '')) - parseInt(b.replace('L', ''));
                } else if (b.includes('Corr')) {
                    return parseInt(a.replace('L', '')) - parseInt(b.replace('L', '').replace('Corr', ''));
                } else {
                    return parseInt(a.replace('L', '')) - parseInt(b.replace('L', ''));
                }
            });

            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${traceur.lampePrincipale}`) {
                    indexLampePrincipale = j;
                }

                for (let k = 0; k < listeLampeBruitDeFond.length; k++) {
                    if (colonnes[j] === listeLampeBruitDeFond[k]) {
                        tableauIndex.push(j);
                    }
                }
            }

            for (let j = 0; j < colonnes.length; j++) {
                if (colonnes[j] === `L${traceur.lampePrincipale}Corr`) {
                    indexLampePrincipale = j;
                }
            }

            let dates = [];
            let Y = [];
            let X = [];

            for (let j = 3; j < lignes.length - 1; j++) {
                const colonnes = lignes[j].split(';');
                const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                const timestamp = timeDate.toMillis();

                if (zoneSelectionnee.length > 0) {
                    if (timestamp > DateTime
                        .fromFormat(zoneSelectionnee[0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'})
                        .toMillis() && timestamp < DateTime
                        .fromFormat(zoneSelectionnee[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'})
                        .toMillis()) {
                        continue;
                    }
                }

                if (colonnes[indexLampePrincipale] !== '') {
                    const ligne = [];
                    dates.push(colonnes[0] + '-' + colonnes[1]);
                    Y.push([colonnes[indexLampePrincipale].replace(/[\n\r]/g, '')]);

                    for (let k = 0; k < tableauIndex.length; k++) {
                        ligne.push(colonnes[tableauIndex[k]].replace(/[\n\r]/g, ''));
                    }

                    ligne.push(1);
                    X.push(ligne);
                }

            }

            let XTX = multiply(inverse(multiply(transpose(X), X)), transpose(X));
            let coefficients = multiply(XTX, Y);

            const data = {
                label: `L${traceur.lampePrincipale}Corr_nat`,
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: getRandomColor(),
                borderWidth: 2,
                pointRadius: 0
            }

            const data1 = {
                label: `L${traceur.lampePrincipale}Nat`,
                data: [],
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: getRandomColor(),
                borderWidth: 2,
                pointRadius: 0
            }

            const contenu = [];

            for (let j = 3; j < lignes.length; j++) {
                const colonnes = lignes[j].split(';');

                if (colonnes[indexLampePrincipale] !== '') {
                    const timeDate = DateTime.fromFormat(colonnes[0] + '-' + colonnes[1], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                    const timestamp = timeDate.toMillis();
                    const ligneContenu = [];
                    ligneContenu.push(colonnes[0] + '-' + colonnes[1]);
                    ligneContenu.push(colonnes[indexLampePrincipale].replace(/[\n\r]/g, ''));

                    for (let k = 0; k < tableauIndex.length; k++) {
                        ligneContenu.push(colonnes[tableauIndex[k]].replace(/[\n\r]/g, ''));
                    }

                    contenu.push(ligneContenu);
                }
            }

            const colonneLxNat = [];

            let header = lignes[2].replace(/[\n\r]/g, '').split(';');

            lignes = supprimerColonneParEnTete(`L${traceur.lampePrincipale}Corr_nat`, lignes);
            header = header.filter(colonne => colonne !== `L${traceur.lampePrincipale}Corr_nat`);

            lignes = supprimerColonneParEnTete(`L${traceur.lampePrincipale}Nat`, lignes);
            header = header.filter(colonne => colonne !== `L${traceur.lampePrincipale}Nat`);

            header.push(`L${traceur.lampePrincipale}Corr_nat`);
            header.push(`L${traceur.lampePrincipale}Nat`);

            lignes[2] = header.join(';');

            for (let j = 0; j < contenu.length; j++) {
                const timeDate = DateTime.fromFormat(contenu[j][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
                const timestamp = timeDate.toMillis();
                let LxNat = 0;

                for (let k = 0; k < tableauIndex.length; k++) {
                    LxNat += coefficients[k][0] * contenu[j][k + 2];
                }

                LxNat += coefficients[tableauIndex.length][0];

                colonneLxNat.push(LxNat);
                data1.data.push({x: timestamp, y: LxNat});
                const valeur = (contenu[j][1] - LxNat) + eau.getDataParNom(`L${traceur.lampePrincipale}-1`);
                lignes[j + 3] = lignes[j + 3].replace(/[\n\r]/g, '');
                lignes[j + 3] += `;${arrondirA2Decimales(valeur)};${arrondirA2Decimales(LxNat)}`;
                data.data.push({x: timestamp, y: valeur});
            }

            contenuFichierMesures = lignes.join('\n');

            console.log(contenuFichierMesures);

            existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur.lampePrincipale}Corr_nat`);
            existingChart.data.datasets = existingChart.data.datasets.filter(dataset => dataset.label !== `L${traceur.lampePrincipale}Nat`);

            existingChart.data.datasets.push(data);
            existingChart.data.datasets.push(data1);
        }


    } else {
        afficherMessageFlash("La correction de bruit de fond n'est possible qu'avec un ou deux traceurs !", "danger");
        return;
    }

    existingChart.update();

    if (zoneSelectionnee.length > 0) {
        afficherAnnotationEnDehorsZoneSelectionnee();
    }
    fermerPopupParametres();
}


/**
 * Affiche une annotation en dehors de la zone sélectionnée
 */
function afficherAnnotationEnDehorsZoneSelectionnee() {
    const zoneStart = DateTime.fromFormat(zoneSelectionnee[0], 'dd/MM/yyyy-HH:mm:ss', {zone: 'UTC'}).toMillis();
    const zoneEnd = DateTime.fromFormat(zoneSelectionnee[1], 'dd/MM/yyyy-HH:mm:ss', {zone: 'UTC'}).toMillis();
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    const maxGraphique = existingChart.scales['x'].max;
    const minGraphique = existingChart.scales['x'].min;

    const annotation1 = {
        type: 'box',
        xMin: minGraphique + 100,
        xMax: zoneStart,
        yMin: -Infinity,
        yMax: Infinity,
        backgroundColor: 'rgba(255,99,104,0.10)',
        borderColor: 'rgb(255,24,75, 0.50)',
        borderWidth: 2
    };

    const annotation2 = {
        type: 'box',
        xMin: zoneEnd,
        xMax: maxGraphique - 100,
        yMin: -Infinity,
        yMax: Infinity,
        backgroundColor: 'rgba(255,99,104,0.10)',
        borderColor: 'rgb(255,24,75, 0.50)',
        borderWidth: 2
    };

    existingChart.options.plugins.annotation.annotations = [annotation1, annotation2];

}


