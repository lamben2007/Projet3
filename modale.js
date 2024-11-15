import { deleteWork, addWork } from "./fonctions.js";


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
        // Lancer la suppression d'un travail de l'architecte
        deleteWorkModal(work.id)
    });

    // Insérer l'élément figure dans la section "gallery"
    photosGallery.appendChild(figureElement);

}

/**
 *  Suppression d'un travail avec demande confirmation + réponse suppression auprès de l'utilisateur
 * @param {Number} id - Identifiant du work à supprimer
 */
function deleteWorkModal(id) {
    // Récupération du token
    const token = window.localStorage.getItem("token");

    //
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");

    //
    if (confirmation) {
        //
        deleteWork(id, token);
        // L'utilisateur a confirmé, on exécute l'action
        console.log("L'élément a été supprimé.");
    } else {
        // L'utilisateur a annulé
        alert("Suppression annulée.");
    }
}


/**
 * Supprime le projet contenu dans liste du modal
 * @param {Number} id - Identifiant du projet à supprimer dans le modal
 */
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
    const submitAddPhotoModal = document.querySelector("#submitAddPhotoModal");

    // Ouvrir la modale lors du clic sur le bouton de modification
    changeButton.addEventListener("click", () => {
        //
        modal.style.display = "block";
    })

    // SI clic sur le bouton précédent du modale ALORS
    previousbtn.onclick = function () {

        //
        previousbtn.style.display = "none";

        // Afficher la modale avec la liste des photos des projets
        photosGalleryModal.style.display = "block";

        // Cacher la modale avec le formulaire d'ajout de projet
        addPhotoModal.style.display = "none";
    }

    // Masquer la modale lors du clic sur le bouton de fermeture
    closeModalBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Ouvrir la modale "Ajout photo" lors du clic sur le bouton "Ajouter photo"
    photoAddButton.addEventListener("click", () => {

        //
        previousbtn.style.display = "block";

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

    // Validation du formulaire lors du clic sur le bouton "Ajout photo"
    submitAddPhotoModal.addEventListener("click", async (e) => {

        // Désactiver l'évènement du bouton submit par défaut
        e.preventDefault();

        // Validation du formulaire
        validateAddPhotoForm();

        // Ajouter le work
        const status = await addWork();

        // Reset formulaire
        if (status === 201) resetForm();

    })

    // Lancer la validation du formulaire si changement saisie titre
    document.getElementById("title").addEventListener("change", function () {
        console.log("Contenu du champ title : " + this.value);
        validateAddPhotoForm();
    });

    // Lancer la validation du formulaire si changement saisie catégorie
    document.getElementById("optCategory").addEventListener("change", function () {
        console.log("Contenu du champ optCategory : " + this.value);
        validateAddPhotoForm();
    });

    // Lancer la validation du formulaire si sélection d'un fichier image
    document.getElementById("imageFile").addEventListener("change", function () {

        // Lancer la validation du formulaire du modale "Ajout photo"
        validateAddPhotoForm();

        //
        // previewFile();
    });

}


/**
 * Effectue une validation du formulaire "Ajout photo" du modale
 * @returns - true si formulaire validé sinon false
 */
function validateAddPhotoForm() {

    // Sélection élément form
    const form = document.getElementById('addPhotoForm');

    // Utilise FormData pour récupérer les données du formulaire
    const formData = new FormData(form);

    // Vérifier le champ fichier image
    let validationStatusImageFile = validateImageFile(formData);

    // Vérifier le titre
    let validationStatusTitle = validateTitle(formData);

    // Vérifier la catégorie
    let validationStatusCategorie = validateCategorie(formData);

    // SI aucune erreur trouvé dans le formulaire ALORS
    if (validationStatusImageFile === true && validationStatusTitle === true && validationStatusCategorie === true) {

        //
        console.log("Formulaire valide");

        // Activer le bouton "VALIDER"
        document.getElementById("submitAddPhotoModal").disabled = false;

        // Formulaire validé
        return true;

    }

    // SINON (si erreur(s) trouvée(s))
    else {

        // Désactiver le bouton "VALIDER"
        document.getElementById("submitAddPhotoModal").disabled = true;

        // Formulaire non validé
        return false;

    }
}


/**
 * Vérifie si le champ "title" est défini dans formData.
 * 
 * @param {FormData} formData - Les données du formulaire contenant le champ "title".
 * @returns {boolean} - true si le champ "title" est valide, sinon false.
 */
function validateTitle(formData) {

    // Récupère la valeur du champ "title" dans formData
    const title = formData.get("title");

    // Vérifie si le champ est vide
    if (!title) {
        // alert("Titre non défini"); // Alerte si le champ est vide
        return false;               // Retourne false (= non valide)
    }

    // Retourne true (= valide) car aucune erreur trouvée
    return true;
}


/**
 *  Vérifie si le champ "catégorie" est défini
 * @param {FormData} formData 
 * @returns {boolean} - true si le champ "categorie" est valide, sinon false.
 */
function validateCategorie(formData) {

    // Récupère la valeur du champ "category" dans formData
    const categoryId = formData.get("category");

    // Vérifie si le champ est vide
    if (!categoryId) {
        // alert("Catégorie non défini"); // Alerte si le champ est vide
        return false;               // Retourne false (= non valide)
    }

    // Retourne true (= validation Ok) si aucune erreur n'est détectée
    return true;
}


/**
 * Fonction pour vérifier la validité d'un fichier image soumis via un formulaire.
 * @param {FormData} formData - Objet FormData contenant les données du formulaire.
 * @returns {boolean} - Retourne true si le fichier est valide, sinon false.
 */
function validateImageFile(formData) {

    // Récupération des données du champ fichier image
    const imageUrl = formData.get("image");

    // Vérifier si le fichier est présent
    if (!imageUrl || imageUrl.name.trim() === "") {
        // alert("Fichier image non défini");
        return false;  // Renvoyer false = Fichier image non validé
    }

    // Vérifier la taille du fichier (maximum 4 Mo)
    const maxSize = 1 * 1024 * 1024; // 4 Mo en octets
    // const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    if (imageUrl.size > maxSize) {
        alert("Taille du fichier image incorrecte (doit être < 4 Mo)");
        return false;  // Renvoyer false = Fichier image non validé
    }

    // Vérifier l'extension du fichier
    const validExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = imageUrl.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
        alert("Extension de fichier image incorrecte (seules les extensions jpg, jpeg, et png sont autorisées)");
        return false;  // Renvoyer false = Fichier image non validé
    }

    // Le fichier image est valide donc afficher l'aperçu de la photo
    previewFile();

    // Retourne true = fichier image valide
    return true;
}


