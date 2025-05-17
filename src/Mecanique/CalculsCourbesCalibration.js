/**
 * Ce fichier JavaScript contient les fonctions nécessaires pour afficher les données de calibration dans la partie "calibration" de FluoGraphiX
 * Certains des calculs effectués dans ce fichier, notamment pour obtenir les coefficients de certaines courbes, sont réutilisés dans la partie "visualisation" du site
 * Utilise des fichiers externes, comme Graphiques.js, notamment.
 * /!\ ATTENTION : Pour la correction de bugs, bien faire attention à ne pas modifier les fonctions de ce fichier sans vérifier que cela n'impacte d'autres fonctions !
 */


/**
 * Le nombre de valeurs n'étant pas NaN pour une lampe d'un traceur donné (donc pas pour l'eau)
 */
let nbValeurLampe = 0;

/**
 * Indique si des données potentiellement corrompues ont été détectées
 * @type {boolean} true si des données potentiellement corrompues ont été détectées, false sinon
 */
let donneesCorrompues = false;

/**
 * Contient un objet calcul, représentant l'équation de la courbe de calibration
 */
let equationCourbeCalibration;


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * INITIALISATION DES DONNEES
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Envoie les données du traceur vers des fonctions de calculs en fonction de leurs caractéristiques et affiche les courbes correspondantes
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function initialiserCalculsCourbes(idLampe, traceur) {

    if (!document.querySelector('#graphique')) {
        donneesCorrompues = false;
    }

    const resultat = effectuerCalculsCourbes(idLampe, traceur);

    if (traceur.lampePrincipale !== idLampe) {

        let countNaN = 0;
        for (let i = 0; i < resultat[0].length; i++) {
            if (isNaN(resultat[0][i])) {
                countNaN++;
            }
        }


        if (countNaN === 0) {
            afficherCourbeParasites3Valeurs(resultat, idLampe, traceur);
        } else if (countNaN === 1) {
            afficherCourbeParasites2Valeurs(resultat, idLampe, traceur);
        } else {
            afficherCourbeParasites1Valeur(resultat, idLampe, traceur);
        }


        if (donneesCorrompues) {
            if (!document.querySelector('#graphique')) {
                setTimeout(() => {
                    afficherPopup('<img src="Ressources/img/attention2.png" alt="">', 'Attention : données potentiellement corrompues détectées !', 'Les données calculées indiquent une potentielle erreur dans les données de calibration importées. Assurez-vous qu\'elles soient correctes.', '<div class="bouton boutonFonce" onclick="fermerPopup()">TERMINER</div>');
                }, 500);
            }
        }

    } else {

        if (nbValeurLampe !== 1) {
            console.log("afficherCourbeDepuis3Valeurs");
            afficherCourbeDepuis3Valeurs(resultat, idLampe, traceur);
        } else {
            console.log("afficherCourbeDepuis1Valeur");
            afficherCourbeDepuis1Valeur(resultat, idLampe, traceur);
        }

    }
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * CALCULS DES COURBES (DEGRE1; DEGRE2; CONSTANTES; ERREURS TYPES)
 * ---------------------------------------------------------------------------------------------------------------------
 */


/**
 * Effectue les calculs nécessaires pour obtenir les coefficients des courbes à afficher ensuite sur la partie visualisation ou la partie calibration du site.
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 * @return {*|*[]|*[][]|*[]} les résultats du calcul, contenant au maximum le degré1, le degré2, la constante et l'erreur type.
 */
function effectuerCalculsCourbes(idLampe, traceur) {
    nbValeurLampe = 0;
    equationCourbeCalibration = null;

    for (let i = 0; i < traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + (i + 1)))) {
            nbValeurLampe++;
        }
    }

    let resultat = [];

    if (traceur.lampePrincipale !== idLampe) {

        if (nbValeurLampe < 4 && nbValeurLampe !== 1 && nbValeurLampe !== 2) {
            return effectuerCalculsParasites(traceur, idLampe);
        } else if (nbValeurLampe === 1) {
            let index = 0;

            for (let i = 1; i <= traceur.echelles.length; i++) {
                if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
                    index = i;
                    break;
                }
            }

            const eau = traceurs.find(traceur => traceur.unite === '');
            const eauValeurLampePrincipale = eau.getDataParNom('L' + traceur.lampePrincipale + '-1');
            const eauValeurLampe = eau.getDataParNom('L' + idLampe + '-1');

            const pointX = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + index);
            const pointY = traceur.getDataParNom('L' + idLampe + '-' + index);

            return [[(pointY - eauValeurLampe) / (pointX - eauValeurLampePrincipale), NaN, NaN]];

        } else if (nbValeurLampe === 2) {
            return effectuerCalculsParasites3Valeurs(traceur, idLampe);
        } else {
            return effectuerCalculsParasites4Valeurs(traceur, idLampe);
        }

    } else {
        if (nbValeurLampe < 4 && nbValeurLampe !== 1) {
            console.log("cas1");
            const dmV = creerTableauValeursNettes(traceur, idLampe);
            let X = creerMatriceLn(traceur, dmV);
            //TODO - on est bien dans ce cas pour Uranine L1 - travailler les équations !
            X = inverse(X);
            console.log(X);
            const matriceEntetes = dmV[0];
            return multiply([matriceEntetes], X);

        } else if (nbValeurLampe === 1) {
            console.log("cas2");
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

            return resultat;

        } else {
            console.log("cas3");
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

            let tableauIntervaleConfiance = [];
            let derniereColonne = 0;
            for (let i = 0; i < colonne1.length; i++) {
                const ligne = [];
                const data = colonne2[i];
                ligne.push(data);
                ligne.push(colonne1[i]);
                const data2 = resultat[0][0] + resultat[0][1] * colonne2[i] + resultat[0][2] * colonne3[i];
                ligne.push(data2);
                ligne.push((colonne1[i] - data2) ** 2);
                derniereColonne += (colonne1[i] - data2) ** 2;
                tableauIntervaleConfiance.push(ligne);
            }

            const erreurType = 1.96 * (Math.sqrt(derniereColonne / (colonne1.length - 3)));

            resultat.push(erreurType);

            afficherEquationDroite();
            return resultat;

        }
    }

}

