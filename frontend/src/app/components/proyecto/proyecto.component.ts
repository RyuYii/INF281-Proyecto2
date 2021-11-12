import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/data/user.service';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit {

  @Input() idProyecto: number;
  idProy:any;
  proyecto: any;
  actividades: any = [];
  productos: any = [];
  patrocinadores: any = [];
  comentarios: any = [];

  tipoProyecto: boolean;
  admin: boolean;
  user: any;

  newProyectForm: FormGroup;
  newAct: FormGroup;
  newProd: FormGroup;
  newPat: FormGroup;
  newComment: FormGroup;

  public modalForm: BsModalRef;
  public modalRef: BsModalRef;

  constructor(
    private rutaActiva: ActivatedRoute,
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private Auth:AuthenticationService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = this.Auth.getUser()
    if(this.rutaActiva.snapshot.params.idProyecto){
      this.idProy = this.rutaActiva.snapshot.params.idProyecto;
      this.admin=false;
    }
    if(this.idProyecto){
      this.idProy = this.idProyecto;
      this.admin =true
    }
    this.spinner.show();
    this.obtenerProyecto();
    this.obtenerComentarios();
    this.obtenerPatrocinador();
    this.setForm();

  }
  decode(data){
    return atob(data);
  }
  setForm(){
    this.newAct = this.formBuilder.group({
      title: [''],
      desc:[''],
      horario:['']
    })
    this.newProd = this.formBuilder.group({
      title: [''],
      desc:[''],
      precio:[0]
    })
    this.newComment = this.formBuilder.group({
      comentario: [''],
    })
    
  }

  get form1(){
    return this.newProyectForm.controls;
  }
  obtenerProyecto(){
    this.spinner.show();
    console.log(this.idProy)
    let obj = {"idProy" : this.idProy}
    this.userService.obtenerProyecto(obj).subscribe(
      (data:any) =>{
        console.log(data)
        if (data.length == 0){
          this.router.navigate(['welcome']);
          this.spinner.hide()
          return
        }
        this.proyecto = data[0];
        this.tipoProyecto = data[0].tipoProy == 3 || data[0].tipoProy == 1;

        if(this.tipoProyecto){
          this.userService.obtenerActividades(obj).subscribe(
            (result:any)=>{
              this.spinner.hide();
              console.log(result)
              this.actividades = result;
            }
          )
        }
        else{
          // tipo de proyecto 2 productos
          this.userService.obtenerProductos(obj).subscribe(
            (result:any)=>{
              this.spinner.hide();
              console.log(result)
              this.productos = result;
            }
          )
        }
      }
    );
  }

  obtenerComentarios(){
    this.userService.listarComentariosProyecto({"idProy": this.idProy}).subscribe(
      (data : any) => {
        console.log(data, "#####");
        this.comentarios = data;
      }
    )
  }
  eliminarComentario(idcomentario:any){
    this.userService.eliminarComentario({'idComentario':idcomentario}).subscribe(
      (data:any)=>{
        this.toast.info(data.message)
      }
    )
  }
  enviarComentario(){
    if(this.Auth.isAuthenticated()){

      let obj = this.newComment.value;
      obj["idProy"] = this.idProy;
      obj["idUsuario"] = this.Auth.getUser();
      this.userService.registrarComentario(obj).subscribe(
        (data:any) => {
          this.toast.info(data.message)
          this.obtenerComentarios()
        }
        )
    }else{
      this.toast.info("Para comentar debe iniciar sesion")
    }
  }
  get formCom(){
    return this.newComment.controls;
  }


  EditarActividad(){
    const initialState = {
      text: '¿Esta segur@ de modificar la actividad?'
    };
    this.modalForm.hide();
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        let obj = this.newAct.value
        console.log(obj)
        this.userService.editarActividad(obj).subscribe((data:any)=>{
          this.obtenerProyecto()
          this.toast.info(data.message)
        })
      }
      else {
        console.log('terminate')
      }
    })

  }
  EliminarActividad(idActividad){
    const initialState = {
      text: 'Una vez eliminado no hay vuelta atras, ni podra agregar otra \n¿Esta segur@ de eliminar?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        console.log({"idActividad":idActividad})
        this.userService.eliminarActividad({"idActividad":idActividad}).subscribe((data:any)=>{
          this.obtenerProyecto()
          this.toast.info(data.message)
        })
      }
      else {
        console.log('terminate')
      }
    })
  }

  edtitarProducto(){
    const initialState = {
      text: '¿Esta segur@ de modificar el producto?'
    };
    this.modalForm.hide();
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        let obj = this.newProd.value
        console.log(obj)
        this.userService.editarProductos(obj).subscribe((data:any)=>{
          this.obtenerProyecto()
          this.toast.info(data.message)
        })
      }
      else {
        console.log('terminate')
      }
    })

  }
  EliminarProducto(idCat){
    const initialState = {
      text: 'Una vez eliminado no hay vuelta atras, ni podra agregar otra \n¿Esta segur@ de eliminar?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        console.log({"idCat":idCat})
        this.userService.eliminarProducto({"idCat":idCat}).subscribe((data:any)=>{
          this.obtenerProyecto()
          this.toast.info(data.message)
        })
      }
      else {
        console.log('terminate')
      }
    })
  }

  obtenerPatrocinador(){
    this.userService.obtenerPatrocinadoresProyecto({"idProy": this.idProy}).subscribe((data:any)=>{
      this.patrocinadores = data;
    })
  }

  editarProyecto(){

    const initialState = {
      text: '¿Esta segur@ de modificar los datos del proyecto?'
    };
    this.modalForm.hide();
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        let obj = this.newProyectForm.value
        console.log(obj)
        this.userService.editarProyecto(obj).subscribe((data:any)=>{
          this.obtenerProyecto()
          this.toast.info(data.message)
        })
      }
      else {
        console.log('terminate')
      }
    })
  }

  openModalFormActividades(template: TemplateRef<any>, tipoForm,item ) {
    let obj:any;
    if (tipoForm == 1) {
      obj = item
      this.newAct = this.formBuilder.group({
        title: [obj.nombreActividad],
        desc:[obj.descripcion],
        horario:[obj.horario],
        idActividad: [obj.idActividad]
      })
    } else if(tipoForm ==2) {
      obj = item
      this.newProd = this.formBuilder.group({
        title: [obj.nombreProd],
        desc:[obj.descripcion],
        precio:[obj.precio],
        idCat:[obj.idCat]
      })
    } else {//tirpo form 3
      obj = this.proyecto
      this.newProyectForm = this.formBuilder.group({
        titulo: [obj.tituloProy, Validators.required],
        objetivo: [obj.objetivos, Validators.required],
        mision: [obj.mision, Validators.required],
        vision: [obj.vision, Validators.required],
        descripcionProy: [obj.descripcionProy, Validators.required],
        fechaInicio: [this.userService.toDate(obj.fechaInicio)],
        fechaFinal: [this.userService.toDate(obj.fechaCierre)],
        idProy: [obj.idProy]
      });
    }
    this.modalForm = this.modalService.show(template, {class: 'modal-dialog modal-dialog-centered'});
  }
}
