

/**
 * Charge un fichier XML en texte pour pouvoir le manipuler
 * @param xmlString le contenu du fichier XML
 * @returns {Document|null}
 */
function chargerXML(xmlString) {
    const parser = new DOMParser();
    try {
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const errors = xmlDoc.querySelectorAll("parsererror");

        if (errors.length > 0) {
            console.error("Erreur lors du chargement du fichier XML :", errors[0].textContent);
            return null;
        }
        return xmlDoc;
    } catch (error) {
        console.error("Erreur lors du chargement du fichier XML :", error);
        return null;
    }
}

/**
 * Convertit un fichier XML en fichier .mv pour le GGUN-FL Fluorometer #453
 * @param xmlString le contenu du fichier XML
 * @returns {string}
 */
function convertirXMLenMV(xmlString) {
    const xmlDoc = chargerXML(xmlString);
    const times = xmlDoc.querySelectorAll("time");

    let mvContent = "                           GGUN-FL Fluorometer #453  -   Signals in mV\n";
    mvContent += "                           -------------------------------------------\n";
    mvContent += "    #  Time             R  Tracer 1  Tracer 2  Tracer 3 Turbidity  Baseline Battery V     T    Conductiv\n";

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const timeValue = time.getAttribute("iso");
        const a145Value = time.querySelector("a145").getAttribute("v");
        const a146Value = time.querySelector("a146").getAttribute("v");
        const a147Value = time.querySelector("a147").getAttribute("v");
        const a148Value = time.querySelector("a148").getAttribute("v");
        const a144Value = time.querySelector("a144").getAttribute("v");

        mvContent += ` ${setEspaces(i + 1, 4)} ${getTime(timeValue)} 0   ${setEspaces(around(a145Value), 5)}     ${setEspaces(around(a146Value),5)}     ${setEspaces(around(a147Value),5)}    ${setEspaces(around(a148Value),5)}     ${setEspaces(around(a144Value),5)}     13.20     10.63     0.000\n`;
    }

    return mvContent;
}

/**
 * Ajoute des espaces pour aligner les chiffres
 * @param n le nombre à aligner
 * @param e le nombre d'espaces à ajouter au maximum
 * @returns {string}
 */
function setEspaces(n, e) {
    let string = "";
    for (let i = 0; i < e-n.toString().length; i++) {
        string += " ";
    }
    return string + n;
}


/**
 * Traite le fichier XML sélectionné par l'utilisateur
 */
function traiterFichierXML() {
    const inputFichier = document.getElementById('fileInput');
    const fichier = inputFichier.files[0];

    if (fichier) {
        const reader = new FileReader();
        reader.readAsText(fichier);

        reader.onload = function() {
            const xmlString = reader.result;
            const mvContent = convertirXMLenMV(xmlString);
            console.log(mvContent);
        };
    } else {
        console.error("Aucun fichier sélectionné.");
    }
}

/**
 * Convertit une date ISO en date et heure au format "dd/mm/yy-hh:mm:ss"
 * @param string la date ISO à convertir
 * @returns {string}
 */
function getTime(string) {
    let date = new Date(string);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().slice(2, 4);
    let hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds();
    return `${day}/${month}/${year}-${hour}:${minutes}:${seconds}`;
}

/**
 * Vérifie le nombre de décimales et ajoute des zéros si nécessaire pour avoir 2 décimales après la virgule en arrondissant
 * @param double le nombre à traiter
 * @returns {number|string}
 */
function around(double) {
    const trait =  Math.round(double * 100) / 100;
    const parts = trait.toString().split(".");

    if (parts.length < 2 || parts[1].length < 2) {
        return trait.toFixed(2);
    }
    return trait;
}


test();
