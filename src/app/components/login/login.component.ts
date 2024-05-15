import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Login } from '../../models/logins';
import { JwtAuth } from '../../models/jwtAuth';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../models/jwt-payload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('(?=.*[0-9])(?=.*[A-Z])(?=.*[^A-Za-z0-9_]).*'),
      ],
    ],
  });

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  login(): void {
    if (this.loginForm.valid) {
      const user: Login = this.loginForm.value;
      this.authService.login(user).subscribe(
        (jwtAuth: JwtAuth) => {
          if (jwtAuth.result) {
            // Store the JWT token and role in local storage
            localStorage.setItem('token', jwtAuth.token);
            localStorage.setItem('userName', jwtAuth.userName);
            const decoded: JwtPayload = jwtDecode(jwtAuth.token);
            const role = decoded.role;
            localStorage.setItem('role', role);
            Swal.fire({
              icon: 'success',
              title: 'Login successful',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/']);
          } else {
            // Handle login error
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              text: 'Please check your inputs and try again.',
            });
          }
        },
        (error) => {
          console.error('Error occurred during login', error);
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Please check your inputs and try again.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid form',
        text: 'Please fill out the form correctly before submitting.',
      });
    }
  }
}
