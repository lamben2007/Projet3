

function addCardWork(work) {

  // console.log(work);

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

  }

  // Gestion des erreurs
  catch (err) {
    // Afficher message d'erreur
    alert(err);
  }

}


function selectionButtonFilter(categoryId) {

  // Sélectionner tous les boutons filtre
  let buttonsFilterElement = document.querySelectorAll('.boutonFiltre');

  //
  for (let button of buttonsFilterElement) {

    //
    const id = Number(button.dataset.id);

    //
    button.classList.remove("boutonFiltreActive");

    //
    if (categoryId === id) button.classList.add("boutonFiltreActive");

  }

  // //
  // const filterCategoryId = Number(window.localStorage.getItem("filterCategoryId"));

}

// ----------------------------------------------------------------------------
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

      //
      if (category.id === filterCategoryId) boutonFiltreElement.classList.add("boutonFiltreActive");

      // Définir le texte du bouton
      boutonFiltreElement.textContent = category.name;

      // Ajouter le bouton dans la barre des filtres
      boutonsFiltreElement.appendChild(boutonFiltreElement);

      // Créer une fonction d'évènement "click" pour le bouton
      boutonFiltreElement.addEventListener("click", function (event) {
        //
        const id = Number(event.target.dataset.id);
        //
        window.localStorage.setItem("filterCategoryId", id);

        //
        selectionButtonFilter(id);

        //
        appliquerFiltre(id)

        //
        // listeTravaux();
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
 * 
 * @param {filterCategoryId} filterCategoryId 
 */
export function appliquerFiltre(filterCategoryId) {

  //
  let cards = document.querySelectorAll('.gallery figure');

  //
  for (let card of cards) {

    //
    const cardCategoryId = Number(card.dataset.categoryId);

    //
    if (cardCategoryId === filterCategoryId || filterCategoryId === 0)
      //
      card.style.display = 'block';

    else // 
      //
      card.style.display = 'none';

  }

}




