import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  test: Date = new Date();
  
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
