import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {

  constructor(
    private http: HttpClient
  ) { }
  obtenerRol(user: Object) {        
    return this.http.post(`${API_URL}/obtenerRol`, user);
  }


}
