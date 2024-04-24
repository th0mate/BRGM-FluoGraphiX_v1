/**
 * Ferme le bandeau de sommaire
 */
function fermerSommaire() {
    document.querySelector('.bandeauDocumentation').style.display = "none";
}


/**
 * Ouvre le bandeau de sommaire
 */
function ouvrirSommaire() {
    document.querySelector('.bandeauDocumentation').style.display = "flex";
}


/**
 * Redirige l'utilisateur vers un élément de la page
 * @param anchorId - L'ID ou l'élément vers lequel rediriger l'utilisateur
 * @param isElement précise si anchorId est un élément ou un ID
 */
function redirectTo(anchorId, isElement = false) {
    let element;
    if (!isElement) {
        element = document.getElementById(anchorId);
    } else {
        element = anchorId;
    }

    if (element) {
        element.scrollIntoView({behavior: "smooth"});
    } else {
        afficherMessageFlash("Erreur : L'élément demandé n'existe pas.", "danger");
    }
}


/**
 * Recherche parmi tous les .titreBarre ou h3 de la page celui qui correspond le plus aux caractères entrés, et place ces résultats dans le datalist
 * @param caracteres - Les caractères à rechercher
 */
function rechercher(caracteres) {
    let listeResultats = document.getElementById('listeResultats');
    listeResultats.innerHTML = "";

    let elements = document.querySelectorAll('.findable');
    let resultats = [];

    elements.forEach(element => {
        if (element.innerText.toLowerCase().includes(caracteres.toLowerCase())) {
            resultats.push(element);
        }
    });

    resultats.forEach(resultat => {
        let div = document.createElement('div');
        const texte = resultat.innerText.replace(/[0-9]/g, '');

        div.innerHTML = texte.substring(0, 40);
        div.onclick = () => {
            redirectTo(resultat, true);
        };
        listeResultats.appendChild(div);
    });
}

document.querySelector('#rechercher').addEventListener('input', (event) => {
    rechercher(event.target.value);
});

document.querySelector('#rechercher').addEventListener('blur', () => {
    setTimeout(() => {
        document.getElementById('listeResultats').innerHTML = "";
    }, 200);
});