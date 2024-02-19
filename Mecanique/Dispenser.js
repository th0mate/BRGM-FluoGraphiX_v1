/**
 * Gère le lien entre le HTML et le back
 * @type {boolean} si l'optimisation est activée ou non
 */


let isOptimise = false;

/**
 * Traite le fichier sélectionné par l'utilisateur et redirige le contenu du fichier vers la fonction de traitement appropriée
 */
function traiterFichier() {
    const inputFichier = document.getElementById('fileInput');
    const fichier = inputFichier.files[0];

    if (fichier) {

        if (fichier.name.split('.').pop() === "xml") {

            const reader = new FileReader();
            reader.readAsText(fichier);

            reader.onload = function () {
                const xmlString = reader.result;
                const mvContent = convertirXMLenMV(xmlString);
                afficherGraphique(mvContent);
            };
        } else if (fichier.name.split('.').pop() === "txt") {
            chargerTexteFichier(fichier, function (contenuFichier) {
                const mvContent = convertirTexteenMV(contenuFichier);
                if (mvContent) {
                    afficherGraphique(mvContent);
                } else {
                    console.error("Erreur lors du traitement du fichier texte.");
                }
            });
        } else if (fichier.name.split('.').pop() === "mv") {
            getStringDepuisFichierMV(fichier, function (mvContent) {
                if (mvContent) {
                    console.log(mvContent);
                    afficherGraphique(mvContent);
                } else {
                    console.error("Erreur lors de la lecture du fichier .mv.");
                }
            });
        } else {
            console.error("Ce type de fichier n'est pas pris en charge");
        }
    } else {
        console.error("Aucun fichier sélectionné.");
    }
}

/**
 * Réinitialise le zoom du graphique comme il était d'origine
 */
function resetZoom() {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.resetZoom();
    }
}

/**
 * Affiche tous les points sur le graphique si le nombre de points est inférieur à 100, sinon les masque si ce n'est pas déjà fait
 */
function displayPoints() {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        const nbPoints = getNbPoints();
        if (getNbPoints() < 100) {
            existingChart.options.datasets.line.pointRadius = 3;
            existingChart.options.elements.point.display = true;
            existingChart.update();
        } else {
            if (existingChart.options.datasets.line.pointRadius !== 0) {
                existingChart.options.datasets.line.pointRadius = 0;
                existingChart.update();
            }
        }

    }
}

/**
 * Retourne le nombre de points sur le graphique affichés à l'écran, en se mettant à jour dès que le zoom sur le graphique change
 */
function getNbPoints() {
    const canvas = document.getElementById('graphique');
    const chart = Chart.getChart(canvas);

    // Récupérer les échelles des axes
    const xAxis = chart.scales['x'];
    const yAxis = chart.scales['y'];

    // Récupérer les graduations des axes X et Y
    const xTicks = xAxis.getTicks();
    const yTicks = yAxis.getTicks();

    // Nombre de points actuellement visibles sur l'axe X (basé sur les graduations)
    const visiblePointsX = xTicks.length;

    // Nombre de points actuellement visibles sur l'axe Y (basé sur les graduations)
    const visiblePointsY = yTicks.length;
    return visiblePointsX * visiblePointsY;

}


/**
 * Optimise l'affichage des points sur le graphique en arrondissant les valeurs des graduations aux entiers les plus proches
 */
function optimise() {
    isOptimise = !isOptimise;
}

/**
 * Retourne si l'optimisation est activée ou non
 * @returns {boolean} si l'optimisation est activée ou non
 */
function getOptimise() {
    return isOptimise;
}

/**
 * Permet d'afficher les points ou non sur le graphique en fonction du niveau de zoom
 */
document.getElementById('graphique').onwheel = function () {
    //displayPoints();
};