/**
 * Ce fichier JavaScript contient les fonctions servant à afficher les graphiques ChartJS sur le site.
 * Il se décompose en deux parties principales :
 *  - Partie visualisation, pour l'affichage des données de mesure (mV) issues de fluorimètres
 *  - Partie calibration, pour l'affichage des graphiques (parasites, concentration) des traceurs
 *  /!\ ATTENTION : dépend fortement de l'utilisation de librairies externes, téléchargées dans le dossier src/libs : ChartJS, Luxon, Hammer, etc.
 * @type {DateTime}
 */


/**
 * Librairie Luxon pour la gestion des dates et heures. Utile pour éviter les gros problèmes lors de changements d'heures.
 * @type {DateTime}
 */
const DateTime = luxon.DateTime;



/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE VISUALISATION
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Traite les données de mesures pour les afficher sous la forme d'un graphique : milliVolts en fonction du temps - Partie Visualisation
 * @param mvContent le contenu du ou des fichier(s) importé(s) par l'utilisateur à afficher
 */
function afficherGraphique(mvContent) {
    const couleurs = ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgb(249,158,255)', 'rgba(255, 99, 132, 1)'];
    const lignes = mvContent.split('\n');

    if (!lignes[0].includes('FluoriGraphix')) {
        lignes.unshift('\n');
        lignes.unshift('\n');
    }

    const header = lignes[2].split(';').splice(2);

    const dataColumns = header.map(() => []);

    for (let i = 3; i < lignes.length - 1; i++) {
        const colonnes = lignes[i].split(';');

        const dateStr = colonnes[0] + '-' + colonnes[1];
        const timeDate = DateTime.fromFormat(dateStr, 'dd/MM/yy-HH:mm:ss', {zone: 'UTC'});

        const timestamp = timeDate.toMillis();

        for (let j = 0; j < dataColumns.length; j++) {
            const value = parseFloat(colonnes[j + 2]);
            dataColumns[j].push({x: timestamp, y: value});
        }
    }

    const datasets = [];
    for (let i = 0; i < header.length; i++) {
        if (header[i] !== '' && header[i] !== 'R' && header[i] !== '    ' && header[i] !== '  ') {
            if (i >= couleurs.length) {
                couleurs.push(getRandomColor());
            }

            datasets.push({
                label: header[i],
                data: dataColumns[i],
                borderColor: couleurs[i],
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            });
        }
    }

    const data = {
        datasets: datasets
    };

    const canvas = document.getElementById('graphique');
    canvas.style.display = 'block';

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const ctx = canvas.getContext('2d');

    const chartOptions = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'x',
                        unit: 'hour',
                        tooltipFormat: 'DD/MM/YY-HH:mm:ss',
                        displayFormats: {
                            hour: 'DD/MM/YY-HH:mm:ss'
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20,
                        callback: function (value, index, values) {
                            return DateTime.fromMillis(value, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                        }
                    }
                },
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: `${zoom}`,
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: `${zoom}`,
                    }
                },
                annotation : {
                    annotation: {
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function (tooltipItem) {
                            return DateTime.fromMillis(tooltipItem[0].parsed.x, {zone: 'UTC'}).toFormat('dd/MM/yy-HH:mm:ss');
                        },
                        label: function (tooltipItem) {
                            return tooltipItem.dataset.label + ': ' + tooltipItem.parsed.y;
                        }
                    }
                }
            },
        }
    };

    new Chart(ctx, chartOptions);

    cacherDoublons();
    document.querySelector('.resetZoom').style.display = 'flex';
    document.querySelector('.copier').style.display = 'flex';
    document.querySelector('.infos').style.display = 'none';
}



/**
 * ---------------------------------------------------------------------------------------------------------------------
 * FONCTIONS UTILITAIRES
 * ---------------------------------------------------------------------------------------------------------------------
 */



/**
 * Return true si le string passé en paramètre contient ne contient que des duplications du même nombre
 * @param string le string - donc la colonne de données à vérifier
 * @returns {boolean} true si le string contient que des duplications du même nombre
 */
function isConstant(string) {
    const value = string[0].y;
    for (let i = 1; i < string.length - 5; i++) {
        if (around(string[i].y) !== around(value)) {
            return false;
        }
    }
    return true;

}


/**
 * Cache dans le graphique existant toutes les courbes réprésentant des colonnes pour lesquelles isConstant renvoie true
 */
function cacherDoublons() {
    const canvas = document.getElementById('graphique');
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        const datasets = existingChart.data.datasets;
        for (let i = 0; i < datasets.length; i++) {
            if (isConstant(datasets[i].data)) {
                datasets[i].hidden = true;
                const index = existingChart.data.datasets.findIndex(dataset => dataset.label === datasets[i].label);
                if (existingChart.isDatasetVisible(index)) {
                    existingChart.toggleDataVisibility(index);
                }
            }
        }
        existingChart.update();
    }
}


/**
 * Retourne une couleur aléatoire en rgba
 * @returns {string} une couleur aléatoire en rgba
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    let isLight = false;
    while (!isLight) {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        isLight = !isColorLight(color);
    }
    return color;
}


/**
 * Retourne true si la couleur passée en paramètre est claire
 * @param color la couleur à vérifier
 * @returns {boolean} true si la couleur est claire
 */
function isColorLight(color) {
    const rgb = hexToRgb(color);
    const hsp = Math.sqrt(
        0.299 * (rgb.r * rgb.r) +
        0.587 * (rgb.g * rgb.g) +
        0.114 * (rgb.b * rgb.b)
    );
    return hsp > 127.5;
}


