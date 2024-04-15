/**
 * Classe Traceur pour la création d'objets Traceur
 */
class Traceur {

    /**
     * Constructeur de la classe Traceur
     * @param nom le nom du traceur
     */
    constructor(nom) {
        this.nom = nom;
        this.data = new Map();
    }


    /**
     * Ajoute une donnée au traceur
     * @param label le label de la donnée
     * @param valeur la valeur de la donnée
     */
    addData(label, valeur) {
        this.data.set(label, valeur);
    }


    /**
     * Récupère une donnée par son label
     * @param label le label de la donnée
     * @returns {any} la valeur de la donnée
     */
    getDataParNom(label) {
        return this.data.get(label);
    }


    toString() {
        return this.nom + ' : ' + this.data;
    }
}