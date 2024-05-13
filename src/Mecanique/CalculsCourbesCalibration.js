/**
 * Le nombre de valeurs n'étant pas NaN pour une lampe d'un traceur donné
 */
let nbValeurLampe = 0;
let donneesCorrompues = false;

/**
 * Effectue toutes les inits et les calculs nécessaires pour le calcul des concentrations d'un traceur et d'une lampe donnés
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function calculerConcentration(idLampe, traceur) {
    donneesCorrompues = false;
    nbValeurLampe = 0;
    for (let i = 0; i < traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + (i + 1)))) {
            nbValeurLampe++;
        }
    }

    let resultat = [];

    if (traceur.lampePrincipale !== idLampe) {

        let result = [];

        if (nbValeurLampe < 4) {
            result = effectuerCalculsParasites(traceur, idLampe);
        } else {
            result = effectuerCalculsParasites4Valeurs(traceur, idLampe);
        }

        let countNaN = 0;
        console.log(result);
        for (let i = 0; i < result[0].length; i++) {
            if (isNaN(result[0][i])) {
                countNaN++;
            }
        }

        if (countNaN === 0) {
            afficherCourbeParasites3Valeurs(result, idLampe, traceur);
        } else {
            afficherCourbeParasites1Valeur(result, idLampe, traceur);
        }

        if (donneesCorrompues) {
            afficherPopup('<img src="Ressources/img/attention2.png" alt="">', 'Attention : données potentiellement corrompues détectées !', 'Les données affichées par la courbe indiquent une potentielle erreur dans les données pour cette lampe et ce traceur. Assurez-vous qu\'elles soient correctes.', '<div class="bouton boutonFonce" onclick="fermerPopup()">TERMINER</div>');
        }

    } else {
        if (nbValeurLampe < 4 && nbValeurLampe !== 1) {
            const dmV = creerTableauValeursNettes(traceur, idLampe);
            let X = creerMatriceLn(traceur, dmV);
            X = inverse(X);
            const matriceEntetes = dmV[0];
            resultat = multiply([matriceEntetes], X);
            afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur);


        } else if (nbValeurLampe === 1) {

            const eau = traceurs.find(traceur => traceur.unite === '');
            const dmv = [];
            let temp = 0;
            const y = [];
            y.push(0);
            dmv.push(0);
            for (let i = 1; i <= traceur.echelles.length; i++) {
                if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
                    temp = traceur.getDataParNom('L' + idLampe + '-' + i);
                    y.push(traceur.echelles[i - 1]);
                }
            }
            dmv.push(temp - eau.getDataParNom('L' + idLampe + '-1'));
            resultat.push(arrondir8Chiffres((y[1] - y[0]) / (dmv[1] - dmv[0])));
            afficherCourbeDepuis1Valeur(resultat, idLampe, traceur);

        } else {
            const regLin = creerTableauValeursNettesLn(traceur, idLampe);
            let colonne1 = [];
            let colonne2 = [];
            let colonne3 = [];

            for (let i = 0; i < regLin.length; i++) {
                colonne1.push(regLin[i][0]);
                colonne2.push(regLin[i][1]);
                colonne3.push(regLin[i][2]);
            }

            let colonne2_3 = [];
            for (let i = 0; i < colonne2.length; i++) {
                colonne2_3.push([1, colonne2[i], colonne3[i]]);
            }

            resultat = multipleLinearRegression(colonne2_3, [colonne1]);
            resultat = transpose(resultat);
            afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur);
        }
    }
}


/**
 * Effectue les calculs nécessaires obtenir les données parasites d'une lampe, si on a 1, 2 ou 3 valeurs
 * @param traceur le traceur
 * @param idLampe l'id de la lampe
 * @returns {*[]} les résultats du calcul
 */
function effectuerCalculsParasites(traceur, idLampe) {
    const eau = traceurs.find(traceur => traceur.unite === '');
    const ln = [];
    const l4Net = [];
    const X = [];

    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            ln.push(arrondir8Chiffres(Math.log(traceur.getDataParNom('L' + idLampe + '-' + i) - eau.getDataParNom('L' + idLampe + '-1'))));
        }
        if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i))) {
            l4Net.push(arrondir8Chiffres(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')));
        }
    }

    for (let i = 0; i < 3; i++) {
        const ligne = [];
        for (let j = 0; j < ln.length; j++) {
            ligne.push(arrondir8Chiffres(Math.log(l4Net[j]) ** i));
        }
        X.push(ligne);
    }

    const Xinverse = inverse(X);
    return (multiply([ln], Xinverse));
}


/**
 * Effectue les calculs nécessaires obtenir les données parasites d'une lampe, si on a 4 valeurs ou plus
 * @param traceur le traceur
 * @param idLampe l'id de la lampe
 * @returns {*[]} les résultats du calcul
 */
