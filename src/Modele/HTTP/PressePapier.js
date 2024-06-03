/**
 * Copie dans le presse papier un élément HTML de la page, et affiche un message flash
 */
async function copierScreenElement(nomClasseElement) {
    const element = document.querySelector(`.${nomClasseElement}`);
    const canvas = await html2canvas(element);
    canvas.toBlob(async (blob) => {
        try {
            const clipboardItem = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([clipboardItem]);
            afficherMessageFlash('Image copiée dans le presse-papier.', 'success');
        } catch (error) {
            afficherMessageFlash('Impossible de copier l\'image dans le presse-papier.', 'danger');
        }
    });
}