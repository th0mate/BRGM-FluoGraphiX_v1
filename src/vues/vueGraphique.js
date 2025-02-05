function vueGraphique() {
    return `

    <div id="tooltip" style="display: none; position: absolute;"></div>
       
    <div class="graphiques">
    
        <div class="bandeauGraphiques" style="width: 55px">
        
            <img class="extend" src="Ressources/img/extend.png" alt="etendre" onclick="toogleMenuGraphique()">
            
            <div class="separatorGraphique first"><span></span><span class="text">CALCULS SUPPLÉMENTAIRES</span><span></span></div>

            <div class="elementBandeau" onclick="afficherPopupParametresGraphiques()">
                <span>OUVRIR LE PANNEAU DE CALCULS</span>
                <img src="Ressources/img/grandCalibration.png" alt="Ajouter">
            </div>
            
            <div class="separatorGraphique"><span></span><span class="text">IMPORTATION DE FICHIERS</span><span></span></div>
            
            <div class="elementBandeau" onclick="ouvrirChoisirFichier()">
                <span>IMPORTER DES NOUVEAUX FICHIERS</span>
                <img src="Ressources/img/importer.png" alt="Ajouter">
            </div>
            
            <div class="separatorGraphique"><span></span><span class="text">GESTION ZOOM/DEPLACEMENTS</span><span></span></div>
            
            <div class="elementBandeau" id="axeX" onclick="modifierZoom('x')">
                <span>INTERACTIONS ET ZOOM SUR AXE X</span>
                <img src="Ressources/img/x_axis.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" id="axeY" onclick="modifierZoom('y')">
                <span>INTERACTIONS ET ZOOM SUR AXE Y</span>
                <img src="Ressources/img/y_axis.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" onclick="resetZoom()">
                <span>RÉINITIALISER ZOOM ET POSITION</span>
                <img src="Ressources/img/circulaire.png" alt="Ajouter">
            </div>
            
            <div class="separatorGraphique"><span></span><span class="text">FORMATS DE DATES</span><span></span></div>

            <div class="elementBandeau" id="amj" onclick="modifierFormat('2')">
                <span>FORMAT JOUR/MOIS/ANNÉE</span>
                <img src="Ressources/img/format_jma.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau" id="jma" onclick="modifierFormat('1')">
                <span>FORMAT ANNÉE/MOIS/JOUR</span>
                <img src="Ressources/img/format_amj.png" alt="Ajouter">
            </div>
            
            <div class="elementBandeau disabled" id="auto" onclick="modifierFormat('0')">
                <span>DÉTECTION AUTOMATIQUE</span>
                <img src="Ressources/img/automatique.png" alt="Ajouter">
            </div>
            
            <div class="separatorGraphique"><span></span><span class="text">EXPORT DES DONNÉES</span><span></span></div>
            
            <div class="elementBandeau" onclick="afficherPopupTelecharger()">
                <span>EXPORTER LES DONNÉES</span>
                <img src="Ressources/img/dl.png" alt="Ajouter">
            </div>
            
            <div class="separatorGraphique"><span></span><span class="text">EXPORT D'IMAGES</span><span></span></div>
            
            <div class="elementBandeau" onclick="copierScreenElement('.graphique')">
                <span>CAPTURE D'ÉCRAN</span>
                <img src="Ressources/img/copier.png" alt="Ajouter">
            </div>
            
        </div>
    
    
    
        <canvas class="graphique" id="graphique"></canvas>
        <div class="infos">
        
            <div class="cotesInfos">
                <img src="Ressources/img/illuGraphique1.png" alt="Graphique">
                
                <div class="bulles bl1">
                    <span>Se concentrer sur l'essentiel</span>
                    <p>Les courbes redondantes sont automatiquement occultées pour ne vous laisser que l'essentiel.</p>
                </div>
            </div>
            
            <div class="mainInfos">
                <h1 class="titreBarre">Graphiques</h1>
                <h2 class="orange">Importez un fichier et prenez le contrôle de vos données</h2>
                <br>
                <p>Types de fichiers pris en charge : .mv, .txt, .xml, .csv, .dat (fichiers de calibration).</p>
                <p>Export possible au format .csv ou .csv adapté pour le logiciel TRAC.</p>
                <p>Possibilité de sélectionner plusieurs fichiers pour l'importation.</p>
                
                <br>
                <br>
                <p>Choisissez le format de dates :</p>
                <br>
                <div class="elementCentre">
                    <div class="dates">
                        <label>
                            <select onchange="modifierFormat(this.value)" id="selectFormatDate">
                                <option value="1">jj/mm/aa</option>
                                <option value="2">aa/mm/jj</option>
                            </select>
                        </label>
                    </div>
                </div>
                
                <br>
                <p>Sélectionnez un ou plusieurs fichiers :</p>
                <br>
                
                <div class="elementCentre">
                    <div id="start" class="bouton boutonFonce" onclick="ouvrirChoisirFichier()">COMMENCER</div>
                </div>
            </div>
            
            <div class="cotesInfos">
                <img src="Ressources/img/illuGraphique2.png" alt="Graphique">
                
                <div class="bulles bl2">
                    <span>Nombreux calculs possibles</span>
                    <p>Effectuez des calculs de correction, de conversion et plus encore sur vos valeurs.</p>
                </div>
                
            </div>
        </div>
        
        
        
        <div class="settings">
                <input type="file" id="fileInput" accept=".mv,.dat,.txt,.xml,.csv" multiple onchange="traiterFichier()">
        </div>
        
        <div class="annonce">
            <img src="Ressources/img/perteConnexion.png" alt="Perte de connexion">
            <h2>Votre appareil n'est pas pris en charge</h2>
            <h4>L'appareil avec lequel vous utilisez ce site n'a pas un écran suffisamment grand pour afficher les données de façon lisible</h4>
            <h4>Si vous êtes sur ordinateur et que votre fenêtre de votre navigateur est réduite, agrandissez-la davantage.</h4>
            <p>Note : une prochaine version de l'outil FluoGraphiX vous permettra d'utiliser l'entièreté du site sur smartphone.</p>
        </div>
        <div class="donnees" style="display: none;"></div>
        
        
        <section class="outilSuppressionCourbes">
            <div class="pastille"><img src="Ressources/img/parametres.png" alt="" onclick="ouvrirPanneauSuppression()"></div>
            <img src="Ressources/img/close.png" alt="Fermer" class="fermer" onclick="fermerPanneauSuppression()">
            <div class="main">
                <h2>Supprimer des courbes</h2>
                <div class="listeCourbesSupprimer"></div>
                
                <br>
                
                <div class="bouton boutonFonce" onclick="supprimerCourbes()">SUPPRIMER</div>
            </div>
        </section>
        
        
        
    </div>
</div>

`;
}