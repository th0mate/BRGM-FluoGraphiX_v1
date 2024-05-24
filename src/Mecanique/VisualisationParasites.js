let niveauCorrection = 1;
let listeLampesACorriger = [];
let traceurATraiter;

/**
 * Affiche les paramètres supplémentaires pour la visualisation des parasites sous la forme d'un popup
 */
function afficherParametresParasites() {
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
            </div>`;
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

        popupHTML += `</select><div class="boutonFonce bouton boutonOrange" onclick="ajouterCourbeConcentrationTraceur(traceurATraiter)">TERMINER</div></div>
        
    </div>`;
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
        afficherParametresParasites();
    }, 500);

}


/**
 * Tente de lier automatiquement les labels des courbes aux labels des lampes du fichier de calibration.
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
 * Affiche une courbe de correction de la turbidité pour une lampe donnée sur le graphique de la partie visualisation
 */
function corrigerTurbidite(idLampe, TS = niveauCorrection) {
    const eau = traceurs.find(traceur => traceur.unite === '');
    const turbidite = traceurs.find(traceur => traceur.unite.toLowerCase() === 'ntu');

    const resultat = effectuerCalculsCourbes(idLampe, turbidite);

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


    for (let i = 0; i < contenu.length; i++) {
        const timeDate = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});
        const timestamp = timeDate.toMillis();

        data.data.push({x: timestamp, y: colonneFinale[i]});
    }

    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);

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

        existingChart.data.datasets.forEach(dataset => {
            dataset.hidden = dataset.label !== `L${listeLampesACorriger[i]}` && dataset.label !== `L${listeLampesACorriger[i]}Corr`;
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
    console.log(traceurATraiter);
}


/**
 * Ajoute dans le graphique la courbe de concentration pour le traceur sélectionné, à partir des calculs effectués
 * @param traceur Traceur dont la concentration doit être affichée
 */
function ajouterCourbeConcentrationTraceur(traceur) {
    if (traceur) {
        const eau = traceurs.find(t => t.unite === '');
        const resultat = effectuerCalculsCourbes(traceur.lampePrincipale, traceur);

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

        for (let i = 0; i < contenu.length; i++) {
            const timestamp = DateTime.fromFormat(contenu[i][0], 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'}).toMillis();
            const mVValue = contenu[i][1];

            if (!isNaN(mVValue)) {
                const eauValue = parseFloat(eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
                console.log(eauValue);
                if (!isNaN(eauValue) && mVValue > eauValue) {
                    const logValue = Math.log(mVValue - eauValue);

                    if (resultat[0].length === 3) {
                        const log2Value = logValue ** 2;
                        const concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue + parseFloat(resultat[0][2]) * log2Value);
                        data.data.push({x: timestamp, y: concentration});
                    } else if (resultat[0].length === 2) {
                        const concentration = Math.exp(parseFloat(resultat[0][0]) + parseFloat(resultat[0][1]) * logValue);
                        data.data.push({x: timestamp, y: concentration});
                    } else if (resultat[0].length === 1) {
                        const concentration = parseFloat(resultat[0][0]) * mVValue;
                        data.data.push({x: timestamp, y: concentration});
                    }
                }
            }
        }

        existingChart.data.datasets.push(data);
        existingChart.update();
        fermerPopupParametres();
    }
}