function effectuerCalculsParasites4Valeurs(traceur, idLampe) {
    //TODO marche pas
    const regLin = creerTableauValeursNettesLn(traceur, idLampe);
    let colonne1 = [];
    let colonne2 = [];
    let colonne3 = [];

    for (let i = 0; i < regLin.length; i++) {
        colonne1.push(regLin[i][0]);
        colonne2.push(regLin[i][1]);
        colonne3.push(regLin[i][2]);
    }

    let colonne2_3 = [];
    for (let i = 0; i < colonne2.length; i++) {
        colonne2_3.push([1, colonne2[i], colonne3[i]]);
    }

    let resultat = multipleLinearRegression(colonne2_3, [colonne1]);
    resultat = transpose(resultat);
    return resultat;
}


/**
 * Affiche la courbe de concentration d'un traceur et d'une lampe donnés ayant nbValeurLampe !== 1
 * @param resultat les résultats du calcul
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur) {
    const data = {
        label: 'Calibration',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(230,65,160)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    };

    let final = new Map();
    final.set('Constante', arrondir8Chiffres(resultat[0][0]));
    final.set('Degré 1', arrondir8Chiffres(resultat[0][1]));
    if (resultat[0].length === 3) {
        final.set('Degré 2', arrondir8Chiffres(resultat[0][2]));
    }

    const constante = arrondir8Chiffres(resultat[0][0]);
    const degre1 = arrondir8Chiffres(resultat[0][1]);
    const degre2 = resultat[0].length === 3 ? arrondir8Chiffres(resultat[0][2]) : 0;

    const eau = traceurs.find(traceur => traceur.unite === '');
    const eauValeur = eau.getDataParNom('L' + idLampe + '-1');

    let colonne0 = [];
    let colonne1 = [];
    let colonne2 = [];
    const max = valeurSup10(traceur, idLampe);

    for (let i = eauValeur + 0.01; i <= max; i += 2) {
        colonne0.push(i);
        colonne1.push(ln(i - eauValeur));
    }

    for (let i = 0; i < colonne1.length; i++) {
        colonne2.push(Math.exp(constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
    }

    for (let i = 0; i < colonne1.length; i++) {
        data.data.push({x: colonne0[i], y: colonne2[i]});
    }

    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);

    if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
        existingChart.data.datasets.push(data);
        existingChart.update();
    }
}


/**
 * Affiche la courbe de concentration d'un traceur et d'une lampe donnés ayant nbValeurLampe === 1
 * @param resultat le résultat du calcul
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function afficherCourbeDepuis1Valeur(resultat, idLampe, traceur) {

    const data = {
        label: 'Calibration',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(230,65,160)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    };

    const a = resultat[0];
    const eau = traceurs.find(traceur => traceur.unite === '');
    const eauValeur = eau.getDataParNom('L' + idLampe + '-1');

    let colonne0 = [];
    let colonne1 = [];
    const max = valeurSup10(traceur, idLampe);

    for (let i = eauValeur + 0.01; i <= max; i += 2) {
        colonne0.push(i);
        colonne1.push(a * (i - eauValeur));
    }

    for (let i = 0; i < colonne1.length; i++) {
        data.data.push({x: colonne0[i], y: colonne1[i]});
    }

    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);

    if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
        existingChart.data.datasets.push(data);
        existingChart.update();
    }
}


/**
 * Affiche la courbe des mv parasites d'une lampe d'un traceur donné pour un degré 2
 */
function afficherCourbeParasites3Valeurs(resultat, idLampe, traceur) {
    const data = {
        label: 'Signaux parasites',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(230,65,160)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    };

    const constante = arrondir8Chiffres(resultat[0][0]);
    const degre1 = arrondir8Chiffres(resultat[0][1]);
    const degre2 = arrondir8Chiffres(resultat[0][2]);

    const eau = traceurs.find(traceur => traceur.unite === '');
    const eauValeur = eau.getDataParNom('L' + idLampe + '-1');
    const valeurIni = Math.log(eau.getDataParNom('L4-1') + 0.01);
    const valeurFinale = Math.log(traceur.getDataParNom('L4-3') * 1.2);

    const pas = (valeurFinale - valeurIni) / (100 - 1);


    let colonne0 = [];
    let colonne1 = [];
    let colonne2 = [];
    const max = valeurSup10(traceur, idLampe);

    colonne0.push(valeurIni);
    colonne1.push(Math.exp(valeurIni));
    colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));


    for (let i = 1; i < 100; i++) {
        colonne0.push(colonne0[i - 1] + pas);
        colonne1.push(Math.exp(colonne0[i]));
        if (colonne1[i] <= eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) {
            colonne2.push(0);
        } else {
            colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
        }
    }

    let tempX = 0;
    let tempY = 0;


    for (let i = 0; i < colonne1.length; i++) {

        if (colonne1[i] < tempX || colonne2[i] < tempY) {
            donneesCorrompues = true;
            console.error('prec (x,y): ' + tempX + ' ou ' + tempY + ' pour: ' + colonne1[i] + ' ou ' + colonne2[i]);
        }

        data.data.push({x: colonne1[i], y: colonne2[i]});
        tempX = colonne1[i];
        tempY = colonne2[i];
    }

    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);

    if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
        existingChart.data.datasets.push(data);
        existingChart.update();
    }
}


