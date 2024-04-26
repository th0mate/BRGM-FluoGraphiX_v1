function vueDocumentation() {
    return `
    <div class="bannierePage">
        <img src="Ressources/img/image6.jpg" alt="Sources">
        <div class="contenu">
            <p><span onclick="afficherVue('vueAccueil')"><span></span>Accueil</span> <strong> / Documentation</strong></p>
            <h1>Documentation</h1>
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
            </div>
            
        </div>
        
        
        <div class="documentationContenu">
        
            <div class="section">
                <h3 class="findable">Présentation & Installation</h3>
                <h1 id="installationDoc" class="titreBarre findable">Installation</h1>
                <h3>FluoriGraphix vous permet de gagner du temps en proposant des solutions efficaces pour la manipulation de données issues de fluorimètres. Avec une interface soignée, et des interactions travaillées, FluoriGraphix est un outil simple d'utilisation et puissant.</h3>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Téléchargement depuis le site</h3>
                        <p>Rendez-vous dans l'onglet "Téléchargement" du site dans la barre de navigation, ensuite, cliquer sur "Télécharger FluoriGraphix"</p>
                        <p>Vous pouvez également accéder à la page de téléchargement du site, depuis l'accueil, via les actions rapides, ou via la présentation du site dans la rubrique "Installation et Assistance".</p>
                    </div>
                    <img src="Ressources/img/screen1.png" alt="">
                </div>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Installation de l'outil FluoriGraphix</h3>
                        <p>Vous venez de télécharger un fichier .zip. Décompressez ce fichier où bon vous semble, et ouvrez le dossier contenant les ressources du site.</p>
                        <p>Vous avez alors plusieurs fichiers et dossiers, dont un se nommant "FluoriGraphix-BRGM.html". C'est avec ce fichier que vous pourrez lancer le site et l'utiliser. Ce fichier est un raccourci, vous pouvez donc le copier/coller à un emplacement plus appréciable, comme votre bureau par exemple.</p>
                    </div>
                    <img src="Ressources/img/screen3.png" alt="">
                </div>
                <h3>Et voilà, FluoriGraphix est installé sur votre ordinateur !</h3>
            </div>
            
            
            <div class="section">
                <h3>Présentation & Installation</h3>
                <h1 id="lancementDoc" class="titreBarre findable">Lancement</h1>
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>1</span>Premier Lancement</h3>
                        <p>Double-cliquez sur le fichier "FluoriGraphix-BRGM.html". Votre navigateur par défaut s'ouvre. Vous arrivez alors Directement sur la page d'accueil. Vous êtes en local, c'est à dire que vous ne dépendez plus d'internet pour l'utilisation de ce site.</p>
                        <p>Notez qu'il est conseillé de télécharger à nouveau FluoriGraphix depuis le site internet pour mettre à jour votre version. Sans cela, vous pourriez converser des bugs datant de versions plus anciennes. La procédure de mise à jour est la même que celle d'installation.</p>
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
                        <p>Vous pouvez sélectionner un ou plusieurs fichiers de type .mv, .txt (xml converti), .xml, .dat (fichiers de calibration). En cas de modification de ces fichiers, prenez garde à ce que la syntaxe d'origine de ce fichier soit bien respectée.</p>
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
                        <p>Vous pouvez exporter le ou les fichiers importés sous la forme d'un seul fichier .mv.</p>
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
                        <p>Vous pouvez importer des fichiers de type .mv, .txt (xml converti), .xml, .dat (fichiers de calibration)</p>
                        <p>Pour les Fichiers .mv et .txt : le programme lit le fichier en fonction du nombre d'espaces séparant chaque colonne. Si des modifications ont été apportées, veillez à ce que la syntaxe d'origine soit parfaitement respectée.</p>
                        <p>Si le graphique est altéré/corrompu, il est possible que votre fichier ne respecte pas la syntaxe attendue, ou que le format de date ne soit pas correctement paramétré.</p>
                    </div>
                    <img src="Ressources/img/screen9.png" alt="">
                </div>
                
                <div class="etape">
                    <div>
                        <h3 class="findable"><span>2</span>Fichiers .dat</h3>
                        <p>Vous pouvez également importer des fichiers de calibration au format .dat. S'ils sont sélectionnés en plus d'autres fichiers, ils permettent de paramétrer automatiquement le format de dates du graphique.</p>
                        <p>Si un fichier .dat est importé seul, vous serez redirigé vers l'onglet "Calibration", et vos données seront affichées.</p>
                        <p>Notez que les fichiers .txt exportés par FluoriGraphix dans l'onglet "Calibration" ne sont pas pris en charge dans la partie "Graphiques".</p>
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
                        <h3 class="findable"><span>1</span>Exportation en fichier mv</h3>
                        <p>Vous pouvez exporter vos fichiers sous la forme d'un fichier .mv. Ce fichier contiendra toutes les données importées, et sera réutilisable par la suite dans FluoriGraphix.</p>
                        <p>Les fichiers .mv ont l'avantage d'être très lisibles et compréhensibles, contrairement au xml ou au txt.</p>
                        <p>Le téléchargement débute aussitôt le bouton "Télécharger le fichier" cliqué.</p>
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
            
           
            
        </div>
        
    </div>
    
    `;
}