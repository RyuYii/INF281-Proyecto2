import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/data/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-proyecto',
  templateUrl: './formulario-proyecto.component.html',
  styleUrls: ['./formulario-proyecto.component.css']
})
export class FormularioProyectoComponent implements OnInit {

  newProyectForm: FormGroup;
  newAct: FormGroup;
  newProd: FormGroup;
  listaImagenes: any [] = [];
  public modalRef: BsModalRef;
  public modalForm: BsModalRef;
  lista:Object[]=[
    {descripcion: "Cultural", id: 1},
    {descripcion: "Servicio", id: 2},
    {descripcion: "Beneficencia", id: 3},
  ];

  listaActividadesCulturales: Object[] = [];
  listaActividadesBeneficas: Object[] = [];
  listaProductos: Object[] = [];

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  private title: string;
  public imageDataArray;


  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private cloudinary: Cloudinary, 
    private http: HttpClient,
    private authService: AuthenticationService,
    private userService: UserService,
    private spiner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.title = '';
  }

  ngOnInit(): void {

    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/image/upload`,
      autoUpload: false, // Cargar archivos automáticamente al agregarlos a la cola de carga
      isHTML5: true, // Use xhrTransport a favor de iframeTransport
      removeAfterUpload: true, // Calcule el progreso de forma independiente para cada archivo cargado
      headers: [ // XHR request headers
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };

    const upsertResponse = fileItem => {
      // Check if HTTP request was successful
      if (fileItem.status !== 200) {
        console.log('Upload to cloudinary Failed');
        console.log(fileItem);
        return false;
      }
      console.log(fileItem);
      console.log(fileItem.data.url);
      this.listaImagenes.push(fileItem);
    }

    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Agregue el preajuste de carga sin firmar de Cloudinary al formulario de carga
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Usar el valor predeterminado "withCredentials" para las solicitudes CORS
      fileItem.withCredentials = false;
      return { fileItem, form };
    }

    // Actualizar el modelo al finalizar la carga de un archivo
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file, status,
          data: JSON.parse(response),
        }
      );


    this.newProyectForm = this.formBuilder.group({
      titulo: [''],
      objetivo: [''],
      mision: [''],
      vision: [''],
      tipo: [1],
      fechaInicio: [''],
      fechaFinal: ['']
    });
    this.setForm();
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
  }
  get form1(){
    return this.newProyectForm.controls;
  }
  get formAct(){
    return this.newAct.controls;
  }
  get formProd(){
    return this.newProd.controls;
  }
  onSubmit1(){
    const initialState = {
      text: 'El proyecto sera enviado a revision por uno de los administradores \n¿Esta segur@ de enviarlo?'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        this.spiner.show();
        let obj: any = this.newProyectForm.value;
        obj["idUsuario"] = this.authService.getUser()
        if(this.listaImagenes.length != 0)
          obj["banner"] = btoa(this.listaImagenes[0].data.url);
        else
          obj["banner"] = btoa('assets/img/banerDefault.jpg');
        console.log(obj);
        //obj.idEntidadBancaria = parseInt(obj.idEntidadBancaria);
        
        this.userService.registrarProyecto(obj).subscribe(
          (data: any) => {
            this.spiner.hide();
            if (data.code === 1){
              this.toastr.success(data.message);
              this.llenarRecursos(data.idProy, obj["tipo"]);
              this.router.navigate(['dashboard']);
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
  llenarRecursos(idProy:any, tipo:any){
    if(tipo == 1){
      this.listaActividadesCulturales.forEach(
        (item:any)=>{
          item["idProy"] = idProy;
          this.userService.editarActividad(item).subscribe((data:any)=>{
            if(data.code == 0){
              this.toastr.warning(data.message);
              return;
            }
          })
        }
      )
    }
    if(tipo == 2){  
      this.listaProductos.forEach(
        (item:any)=>{
          item["idProy"] = idProy;
          this.userService.editarProductos(item).subscribe((data:any)=>{
            if(data.code == 0){
              this.toastr.warning(data.message);
              return;
            }
          })
        }
      )
    }
    if(tipo == 3){
      this.listaActividadesBeneficas.forEach(
        (item:any)=>{
          item["idProy"] = idProy;
          this.userService.editarActividad(item).subscribe((data:any)=>{
            if(data.code == 0){
              this.toastr.warning(data.message);
              return;
            }
          })
        }
      )
    }
  }


  openModalFormActividades(template: TemplateRef<any>) {
    this.modalForm = this.modalService.show(template, {class: 'modal-sm'});
  }
  decline() {
    this.modalForm.hide();
  }
  eliminarActBen(i:number){
    this.listaActividadesBeneficas.splice(i,1)
  }
  eliminarActCult(i:number){
    this.listaActividadesCulturales.splice(i,1)
  }
  eliminarProdSer(i:number){
    this.listaProductos.splice(i,1)
  }
  agregarActBen(){
    let obj: any = this.newAct.value;
    console.log(obj);
    this.listaActividadesBeneficas.push(obj);
    this.setForm();
    this.modalForm.hide();
  }
  agregarActCult(){
    let obj: any = this.newAct.value;
    console.log(obj);
    this.listaActividadesCulturales.push(obj);
    this.setForm();
    this.modalForm.hide();
  }
  agregarProdSer(){
    let obj: any = this.newProd.value;
    console.log(obj);
    this.listaProductos.push(obj);
    this.setForm();
    this.modalForm.hide();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    console.log(this.hasBaseDropZoneOver);
  }

  deleteImage= function (data: any) { 
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.authService.setTask(0);
    this.http.post(url, body, options).subscribe(response => {
      // Remove deleted item for responses
      this.toastr.success(`Deleted image - ${data.public_id} ${response.result}`);
      this.listaImagenes = [];
      this.authService.setTask(1);
    });
  };
}
