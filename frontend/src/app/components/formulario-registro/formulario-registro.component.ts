import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css']
})
export class FormularioRegistroComponent implements OnInit {
  public modalRef: BsModalRef;
  registerForm: FormGroup;
  datosCuenta: any[] = [];
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      ci: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      fechaNac: ['']
    });
  }

  get form() {
    return this.registerForm.controls;
  }
  onSubmit() {    

    const initialState = {
      text: '¿Desea realizar el registro?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.spinner.show();
        let obj: object = this.registerForm.value;
        console.log(obj);
        this.authService.register(obj).subscribe(
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
  onReset() {
    this.router.navigate(['welcome']);
  }
}
