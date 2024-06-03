/**
 * Copie dans le presse-papier un élément HTML de la page, et affiche un message flash
 * @param {string} querySelectorElement Nom de la classe de l'élément à convertir en image
 */
async function copierScreenElement(querySelectorElement) {
    const element = document.querySelector(`${querySelectorElement}`);

    if (!element) {
        afficherMessageFlash('Element introuvable dans le DOM', 'danger');
        return;
    }

    const elementRect = element.getBoundingClientRect();

    try {
        const canvas = await html2canvas(element, {
            scrollY: -window.scrollY,
            width: elementRect.width,
            height: elementRect.height,
            useCORS: true,
        });

        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const clipboardItem = new ClipboardItem({'image/png': blob});
        await navigator.clipboard.write([clipboardItem]);
        afficherMessageFlash('Image copiée dans le presse-papier.', 'success');
    } catch (error) {
        afficherMessageFlash('Impossible de copier l\'image dans le presse-papier.', 'danger');
        console.error(error);
    }

}
