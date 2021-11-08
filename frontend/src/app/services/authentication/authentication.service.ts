import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { API_URL, TOKEN, AUTHENTICATED_USER} from './../../../environments/environment';
import { forkJoin } from 'rxjs';
import { AccesosService } from '../data/accesos.service';
import { ThrowStmt } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
  
  
export class AuthenticationService {
  modulos: any;
  roles: any;
  idRol: number;
  menusUser: any = [];
  menus: any = [
      {
        descri: "Inicio",
        rutaEnlace: "/welcome"
      },
      {
        descri: "Proyectos",
        rutaEnlace: "/panel"
      },
      {
        descri: "About",
        rutaEnlace: "/about"
      },
    ];

  menusUser1: any = [
    {
      descri: "Perfil",
      rutaEnlace: "/perfil"
    },

  ];

  menusUserGerencial: any = [
    {
      descri: "Perfil",
      rutaEnlace: "/perfil"
    },
    {
      descri: "mis Proyectos",
      rutaEnlace: "/dashboard"
    },
  ];

  menusUserRoot: any = [
      {
        descri: "Perfil",
        rutaEnlace: "/perfil"
      },
      {
        descri: "administracion",
        rutaEnlace: "/admin"
      },
    ];

  constructor(
    private http: HttpClient,
    private accesosService: AccesosService
  ) { }
  register(body: object) {
    return this.http.post(`${API_URL}/signin`, body)
  }

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
            const token: string = this.getAuthenticatedToken();
            //console.log(jwt_decode(token.substr(7, token.length)));
            sessionStorage.setItem("user",jwt_decode(token.substr(7, token.length)).identity);
            //console.log(this.getUser());
            this.setTask(1);
            this.setConfiguration();
          }
        )
      );
  }

  setMenus(idRol: number){
    if(idRol === 1){
      this.menusUser = this.menusUser1;
    }
    if(idRol === 2){
      this.menusUser = this.menusUserGerencial;
    }
    if(idRol === 3){
      this.menusUser = this.menusUserRoot;
    }
  }

  setConfiguration() {
    let usuario = {idUser: this.getUser()}
    this.accesosService.obtenerRol(usuario).subscribe(
      (data:any) => {
        //console.log(data);
        if (data.length > 1){
          this.roles = data
          sessionStorage.setItem("rol", data[0]["idRol"])
        }
        else{
          this.roles = null
          sessionStorage.setItem("rol", data[0]["idRol"])
        }
        this.setMenus(this.getRol());
      }
    )
    /*
    const modulosObs = this.accesosService.listarmodulos().pipe(
      map(modulosData => {
        this.modulos = modulosData;
        if (!this.getIdModulo())
          //console.log(modulosData, '%%%%%%%%%%%%%%%%%%%');
          this.setIdModulo(modulosData[0].idModulo);
        this.idModulo = this.getIdModulo();

        this.setFase();

        return modulosData[0];
      }),
      mergeMap(modulosData =>
        this.accesosService.listarRoles(this.getIdModulo())
      )
    );

    forkJoin([modulosObs]).subscribe(
      (data: any[]) => {
        //para roles

        const dataRoles = data[0];
        this.roles = dataRoles;
        if (!this.getIdRol())
          this.setIdRol(dataRoles[0].idRol);
        this.idRol = this.getIdRol();
        this.accesosService.listarMenus(this.getIdModulo(), this.getIdRol()).subscribe(
          dataMenu => {
            this.menus = dataMenu
            //console.log(dataMenu, '$$$$$$$$$$$$$$$$$$$$$$')
          }
        )
      }
    )*/
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
  getUser() {
    if (!this.isAuthenticated()) {
      return false;
    }
    return parseInt(sessionStorage.getItem('user'));
  }
  getRol():number {
    if (!this.isAuthenticated()) {
      return 0;
    }
    return parseInt(sessionStorage.getItem('rol'));
  }

  setTask(task){
    sessionStorage.setItem('task', task);
  }
  getTask(){
    return parseInt(sessionStorage.getItem('task'));
  }

}
