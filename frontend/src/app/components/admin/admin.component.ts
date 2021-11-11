import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RootService } from 'src/app/services/data/root.service';
import { UserService } from 'src/app/services/data/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public modalRef: BsModalRef;

  listSolicitudes: any = [];
  listProyectosEnEspera: any = [];
  idProyectoSeleccionado: any;
  listComentarios: any = [];
  constructor(
    private rootService: RootService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.spinner.show()
    this.obtenerProyectosEnEspera();
    this.obtenerSolicitudes();
    this.obtenerComentarios();
  }
  obtenerSolicitudes() {
    this.rootService.obtenerSolicitudes().subscribe(
      (data: any) => {
        this.spinner.hide()
        this.listSolicitudes = data;
      })
  }
  obtenerProyectosEnEspera() {
    this.rootService.obtenerProyectosEnEspera().subscribe(
      (data: any) => {
        this.spinner.hide()
        this.listProyectosEnEspera = data;
      }
    )
  }
  obtenerComentarios() {
    this.rootService.obtenerComentarios().subscribe(
      (data: any) => {
        this.spinner.hide()
        this.listComentarios = data;
      }
    )
  }

  retirarComentario(idComentario:number){
    this.spinner.show()
    this.userService.eliminarComentario({"idComentario": idComentario}).subscribe(
      (data:any) => {
        console.log(data)
        this.toastr.info(data.message)
        this.obtenerComentarios()
      }
    )
  }
  decode(data) {
    return atob(data);
  }

  aceptarSolicitud(idUsuario: number) {
    this.spinner.show()
    let body: Object = { "idUsuario": idUsuario }
    this.rootService.aceptarSolicitud(body).subscribe(
      (data: any) => {
        if (data.code === 1) {
          this.toastr.success(data.message);
          this.obtenerSolicitudes();
        }
        else
          this.toastr.warning(data.message);
      }
    )
  }
  valorarProyecto(idProy: number, nota: number) {
    this.spinner.show()
    this.rootService.valorarProyecto({"idProy": idProy,"nota":nota}).subscribe(
      (data:any)=>{
        if (data.code === 1) {
          this.toastr.success(data.message);
          this.obtenerProyectosEnEspera();
          this.cerrarModal()
        }
        else
          this.toastr.warning(data.message);
      }
    )
  }

  openModalProyect(template: TemplateRef<any>, idProy: number) {
    this.idProyectoSeleccionado = idProy;
    this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog modal-dialog-centered modal-dialog-scrollable' });
  }
  cerrarModal() {
    this.idProyectoSeleccionado = 0;
    this.modalService.hide(1)
  }
}