/**
 * Convertit une couleur hexadécimale en RGB
 * @param hex la couleur hexadécimale
 * @returns {{r: number, b: number, g: number}} la couleur en RGB
 */
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
}




/**
 * ---------------------------------------------------------------------------------------------------------------------
 * PARTIE CALIBRATION
 * ---------------------------------------------------------------------------------------------------------------------
 */




/**
 * Affiche un graphique pour un traceur donné de ses LX en fonction de la valeur des signaux - Partie Calibration
 * @param traceur le traceur à afficher
 * @param idData l'id du traceur
 */
function afficherGraphiqueTraceur(traceur, idData) {
    let labels = traceur.echelles;
    let datasets = [];
    let maxDataLength = 0;
    let maxDataIndex = 0;
    let labelX = '';
    let labelY = '';


    let nbValeurs = 0;
    for (let i = 0; i < labels.length; i++) {
        const value = traceur.getDataParNom('L' + idData + '-' + (i + 1));
        if (value !== null && value !== 'NaN' && !isNaN(value)) {
            nbValeurs++;
        }

    }


    if (idData === traceur.lampePrincipale) {
        labelX = `Signaux (mV)`;
        labelY = `Concentrations (${traceur.unite})`;

        for (let i = 1; i <= 4; i++) {
            let data = [];
            for (let j = 0; j < labels.length; j++) {
                const value = traceur.getDataParNom('L' + i + '-' + (j + 1));
                if (value !== null && value !== 'NaN') {
                    data.push({x: value, y: labels[j]});
                }
            }


            data = data.filter((point) => !isNaN(point.x) && !isNaN(point.y));


            if (data.length > maxDataLength) {
                maxDataLength = data.length;
                maxDataIndex = datasets.length;
            }

            let hiddenStatus = false;
            if (data.length > 1 && data[0].x === '0') {
                hiddenStatus = true;
            }

            if (i === idData) {
                const eau = recupererTraceurEau();
                let dataEau = [];
                for (let j = 0; j < labels.length; j++) {
                    const value = eau.getDataParNom('L' + idData + '-' + (j + 1));
                    if (value !== null && value !== 'NaN') {
                        dataEau.push({x: value, y: 0});
                    }
                }
                dataEau = dataEau.filter((point) => !isNaN(point.x) && !isNaN(point.y));
                datasets.push({
                    label: eau.nom,
                    data: dataEau,
                    borderColor: 'rgb(86,135,255)',
                    borderWidth: 2,
                    fill: false,
                    hidden: false,
                    showLine: false,
                    pointStyle: 'cross'
                });


                datasets.push({
                    label: 'L' + i,
                    data: data,
                    borderColor: getRandomColor(),
                    borderWidth: 2,
                    fill: false,
                    hidden: hiddenStatus,
                    showLine: false,
                    pointStyle: 'cross'
                });
            }
        }


    } else {
        labelX = `Signal L${traceur.lampePrincipale} (mV)`;
        labelY = `Signal parasite L${idData} (mV)`;

        let data = [];
        const tableauY = [];

        for (let j = 0; j < labels.length; j++) {
            const value = traceur.getDataParNom('L' + idData + '-' + (j + 1));
            if (value !== null && value !== 'NaN') {
                tableauY.push(value);
            }
        }

        for (let j = 0; j < labels.length; j++) {
            const value = traceur.getDataParNom('L' + traceur.lampePrincipale +'-' + (j + 1));
            if (value !== null && value !== 'NaN') {
                data.push({x: value, y: tableauY[j]});
            }
        }

        data = data.filter((point) => !isNaN(point.x) && !isNaN(point.y));


        let hiddenStatus = false;
        if (data.length > 1 && data[0].x === '0') {
            hiddenStatus = true;
        }

        const eau = recupererTraceurEau();
        let dataEau = [];
         dataEau.push({x: eau.getDataParNom('L' + traceur.lampePrincipale + '-1'), y: eau.getDataParNom('L' + idData + '-1')});

        datasets.push({
            label: eau.nom,
            data: dataEau,
            borderColor: 'rgb(86,135,255)',
            borderWidth: 2,
            fill: false,
            hidden: false,
            showLine: false,
            pointStyle: 'cross'
        });


        datasets.push({
            label: 'L' + idData,
            data: data,
            borderColor: getRandomColor(),
            borderWidth: 2,
            fill: false,
            hidden: hiddenStatus,
            showLine: false,
            pointStyle: 'cross'
        });

    }


    for (let i = 0; i < datasets.length; i++) {
        if (datasets[i].data.length > 1) {
            labels = labels.filter(label => label !== 0);
            labels.unshift(0);
            break;
        }
    }


    if (document.getElementById('graphiqueTraceur')) {
        document.getElementById('graphiqueTraceur').remove();
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'graphiqueTraceur';
    canvas.style.display = 'block';
    document.querySelector('.donnees').appendChild(canvas);

    const ctx = document.getElementById('graphiqueTraceur').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(String),
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: labelX
                    }
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: labelY
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        onPan: function ({chart}) {
                            const scales = chart.scales;
                            if (scales['x'].min < 0 || scales['y'].min < 0) {
                                return false;
                            }
                        }
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                        onZoom: function ({chart}) {
                            const scales = chart.scales;
                            if (scales['x'].min < 0 || scales['y'].min < 0) {
                                return false;
                            }
                        }
                    }
                },
            },
            elements: {
                point: {
                    radius: 10
                }
            }
        }
    });
}



