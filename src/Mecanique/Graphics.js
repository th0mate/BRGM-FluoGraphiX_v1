

/**
 * Traite les données pour les afficher sous forme de graphique
 * @param mvContent le contenu du fichier .mv à afficher
 */
function afficherGraphique(mvContent) {
    const couleurs = ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgb(249,158,255)'];
    const lignes = mvContent.split('\n');
    const labels = [];
    const datasets = [];

    const header = lignes[2].split(/ {2,}/).slice(3);

    const dataColumns = header.map(() => []);
    let lastDate = null;

    for (let i = 3; i < lignes.length; i++) {
        const colonnes = lignes[i].split(/\s+/);
        const timeValue = colonnes[2];

        const timeDate = moment.utc(timeValue, 'DD/MM/YY-HH:mm:ss');

        if (timeDate.isValid()) {
            if (lastDate && timeDate.isBefore(lastDate)) {
                console.warn('Date inférieure à la précédente :', timeDate);
                continue;
            }

            labels.push(timeDate);
            lastDate = timeDate;

            for (let j = 0; j < dataColumns.length; j++) {
                const value = around(parseFloat(colonnes[j + 3]));
                dataColumns[j].push({x: timeDate, y: value});
            }
        }
    }

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
                fill: false
            });
        }
    }

    console.log(labels);

    const data = {
        labels: labels,
        datasets: datasets
    };

    const canvas = document.getElementById('graphique');
    canvas.style.display = 'block';

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    const ctx = document.getElementById('graphique').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'DD/MM/YY-HH:mm:ss',
                        unit: 'minute',
                        displayFormats: {
                            minute: 'DD/MM/YYYY-HH:mm:SS'
                        }
                    },
                    position: 'bottom',
                    ticks: {
                        source: 'labels',
                        autoSkip: true,
                        maxTicksLimit: 20
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
            },
            datasets: {
                line: {
                    pointRadius: 0
                }
            }
        }
    });

    cacherDoublons();
    document.querySelector('.resetZoom').style.display = 'flex';
    document.querySelector('.infos').style.display = 'none';
}


/**
 * Return true si le string passé en paramètre contient ne contient que des duplications du même nombre
 * @param string le string - donc la colonne de données à vérifier
 * @returns {boolean} true si le string contient que des duplications du même nombre
 */
function isConstant(string) {
    const value = string[0].y;
    for (let i = 1; i < string.length; i++) {
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
 * Affiche un graphique pour un traceur donné de ses LX en fonction de la valeur des signaux
 * @param traceur le traceur à afficher
 * @param idData l'id du traceur
 */
function afficherGraphiqueTraceur(traceur, idData) {
    let labels = traceur.echelles;
    let datasets = [];
    let maxDataLength = 0;
    let maxDataIndex = 0;


    let nbValeurs = 0;
    for (let i = 0; i < labels.length; i++) {
        const value = traceur.getDataParNom('L'+ idData + '-' + (i + 1));
        if (value !== null && value !== 'NaN' && !isNaN(value)) {
            nbValeurs++;
        }

    }

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
                        text: 'Signaux (mV)'
                    }
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Concentrations (ppb)'
                    }
                }
            },
            plugins: {
                crosshair: {
                    enabled: true,
                    line: {color: 'rgba(255, 0, 0, 0.5)', width: 2},
                    sync: {
                        enabled: true,
                    },
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



