import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/shared/login/login.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ConfirmModalComponent } from './components/modal/confirm-modal/confirm-modal.component';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule } from 'ngx-bootstrap/modal';

import { IntercepterRequestService } from './services/util/intercepter-request.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormularioProyectoComponent } from './components/formulario-proyecto/formulario-proyecto.component';
import { FormularioRegistroComponent } from './components/formulario-registro/formulario-registro.component';
import { AboutComponent } from './components/about/about.component';
import { AdminComponent } from './components/admin/admin.component';
import { FormularioEdicionDatosComponent } from './components/formulario-edicion-datos/formulario-edicion-datos.component';
import { FormularioEdicionProyectoComponent } from './components/formulario-edicion-proyecto/formulario-edicion-proyecto.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { PanelProyectosComponent } from './components/panel-proyectos/panel-proyectos.component';


import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { FileUploadModule } from 'ng2-file-upload';
import { BadgeComponent } from './components/elements/badge/badge.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    ConfirmModalComponent,
    PerfilComponent,
    DashboardComponent,
    FormularioProyectoComponent,
    FormularioRegistroComponent,
    AboutComponent,
    AdminComponent,
    FormularioEdicionDatosComponent,
    FormularioEdicionProyectoComponent,
    ProyectoComponent,
    PanelProyectosComponent,
    BadgeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule,
    ModalModule.forRoot(),
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AutoCompleteModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    Ng2SearchPipeModule,
    CloudinaryModule.forRoot({Cloudinary}, { 
      cloud_name: 'djkhinfbr' ,
      api_key: '953777888978946',
      api_secret: '8Nxm-ZvHpCvOpneRRb2SrEajSVU',
      upload_preset: 'xvcritvd'
    } as CloudinaryConfiguration),
  ],
  providers: [
    DatePipe,
    BnNgIdleService,
    {
      provide: LOCALE_ID,
      useValue: 'es-BO',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IntercepterRequestService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