/**
 * Affiche la courbe de parasites en ayant uniquement la constante et aucun degré. La droite doit alors passer par les deux points
 * @param resultat le résultat du calcul
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function afficherCourbeParasites1Valeur(resultat, idLampe, traceur) {
    const data = {
        label: 'Signaux parasites',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(230,65,160)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    };

    const eau = traceurs.find(traceur => traceur.unite === '');
    const eauValeurL4 = eau.getDataParNom('L' + traceur.lampePrincipale + '-1');
    const eauValeurLampe = eau.getDataParNom('L' + idLampe + '-1');

    let index = 0;

    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            index = i;
            break;
        }
    }

    const pointX = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + index);
    const pointY = traceur.getDataParNom('L' + idLampe + '-' + index);

    const a = (pointY - eauValeurLampe) / (pointX - eauValeurL4);
    const b = eauValeurLampe - a * eauValeurL4;

    const marge = pointX * 1.2;
    let tempX = 0;
    let tempY = 0;

    for (let x = eauValeurL4; x <= marge; x += 2) {
        const y = a * x + b;

        if (x < tempX || y < tempY) {
            donneesCorrompues = true;
        }

        data.data.push({x: x, y: y});
        tempX = x;
        tempY = y;

    }

    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);

    if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
        existingChart.data.datasets.push(data);
        existingChart.update();
    }

}


/**
 * Réinitialise le zoom du graphique comme il était d'origine
 */
function reinitialiserZoomGraphiqueConcentrations() {
    const canvas = document.getElementById('graphiqueTraceur');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.resetZoom();
        afficherMessageFlash("Zoom réinitialisé.", 'info');
    }

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
 * Retourne un tableau (matrice) contenant les signaux nets pour un traceur et une lampe donnée.
 * Les titres des colonnes sont les logarithmes népériens des échelles du traceur
 * Les titres des lignes sont L1 à L4
 * Le contenu des cellules est le signal net, donc le signal (L lampe - X) - la valeur LX - 1 de l'eau
 * @param traceur
 * @param lampe
 */
function creerTableauValeursNettesLn(traceur, lampe) {
    const eau = traceurs.find(traceur => traceur.unite === '');
    let valeursNettes = [];

    const echelles = traceur.echelles.map(echelle => arrondir8Chiffres(ln(echelle)));
    valeursNettes.push(echelles);

    const ligne = [];
    const ligneCarre = [];
    for (let j = 1; j <= traceur.echelles.length; j++) {
        const signal = ln(traceur.getDataParNom('L' + lampe + '-' + j) - eau.getDataParNom('L' + lampe + '-1'));
        ligne.push(arrondir8Chiffres(signal));
        ligneCarre.push(arrondir8Chiffres(signal ** 2));
    }
    valeursNettes.push(ligne);
    valeursNettes.push(ligneCarre);

    valeursNettes = transpose(valeursNettes);

    return valeursNettes;
}


/**
 * Crée une matrice contenant ln(creerTableauValeursNettes)** position de chaque cellule de traceur.echelles
 */
function creerMatriceLn(traceur, tableauValeursNettes) {
    const matriceLn = [];
    for (let i = 0; i < traceur.echelles.length; i++) {
        const ligne = [];
        for (let j = 0; j < tableauValeursNettes[1].length; j++) {
            ligne.push(arrondir8Chiffres(ln(tableauValeursNettes[1][j]) ** i));
        }
        matriceLn.push(ligne);
    }
    return matriceLn;
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS DE CALCULS
 * ---------------------------------------------------------------------------------------------------------------------
 */


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
            console.error(matrix);
            throw new Error('La matrice est singulière et ne peut pas être inversée');
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
    y = transpose(y);
    const XT_y = multiply(XT, y);
    return multiply(XT_X_inv, XT_y);
}


/**
 * Retourne une valeur supérieure à la valeur maximale du traceur LidLampe
 * @param traceur le traceur
 * @param idLampe l'id de la lampe
 * @returns {number} la valeur correspondante
 */
function valeurSup10(traceur, idLampe) {
    const valeurs = [];
    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            valeurs.push(traceur.getDataParNom('L' + idLampe + '-' + i));
        }
    }
    const max = Math.max(...valeurs);
    //on retourne max + 20%
    return max * 1.2;

}