function afficherEquationDroite() {
    if (document.querySelector('.equation')) {
        document.querySelector('.equation').innerHTML = `<span>${equationCourbeCalibration.toStringEquation()}</span>`;
        document.querySelector('.equation').innerHTML += `${equationCourbeCalibration.toStringValeursParametres()}`;
    }
}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * CALCULS DES PARASITES
 * ---------------------------------------------------------------------------------------------------------------------
 */


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

    let Y = [];
    let X = [];
    const eau = traceurs.find(traceur => traceur.unite === '');

    for (let i = 0; i < nbValeurLampe; i++) {
        Y.push(Math.log(traceur.getDataParNom('L' + idLampe + '-' + (i + 1)) - eau.getDataParNom('L' + idLampe + '-1')));
        const ligne = [];
        ligne.push(1);
        const data = Math.log(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + (i + 1)) - eau.getDataParNom('L' + traceur.lampePrincipale + '-1'));
        ligne.push(data);
        ligne.push(data ** 2);
        X.push(ligne);
    }

    Y = transpose([Y]);
    let XT = transpose(X);
    let Xmultiply = multiply(XT, X);
    Xmultiply = inverse(Xmultiply);
    let beforeRegression = multiply(Xmultiply, XT);

    let final = multiply(beforeRegression, Y);

    X = X.map(ligne => ligne.slice(1));

    let tableauIntervaleConfiance = [];

    let derniereColonne = 0;

    final = transpose(final);

    for (let i = 0; i < nbValeurLampe; i++) {
        const ligne = [];
        const data = X[i][0];
        ligne.push(data);
        ligne.push(Y[i][0]);
        const data2 = final[0][0] + final[0][1] * data + final[0][2] * data ** 2;
        ligne.push(data2);
        ligne.push((Y[i][0] - data2) ** 2);
        derniereColonne += (Y[i][0] - data2) ** 2;
        tableauIntervaleConfiance.push(ligne);
    }

    const erreurType = 1.96 * (Math.sqrt(derniereColonne / (nbValeurLampe - 3)));
    final.push(erreurType);
    return final;
}


