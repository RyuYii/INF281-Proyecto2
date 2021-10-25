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

  obtenerDatos(body: Object) {
    return this.http.post(`${API_URL}/datosPersonales`, body)
  }
}
