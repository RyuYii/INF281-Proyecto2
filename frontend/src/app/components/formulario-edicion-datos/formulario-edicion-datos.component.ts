import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/data/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-formulario-edicion-datos',
  templateUrl: './formulario-edicion-datos.component.html',
  styleUrls: ['./formulario-edicion-datos.component.css']
})
export class FormularioEdicionDatosComponent implements OnInit {

  @Input()
  datosP: Object;

  changeData: boolean;
  changePass: boolean;
  registerForm: FormGroup;
  newPassForm: FormGroup;
  public modalRef: BsModalRef;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private authenticateService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private miDatePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.changeData = false;
    this.changePass = false;
    this.registerForm = this.formBuilder.group({
      nombres: [this.datosP['nombre']],
      apellidos: [this.datosP['apellido']],
      fechaNac: [this.datosP['fechaNac']],
      ci: [this.datosP['ci']]
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

  formatearFecha2(fecha: string) {
    const fechaArray: any[] = fecha.split(/[\/\s\:]/g);
    const fechaFormateadaa: any = this.miDatePipe.transform(fecha, 'yyyy-MM-dd');
    // Pasamos la fecha Date
    const date = new Date(fechaArray[2], fechaArray[1] - 1,
      fechaArray[0], fechaArray[3], fechaArray[4], fechaArray[5]);

    const fechaFormateada = this.miDatePipe.transform(date, 'yyyy-MM-dd');

    return `${fechaFormateada} ${fecha.split(/[\s]/g)[1]}-00`;
  }
  get form() {
    return this.registerForm.controls;
  }
  get form1(){
    return this.newPassForm.controls;
  }
  onSubmit() {    

    const initialState = {
      text: '¿Desea realizar la actualizacion de datos?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.spinner.show();
        let obj: any = this.registerForm.value;
        obj['idUsuario'] = this.authenticateService.getUser();
        console.log(obj);
        
        this.userService.changeDatosPersonales(obj).subscribe(
          (data: any) => {
            this.spinner.hide();
            console.log(data, 'fasdfsaf');
            if (data.code === 1){
              this.toastr.success(data.message);
              this.router.navigate(['welcome']);
            }
            else
              this.toastr.warning(data.message);
            this.modalService.hide(1)
          }
        )
        
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
        obj['idUsuario'] = this.authenticateService.getUser();
        console.log(obj);
        
        this.userService.changePassword(obj).subscribe(
          (data: any) => {
            this.spinner.hide();
            if (data.code === 1){
              this.toastr.success(data.message);
              this.router.navigate(['welcome']);
              }
            else
              this.toastr.warning(data.message);
            this.modalService.hide(1)
          }
        ) 
      }
      else {
        console.log('terminate')
      }
    })

  }
}
