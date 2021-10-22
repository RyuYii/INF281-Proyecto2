import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { esLocale } from 'ngx-bootstrap/locale';
import { BnNgIdleService } from 'bn-ng-idle';
import { RouterLink, Router } from '@angular/router';
import { Subject, Subscriber, Subscribable, Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './services/authentication/authentication.service';
import { defineLocale } from 'ngx-bootstrap/chronos';


declare var $: any;
defineLocale('es', esLocale);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  queries: {
    contentRef: new ViewChild("sesionTemplate")
  },
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit {
  @ViewChild('sesionTemplate') sesionTemplate: ElementRef;
  
  modalRefPrincipal: BsModalRef;
  title = 'front';
  sesion = false;
  abierto = false;
  tiempo = 10;
  intervalos: any;
  controlaSesionSubscrib: Subscription;
  constructor(
    private bnIdle: BnNgIdleService,

    private modalService: BsModalService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.controlaSesion();
  }

  controlaSesion() {
    //600
    this.correrSesion();
  }
  correrSesion(){
    this.controlaSesionSubscrib = this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {

      if (isTimedOut && !this.abierto && this.authenticationService.isAuthenticated()) {        
        
        this.sesion = true;
        this.modalRefPrincipal = this.modalService.show(this.sesionTemplate,
          {
            ignoreBackdropClick: true,
            keyboard: false
          }

        );
        this.abierto = true;
        if (this.tiempo)
          this.intervalos = setInterval(() => {
            this.bnIdle.stopTimer();
            if (this.tiempo > 0)
              this.tiempo--;
            else {

              clearInterval(this.intervalos);
              this.finalizarSesion();
              this.tiempo = 10;
            }

          }, 1000);
      }


    });
  }
  continuar() {
    this.controlaSesionSubscrib.unsubscribe();
    this.correrSesion();
    this.tiempo = 10;
    clearInterval(this.intervalos);
    this.modalRefPrincipal.hide();
    this.abierto = false;
  }

  finalizarSesion() {
    this.continuar();    
    this.modalService.hide(1);
    this.bnIdle.resetTimer();    
    this.authenticationService.logout();        
    this.router.navigate(['ingreso']);
    
  }
}

