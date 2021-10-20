import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
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
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
