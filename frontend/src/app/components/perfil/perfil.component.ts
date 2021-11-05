import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  public modalForm: BsModalRef;
  newProd: FormGroup;
  constructor(
    public authenticacionService: AuthenticationService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService
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
  solicitarUsuarioGerencial(template: TemplateRef<any>) {
    this.newProd = this.formBuilder.group({
      motivo: ['']
    })
    this.modalForm = this.modalService.show(template, {class: 'modal-sm'});
  }
  realizarSolicitud(){
    console.log(this.newProd.value)
    this.spinner.show();
    let obj: any = this.newProd.value;
    obj["idUsuario"] = this.authenticacionService.getUser();
    obj.idEntidadBancaria = parseInt(obj.idEntidadBancaria);
        
        this.userService.registrarSolicitud(obj).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.code === 1)
              this.toastr.success(data.message);
            else
              this.toastr.warning(data.message);
            this.modalService.hide(1)
            this.modalForm.hide();
          }
        )
  }
}
