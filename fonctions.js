

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
      addCardWork(work);
    }

    // Appliquer le filtre
    const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));
    appliquerFiltre(filterCategoryId);

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
        appliquerFiltre(id)

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
export function appliquerFiltre(filterCategoryId) {

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
