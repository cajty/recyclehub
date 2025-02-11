import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/components/header/header.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {UserService} from './core/services/user.service';
import {ErrorToastComponent} from './shared/components/error-toast/error-toast.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
    imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,



  ],
})

export class AppComponent  {
  title = 'recyclehub';

}
