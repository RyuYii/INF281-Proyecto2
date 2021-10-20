import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { API_URL, TOKEN, AUTHENTICATED_USER} from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
  
  
export class AuthenticationService {

  constructor(
    private http: HttpClient,
  ) { }

  authenticate(username: string, password: string) {
    const body = { username, password };
    console.log('aqui');
    return this.http.post(`${API_URL}/login`, body, { observe: 'response' })
      .pipe(
        map(
          response => {
            
            sessionStorage.setItem(TOKEN, response.body['token']);
            //SI SOLO TIENE ESTE ROL, SIGNIFICA QUE NO TIENE NINGUN ROL HABILITADO EN LA TABLA ADM_USUARIOS_ROLES
            // if (!this.isRole('ROLE_USER')) {
            //   this.setConfiguration();
            // } 
          }
        )
      );
  }

  logout() {
    sessionStorage.removeItem(TOKEN);
  }
  isRole(rol:String) {
    return true
  }

  getAuthenticatedUser() {
    return sessionStorage.getItem(TOKEN);
  }

  getAuthenticatedToken() {
    if (this.getAuthenticatedUser()) {
      return sessionStorage.getItem(TOKEN);
    }
  }

  isAuthenticated() {
    const user = sessionStorage.getItem(TOKEN);
    return !(user === null);
  }
}
