function vueCookies() {
    return `
    <div class="bannierePage">
        <img src="Ressources/img/image1.jpg" alt="Sources">
        <div class="contenu">
            <p><span onclick="afficherVue('vueAccueil')"><span></span>Accueil</span> <strong> / Gestion des Cookies</strong></p>
            <h1>Gestion des Cookies</h1>
        </div>
    </div>
    
    <div class="cookies">
        <h2>Certaines fonctionnalités de ce site reposent sur l’usage de témoins de connexion, dits "cookies". Vous pouvez donner, refuser ou retirer votre consentement au dépôt de ces cookies sur votre ordinateur, votre mobile ou votre tablette, à tout moment, soit globalement soit service par service.</h2>
        
        <h1 class="titreBarre">Cookies indispensables au fonctionnement du site</h1>
        <p>Certains cookies sont indispensables au bon fonctionnement du site. Il s'agit notamment des cookies d'équilibrage de charge ou encore des cookies qui conservent en mémoire votre acceptation ou votre refus de l'utilisation de cookies tiers.</p>
        <p>Ces traceurs ne nécessitent pas de consentement préalable et ne peuvent être désactivés.</p>
        
        <h1 class="titreBarre">Cookies de mesure d'audience</h1>
        <p>Les services de mesure d'audience sont nécessaires au fonctionnement du site en permettant sa bonne administration.</p>
        <p>Les données collectées (zone géographique, pages visitées, temps passé, etc.) sont enregistrées et conservées sur les serveurs du BRGM, pour une durée maximum de treize (13) mois. Ces informations sont strictement anonymes, ne permettent pas d'identifier les utilisateurs ni de suivre leur navigation sur d'autres sites. Les informations recueillies ne seront utilisées que pour les seuls besoins de l'analyse de la fréquentation des sites du BRGM.</p>
        
        <h1 class="titreBarre">Cookies tiers</h1>
        <p>D'autres cookies sont utilisés pour vous permettre de visualiser directement sur notre site du contenu hébergé par des tiers.</p>
        <p>Vous avez la possibilité d'accepter ou de vous opposer au dépôt de ces cookies tiers, via le panneau de gestion des cookies accessible via le bandeau affiché lors de votre arrivée sur le site.</p>
    </div>
    `;
}