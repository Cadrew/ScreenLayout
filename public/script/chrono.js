$.initCompteRebours = function(conteneur, dateFinTeasing)
{
    var compteRebours = conteneur.find('.compte_rebours'),
        jours = compteRebours.find('.jours'),
        heures = compteRebours.find('.heures'),
        minutes = compteRebours.find('.minutes'),
        secondes = compteRebours.find('.secondes'),
        lanceCompteRebours,
        boucleCompteur,
        formateNombre;
        
    // Ajoute un zéro si le nombre est inférieur à 10
    formateNombre = function(n)
    {
        return (n < 10 ? '0' : '') + n;
    };

    lanceCompteRebours = function()
    {
        var maintenant = new Date(),
        // le temps restant en secondes
            tempsRestant = (dateFinTeasing.getTime() - maintenant.getTime()) / 1000,
            j, h, m;

        // Une fois que le compte à rebours est terminé
        if(tempsRestant <= 0)
        {
            clearInterval(boucleCompteur);
            return;
        }

        // nombre de jours restants
        j = Math.floor(tempsRestant / 86400);
        tempsRestant -= j * 86400;

        // nombre d'heures restantes
        h = Math.floor(tempsRestant / 3600);
        tempsRestant -= h * 3600;

        // nombre de minutes restantes
        m = Math.floor(tempsRestant / 60);
        tempsRestant -= m * 60;

        jours.text(formateNombre(j));
        heures.text(formateNombre(h));
        minutes.text(formateNombre(m));
        secondes.text(formateNombre(Math.floor(tempsRestant)));

        if(j == 0 && h == 0 && m == 0 && Math.floor(tempsRestant) == 0) {
            location.reload(true);
        }
    };

    // On appelle la fonction toutes les secondes pour obtenir le compte à rebours
    boucleCompteur = setInterval(lanceCompteRebours, 1000);
};