
import { KeycloakService } from 'keycloak-angular';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: { // TODO => ENV (placé ici par simplicité)
            url: 'http://localhost:8080/',
            realm: 'SpringBootKeycloak',
            clientId: 'login-app',
          },
          loadUserProfileAtStartUp: true,
          initOptions: {
            //onLoad: 'login-required', // <= Passer à true pour rendre le login obligatoire au startup
            checkLoginIframe: false,
          },
          bearerExcludedUrls: ['/assets'],
        });
        resolve(resolve);
      } catch (error) {
        reject(error);
      }
    });
  };
}
