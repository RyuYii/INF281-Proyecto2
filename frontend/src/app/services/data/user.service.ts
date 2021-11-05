import { Injectable } from '@angular/core';
import { API_URL } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  toDate(date){
    date = (new Date()).toISOString().split('T')[0]
    return date;
  }
  obtenerDatos(body: Object) {
    return this.http.post(`${API_URL}/datosPersonales`, body)
  }
  changeDatosPersonales(body: Object){
    return this.http.post(`${API_URL}/changeDatosPersonales`, body)
  }
  changePassword(body: Object){
    return this.http.post(`${API_URL}/changePassword`, body)
  }
  registrarSolicitud(body: Object){
    return this.http.post(`${API_URL}/registrarSolicitud`, body)
  }

  
}
