function vueDocumentation() {
    return `
    <div class="bannierePage">
        <img src="Ressources/img/traceurs.jpg.webp" alt="Sources">
        <div class="contenu">
            <p><span onclick="afficherVue('vueAccueil')"><span></span>Accueil</span> <strong> / Documentation</strong></p>
            <h1>Documentation</h1>
            <span class="auteur"><img src="Ressources/img/auteur.png" alt=""> <h3>© BRGM - Marie Genevier, Haute-Corse, 2013.</h3></span>
        </div>
    </div>
    
    
    <div class="documentation">
        <img src="Ressources/img/documentation.png" alt="Documentation">
        <div>
            <h1 class="titreBarre">Besoin d'aide ?</h1>
            <h2>Retrouvez toute la documentation du site sur une seule et même page. Utilisez la barre de recherche pour trouver tout de suite les informations dont vous avez besoin.</h2>
            <span>
                <span>
                    <input oninput="rechercher(this.value)" onblur="quitterFocus()" type="text" id="rechercher" placeholder="Rechercher...">
                    <div class="datalist" id="listeResultats"></div>
                </span>
                <img src="Ressources/img/rechercher.png" alt="">
            </span>
            <a class="bouton boutonFonce" target="_blank" href="mailto:thomasloye1@gmail.com?subject=Signalement de bug FluoGraphiX&cc=v.bailly-comte@brgm.fr">Signaler un bug <img src="Ressources/img/bugs.png" alt=""> </a>
        </div>
    </div>
    
    
    
    <div class="documentationMain">
        
        <div class="burgerDocumentation" onclick="ouvrirSommaire()">
            <div>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <h4>Sommaire</h4>
        </div>
        
        <div class="bandeauDocumentation">
            <div class="entete">
                <img src="Ressources/img/close.png" alt="fermer" onclick="fermerSommaire()">
            </div>
            
            <div>
                <h3>Présentation & Installation</h3>
                <div class="sommaire" data-content="Installation" onclick="redirectTo('installationDoc')"><span></span>Installation<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Lancement" onclick="redirectTo('lancementDoc')"><span></span>Lancement<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Présentation" onclick="redirectTo('presentationDoc')"><span></span>Présentation<img src="Ressources/img/droite.png" alt=""></div>
            </div>
            
            <div>
                <h3>Graphiques</h3>
                <div class="sommaire" data-content="Paramètres" onclick="redirectTo('paramGraphiqueDoc')"><span></span>Paramètres<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Importation" onclick="redirectTo('importGraphiqueDoc')"><span></span>Importation<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Exportation" onclick="redirectTo('expGraphiqueDoc')"><span></span>Exportation<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Graphique" onclick="redirectTo('GraphiqueDoc')"><span></span>Graphique<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Calculs" onclick="redirectTo('CalculsDoc')"><span></span>Calculs<img src="Ressources/img/droite.png" alt=""></div>
            </div>
            
            <div>
                <h3>Calibration</h3>
                <div class="sommaire" data-content="Calibration : Présentation et importation" onclick="redirectTo('calibrationDoc')"><span></span>Présentation et Importation de données<img src="Ressources/img/droite.png" alt=""></div>
                <div class="sommaire" data-content="Fichiers CSV (Calibration)" onclick="redirectTo('paramCalibrationDoc')"><span></span>Présentation des Fichiers CSV<img src="Ressources/img/droite.png" alt=""></div>
            </div>
            
        </div>
        
        
        <div class="documentationContenu">
        
            <div class="section">
                <h3 class="findable">Présentation & Installation</h3>
                <h1 id="installationDoc" class="titreBarre findable">Installation</h1>
                <h3>FluoGraphiX vous permet de gagner du temps en proposant des solutions efficaces pour la manipulation de données issues de fluorimètres. Avec une interface soignée, et des interactions travaillées, FluoGraphiX est un outil simple d'utilisation et puissant.</h3>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Téléchargement depuis le site</h3>
                        <p>Rendez-vous dans l'onglet "Téléchargement" du site dans la barre de navigation, ensuite, cliquer sur "Télécharger FluoGraphiX"</p>
                        <p>Vous pouvez également accéder à la page de téléchargement du site, depuis l'accueil, via les actions rapides, ou via la présentation du site dans la rubrique "Installation et Assistance".</p>
                    </div>
                    <img src="Ressources/img/screen1.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Installation de l'outil FluoGraphiX</h3>
                        <p>Vous venez de télécharger un fichier .zip. Décompressez ce fichier où bon vous semble, et ouvrez le dossier contenant les ressources du site.</p>
                        <p>Vous avez alors plusieurs fichiers et dossiers, dont un se nommant "FluoGraphiX.html". C'est avec ce fichier que vous pourrez lancer le site et l'utiliser. Ce fichier est un raccourci, vous pouvez donc le copier/coller à un emplacement plus appréciable, comme votre bureau par exemple.</p>
                    </div>
                    <img src="Ressources/img/screen3.png" alt="">
                </div>
                <h3>Et voilà, FluoGraphiX est installé sur votre ordinateur !</h3>
            </div>
            
            
            <div class="section">
                <h3>Présentation & Installation</h3>
                <h1 id="lancementDoc" class="titreBarre findable">Lancement</h1>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Premier Lancement</h3>
                        <p>Double-cliquez sur le fichier "FluoGraphiX-BRGM.html". Votre navigateur par défaut s'ouvre. Vous arrivez alors Directement sur la page d'accueil. Vous êtes en local, c'est à dire que vous ne dépendez plus d'internet pour l'utilisation de ce site.</p>
                        <p>Notez qu'il est conseillé de télécharger à nouveau FluoGraphiX depuis le site internet pour mettre à jour votre version. Sans cela, vous pourriez converser des bugs datant de versions plus anciennes. La procédure de mise à jour est la même que celle d'installation.</p>
                    </div>
                    <img src="Ressources/img/screen4.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Utilisation de cookies</h3>
                        <p>Pour le bon fonctionnement du site, des cookies ou du stockage local sont utilisés. Ils sont utilisés sur ce site pour mémoriser la page sur laquelle vous vous trouvez, permettant de revenir à votre dernière navigation en cas de fermeture de votre navigateur ou de rafraîchissement de page.</p>
                        <p>Pour plus d'informations relatives aux cookies, rendez-vous dans la page dédiée "Gestion des cookies" en bas de toutes les pages du site.</p>
                    </div>
                    <img src="Ressources/img/cookies.jpg" alt="">
                </div>
            </div>
            
            
            
            <div class="section">
                <h3>Présentation & Installation</h3>
                <h1 id="presentationDoc" class="titreBarre findable">Présentation</h1>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Présentation générale</h3>
                        <p>Une partie du site est commune à toutes les pages : il s'agit du bandeau de navigation et du pied de page. C'est avec ces éléments que vous pouvez naviguer dans le site.</p>
                        <p>Vous pouvez retrouver les pages principales dans le bandeau de haut de page, ainsi que les pages supplémentaires, comme les mentions légales ou les sources, dans le pied de page.</p>
                    </div>
                    <img src="Ressources/img/screen5.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Page d'accueil</h3>
                        <p>La page d'accueil vous permet de voir un aperçu du site et de ses fonctionnalités. Vous pouvez également y retrouver les actions rapides, permettant de vous rendre directement là où vous en avez besoin.</p>
                    </div>
                    <img src="Ressources/img/screen6.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Page de documentation</h3>
                        <p>La page de documentation (sur laquelle vous vous trouvez) est le mode d'emploi du site. Retrouvez-y toutes les informations dont vous avez besoin.</p>
                    </div>
                    <img src="Ressources/img/screen7.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>4</span>Page de téléchargement (Si disponible)</h3>
                        <p>La page de téléchargement ne peut être accessible que si vous êtes connecté à internet. Si vous utilisez ce site en local (depuis un fichier html télécharé sur votre ordinateur), vous pouvez accéder à cette page via une redirection vers le site hébergé.</p>
                    </div>
                    <img src="Ressources/img/screen1.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>5</span>Page de Calibration</h3>
                        <p>La page "Calibration" est une page phare du site. Vous pouvez y importer des fichiers de calibration .dat ou .txt pour en afficher les données et ensuite calculer ces dernières en concentrations.</p>
                       
                        <a class="bouton boutonFonce" onclick="afficherVue('aa')">En savoir plus</a>
                    </div>
                    <img src="Ressources/img/screen8.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>6</span>Page des Graphiques</h3>
                        <p>La page "Graphiques" est la deuxième page phare du site. Vous pouvez y importer des fichiers .dat, .txt, .xml ou .mv pour en afficher les données sous la forme de graphiques. De nombreuses possibilités d'affichage sont disponibles, comme le zoom ou le déplacement.</p>
                       
                        <a class="bouton boutonFonce" onclick="redirectTo('importGraphiqueDoc')">En savoir plus</a>
                    </div>
                    <img src="Ressources/img/screen9.png" alt="">
                </div>
                
                <h3>Et voilà ! Nous avons fait le tour des pages principales du site !</h3>
            </div>
            
            
            <div class="section">
                <h3>Graphiques</h3>
                <h1 id="paramGraphiqueDoc" class="titreBarre findable">Paramètres</h1>
                <h3>La page "Graphiques" vous permet de visualiser des données issues de fluorimètres sous la forme de graphiques (signaux en mV en fonction de la date de mesure).</h3>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Sélection de fichiers</h3>
                        <p>Vous pouvez sélectionner un ou plusieurs fichiers de type .mv, .txt (xml converti), .xml, .dat (fichiers de calibration), et csv (calibration ou données de mesures). En cas de modification de ces fichiers, prenez garde à ce que la syntaxe d'origine de ce fichier soit bien respectée.</p>
                    </div>
                    <img src="Ressources/img/screen10.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Refus automatique</h3>
                        <p>Si plusieurs fichiers ont été joints, et qu'un message apparaît, c'est que le site n'a pas réussi à former un graphique à partir de vos deux fichiers. En effet, les deux fichiers ont un écart de dates trop important entre eux.</p>
                    </div>
                    <img src="Ressources/img/screen11.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Zoom et déplacement</h3>
                        <p>Vous avez la possibilité de zoomer dans un graphique. Pour ce faire, utiliser la molette de votre souris en ciblant la zone à zoomer. Pour vous déplacer dans un graphique, maintenez le clic.</p>
                        <p>Vous pouvez désactiver/activer le zoom et le déplacer sur les axes en cochant ou décochant les cases de la catégorie "Gestion du Zoom/déplacement.</p>
                    </div>
                    <img src="Ressources/img/screen12.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>4</span>Formats de dates - Détection automatique</h3>
                        <p>Si un fichier de calibration (.dat) est joint, le format de date est automatiquement sélectionné (jj/mm/aa ou aa/mm/jj).</p>
                        <p>Dans le cas où ce fichier n'est pas joint, vous pouvez sélectionner vous même la valeur de ce paramètre. Par défaut, le format est jj/mm/aa.</p>
                    </div>
                    <img src="Ressources/img/screen13.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>4</span>Export</h3>
                        <p>Vous pouvez exporter le ou les fichiers importés sous la forme d'un seul fichier CSV, pris en charge également à l'importation.</p>
                    </div>
                    <img src="Ressources/img/screen10.png" alt="">
                </div>
            </div>
            
            
            <div class="section">
                <h3>Graphiques</h3>
                <h1 id="importGraphiqueDoc" class="titreBarre findable">Importation</h1>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Importation de fichiers</h3>
                        <p>Vous pouvez importer des fichiers de type .mv, .txt (xml converti), .xml, .dat (fichiers de calibration) et CSV.</p>
                        <p>Pour les Fichiers .mv et .txt : le programme lit le fichier en fonction du nombre d'espaces séparant chaque colonne. Si des modifications ont été apportées, veillez à ce que la syntaxe d'origine soit parfaitement respectée.</p>
                        <p>Si le graphique est altéré/corrompu, il est possible que votre fichier ne respecte pas la syntaxe attendue, ou que le format de date ne soit pas correctement paramétré.</p>
                    </div>
                    <img src="Ressources/img/screen9.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Fichiers .dat ou CSV</h3>
                        <p>Vous pouvez également importer des fichiers de calibration au format .dat ou CSV. S'ils sont sélectionnés en plus d'autres fichiers, ils permettent de paramétrer automatiquement le format de dates du graphique.</p>
                        <p>Si un fichier de calibration est importé seul, vous serez redirigé vers l'onglet "Calibration", et vos données seront affichées.</p>
                    </div>
                    <img src="Ressources/img/screen14.png" alt="">
                </div>
                
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Signaler un bug</h3>
                        <p>Un ou plusieurs bugs peuvent être constatés. Dans cette situation, vous pouvez utiliser le bouton dédié en haut de l'onglet "Documentation".</p>
                    </div>
                    <img src="Ressources/img/fix.png" alt="">
                </div>
            </div>
            
            
            <div class="section">
                <h3>Graphiques</h3>
                <h1 id="expGraphiqueDoc" class="titreBarre findable">Exportation</h1>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Exportation en fichier CSV</h3>
                        <p>Vous pouvez exporter vos fichiers sous la forme d'un fichier .CSV. Ce fichier contiendra toutes les données importées, et sera réutilisable par la suite dans FluoGraphiX.</p>
                        <p>Les fichiers .CSV ont l'avantage d'être très lisibles et compréhensibles, contrairement au xml ou au txt.</p>
                        <p>Le téléchargement débute aussitôt le bouton "Exporter les données" cliqué.</p>
                        <p>Se référer à la partie "Calculs depuis les graphiques" pour la documentation traitant les exports TRAC.</p>
                    </div>
                    <img src="Ressources/img/screen15.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Notes sur l'exportation</h3>
                        <p>Le fichier téléchargé est nommé avec l'heure et la date du jour. La date est également indiquée en première ligne du fichier.</p>
                    </div>
                    <img src="Ressources/img/screen10.png" alt="">
                </div>
            </div>
            
            
            <div class="section">
                <h3>Graphiques</h3>
                <h1 id="GraphiqueDoc" class="titreBarre findable">Graphique</h1>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Zoom</h3>
                        <p>Il est possible de zoomer et dézoomer sur le graphique en ciblant la zone désirée. Pour cela, vous pouvez utiliser la molette de votre souris, ou effectuer un mouvement de pincement sur votre pavé tactile.</p>
                        <p>Il vous est également possible de vous déplacer dans un graphique, en maintenant le clic et en effectuant un mouvement de déplacement dans le sens voulu.</p>
                        <p>La maniabilité avec le pavé tactile, utile en cas d'utilisation du site sur le terrain, a été travaillée pour assurer un certain confort d'utilisation.</p>
                    </div>
                    <img src="Ressources/img/screen12.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Affichage/Occultation de courbes</h3>
                        <p>Il est possible de cacher ou d'afficher des courbes sur un graphique. Pour cela, vous pouvez cliquer sur le label ou la couleur d'un label en haut du graphique.</p>
                    </div>
                    <img src="Ressources/img/screen16.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Occultation automatique en cas de redondance</h3>
                        <p>Si une courbe est parfaitement stable sur toute la longueur du graphique, alors cette dernière sera occultée automatiquement par défaut pour améliorer la visibilité des données.</p>
                        <p>Vous pouvez afficher cette courbe à tout moment en cliquant sur son label ou sur la couleur de son label.</p>
                    </div>
                    <img src="Ressources/img/screen9.png" alt="">
                </div>
            </div>
            
            
            <div class="section">
                <h3>Graphiques</h3>
                <h1 id="CalculsDoc" class="titreBarre findable">Calculs</h1>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Présentation</h3>
                        <p>Des paramètres supplémentaires, vous permettant de manipuler les données de mesures et les données de calibration, vous sont proposés en cliquant sur le bouton "Autres" dans le bandeau de paramètres.</p>
                        <p>Un pop-up de paramètres s'affiche, vous permettant de jongler entre plusieurs onglets, chacun représentant une fonctionnalité.</p>
                    </div>
                    <img src="Ressources/img/screen80.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Importation de données de calibration</h3>
                        <p>Pour importer des données de calibration, plusieurs possibilités s'offrent à vous : soit vous importez un fichier de calibration en même temps qu'un fichier de données de mesure; soit vous importez un fichier de calibration depuis le pop-up de paramètres si cela n'a pas été fait auparavant.</p>
                        <p>Dans le cas où aucun fichier de calibration n'a été importé, un avertissement s'affiche dans le popup de paramètres, vous invitant à en joindre un.</p>
                    </div>
                    <img src="Ressources/img/screen81.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Avertissement de données corrompues</h3>
                        <p>Après avoir importé un fichier de calibration, un popup peut apparaître sur votre écran.</p>
                        <p>Ce popup apparaît si vous venez de joindre un fichier de calibration depuis le popup de paramètres, ou si vous venez d'ouvrir le popup de paramètres.</p>
                        <p>Ce message vous indique que l'application a détecté une potentielle erreur dans vos données de calibration. Il est recommandé de corriger cette erreur avant d'effectuer d'autres actions.</p>
                    </div>
                    <img src="Ressources/img/screen82.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>4</span>Renommer ses courbes</h3>
                        <p>Si vos noms de courbes ne sont pas nommées L1, L2, L3 ou L4, comme dans votre fichier de calibration, l'application vous demandera de les renommer.</p>
                        <p>Cette action se fait par le biais d'un tableau, en faisant correspondre les noms du fichier de calibration, avec les noms de vos courbes.</p>
                        <p>Vos courbes sont alors automatiquement renommées pour correspondre à votre fichier de calibration. Une fois l'opération terminée, l'application vous indique que toutes les données sont conformes.</p>
                        <p>Si vous sautez cette étape, et que vous effectuez des calculs depuis la partie de visualisation ("graphiques"), des bugs et erreurs peuvent survenir.</p>
                    </div>
                    <img src="Ressources/img/screen83.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>5</span>Correction de la turbidité</h3>
                        <p>Vous pouvez corriger l'incidence de la turbidité sur vos courbes, en vous rendant dans l'onglet "corriger la turbidité".</p>
                        <p>Cet onglet vous permet de créer de nouvelles courbes, représentant les courbes sélectionnées corrigées en fonction de la turbidité du fichier de calibration.</p>
                        <p>Vous pouvez donc sélectionner le niveau de correction à appliquer (entre 1 et 2), puis sélectionner la ou les courbes à corriger.</p>
                        <p>En appuyant sur le bouton "terminer", les courbes corrigées apparaissant avec le nom "LxCorr" dans votre graphique. Pensez à les afficher en cliquant sur leur nom.</p>
                    </div>
                    <img src="Ressources/img/screen84.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>6</span>Conversion en concentration</h3>
                        <p>Vous pouvez convertir vos traceurs en concentrations en vous rendant dans l'onglet "Convertir en concentration".</p>
                        <p>Les traceurs sont récupérés à partir du fichier de calibration. Chaque traceur est associé à une courbe, en fonction de sa lampe principale.</p>
                        <p>Vous pouvez sélectionner un traceur à convertir puis cliquer sur "terminer". La courbe représentant alors votre traceur en concentration apparaît.</p>
                    </div>
                    <img src="Ressources/img/screen85.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>7</span>Exporter vers TRAC</h3>
                        <p>Après avoir converti un ou plusieurs traceurs en concentration, vous pouvez exporter vos données en un format CSV adapté pour le logiciel TRAC.</p>
                        <p>Pour ce faire, vous pouvez cliquer sur le bouton "exporter les données". Un nouveau popup s'ouvre.</p>
                        <p>Vous pouvez alors choisir en un export standard CSV, ou un export CSV dédié à TRAC.</p>
                        <p>Sélectionnez alors la date d'injection, en utilisant votre clavier ou en cliquant sur le calendrier. Vous pouvez sélectionner une date comprise entre la première et la dernière date du graphique affiché.</p>
                        <p>Si plusieurs traceurs ont été convertis en concentration, il vous est demandé d'en sélectionner un.</p>
                        <p>Vous pouvez cliquer sur "exporter vers trac" pour débuter le téléchargement du fichier.</p>
                    </div>
                    <img src="Ressources/img/screen86.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>8</span>Correction des interférences entre traceurs</h3>
                        <p>Vous pouvez corriger les interférences générées par un, deux, ou trois traceurs sur vos courbes.</p>
                        <p>Séléctionnez le nombre de traceurs à choisir, puis sélectionnez vos traceurs.</p>
                        <p>Cliquez sur "terminer" pour afficher dans votre graphique la/les courbe(s) corrigée(s).</p>
                    </div>
                    <img src="Ressources/img/screen87.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>9</span>Correction du bruit de fond naturel</h3>
                        <p>Vous pouvez également corriger le bruit de fond sur l'une de vos courbes, représentant un traceur.</p>
                        <p>Pour accéder à cette option, vous devez avoir corrigé les interférences de un ou deux traceurs.</p>
                        <p>Sélectionnez la période du graphique influencée par le traceur. ATTENTION : cette étape doit être réalisée en premier lieu, elle reste toutefois facultative.</p>
                        <p>Sélectionnez ensuite les variables explicatives (courbes) à utiliser pour le calcul (2 courbes sélectionnées minimum, 3 maximum). Les courbes sélectionnées par défaut sont celles ayant été corrigées ("Corr").</p>
                        <p>Cliquez sur "calculer" pour afficher la nouvelle courbe calculée ("LxCorr") sur le graphique. Dans l'image ci-contre, la courbe bleu marine corrige la courbe cyan.</p>
                    </div>
                    <img src="Ressources/img/screen88.png" alt="">
                </div>
            </div>
           
            
            
            <div class="section">
                <h3>Calibration</h3>
                <h1 id="calibrationDoc" class="titreBarre findable">Calibration : Présentation et importation</h1>
                <h3>La page "Calibration" vous permet de visualiser, de traiter, et de manipuler des données de calibration, issues de fichiers de calibration .dat, ou .CSV si elles ont été exportées depuis FluoGraphiX</h3>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Importation d'un fichier de calibration .dat</h3>
                        <p>Vous pouvez importer un fichier de calibration .dat issu d'un fluorimètre. Cela vous permettra de visualiser les données de calibration de vos traceurs sous la forme d'un tableau et d'un graphique.</p>
                        <p>Vous pouvez également importer un fichier de calibration simplifié (CSV) issu de FluoGraphiX, vous permettant de modifier facilement les données de ce fichier.</p>
                    </div>
                    <img src="Ressources/img/screen17.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Paramètres d'affichage (Calibration)</h3>
                        <p>Plusieurs paramétrages sont disponibles pour personnaliser l'affichage de vos données. Vous pouvez en effet chosiir quel traceur et quels signaux afficher dans le bandeau dédié.</p>
                        <p>Pour les options de calcul, référez-vous à la section dédiée de la documentation.</p>
                    </div>
                    <img src="Ressources/img/screen18.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Affichage automatique (Calibration)</h3>
                        <p>Automatiquement, lorsque vous changez de traceur à analyser, le programme sélectionnera automatiquement la ligne à afficher dans le graphique étant dotée du maximum de points.</p>
                        <p>Vous pouvez évidemment changer cet affichage en modifiant le signal à afficher dans les paramètres.</p>
                    </div>
                    <img src="Ressources/img/screen17.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Calibration - Présentation</h3>
                        <p>La page "Calibration" vous permet donc de visualiser les données de calibration issues d'un fichier, et de les exporter dans un format lisible pouvant être modifié et importé par la suite.</p>
                    </div>
                    <img src="Ressources/img/screen19.png" alt="">
                </div>
            </div>
            
            
            <div class="section">
                <h3>Calibration</h3>
                <h1 id="paramCalibrationDoc" class="titreBarre findable">Fichiers CSV (Calibration)</h1>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Présentation générale des fichiers CSV de calibration</h3>
                        <p>Les fichiers de calibration au format CSV vous sont proposés à l'exportation depuis la page "Calibration" après avoir importé un fichier de calibration .dat ou .CSV</p>
                        <p>Étant construits d'une façon simple et lisible, vous pouvez les modifier selon vos besoins pour les importer par la suite.</p>
                    </div>
                    <img src="Ressources/img/screen20.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Fichiers CSV de calibration : En-tête</h3>
                        <p>L'en-tête du fichier vous fournit les informations nécessaires importantes des mesures, comme la date de l'export ou encore le numéro de l'appareil de mesure associé.</p>
                        <p>D'autres informations sont également affichées, comme un résumé simple du fonctionnement de ce fichier. Vous pouvez consulter l'espace dédié de cette documentation pour en savoir plus.</p>
                    </div>
                    <img src="Ressources/img/screen21.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>3</span>Fichiers CSV de calibration : Ordre des traceurs</h3>
                        <p>Les fichiers de calibration doivent toujours respecter le même ordre des traceurs, pour ne pas afficher des données corrompues par la suite.</p>
                        <p>En effet, l'eau doit toujours être disposée en <strong>première position</strong> dans le fichier, tandis que la turbidité doit toujours être placée en <strong>dernière position</strong>.</p>
                        <p>Les autres traceurs doivent donc se trouver entre ces deux parties du fichier, sans ordre spécifique.</p>
                    </div>
                    <img src="Ressources/img/screen20.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>4</span>Fichiers CSV de calibration : Eau</h3>
                        <p>L'eau doit être affichée en première position dans le fichier, avant tous les autres traceurs.</p>
                        <p>Dans les premières lignes, on peut voir son label ainsi que sa date de mesure</p>
                        <p>On peut retrouver ensuite ses valeurs de L1 à L4.</p>
                    </div>
                    <img src="Ressources/img/screen22.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>5</span>Fichiers CSV de calibration : Traceur</h3>
                        <p>Les traceurs ont tous la même forme dans ce fichier.</p>
                        <p>Dans les premières lignes, on peut voir le label, la date de mesure, ainsi que l'unité de mesure du traceur.</p>
                        <p>On peut retrouver ensuite un tableau contenant toutes les valeurs du traceur, avec les lignes L1 à L4, et les colonnes représentant les échelles de mesures (100, 200) en unité spécifiée juste avant.</p>
                    </div>
                    <img src="Ressources/img/screen23.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>6</span>Fichiers CSV de calibration : Turbidité</h3>
                        <p>La turbidité doit toujours se trouver en dernière position dans ce fichier, après tous les traceurs et l'eau.</p>
                        <p>Dans les premières lignes, on peut voir le label, la date de mesure, ainsi que l'unité de mesure de la turbidité.</p>
                        <p>On peut retrouver ensuite un tableau contenant toutes les valeurs de la turbidité, avec les lignes L1 à L4, et les colonnes représentant les échelles de mesures (1, 10, 100) en unité spécifiée juste avant.</p>
                    </div>
                    <img src="Ressources/img/screen24.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>7</span>Exportation des données de Calibration</h3>
                        <p>Quelque-soit le fichier importé, vous pouvez télécharger un fichier CSV en cliquant sur le bouton "Télécharger les données".</p>
                    </div>
                    <img src="Ressources/img/screen15.png" alt="">
                </div>
            </div>
            
           
            
        </div>
        
    </div>
    
    `;
}