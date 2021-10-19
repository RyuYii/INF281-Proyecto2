import { Injectable, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }


  openModalWithComponent(title: string,message: string) {
    const initialState = {
      
      title: title,
      message: message,
    };
    this.bsModalRef = this.modalService.show(ModalContentComponent, { initialState, class: 'modal-dialog-centered modal-md', ignoreBackdropClick: true,  });
    this.bsModalRef.content.closeBtnName = 'Cerrar';
  }
}

@Component({
  selector: 'modal-content',
  template: `
    <div class="modal-header modal-header-danger">
      <h1 class="modal-title pull-left"><i class="fas fa-exclamation-triangle"></i>{{title}}</h1>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <div class="alert alert-danger" role="alert">
    {{message}}
    
  </div>
    </div>
    <div class="modal-footer">
      
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">{{closeBtnName}}</button>
    </div>
  `
})

export class ModalContentComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  message: string

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {

  }
}