/**
 * Effectue toutes les inits et les calculs nécessaires pour le calcul des concentrations d'un traceur et d'une lampe donnés
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function calculerConcentration(idLampe, traceur) {
    const final = new Map();
    let resultat;
    if (traceur.echelles.length < 4 && traceur.echelles !== 1) {
        const dmV = creerTableauValeursNettes(traceur, idLampe);
        let X = creerMatriceLn(traceur, dmV);
        X = inverse(X);
        const matriceEntetes = dmV[0];
        resultat = multiply([matriceEntetes], X);
    } else if (traceur.echelles.length === 1) {
        //TODO
    } else {

    }
    final.set('Constante', arrondir8Chiffres(resultat[0][0]));
    final.set('Degré 1', arrondir8Chiffres(resultat[0][1]));
    final.set('Degré 2', arrondir8Chiffres(resultat[0][2]));
    console.log(final);
    return final;
}

/**
 * Calcule le logarithme népérien d'un nombre
 * @param nb le nombre
 * @return {number} le logarithme népérien du nombre
 */
function ln(nb) {
    return Math.log(nb);
}

/**
 * Retourne un tableau (matrice) contenant les signaux nets pour un traceur et une lampe donnée.
 * Les titres des colonnes sont les logarithmes népériens des échelles du traceur
 * Les titres des lignes sont L1 à L4
 * Le contenu des cellules est le signal net, donc le signal (L lampe - X) - la valeur LX - 1 de l'eau
 * @param traceur
 * @param lampe
 */
function creerTableauValeursNettes(traceur, lampe) {
    const eau = traceurs.find(traceur => traceur.unite === '');
    const valeursNettes = [];

    const echelles = traceur.echelles.map(echelle => arrondir8Chiffres(ln(echelle)));
    valeursNettes.push(echelles);


    const ligne = [];
    for (let j = 1; j <= traceur.echelles.length; j++) {
        const signal = traceur.getDataParNom('L' + lampe + '-' + j) - eau.getDataParNom('L' + lampe + '-1');
        ligne.push(arrondir8Chiffres(signal));
    }
    valeursNettes.push(ligne);

    return valeursNettes;
}


/**
 * Crée une matrice contenant ln(creerTableauValeursNettes)** position de chaque cellule de traceur.echelles
 */
function creerMatriceLn(traceur, tableauValeursNettes) {
    const matriceLn = [];
    for (let i = 0; i < traceur.echelles.length; i++) {
        const ligne = [];
        //deuxième ligne de tableauValeursNettes
        for (let j = 0; j < tableauValeursNettes[1].length; j++) {
            ligne.push(arrondir8Chiffres(ln(tableauValeursNettes[1][j]) ** i));
        }
        matriceLn.push(ligne);
    }
    return matriceLn;
}


/**
 * Arrondi un nombre à 8 chiffres après la virgule maximum
 * @param nb le nombre
 * @returns {number} le nombre arrondi
 */
function arrondir8Chiffres(nb) {
    return Math.round(nb * 100000000) / 100000000;
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