/**
 * Effectue les calculs nécessaires obtenir les données parasites d'une lampe, si on a 2 valeurs
 * @param traceur le traceur
 * @param idLampe l'id de la lampe
 * @return {(number|number)[][]} les résultats du calcul (constante et degré1)
 */
function effectuerCalculsParasites3Valeurs(traceur, idLampe) {

    const eau = traceurs.find(traceur => traceur.unite === '');
    let ligneLampePrincipale = [];
    let ligneLampeATraiter = [];

    for (let i = 1; i <= traceur.echelles.length; i++) {

        if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i))) {
            ligneLampePrincipale.push([traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')]);
        }

        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            ligneLampeATraiter.push([traceur.getDataParNom('L' + idLampe + '-' + i) - eau.getDataParNom('L' + idLampe + '-1')]);
        }

    }


    ligneLampePrincipale = ligneLampePrincipale.map(ligne => [Math.log(ligne[0])]);
    ligneLampeATraiter = ligneLampeATraiter.map(ligne => [Math.log(ligne[0])]);


    const constante = (ligneLampeATraiter[1] - ligneLampeATraiter[0]) / (ligneLampePrincipale[1] - ligneLampePrincipale[0]);
    const degre1 = ligneLampeATraiter[1] - constante * ligneLampePrincipale[1];

    return [[constante, degre1, NaN], NaN];

}


/**
 * ---------------------------------------------------------------------------------------------------------------------
 * AFFICHAGE DES COURBES - CONCENTRATION
 * ---------------------------------------------------------------------------------------------------------------------
 */


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
    const max = getValeurSup20Pourcents(traceur, idLampe);

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

    if (resultat.length > 1) {
        let colonne95Plus = [];
        let colonne95Moins = [];

        const data2 = {
            label: '95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        }

        const data3 = {
            label: '-95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        }

        for (let i = 0; i < colonne1.length; i++) {
            colonne95Plus.push(Math.exp(resultat[1] + constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
            colonne95Moins.push(Math.exp(-resultat[1] + constante + degre1 * colonne1[i] + degre2 * colonne1[i] ** 2));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data2.data.push({x: colonne0[i], y: colonne95Plus[i]});
            data3.data.push({x: colonne0[i], y: colonne95Moins[i]});
        }

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.data.datasets.push(data2);
            existingChart.data.datasets.push(data3);
            existingChart.update();
        }

    } else {
        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.update();
        }
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
    const max = getValeurSup20Pourcents(traceur, idLampe);

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
 * ---------------------------------------------------------------------------------------------------------------------
 * AFFICHAGE DES COURBES - PARASITES
 * ---------------------------------------------------------------------------------------------------------------------
 */


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

    let maxTraceur = 0;

    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i)) && traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) > maxTraceur) {
            maxTraceur = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i);
        }
    }

    const eau = traceurs.find(traceur => traceur.unite === '');
    const valeurIni = Math.log(eau.getDataParNom(`L${traceur.lampePrincipale}-1`) + 0.01);
    const valeurFinale = Math.log(maxTraceur * 1.2);

    const pas = (valeurFinale - valeurIni) / (100 - 1);

    let colonne0 = [];
    let colonne1 = [];
    let colonne2 = [];
    const max = getValeurSup20Pourcents(traceur, idLampe);

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
        }

        data.data.push({x: colonne1[i], y: colonne2[i]});
        tempX = colonne1[i];
        tempY = colonne2[i];
    }

    if (resultat.length > 1) {
        let colonne95Plus = [];
        let colonne95Moins = [];

        const data2 = {
            label: '95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        };

        const data3 = {
            label: '-95%',
            data: [],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'black',
            borderWidth: 1,
            pointRadius: 0,
            borderDash: [5, 5],
            tension: 0.4
        }

        for (let i = 0; i < colonne1.length; i++) {
            colonne95Plus.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(resultat[1] + constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
            colonne95Moins.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(-resultat[1] + constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 1 + degre2 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) ** 2));
        }

        for (let i = 0; i < colonne1.length; i++) {
            data2.data.push({x: colonne1[i], y: colonne95Plus[i]});
            data3.data.push({x: colonne1[i], y: colonne95Moins[i]});
        }

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.data.datasets.push(data2);
            existingChart.data.datasets.push(data3);
            existingChart.update();
        }

    } else {

        const canvas = document.getElementById('graphiqueTraceur');
        const existingChart = Chart.getChart(canvas);

        if (existingChart && !existingChart.data.datasets.find(dataset => dataset.label === data.label)) {
            existingChart.data.datasets.push(data);
            existingChart.update();
        }
    }
}


