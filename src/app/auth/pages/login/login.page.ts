import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  private readonly navController = inject(NavController);
  private authService = inject(AuthService);

  isToastOpen: boolean = false;
  error: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('jsebguevara@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Js 1005839965', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() {}

  login() {
    if (!this.loginForm.valid) {
      console.log('Invalid Form');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.navController.navigateRoot('/home');
      },
      error: (err) => {
        this.error = err;
        if (!this.isToastOpen) {
          this.setOpen(true);
        }
      },
    });
  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
