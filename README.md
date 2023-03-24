# Spring / Angular Keycloak demo

## Setup Keycloak

Lancez une instance Keycloak, par exemple avec Docker

<pre><code>docker run -p 8080:8080 \
    -v <b>$PWD/keycloak-setup</b>:/opt/keycloak/data/import \
    quay.io/keycloak/keycloak:latest \
    start-dev <b>--import-realm</b></code></pre>

Ou en téléchargeant le binaire depuis : https://www.keycloak.org/downloads

Le serveur keycloak écoute sur le port `8080`  
Si un autre port est utilisé, mettre à jour les configs [back](spring-resource-server/src/main/resources/application.yml) et [front](angular-oauth-client/src/keycloak/keycloak-init.ts).

### Configuration importée

La commande de lancement via Docker ci-dessus utilise le flag `--import-realm`.  
Avec un *bind mount* du [réportoire `keycloak-setup/`](keycloak-setup) de ce dépôt.

Les fichiers de setup de notre exemple sont ainsi automatiquement importés au lancement de Keycloak.
L'instance comportera ainsi :

2. Un *realm* nommé `SpringBootKeycloak`
3. Dns ce *realm*, un *client* de type *OpenID Connect* appelé `login-app`
4. L'URI `http://localhost:4200/*` configurée dans la section *valid redirect URIs* du *client*
5. Un utilisateur : username `user1`, mot de passe `yop`

Les application Spring et Angular s'attendent à cette configuration.

## Lancer l'application Spring Boot

````sh
cd spring-resource-server
mvn spring-boot:run
````

### Test du endpoint public

    $ > curl http://localhost:8081/api/about
    Hello !

### Test du endpoint privé

    $ > curl -v http://localhost:8081/api/hello
    < HTTP/1.1 401 

### Test avec un token

Cet accès nécéssite un token JWT émis par Keycloak.

On peut l'obtenir par appel direct à Keycloak, avec les credentials de l'utilisateur créé lors du setup.

````sh
curl --location 'http://localhost:8080/realms/SpringBootKeycloak/protocol/openid-connect/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'client_id=login-app' \
    --data-urlencode 'username=user1' \
    --data-urlencode 'password=yop' \
    --data-urlencode 'grant_type=password'
````

Qui donne une réponse de type :

````json
{
    "access_token": "eyJhbGciOiJ...", // etc...
    "expires_in": 300,
    "refresh_expires_in": 1800,
    // etc...
}
````

Nous pouvons utiliser ce token pour faire une requête vers le endpoint protégé :

````sh
$ > curl -v -H "Authorization: Bearer ey..." http://localhost:8081/api/hello
{"name":"(...)","greeting":"Salut !"}
````


## Lancer le front Angular

````sh
cd angular-oauth-client
npm install && npm start
````

Et accéder à <http://localhost:4200/>

Le front ne contient qu'un seul composant racine, qui appelle les endpoints et affiche simplement le résultat 

### Accès non identifé au front

<img width="600px" alt="Front sans connexion" src="logged-out.png" />

### Front après connexion

Le bouton login redirige vers la page de login Keycloak.  
Saisir les identifiants de l'utilisateur importé lors du setup.

Après connection, vous serez redirigé vers le front, qui devrait ressembler alors à ceci :

<img width="600px" alt="Front avec connexion" src="logged-in.png" />

Le front récupère le token, (le renouvelle si nécessaire) et l'envoie au back en header de la requête.
