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
 * Affiche la liste des projets sous forme de cards
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

    // Créer les card work
    for (let work of works) {
      // Ajout d'1 card côté modale
      addCardWorkModal(work);
      // Ajout d'1 card côté gallerie
      addCardWork(work);
    }

    // Appliquer le filtre actif
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

    // Définit les catégories dans le formulaire du modale "ajout photo"
    defineCategoriesModal(categories);

  }
  // Gestion des erreurs
  catch (err) {
    // Afficher message d'erreur
    alert(err);
  }

}


/**
 * Définit les catégories dans le formulaire du modale "ajout photo"
 * @param {*} categories - Tableau d'objets contenant les catégories
 */
function defineCategoriesModal(categories) {

  //
  const selectElement = document.querySelector("#addPhotoForm #optCategory");

  //
  for (let category of categories) {

    //
    if (category.name !== "Tous") {
      //
      let optionElement = document.createElement("option");
      //
      optionElement.value = category.id; // Définit la valeur de l'option

      //
      optionElement.textContent = category.name; // Définit le texte affiché

      //
      selectElement.appendChild(optionElement);

    }

  }
}


/**
 * Appliquer le filtre (liste de projets) en fonction de la catégorie
 * @param {filterCategoryId} filterCategoryId - Identifiant de la catégorie
 */
export function applyFilter(filterCategoryId) {

  // Forcer le filtre sur "Tous" SI mode edition
  const token = window.localStorage.getItem("token");
  if (token) {
    //
    filterCategoryId = 0;
    console.log("forcer le filtre à tous car mode edition")
  }

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
 * Gestion du mode édition / mode standard 
 */
export function editionMode() {

  // Récupération du token
  const token = window.localStorage.getItem("token");

  // Sélection du bouton "Modifier" et de la barre édition
  const changeButton = document.querySelector("#changeButton");
  const barEditionMode = document.querySelector("#editionMode");
  const barBoutonsFiltres = document.querySelector(".boutonsFiltre");

  // SI token trouvé (Mode édition) ALORS
  if (token !== null) {

    // Afficher le bouton "Modifier"
    changeButton.style.display = "flex";

    // Afficher la barre noire EDITION
    barEditionMode.style.display = "flex";

    // Cacher la barre des filtres
    barBoutonsFiltres.style.display = "none";

  }

  // SINON si token non trouvé (Mode standard)
  else {
    // Cacher le bouton "Modifier"
    changeButton.style.display = "none";

    // Cacher la barre noire EDITION
    barEditionMode.style.display = "none";

    // Afficher la barre des filtres
    barBoutonsFiltres.style.display = "flex";

    // Réappliquer le filtre qui était activé en mode standard
    const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));
    applyFilter(filterCategoryId);

  }

}


/**
 * Supprime un projet dans la liste des galleries
 * @param {Number} ID - Identifiant du projet
 */
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


/**
 * Ajoute un nouveau projet
 * @returns Renvoi le status envoyé par l'API (201 = réussi)
 */
export async function addWork() {

  //
  try {

    // Récupération du token
    const token = window.localStorage.getItem("token");

    // Utilise FormData pour récupérer les données du formulaire
    const form = document.getElementById('addPhotoForm');
    const formData = new FormData(form);

    // Ajouter un nouveau work via l'API
    const response = await fetch("http://localhost:5678/api/works", {
      method: 'POST', // Méthode d'envoi (POST)
      headers: {
        'Authorization': `Bearer ${token}`, // Ajoute le token d'autorisation dans les headers
      },
      body: formData, // Corps de la requête, ici les données du formulaire
    });

    // Renvoyer une erreur si réponse non Ok
    if (!response.ok) {
      let error = new Error("Une erreur s'est produite");
      error.status = response.status;
      throw error;
    }

    // Si la réponse est correcte, récupère les données en JSON
    const work = await response.json();

    // Ajouter une card work dans la liste des galleries (en tenant compte du filtre actif)
    addCardWork(work);
    const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));
    applyFilter(filterCategoryId);

    // Ajouter une card work dans la liste des galleries du modal
    addCardWorkModal(work);

    // Message "Ajout effectué avec succès !"
    alert("Ajout effectué avec succès !");

    // Renvoyer le status (201 = réussite)
    return response.status;

  }

  // Gestion des erreurs
  catch (error) {

    //
    console.log("addWork: ", error)

    // Renvoyer le status de la réponse
    return error.status

  }
}


/**
 * Supprime un projet
 * @param {Number} id - Identifiant du projet
 * @param {*} token - token permettant la suppression du projet via l'API
 */
export async function deleteWork(id, token) {

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


/**
 * Gère la connexion / déconnexion administrateur
 */
function loginLogoutManagement() {

  // Sélection du bouton login / logout
  const loginLogoutElement = document.querySelector("#loginLogout");

  // Récupération du token dans le localStorage
  const token = window.localStorage.getItem("token");

  // SI pas de token ( mode standard ) ALORS
  if (!token) {
    // Charge le formulaire de connexion
    window.location.href = "login.html";
  }

  // SINON (si présence token = mode administrateur)
  else {
    // Suppression du token dans le localStorage
    window.localStorage.removeItem("token");

    // Mise à jour du mode édition / mode standard
    editionMode();
  }

  // Gère l'étatdu  bouton login / logout
  statusLoginLogout();

}


/**
 * Gère le bouton login/logout 
 */
export function statusLoginLogout() {

  // Sélection du bouton "Login/logout"
  const loginLogoutElement = document.querySelector("#loginLogout");

  // Récupération du token dans le localStorage
  const token = window.localStorage.getItem("token");

  // SI pas de token (= mode standard) ALORS
  if (!token) {
    // Afficher le bouton "Login"
    loginLogoutElement.innerText = 'login';
  }

  // SINON (si présence token = mode admin)
  else {
    // Afficher le bouton "Logout"
    loginLogoutElement.innerText = 'logout';
  }

}


/**
 * Crée les évènements des diverses éléments du DOM
 */
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


// Crée les évènements des diverses éléments du DOM
createEvents();