/**
 * Effectue l'aperçu de l'image en fonction du fichier sélectionné
 */
function previewFile() {

    // Sélection élément du DOM
    const preview = document.querySelector("#divAddPhoto img");
    const file = document.querySelector("#imageFile").files[0];

    // Créer l'objet FileReader
    const reader = new FileReader();

    // Créer l'évènement permettant l'affichage de l'image seule après sélection du fichier
    reader.addEventListener(
        "load",
        () => {
            // on convertit l'image en une chaîne de caractères base64
            preview.src = reader.result;

            // Afficher uniquement que l'aperçu de l'image
            document.querySelector("#divAddPhoto i").style.display = "none";
            document.querySelector("#divAddPhoto label").style.display = "none";
            document.querySelector("#divAddPhoto span").style.display = "none";
            document.querySelector("#divAddPhoto img").style.display = "block";
        },
        false,
    );

    // Lecture des données du fichier image chargé
    if (file) {
        reader.readAsDataURL(file);
    }
}


/**
 * Effectue une réinitialisation du formulaire
 */
function resetForm() {

    // Lancer le reset sur le formulaire
    document.querySelector("#addPhotoForm").reset();

    // Afficher uniquement que l'aperçu de l'image
    document.querySelector("#divAddPhoto i").style.display = "block";
    document.querySelector("#divAddPhoto label").style.display = "block";
    document.querySelector("#divAddPhoto span").style.display = "block";
    document.querySelector("#divAddPhoto img").style.display = "none";
}


// Initialisation du modale
initModal();
