import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/data/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  habilitado: boolean;
  datos: Object = {
    nombres: '',
    apellidos: '',
    ci: '',
    fechaNac: ''
  };
  constructor(
    public authenticacionService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.habilitado = false;
    this.userService.obtenerDatos({ idUser: this.authenticacionService.getUser() }).subscribe(
      (data: any) => {
        console.log(data)
        this.datos = data;
      })
    
  }
  habilitarForm(){
    this.habilitado = true;
  }
  deshabilitarForm(){
    this.habilitado = false;
  }
}
