import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';


interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class LoginComponent {
  loginData: LoginData = {
    email: '',
    password: ''
  };
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.authService.login(this.loginData.email, this.loginData.password)
        .subscribe({
          next: (user) => {
            localStorage.setItem('user-idl', user.email);
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            this.errorMessage = 'Invalid email or password';
            console.error('Login error:', error);
          }
        });
    } else {
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
