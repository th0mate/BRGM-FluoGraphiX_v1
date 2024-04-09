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
        contenuFinal = "                           GGUN-FL Fluorometer #453  -   Signals in mV\n";
        contenuFinal += "                           -------------------------------------------\n";
        contenuFinal += "    #  Time             R  Tracer 1  Tracer 2  Tracer 3 Turbidity  Baseline Battery V     T    Conductiv\n";
    }

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const timeValue = time.getAttribute("iso");
        const a145Value = time.querySelector("a145").getAttribute("v");
        const a146Value = time.querySelector("a146").getAttribute("v");
        const a147Value = time.querySelector("a147").getAttribute("v");
        const a148Value = time.querySelector("a148").getAttribute("v");
        const a144Value = time.querySelector("a144").getAttribute("v");

        if (getTime(timeValue) === "NaN/NaN/N-NaN:NaN:NaN") {
            problemes = true;
            continue;
        }

        if (i === 0) {
            premiereDate = getTime(timeValue);
        }

        contenuFinal += ` ${setEspaces(i + 1, 4)} ${getTime(timeValue)} 0   ${setEspaces(around(a145Value), 5)}     ${setEspaces(around(a146Value),5)}     ${setEspaces(around(a147Value),5)}    ${setEspaces(around(a148Value),5)}     ${setEspaces(around(a144Value),5)}     13.20     10.63     0.000\n`;
    }

    if (problemes) {
        afficherMessageFlash('Certaines données sont corrompues : Erreurs de dates', 'warning')
    }

    return contenuFinal;
}
