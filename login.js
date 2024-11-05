
/**
 * Effectue une connexion de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {number} status - Renvoie le status de la réponse (200 = réussi / 404 = utilisateur inconnu / 401 = utilisateur non authorisé)
 */
async function connect(email, password) {

    try {

        // Création de l’objet user
        const user = {
            "email": email,
            "password": password
        };

        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);

        // Récupération des données des catégories via l'API
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        // Renvoyer une erreur si réponse non Ok
        if (!response.ok) {
            let error = new Error("Une erreur s'est produite");
            error.status = response.status;
            throw error;
        }

        // Récupérer le token et le mettre dans le localStorage
        const data = await response.json(); // Récupère les données JSON de la réponse
        window.localStorage.setItem("token", data.token);

        // Renvoyer le status (200 = réussite)
        return response.status;

    }

    // Gestion des erreurs
    catch (error) {

        //
        console.log("connectUser: ", error)

        // Renvoyer le status de la réponse
        return error.status

    }
}


/**
 * Ajout de l'écouteur d'évènements pour le bouton submit
 */
function initEvent() {

    // Sélectionner le formulaire par son ID
    const form = document.getElementById('loginForm');

    // Elément message d'erreur
    const errorMessage = document.getElementById('errorMessage');


    // Ajouter un écouteur d'événement pour le "submit"
    form.addEventListener('submit', async function (event) {

        // Empêcher le formulaire de soumettre les données et de rafraîchir la page
        event.preventDefault();

        // Récupérer les valeurs des champs email et password
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Réinitialiser le message d'erreur
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Lancer une tentative de connexion de l'utilisateur
        const response = await connect(email, password);

        // Action selon le résultat

        switch (response) {

            // Cas : Connexion réussi // !!! PB message d'erreur de violation de données google
            case 200:
                errorMessage.textContent = "Connexion Ok";
                errorMessage.style.display = 'block';
                window.location.href = "index.html";
                // window.location.assign("index.html");

                break;

            // Cas : Utilisateur inconnu
            case 404:
                errorMessage.textContent = "Utilisateur inconnu";
                errorMessage.style.display = 'block';
                break

            // Cas : Utilisateur non authorisé
            case 401:
                errorMessage.textContent = "Utilisateur non authorisé";
                errorMessage.style.display = 'block';
                break

        }

    })

}

// Configuration des évènements
initEvent();

