import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<User> {
    const params = new HttpParams().set('email', email);
    return this.http.get<User[]>(`${this.apiUrl}/users`, { params }).pipe(
      map(users => {
        const user = users[0];
        if (user?.password === password) {
          return user;
        }
        throw new Error('Invalid credentials');
      })
    );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, userData).pipe(
      map(user => {
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-type');
    this.router.navigate(['/user/login']);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user-id');
  }
  logingSuccess(id: string, type: string ): void {
      localStorage.setItem('user-id', id);
      localStorage.setItem('user-type', type);
      this.router.navigate(['/profile']);
  }

}
