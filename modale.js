/**
 * Affiche la liste de CARD des travaux dans le modale
 */
export async function displayCardsWorksModal() {

    try {

        // Récupération des données des travaux de l'architecte via l'API
        const response = await fetch("http://localhost:5678/api/works");

        // Renvoyer une erreur si réponse non Ok
        if (!response.ok) {
            throw new Error(response.status + " Une erreur s'est produite")
        }

        // Conversion en json
        const works = await response.json();

        // Créer les card works
        for (let work of works) {
            addCardWorkModal(work);
        }

    }

    // Gestion des erreurs
    catch (err) {
        // Afficher message d'erreur
        alert(err);
    }

}

/**
 * Ajout d'une card work
 * @param {object} work - Objet work de l'API 
 */
function addCardWorkModal(work) {

    // Sélectionner le composant "gallery"
    const photosGallery = document.querySelector("#photosGallery");

    // Création de l'élément "figure"
    let figureElement = document.createElement("figure");

    // Ajouter l'attribut "id" à l'élément "figureElement"
    figureElement.setAttribute('id', work.id);

    // Ajout attribut personnalisé "categoryID" à l'élément "figureElement"
    figureElement.dataset.categoryId = work.categoryId;

    // Création de l'élément image
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    figureElement.appendChild(imageElement);


    // Bouton de suppression
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Icone poubelle
    figureElement.appendChild(deleteButton);

    // Action au clic du bouton suppression
    deleteButton.addEventListener('click', () => {

        const id = figureElement.getAttribute('id');
        alert("suppression card ID : " + id);
    });


    // Insérer l'élément figure dans la section "gallery"
    photosGallery.appendChild(figureElement);

}

/**
 * Initialisation du modale (Ajout des évènements)
 */
function initModal() {

    // Récupération des éléments
    const modal = document.getElementById("myModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const changeButton = document.querySelector("#changeButton");

    // Masquer la modale lors du clic sur le bouton de fermeture
    closeModalBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Ouvrir la modale lors du clic sur le bouton de modification
    changeButton.addEventListener("click", () => {
        //
        modal.style.display = "block";
    })

    // Masquer la modale en cliquant en dehors du contenu
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

}

// Initialisation du modale
initModal();

// Afficher la liste des cards Work dans le modal
displayCardsWorksModal();