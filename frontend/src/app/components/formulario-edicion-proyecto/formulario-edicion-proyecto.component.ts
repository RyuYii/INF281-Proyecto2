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

  constructor() { }

  ngOnInit(): void {
  }
}
