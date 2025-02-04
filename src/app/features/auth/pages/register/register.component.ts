// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';


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

 constructor(private fb: FormBuilder, private authService: AuthService) {}

 ngOnInit() {
   this.registerForm = this.fb.group({
     email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required, Validators.minLength(6)]],
     firstName: ['', [Validators.required, Validators.minLength(2)]],
     lastName: ['', [Validators.required, Validators.minLength(2)]],
     address: this.fb.group({
       street: ['', Validators.required],
       city: ['', Validators.required],
       zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
     }),
     phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
     const userData = {
       ...this.registerForm.value,
       userType: 'individual',
       points: 0
     };
     this.authService.register(userData).subscribe({
       next: (response) => {
         console.log('Registration successful', response);
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
     if (control instanceof FormGroup) {
       this.markFormGroupTouched(control);
     }
   });
 }

 getErrorMessage(controlName: string): string {
   const control = this.registerForm.get(controlName);
   if (control?.hasError('required')) return 'This field is required';
   if (control?.hasError('email')) return 'Invalid email format';
   if (control?.hasError('minlength')) return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
   if (control?.hasError('pattern')) {
     if (controlName === 'phone') return 'Invalid phone number format';
     if (controlName === 'address.zipCode') return 'Invalid zip code format';
   }
   return '';
 }
}
