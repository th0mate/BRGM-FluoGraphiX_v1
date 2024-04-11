/**
 * Traite les données pour les afficher sous forme de graphique
 * @param mvContent le contenu du fichier .mv à afficher
 */
function afficherGraphique(mvContent) {
    const lignes = mvContent.split('\n');
    const labels = [];
    const dataTracer1 = [];
    const dataTracer2 = [];
    const dataTracer3 = [];
    const turbidite = [];
    const baseline = [];
    const batterie = [];
    const temperature = [];
    const conductivite = [];

    for (let i = 3; i < lignes.length; i++) {
        const colonnes = lignes[i].split(/\s+/);
        const timeValue = colonnes[2];

        const a145Value = around(parseFloat(colonnes[4]));
        const a146Value = around(parseFloat(colonnes[5]));
        const a147Value = around(parseFloat(colonnes[6]));
        const turbiditeValue = around(parseFloat(colonnes[7]));
        const baselineValue = around(parseFloat(colonnes[8]));
        const batterieValue = around(parseFloat(colonnes[9]));
        const temperatureValue = around(parseFloat(colonnes[10]));
        const conductiviteValue = around(parseFloat(colonnes[11]));


        const timeDate = moment(timeValue, 'DD/MM/YY-HH:mm:ss', true);
        if (timeDate.isValid()) {
            labels.push(timeDate.toISOString());
            dataTracer1.push({x: timeDate.toISOString(), y: a145Value});
            dataTracer2.push({x: timeDate.toISOString(), y: a146Value});
            dataTracer3.push({x: timeDate.toISOString(), y: a147Value});
            turbidite.push({x: timeDate.toISOString(), y: turbiditeValue});
            baseline.push({x: timeDate.toISOString(), y: baselineValue});
            batterie.push({x: timeDate.toISOString(), y: batterieValue});
            temperature.push({x: timeDate.toISOString(), y: temperatureValue});
            conductivite.push({x: timeDate.toISOString(), y: conductiviteValue});
        }
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Tracer 1',
                data: dataTracer1,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Tracer 2',
                data: dataTracer2,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Tracer 3',
                data: dataTracer3,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Turbidité',
                data: turbidite,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Baseline',
                data: baseline,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Batterie',
                data: batterie,
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Température',
                data: temperature,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Conductivité',
                data: conductivite,
                borderColor: 'rgb(0,255,51)',
                borderWidth: 2,
                fill: false
            }
        ]
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
                        parser: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // Format ISO
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
                    beginAtZero: true
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
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy'
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
}






