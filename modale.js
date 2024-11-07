import { deleteCardWork } from "./fonctions.js";


/**
 * Ajout d'une card work
 * @param {object} work - Objet work de l'API 
 */
export function addCardWorkModal(work) {

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

        //
        const id = Number(figureElement.getAttribute('id'));

        // Récupération du token
        const token = window.localStorage.getItem("token");

        //
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
    
        //
        if (confirmation) {
            //
            deleteCardWork(id, token);
            // L'utilisateur a confirmé, on exécute l'action
            console.log("L'élément a été supprimé.");
        } else {
            // L'utilisateur a annulé
            alert("Suppression annulée.");
        }



    });


    // Insérer l'élément figure dans la section "gallery"
    photosGallery.appendChild(figureElement);

}

export function deleteCardWorkModalDOM(id) {

    //
    let cards = document.querySelectorAll('#photosGallery figure');

    // POUR chaque card
    for (let card of cards) {

        // Récupérer l'identifiant de la card work
        const idCard = Number(card.id);

        // SI la card en cours est la card à supprimer
        if (idCard === id) {
            // Suppression de la card work
            card.remove();
        }

    }
}


/**
 * Initialisation du modale (Ajout des évènements)
 */
function initModal() {

    // Récupération des éléments
    const modal = document.getElementById("myModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const changeButton = document.querySelector("#changeButton");
    const photoAddButton = document.querySelector(".photoAddButton");
    const photosGalleryModal = document.querySelector("#photosGalleryModal");
    const addPhotoModal = document.querySelector("#addPhotoModal");
    const previousbtn = document.querySelector(".previous-btn");


    //
    previousbtn.onclick = function () {
        //
        photosGalleryModal.style.display = "block";

        //
        addPhotoModal.style.display = "none";
    }

    // Masquer la modale lors du clic sur le bouton de fermeture
    closeModalBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Ouvrir la modale lors du clic sur le bouton de modification
    changeButton.addEventListener("click", () => {
        //
        modal.style.display = "block";
    })

    // Ouvrir la modale "Ajout photo" lors du clic sur le bouton "Ajouter photo"
    photoAddButton.addEventListener("click", () => {

        //
        photosGalleryModal.style.display = "none";

        //
        addPhotoModal.style.display = "block";

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
