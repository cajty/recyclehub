import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      // Handle specific JSON Server errors
      if (error.status === 404) {
        errorMessage = 'Resource not found';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }



  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

 getUserByEmail(email: string): Observable<User> {
  const params = new HttpParams().set('email', email);
  return this.http.get<User[]>(`${this.apiUrl}`, { params })
    .pipe(
      map(users => users[0]), // Return the first user from the array
      catchError(this.handleError)
    );
}

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateUserPoints(id: string, points: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { points })
      .pipe(catchError(this.handleError));
  }

  getCollectorsByCity(city: string): Observable<User[]> {
    // JSON Server query parameters
    const params = new HttpParams()
      .set('userType', 'collector')
      .set('q', city); // JSON Server full-text search

    return this.http.get<User[]>(this.apiUrl, { params })
      .pipe(
        map(users => users.filter(user =>
          user.address?.toLowerCase().includes(city.toLowerCase())
        )),
        catchError(this.handleError)
      );
  }
}
