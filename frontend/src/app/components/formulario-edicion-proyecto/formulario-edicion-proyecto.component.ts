import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-formulario-edicion-proyecto',
  templateUrl: './formulario-edicion-proyecto.component.html',
  styleUrls: ['./formulario-edicion-proyecto.component.css']
})
export class FormularioEdicionProyectoComponent implements OnInit {

  changeData: boolean;
  changePass: boolean;
  registerForm: FormGroup;
  newPassForm: FormGroup;
  public modalRef: BsModalRef;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.changeData = false;
    this.changePass = false;
    this.registerForm = this.formBuilder.group({
      nombres: [''],
      apellidos: [''],
      fechaNac: ['']
    });
    this.newPassForm = this.formBuilder.group({
      password: ['', Validators.required],
      newpassword: ['',Validators.required]
    })
  }
  habilitarCambioPassword(){
    this.changeData = false;
    this.changePass = true;
  }
  habilitarCambioDatos(){
    this.changeData = true;
    this.changePass = false;
  }

  get form() {
    return this.registerForm.controls;
  }
  get form1(){
    return this.newPassForm.controls;
  }
  onSubmit() {    

    const initialState = {
      text: '¿Desea realizar el registro?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        //this.spinner.show();
        let obj: any = this.registerForm.value;
        console.log(obj);
        //obj.idEntidadBancaria = parseInt(obj.idEntidadBancaria);
        /*
        this.busquedaService.RegistrarPersonaCuentaBancaria(obj).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.code === 1)
              this.toastr.success(data.message);
            else
              this.toastr.warning(data.message);
            this.modalService.hide(1)
            this.seleccionaroPersona();
          }
        )
        */
      }
      else {
        console.log('terminate')
      }
    })
  }
  onSubmit1(){
    const initialState = {
      text: '¿Desea cambiar la contraseña'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        //this.spinner.show();
        let obj: any = this.newPassForm.value;
        console.log(obj);
        //obj.idEntidadBancaria = parseInt(obj.idEntidadBancaria);
        /*
        this.busquedaService.RegistrarPersonaCuentaBancaria(obj).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.code === 1)
              this.toastr.success(data.message);
            else
              this.toastr.warning(data.message);
            this.modalService.hide(1)
            this.seleccionaroPersona();
          }
        )
        */
      }
      else {
        console.log('terminate')
      }
    })

  }
}
