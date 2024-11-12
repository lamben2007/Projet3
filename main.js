import { displayCardWorks, menuFiltres, editionMode, statusLoginLogout } from "./fonctions.js";

// Gestion Edition mode
editionMode();

// Afficher la liste des projets
await displayCardWorks();

// Afficher la barre des filtres
await menuFiltres();

// Gestion état login / logout
statusLoginLogout();

