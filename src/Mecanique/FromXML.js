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
        contenuFinal = `                   FluoriGraphix - Export du ${getDateAujourdhui()} - Signaux en mV\n`;
        contenuFinal += "                           -------------------------------------------\n";
    }

    if (times.length > 0) {
        const firstTimeChildren = times[0].children;
        let header = "Date;Time";

        for (let i = 0; i < firstTimeChildren.length; i++) {
            header += `;${firstTimeChildren[i].tagName.toUpperCase()}`;
        }

        contenuFinal += header + "\n";
    }

    for (let i = 0; i < times.length; i++) {
        const time = times[i];

        const timeValue = time.getAttribute("iso");

        if (getTime(timeValue) === "NaN/NaN/N-NaN:NaN:NaN") {
            problemes = true;
            continue;
        }

        if (i === 0) {
            premiereDate = getTime(timeValue);
        }

        let line = `${getDateHeure(getTime(timeValue))[0]};${getDateHeure(getTime(timeValue))[1]}`;

        for (let j = 0; j < time.children.length; j++) {
            const child = time.children[j];
            line += `;${around(child.getAttribute("v"))}`;
        }

        contenuFinal += line + "\n";
    }

    if (problemes) {
        afficherMessageFlash('Certaines données sont corrompues : Erreurs de dates', 'warning')
    }

    return contenuFinal;
}
