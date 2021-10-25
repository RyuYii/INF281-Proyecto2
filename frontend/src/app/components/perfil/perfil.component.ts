import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  habilitado:boolean;
  constructor() { }

  ngOnInit(): void {
    this.habilitado = false;
  }
  habilitarForm(){
    this.habilitado = true;
  }
  deshabilitarForm(){
    this.habilitado = false;
  }
}
