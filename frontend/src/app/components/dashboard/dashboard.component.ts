import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/data/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  listProyectos: any = [];
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
    this.userService.obtenerProyectosRegistrados({"idUsuario":this.authService.getUser()}).subscribe(
      (data:any)=>{
        this.spinner.hide();
        console.log(data)
        this.listProyectos = data;
      }
    )
  }
  decode(data){
    return atob(data);
  }




}
