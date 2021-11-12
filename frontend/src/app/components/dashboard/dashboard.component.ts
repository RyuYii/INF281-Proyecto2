import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/data/user.service';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  listProyectos: any = [];
  public modalRef: BsModalRef;
  constructor(
    private userService: UserService,
    private toastr : ToastrService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.obtenerProyectos();
  }
  decode(data){
    return atob(data);
  }
  obtenerProyectos(){
    this.userService.obtenerProyectosRegistrados({"idUsuario":this.authService.getUser()}).subscribe(
      (data:any)=>{
        this.spinner.hide();
        console.log(data)
        this.listProyectos = data;
      }
    )
  }

  EliminarProyecto(idProy){
    const initialState = {
      text: 'Una vez eliminado no hay vuelta atras, ni podra agregar otra \n¿Esta segur@ de eliminar?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.spinner.show()
        console.log({"idProy":idProy})
        this.userService.eliminarProyecto({"idProy":idProy}).subscribe((data:any)=>{
          this.obtenerProyectos()
          this.toastr.info(data.message)
          this.spinner.hide()
        })
      }
      else {
        console.log('terminate')
      }
    })
  }

}
