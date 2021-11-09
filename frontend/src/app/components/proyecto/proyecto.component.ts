import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/data/user.service';

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

  constructor(
    private rutaActiva: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    if(this.rutaActiva.snapshot.params.idProyecto)
      this.idProy = this.rutaActiva.snapshot.params.idProyecto;
    if(this.idProyecto)
      this.idProy = this.idProyecto;
    console.log(this.idProy)
    let obj = {"idProy" : this.idProy}
    this.spinner.show();
    this.userService.obtenerProyecto(obj).subscribe(
      (data:any) =>{
        console.log(data)
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
    this.obtenerComentarios();

  }
  decode(data){
    return atob(data);
  }

  obtenerComentarios(){
    this.userService.listarComentariosProyecto({"idProy": this.idProy}).subscribe(
      (data : any) => {
        console.log(data, "#####");
        this.comentarios = data;
      }
    )
  }

}