/**
 * Affiche la courbe de parasites en ayant uniquement la constante et le degré 1
 * @param resultat le résultat du calcul
 * @param idLampe l'id de la lampe
 * @param traceur le traceur
 */
function afficherCourbeParasites2Valeurs(resultat, idLampe, traceur) {
    const data = {
        label: 'Signaux parasites',
        data: [],
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(230,65,160)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
    };

    const degre1 = resultat[0][0];
    const constante = resultat[0][1];

    let maxTraceur = 0;

    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i)) && traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i) > maxTraceur) {
            maxTraceur = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + i);
        }
    }

    const eau = traceurs.find(traceur => traceur.unite === '');
    const valeurIni = Math.log(eau.getDataParNom(`L${traceur.lampePrincipale}-1`) + 0.01);
    const valeurFinale = Math.log(maxTraceur * 1.2);

    const pas = (valeurFinale - valeurIni) / (100 - 1);

    let colonne0 = [];
    let colonne1 = [];
    let colonne2 = [];

    colonne0.push(valeurIni);
    colonne1.push(Math.exp(valeurIni));
    colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[0] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1'))));

    for (let i = 1; i < 100; i++) {
        colonne0.push(colonne0[i - 1] + pas);
        colonne1.push(Math.exp(colonne0[i]));
        if (colonne1[i] <= eau.getDataParNom('L' + traceur.lampePrincipale + '-1')) {
            colonne2.push(0);
        } else {
            colonne2.push(eau.getDataParNom('L' + idLampe + '-1') + Math.exp(constante + degre1 * Math.log(colonne1[i] - eau.getDataParNom('L' + traceur.lampePrincipale + '-1'))));
        }
    }

    for (let i = 0; i < colonne1.length; i++) {
        data.data.push({x: colonne1[i], y: colonne2[i]});
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
    const eauValeurLampePrincipale = eau.getDataParNom('L' + traceur.lampePrincipale + '-1');
    const eauValeurLampe = eau.getDataParNom('L' + idLampe + '-1');

    let index = 0;

    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            index = i;
            break;
        }
    }


    const pointX = traceur.getDataParNom('L' + traceur.lampePrincipale + '-' + index);

    const a = resultat[0][0];
    const b = eauValeurLampe - a * eauValeurLampePrincipale;

    const marge = pointX * 1.2;
    let tempX = 0;
    let tempY = 0;

    for (let x = eauValeurLampePrincipale; x <= marge; x += 2) {
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
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS UTILITAIRES
 * ---------------------------------------------------------------------------------------------------------------------
 */


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
 * FONCTIONS DE CALCULS MATRICIELS
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
            afficherPopup('<img src="Ressources/img/404.png" alt="">', 'Erreur générale de calcul', 'Une erreur de calcul a empêché l\'exécution d\'une partie du code. Erreur : "La matrice est singulière et ne peut pas être inversée". Vérifiez vos données et les variables explicatives sélectionnées.', '<div class="bouton boutonFonce" onclick="fermerPopup()">FERMER</div>');
            console.error(matrix);
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
 * Retourne une valeur supérieure (+20%) à la valeur maximale du traceur LidLampe
 * @param traceur le traceur
 * @param idLampe l'id de la lampe
 * @returns {number} la valeur correspondante
 */
function getValeurSup20Pourcents(traceur, idLampe) {
    const valeurs = [];
    for (let i = 1; i <= traceur.echelles.length; i++) {
        if (!isNaN(traceur.getDataParNom('L' + idLampe + '-' + i))) {
            valeurs.push(traceur.getDataParNom('L' + idLampe + '-' + i));
        }
    }
    const max = Math.max(...valeurs);
    return max * 1.2;

}