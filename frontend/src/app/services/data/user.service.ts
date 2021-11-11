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
    date = (date).split('T')[0]
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

  registrarProyecto(body: Object){
    return this.http.post(`${API_URL}/registrarProyecto`, body)
  }
  eliminarProyecto(body: Object){
    return this.http.post(`${API_URL}/eliminarProyecto`, body)
  }
  obtenerProyecto(body: Object){
    return this.http.post(`${API_URL}/obtenerProyecto`, body)
  }

  obtenerProyectosRegistrados(body: Object){
    return this.http.post(`${API_URL}/obtenerProyectosRegistrados`, body)
  }

  obtenerProyectosRegistradosGet(){
    return this.http.get(`${API_URL}/obtenerProyectosRegistrados`)
  }

  obtenerActividades(body: Object){
    return this.http.post(`${API_URL}/obtenerActividades`, body)
  }

  editarActividad(body: Object){
    return this.http.post(`${API_URL}/editarActividad`, body)
  }

  eliminarActividad(body: Object){
    return this.http.post(`${API_URL}/eliminarActividad`, body)
  }

  obtenerProductos(body: Object){
    return this.http.post(`${API_URL}/obtenerProductos`, body)
  }

  editarProductos(body: Object){
    return this.http.post(`${API_URL}/editarProductos`, body)
  }

  eliminarProducto(body: Object){
    return this.http.post(`${API_URL}/eliminarProducto`, body)
  }

  obtenerPatrocinadores(){
    return this.http.get(`${API_URL}/obtenerPatrocinadores`)
  }

  registrarPatrocinador(body: Object){
    return this.http.post(`${API_URL}/registrarPatrocinador`, body)
  }

  eliminarPatrocinador(body: Object){
    return this.http.post(`${API_URL}/eliminarPatrocinador`, body)
  }

  registrarComentario(body: Object){
    return this.http.post(`${API_URL}/registrarComentario`, body)
  }

  eliminarComentario(body: Object){
    return this.http.post(`${API_URL}/eliminarComentario`, body)
  }

  listarComentariosProyecto(body: Object){
    return this.http.post(`${API_URL}/listarComentariosProyecto`, body)
  }

  listarComentarios(body: Object){
    return this.http.post(`${API_URL}/listarComentarios`, body)
  }
}
