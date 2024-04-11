/**
 * Convertit un fichier XML en fichier .mv
 * @param xmlString le contenu du fichier XML
 * @returns {string} le contenu du fichier .mv
 * @throws {Error} si le fichier XML est mal formé
 */



/**
 * Charge un fichier XML en texte pour pouvoir le manipuler
 * @param xmlString le contenu du fichier XML
 * @returns {Document|null} le fichier XML chargé
 */
function chargerXML(xmlString) {
    const parser = new DOMParser();
    try {
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const errors = xmlDoc.querySelectorAll("parsererror");

        if (errors.length > 0) {
            afficherMessageFlash("Erreur lors du chargement du fichier XML", 'danger')
            return null;
        }
        return xmlDoc;
    } catch (error) {
        afficherMessageFlash("Erreur lors du chargement du fichier XML", 'danger')
        return null;
    }
}

/**
 * Convertit un fichier XML en fichier .mv pour le GGUN-FL Fluorometer #453
 * @param xmlString le contenu du fichier XML
 * @returns {string} le contenu du fichier .mv
 */
function convertirXMLenMV(xmlString) {
    const xmlDoc = chargerXML(xmlString);
    const times = xmlDoc.querySelectorAll("time");

    let contenuFinal = "";

    if (nbLignes === 0) {
        contenuFinal =  `                   FluoriGraphix - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        contenuFinal += "                           -------------------------------------------\n";
        contenuFinal += "    #  Time             R  Tracer 1  Tracer 2  Tracer 3 Turbidity  Baseline Battery V     T    valeura149     valeura150     valeura151\n";
    }

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const timeValue = time.getAttribute("iso");
        const a145Value = time.querySelector("a145").getAttribute("v");
        const a146Value = time.querySelector("a146").getAttribute("v");
        const a147Value = time.querySelector("a147").getAttribute("v");
        const a148Value = time.querySelector("a148").getAttribute("v");
        const a144Value = time.querySelector("a144").getAttribute("v");

        let a149Value = 0.001;
        let a150Value = 0.001;
        let a151Value = 0.001;

        for (let j = 0; j < time.children.length; j++) {
            const child = time.children[j];
            if (child.tagName === "a149") {
                a149Value = child.getAttribute("v");
                console.log('trouvé');
            }
            if (child.tagName === "a150") {
                a150Value = child.getAttribute("v");
            }
            if (child.tagName === "a151") {
                a151Value = child.getAttribute("v");
            }
        }

        if (getTime(timeValue) === "NaN/NaN/N-NaN:NaN:NaN") {
            problemes = true;
            continue;
        }

        if (i === 0) {
            premiereDate = getTime(timeValue);
        }

        contenuFinal += ` ${setEspaces(i + 1, 4)} ${getTime(timeValue)} 0   ${setEspaces(around(a145Value), 5)}     ${setEspaces(around(a146Value),5)}     ${setEspaces(around(a147Value),5)}    ${setEspaces(around(a148Value),5)}      0.001    0.001     ${setEspaces(around(a144Value),5)}     ${setEspaces(around(a149Value),5)}          ${setEspaces(around(a150Value),5)}          ${setEspaces(around(a151Value),5)}\n`;
    }

    if (problemes) {
        afficherMessageFlash('Certaines données sont corrompues : Erreurs de dates', 'warning')
    }

    return contenuFinal;
}
