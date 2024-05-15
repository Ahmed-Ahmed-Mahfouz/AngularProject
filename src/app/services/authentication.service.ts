import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/logins';
import { Register } from '../models/register';
import { Observable } from 'rxjs';
import { JwtAuth } from '../models/jwtAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  baseURL: string = 'http://localhost:8454/api/AuthManagement';
  get role(): string {
    return localStorage.getItem('role') ?? '';
  }

  get userName(): string {
    return localStorage.getItem('userName') ?? '';
  }

  constructor(private http: HttpClient) {}

  public register(user: Register): Observable<JwtAuth> {
    return this.http.post<JwtAuth>(this.baseURL + '/register', user);
  }

  public login(user: Login): Observable<JwtAuth> {
    return this.http.post<JwtAuth>(this.baseURL + '/login', user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
