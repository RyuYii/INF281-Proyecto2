import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { API_URL, TOKEN, AUTHENTICATED_USER} from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
  
  
export class AuthenticationService {
  modulos: any;
  roles: any;
  idRol: number;
  
  menus: any = [{
    abrev: null,
    descri: "INTEGR. PLANILLAS",
    enlaces: [{
        abrev: "PM",
        descri: "Planilla Mensual",
        estado: 1,
        idCategoria: 1,
        idEnlace: 1,
        imagen: "",
        orden: 0,
        rutaEnlace: "/planilla_mensual"
      },
      {
        abrev: "PM",
        descri: "Planilla Mensual",
        estado: 1,
        idCategoria: 1,
        idEnlace: 1,
        imagen: "",
        orden: 0,
        rutaEnlace: "/planilla_mensual"
      }],
    estado: null,
    icono: "fas fa-folder-open",
    idCategoria: 1,
    idModulo: null,
    idRol: null,
    orden: 1,
  }];
  menusUser: any = {}
  menusUserGerencial: any = {}
  menusUserRoot: any = {}

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
