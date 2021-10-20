import { Component, OnInit } from '@angular/core';
import { RootService } from 'src/app/services/data/root.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private rootService: RootService
  ) { }

  ngOnInit(): void {
  }
  mensajes() {        
    this.rootService.mensajes().subscribe(
      (data: any) => {
        console.log(data);
      }
    )
  }
}
