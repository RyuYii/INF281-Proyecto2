import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RootService {

  constructor(
    private http: HttpClient
  ) { }

  mensajes() {        
    return this.http.get(`${API_URL}/protected`);
  }
  obtenerSolicitudes(){
    return this.http.get(`${API_URL}/obtenerSolicitudes`)
  }
  aceptarSolicitud(body: Object){
    return this.http.post(`${API_URL}/aceptarSolicitud`, body)
  }


  obtenerProyectosEnEspera(){
    return this.http.get(`${API_URL}/obtenerProyectosEnEspera`)
  }
}
