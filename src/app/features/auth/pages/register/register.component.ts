import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import type { User } from "../../../../models/user.model";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: ['', Validators.required],
      profilePicture: ['']
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        this.registerForm.patchValue({
          profilePicture: file
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;


      const userData: User = {
        id: crypto.randomUUID(), // Generate a unique ID
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        profilePicture: this.selectedImage || '',
        userType: "user",
        balance: 0,
        points: 0
      };

      this.authService.register(userData).subscribe({
        next: (user) => {
           localStorage.setItem('user-id', user.id);
            this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }




  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Must be at least ${minLength} characters`;
    }

    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'phoneNumber':
          return 'Please enter a valid 10-digit phone number';
        default:
          return 'Invalid format';
      }
    }

    return '';
  }
}
