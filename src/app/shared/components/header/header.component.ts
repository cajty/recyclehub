import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../core/services/auth.service';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent {
  isMenuOpen = false

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  logout() {
    this.authService.logout()
    this.isMenuOpen = false
  }

  isLoggedIn() {
    return this.authService.isLoggedIn()
  }
}

