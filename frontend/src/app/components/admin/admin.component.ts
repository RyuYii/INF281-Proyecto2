import { Component, OnInit } from '@angular/core';
import { RootService } from 'src/app/services/data/root.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  listSolicitudes:any;
  listProyectosEnEspera:any;
  constructor(
    private rootService: RootService
  ) { }

  ngOnInit(): void {
    this.rootService.obtenerSolicitudes().subscribe(
      (data:any)=> {
        this.listSolicitudes = data;
        console.log(data)
      })
    this.rootService.obtenerProyectosEnEspera().subscribe(
      (data: any)=>{
        this.listProyectosEnEspera = data;
      }
    )
  }

  decode(data){
    return atob(data);
  }
  aceptarSolicitud(idUsuario: number){
    let body: Object = {"idUsuario":idUsuario}
    this.rootService.aceptarSolicitud(body).subscribe(
      (data: any) => {
        console.log(data)
      }
    )
  }

}
