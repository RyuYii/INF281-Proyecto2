import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
    nombre: '',
    apellido: '',
    ci: '',
    fechaNac: ''
  };
  constructor(
    public authenticacionService: AuthenticationService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.habilitado = false;
    this.spinner.show();
    this.userService.obtenerDatos({ idUsuario: this.authenticacionService.getUser() }).subscribe(
      (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.datos = data[0];
        this.datos['fechaNac'] = this.userService.toDate(this.datos['fechaNac'])
      })
    
  }
  habilitarForm(){
    this.habilitado = true;
  }
  deshabilitarForm(){
    this.habilitado = false;
  }
}
