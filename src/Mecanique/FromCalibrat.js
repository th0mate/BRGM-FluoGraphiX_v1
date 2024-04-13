/**
 * Classe chargée de récupérer les informations nécessaires à partir du fichier Calibrat.dat et de les utiliser pour en effectuer des calculs
 */


let lignesCalibrat = [];
let sectionsCalibrat = [];
let nomsTraceur = [];
let numeroFluorimetre = '';
let traceurs = [];


/**
 * Initialise les variables issues du fichier Calibrat.dat nécessaires pour le calcul de la régression linéaire
 */
function init() {
    lignesCalibrat = contenuCalibrat.split('\n');
    sectionsCalibrat = getSectionsCalibrat();
    nomsTraceur = getNomsTraceurs();
    numeroFluorimetre = getNumeroFluorimetre();
    creerTraceurs();
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
 * @returns {Traceur[]} les objets Traceur créés
 */
function creerTraceurs() {
    for (let i = 1; i <= 4; i++) {
        const section = sectionsCalibrat[i].split('\n');
        const nom = section[0].trim();
        const l1 = parseFloat(section[1].split(/\s+/)[1]);
        const l2 = parseFloat(section[2].split(/\s+/)[1]);
        const l3 = parseFloat(section[3].split(/\s+/)[1]);
        const l4 = parseFloat(section[4].split(/\s+/)[1]);
        traceurs.push(new Traceur(nom, l1, l2, l3, l4));
    }
    console.log(traceurs);
    return traceurs;
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