import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/data/user.service';

@Component({
  selector: 'app-panel-proyectos',
  templateUrl: './panel-proyectos.component.html',
  styleUrls: ['./panel-proyectos.component.css']
})
export class PanelProyectosComponent implements OnInit {

  proyectos: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    
    this.userService.obtenerProyectosRegistradosGet().subscribe(
      (data: any) => {
        console.log(data)
        this.proyectos = data;
        this.spinner.hide();
      })
  }


}
