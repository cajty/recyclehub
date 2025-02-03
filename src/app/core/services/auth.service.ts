import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(email: string, password: string) {
    if (this.isCollector()) {
      this.router.navigate(['/collector/available-collections']);
    } else {
      this.router.navigate(['/collection']);
    }
  }

  isCollector(): boolean {
    // that logic using that if user is login
    return true;
  }
}
