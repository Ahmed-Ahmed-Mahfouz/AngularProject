import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
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
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (data) => {
          console.log('Registration successful');
          Swal.fire({
            icon: 'success',
            title: 'Registration successful',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error occurred during registration', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration failed',
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
