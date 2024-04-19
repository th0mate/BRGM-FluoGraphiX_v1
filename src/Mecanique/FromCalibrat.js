/**
 * Classe chargée de récupérer les informations nécessaires à partir du fichier Calibrat.dat et de les utiliser pour en effectuer des calculs
 */


let lignesCalibrat = [];
let sectionsCalibrat = [];
let nomsTraceur = [];
let numeroFluorimetre = '';
let traceurs = [];
let echelles = [];


/**
 * Initialise les variables issues du fichier Calibrat.dat nécessaires pour le calcul de la régression linéaire
 */
function init() {
    if (contenuCalibrat !== '') {
        lignesCalibrat = contenuCalibrat.split('\n');
        sectionsCalibrat = getSectionsCalibrat();
        nomsTraceur = getNomsTraceurs();
        numeroFluorimetre = getNumeroFluorimetre();
        creerTraceurs();
        creerTurbidity();
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
function getNumeroFluorimetre() {
    const lignes = contenuCalibrat.split('\n');
    const premiereLigne = lignes[0];
    const index = premiereLigne.indexOf('#');
    return premiereLigne.substring(index + 1).trim();
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
function getNomsTraceurs() {
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
        let traceur = new Traceur(nom);

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
    const turbidite = new Traceur('Turbidité');
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
 * Affiche dans un div un select permettant de choisir un traceur
 */
function afficherSelectTraceurs() {
    if (document.querySelector('.selectTraceur')) {
        document.querySelector('.selectTraceur').remove();
    }
    const select = document.createElement('select');
    select.id = 'selectTraceur';
    select.classList.add('selectTraceur');
    select.addEventListener('change', () => {
        const nom = select.value;
        const traceur = recupererTraceurParNom(nom);
        afficherTableauTraceur(traceur);
        afficherGraphiqueTraceur(traceur);
    });

    const optionDefaut = document.createElement('option');
    optionDefaut.value = '';
    optionDefaut.textContent = 'Choisir un traceur';
    optionDefaut.selected = true;
    optionDefaut.disabled = true;
    select.appendChild(optionDefaut);
    for (let i = 0; i < traceurs.length; i++) {
        if (traceurs[i].nom !== 'Eau') {
            const option = document.createElement('option');
            option.value = traceurs[i].nom;
            option.textContent = traceurs[i].nom;
            select.appendChild(option);
        }
    }

    document.querySelector('.concentrations').appendChild(select);
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

    /**
     * Les colonnes
     */
    const nbColonnes = traceur.data.size / 4;
    for (let i = 0; i < nbColonnes; i++) {
        const th = document.createElement('th');
        th.textContent = traceur.echelles[i] + 'ppb';
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    tableau.appendChild(thead);

    /**
     * Les lignes
     */
    for (let i = 1; i <= 4; i++) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = 'L' + i;
        tr.appendChild(th);

        for (let j = 1; j <= nbColonnes; j++) {
            const td = document.createElement('td');
            td.textContent = traceur.getDataParNom('L' + i + '-' + j);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    tableau.appendChild(tbody);
    document.querySelector('.concentrations').appendChild(tableau);
}


/**
 * Transforme un tableau de valeurs en un tableau de tableaux de valeurs
 * @param matrix le tableau de valeurs
 * @returns {*} le tableau de tableaux de valeurs
 */
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}


/**
 * Multiplie deux matrices
 * @param matrixA la première matrice
 * @param matrixB  la deuxième matrice
 * @returns {any[][]} le résultat de la multiplication des deux matrices
 */
function multiply(matrixA, matrixB) {
    const result = Array(matrixA.length).fill(0).map(() => Array(matrixB[0].length).fill(0));

    for (let i = 0; i < matrixA.length; i++) {
        for (let j = 0; j < matrixB[0].length; j++) {
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}


/**
 * Calcule l'inverse d'une matrice
 * @param matrix la matrice
 * @returns {*} l'inverse de la matrice
 */
function inverse(matrix) {
    const size = matrix.length;
    const augmentedMatrix = matrix.map((row, rowIndex) => [...row, ...Array(size).fill(0).map((_, colIndex) => rowIndex === colIndex ? 1 : 0)]);

    for (let i = 0; i < size; i++) {
        let maxElementIndex = i;
        for (let j = i + 1; j < size; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxElementIndex][i])) {
                maxElementIndex = j;
            }
        }

        if (augmentedMatrix[maxElementIndex][i] === 0) {
            afficherVue('vueAccueil');
            afficherMessageFlash('La matrice est singulière et ne peut pas être inversée', 'danger');
        }

        [augmentedMatrix[i], augmentedMatrix[maxElementIndex]] = [augmentedMatrix[maxElementIndex], augmentedMatrix[i]];

        for (let j = i + 1; j < size * 2; j++) {
            augmentedMatrix[i][j] /= augmentedMatrix[i][i];
        }

        for (let j = 0; j < size; j++) {
            if (j !== i) {
                const factor = augmentedMatrix[j][i];
                for (let k = i; k < size * 2; k++) {
                    augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
                }
            }
        }
    }

    return augmentedMatrix.map(row => row.slice(size));
}


/**
 * Effectue une régression linéaire multiple
 * @param X la matrice des variables indépendantes
 * @param y le vecteur des variables dépendantes
 * @returns {*[][]} le vecteur des coefficients de la régression
 */
function multipleLinearRegression(X, y) {
    const XT = transpose(X);
    const XT_X = multiply(XT, X);
    const XT_X_inv = inverse(XT_X);
    const XT_y = multiply(XT, y);
    return multiply(XT_X_inv, XT_y);
}