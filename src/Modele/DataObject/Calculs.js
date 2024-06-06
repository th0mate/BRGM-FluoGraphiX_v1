/**
 * Classe Calculs
 * Crée un objet calcul, permettant de savoir quels calculs ont été effectués
 * Et plus particulièrement d'avoir une liste des calculs effectués, et de leurs paramètres
 */

class Calculs {


    /**
     * Constructeur de la classe Calculs
     * @param nom le nom du calcul, par exemple "Correction de turbidité"
     * @param estFait précise si le calcul a été utilisé (oui ou non)
     */
    constructor(nom, estFait) {
        this.nom = nom;
        this.estFait = estFait;
        this.parametres = new Map();
    }


    /**
     * Ajoute un paramètre au calcul
     * @param nom le nom du paramètre
     * @param valeur la valeur du paramètre
     */
    ajouterParametreCalcul(nom, valeur) {
        this.parametres.set(nom, valeur);
    }


    /**
     * Récupère un paramètre par son nom
     * @param nom le nom du paramètre
     * @return {string} la valeur du paramètre
     */
    getParametreParNom(nom) {
        return this.parametres.get(nom);
    }

    toString() {
        let string = this.nom + ' : (' + this.estFait + ') => ';

        for (let [nom, valeur] of this.parametres) {
            string += nom + ' : ' + valeur + '| ';
        }

        return string;
    }


}

