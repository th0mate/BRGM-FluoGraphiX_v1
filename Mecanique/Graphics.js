function afficherGraphique(mvContent) {
    const lignes = mvContent.split('\n');
    const labels = [];
    const dataTracer1 = [];
    const dataTracer2 = [];
    const dataTracer3 = [];

    for (let i = 3; i < lignes.length; i++) {
        const colonnes = lignes[i].split(/\s+/);
        const timeValue = colonnes[2] + ' ' + colonnes[3];
        const a145Value = parseFloat(colonnes[7]);
        const a146Value = parseFloat(colonnes[8]);
        const a147Value = parseFloat(colonnes[9]);

        labels.push(timeValue);
        dataTracer1.push(a145Value);
        dataTracer2.push(a146Value);
        dataTracer3.push(a147Value);
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
            }
        ]
    };

    const ctx = document.getElementById('graphique').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        parser: 'YYYY-MM-DD HH:mm:ss',
                        unit: 'minute',
                        displayFormats: {
                            minute: 'YYYY-MM-DD HH:mm'
                        }
                    },
                    position: 'bottom',
                    ticks: {
                        source: 'labels',
                        autoSkip: true,
                        maxTicksLimit: 20 // Essayez d'ajuster cela en fonction du nombre de points de données
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
                            value: '2023-10-17 23:00:00',
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
                            value: '2023-10-17 23:05:00',
                            borderColor: 'blue',
                            borderWidth: 2,
                            label: {
                                content: 'Label 2',
                                enabled: true
                            }
                        }
                    ]
                }
            }
        }
    });
}
