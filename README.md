# Spring / Angular Keycloak demo

## Setup Keycloak

Lancez une instance Keycloak, par exemple avec Docker

    docker run -p 8080:8080 quay.io/keycloak/keycloak start-dev

Ou en téléchargeant le binaire depuis : https://www.keycloak.org/downloads

1. Se connecter en tant qu'admin à Keycloak (credentials par défaut : `admin` / `admin`)
2. Créer un *realm* nommé `SpringBootKeycloak`
3. Configurer dans ce *realm* un *client* de type *OpenID Connect* (s'assurer qu'il est *public*)

## Lancer l'aaplication Spring Boot

````sh
cd angular-oauth-client
mvn spring-boot:run
````

## Lancer le front Angular

````sh
cd angular-oauth-client
npm install && npm start
````

Et accéder à <http://localhost:4200/>