import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorLogin = false;
  sinRoles = false;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
  }

  handleLogin() {
    this.sinRoles = false;
    this.errorLogin = false;

    this.authenticationService.authenticate(this.username, this.password)
      .subscribe(
        (response) => {
          console.log('======================response======================');
          console.log(response);
          console.log('====================================================');
          if (!this.authenticationService.isRole('ROLE_USER')) {

            this.router.navigate(['welcome']);
          } else {
            this.authenticationService.logout();
            this.sinRoles = true;
            // this.captchaRef.reset();
          }
        },
        error => {
          this.errorLogin = true;
          // this.captchaRef.reset();
        }
      );
  }

}
