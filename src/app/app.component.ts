import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FACO';
  //find a better alternative for 
  isLoggedIn = true           //
  //this
  isCollapsed = false;
}
