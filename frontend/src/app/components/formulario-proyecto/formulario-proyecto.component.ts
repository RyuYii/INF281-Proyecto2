import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-formulario-proyecto',
  templateUrl: './formulario-proyecto.component.html',
  styleUrls: ['./formulario-proyecto.component.css']
})
export class FormularioProyectoComponent implements OnInit {

  newProyectForm: FormGroup;
  newAct: FormGroup;
  newProd: FormGroup;
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


  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.newProyectForm = this.formBuilder.group({
      titulo: [''],
      objetivo: [''],
      mision: [''],
      vision: [''],
      tipo: [''],
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
      text: '¿Desea cambiar la contraseña'
    };
    this.modalRef = this.modalService.show(ConfirmModalComponent, {initialState});
    this.modalRef.content.onClose.subscribe(result => {
      if (result) {
        //this.spinner.show();
        let obj: any = this.newProyectForm.value;
        if(obj.tipo == 1){
          obj["listado"] = this.listaActividadesCulturales
        }
        if(obj.tipo == 2){  
          obj["listado"] = this.listaProductos
        }
        if(obj.tipo == 3){
          obj["listado"] = this.listaActividadesBeneficas
        }
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
}
