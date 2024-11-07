import { addCardWorkModal, deleteCardWorkModalDOM } from "./modale.js"

/**
 * Ajout d'une card projet
 * @param {object} work - Objet work de l'API
 */
function addCardWork(work) {

  // Sélectionner le composant "gallery"
  const sectionGallery = document.querySelector(".gallery");

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

  // Création de l'élément "figcaption"
  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = work.title;

  // Insérer les éléments image et figcaption dans l'élement figure
  figureElement.appendChild(imageElement);
  figureElement.appendChild(figcaptionElement);

  // Insérer l'élément figure dans la section "gallery"
  sectionGallery.appendChild(figureElement);

}


/**
 * Affiche la liste des projets
 */
export async function displayCardWorks() {

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
      addCardWork(work);
    }

    // Appliquer le filtre
    const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));
    applyFilter(filterCategoryId);

  }

  // Gestion des erreurs
  catch (err) {
    // Afficher message d'erreur
    alert(err);
  }

}


/**
 * Indique le filtre en cours de sélection
 * @param {number} categoryId - Identifiant de la catégorie
 */
function selectionButtonFilter(categoryId) {

  // Sélectionner tous les boutons filtre
  let buttonsFilterElement = document.querySelectorAll('.boutonFiltre');

  // Pour chaque bouton
  for (let button of buttonsFilterElement) {

    // Identifiant de la catégorie contenu dans le bouton
    const id = Number(button.dataset.id);

    // Supprimer la sélection du filtre
    button.classList.remove("boutonFiltreActive");

    // SI c'est le bouton filtre recherché ALORS le sélectionner
    if (categoryId === id) button.classList.add("boutonFiltreActive");

  }

}


/**
 * Affiche la barre des filtres catégories
 */
export async function menuFiltres() {

  try {

    // Récupération des données des catégories via l'API
    const response = await fetch("http://localhost:5678/api/categories");

    // Renvoyer une erreur si réponse non Ok
    if (!response.ok) {
      throw new Error(response.status + " Une erreur s'est produite")
    }

    // Conversion en json
    let categories = await response.json();

    // Sélecteur

    // Ajouter la catégorie "Tous"
    const categorieTous = { "id": 0, "name": "Tous" }
    categories.unshift(categorieTous);

    // Sélectionner l'élément "boutonsFiltre"
    const boutonsFiltreElement = document.querySelector(".boutonsFiltre");

    // Lire l'identifiant de la catégorie dans le localStorage
    const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));

    // Créer un bouton pour chaque catégorie
    for (let category of categories) {

      // Création du bouton
      const boutonFiltreElement = document.createElement("button");

      // Définir l'attribut data-id
      boutonFiltreElement.setAttribute("data-id", category.id);

      // Ajouter la classe CSS
      boutonFiltreElement.classList.add("boutonFiltre");

      // Sélectionner le bouton filtre selon la catégorie
      if (category.id === filterCategoryId) boutonFiltreElement.classList.add("boutonFiltreActive");

      // Définir le texte du bouton
      boutonFiltreElement.textContent = category.name;

      // Ajouter le bouton dans la barre des filtres
      boutonsFiltreElement.appendChild(boutonFiltreElement);

      // Créer une fonction d'évènement "click" pour le bouton
      boutonFiltreElement.addEventListener("click", function (event) {

        // Identifiant de la catégorie contenu dans le bouton
        const id = Number(event.target.dataset.id);

        // Stocker l'ID de la catégorie dans le localStorage
        window.localStorage.setItem("filterCategoryId", id);

        // Sélectionner le bouton filtre en fonction de la catégorie
        selectionButtonFilter(id);

        // Appliquer le filtre en fonction de l'identifiant catégorie
        applyFilter(id)

      });

    }


  }
  // Gestion des erreurs
  catch (err) {
    // Afficher message d'erreur
    alert(err);
  }

}


/**
 * Appliquer le filtre (liste de projets) en fonction de la catégorie
 * @param {filterCategoryId} filterCategoryId - Identifiant de la catégorie
 */
export function applyFilter(filterCategoryId) {

  // Sélectionner toutes les cards
  let cards = document.querySelectorAll('.gallery figure');

  // POUR chaque card
  for (let card of cards) {

    // Récupérer l'identifiant catégorie de la card
    const cardCategoryId = Number(card.dataset.categoryId);

    // SI la card en cours fait partie de la catégorie ou si catégorie "TOUS" ALORS
    if (cardCategoryId === filterCategoryId || filterCategoryId === 0)
      // Afficher la card
      card.style.display = 'block';

    else // SINON
      // Cacher la card
      card.style.display = 'none';

  }

}


/**
 * Permet de passer en mode édition
 */
export function editionMode() {

  // Récupération du token
  const token = window.localStorage.getItem("token");

  const changeButton = document.querySelector("#changeButton");
  const barEditionMode = document.querySelector("#editionMode");

  // SI token trouvé (Mode édition) ALORS
  if (token !== null) {

    // Afficher le bouton "Modifier"
    changeButton.style.display = "flex";

    // Afficher la barre noire EDITION
    barEditionMode.style.display = "flex";
  }

  // SINON si token non trouvé (Mode standard)
  else {
    // Cacher le bouton "Modifier"
    changeButton.style.display = "none";

    // Cacher la barre noire EDITION
    barEditionMode.style.display = "none";

  }

}


function deleteCardWorkDOM(ID) {

  //
  let cards = document.querySelectorAll('.gallery figure');

  // POUR chaque card
  for (let card of cards) {

    // Récupérer l'identifiant de la card work
    const idCard = Number(card.id);

    // SI la card en cours est la card à supprimer
    if (idCard === ID) {
      // Suppression de la card work
      card.remove();
    }

  }

}

export async function deleteCardWork(id, token) {

  try {

    //
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // En-tête avec token
        'Content-Type': 'application/json' // En-tête JSON si besoin
      }
    });

    //
    if (!response.ok) {
      throw new Error(`Erreur : ${response.status} ${response.statusText}`);
    }

    // Suppression du projet dans les 2 listes des galleries (Liste principale + liste modale)
    deleteCardWorkDOM(id);
    deleteCardWorkModalDOM(id);

  }

  // Gestion des erreurs
  catch (error) {

    //
    console.error('Erreur lors de la requête DELETE:', error);
  }
}


function loginLogoutManagement() {

  //
  const loginLogoutElement = document.querySelector("#loginLogout");

  //
  const token = window.localStorage.getItem("token");

  // SI pas de token ALORS
  if (!token) {
    //
    window.location.href = "login.html";
  }

  else {
    //
    window.localStorage.removeItem("token");

    //
    editionMode();
  }

  //
  statusLoginLogout();




}

function statusLoginLogout() {

  //
  const loginLogoutElement = document.querySelector("#loginLogout");
  //
  const token = window.localStorage.getItem("token");

  // SI pas de token ALORS
  if (!token) {
    //
    loginLogoutElement.innerText = 'login';
  }

  else {
    loginLogoutElement.innerText = 'logout';
  }


}

//
function createEvents() {

  //
  const loginLogoutElement = document.querySelector("#loginLogout");

  //
  loginLogoutElement.addEventListener("click", (e) => {

    //
    e.preventDefault

    //
    loginLogoutManagement();

  })

}

createEvents();

// loginLogoutManagement();

statusLoginLogout();