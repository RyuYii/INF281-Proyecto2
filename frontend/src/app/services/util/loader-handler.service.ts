import { Injectable, Component, OnInit } from '@angular/core';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderHandlerService {

  constructor(private spinner: NgxSpinnerService) { }

  load() {
      this.spinner.show();
  }
  stop() {
    this.spinner.show();
}
}


// @Component({
//   selector: 'modal-content',
//   template: `
//   <ngx-spinner bdColor="rgba(60, 55, 52, 0.84)" color="rgba(246, 198, 115, 1)" type="ball-circus">
//   <p style="font-size: 20px; color: rgba(246, 198, 115, 1)">
//     Buscando registros en nuestros sistemas<br>
//     Por favor aguarde
//   </p>
// </ngx-spinner>

//   `
// })

// export class ModalContentComponent implements OnInit {
//   title: string;
//   closeBtnName: string;
//   list: any[] = [];
//   message: string

//   constructor(private spinner: NgxSpinner) { }

//   ngOnInit() {

//   }
// }