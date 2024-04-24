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
 * @param anchorId {string} - L'ID de l'élément vers lequel rediriger l'utilisateur
 */
function redirectTo(anchorId) {
    const element = document.getElementById(anchorId);

    if (element) {
        element.scrollIntoView({behavior: "smooth"});
    } else {
        afficherMessageFlash("Erreur : L'élément demandé n'existe pas.", "danger");
    }
}