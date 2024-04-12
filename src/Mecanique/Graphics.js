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

    for (let i = 3; i < lignes.length; i++) {
        const colonnes = lignes[i].split(/\s+/);
        const timeValue = colonnes[2];

        const timeDate = moment(timeValue, 'DD/MM/YY-HH:mm:ss', true);
        if (timeDate.isValid()) {
            labels.push(timeDate.toISOString());

            for (let j = 0; j < dataColumns.length; j++) {
                const value = around(parseFloat(colonnes[j + 3]));
                dataColumns[j].push({x: timeDate.toISOString(), y: value});
            }
        }
    }

    for (let i = 0; i < header.length; i++) {
        if (header[i]!== '' && header[i] !== 'R' && header[i] !== '    ' && header[i] !== '  ') {
            console.log(couleurs[i]);
            datasets.push({
                label: header[i],
                data: dataColumns[i],
                borderColor: couleurs[i],
                borderWidth: 2,
                fill: false
            });
        }
    }

    const data = {
        labels: labels,
        datasets: datasets
    };

    const canvas = document.getElementById('graphique');

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
                        parser: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
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
                annotation: {
                    annotations: [
                        {
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x',
                            value: '2023-10-17T23:00:00.000Z',
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: 'Label 1',
                                enabled: true
                            }
                        },
                        {
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x',
                            value: '2023-10-17T23:05:00.000Z',
                            borderColor: 'blue',
                            borderWidth: 2,
                            label: {
                                content: 'Label 2',
                                enabled: true
                            }
                        }
                    ]
                },
                crosshair: {
                    enabled: true,
                    line: {color: 'rgba(255, 0, 0, 0.5)', width: 2},
                    sync: {
                        enabled: true,
                    },
                },
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



