import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from './../authentication/authentication.service';
import { finalize, catchError, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { LoaderHandlerService } from './loader-handler.service';

@Injectable({
  providedIn: 'root'
})
export class IntercepterRequestService implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private errorHandlerService: ErrorHandlerService,
    private loader: LoaderHandlerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // console.log("Comenzando");
    // this.loader.load();
    const token = this.authenticationService.getAuthenticatedToken();
    this
    if (token) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+token // ⬅⬅⬅ authorization token
        } 
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // this.loader.stop();
        console.log(error);
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          console.log('this is client side error');
          errorMsg = `Error: ${error.error.message}`;
        }
        else {
          console.log(error);

          console.log('this is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.error.message} ${error}`;
        }
        console.log(errorMsg);
        this.spinner.hide();                
        if (error.error.trace && error.error.trace.includes('SibsoException')) {
          this.errorHandlerService.openModalWithComponent('Restriccion', error.error.message);
        } else {
          if(error.error.message)
            this.errorHandlerService.openModalWithComponent('Error del Sistema', error.error.message);
            else
            this.errorHandlerService.openModalWithComponent('Error del Sistema', 'Error de Servidor');
        }
        
        return throwError(errorMsg);
      }
      )).pipe(map((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          // this.loader.stop();
          // console.log("Finalizando");
        }
        return evt;
      }));
  }
} 