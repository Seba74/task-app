import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class RegisterPage implements OnInit {
  private readonly navController = inject(NavController);
  private authService = inject(AuthService);

  isToastOpen: boolean = false;
  error: string = '';

  checkPasswords: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const password2 = control.get('password2');

    //Comprobamos unicamente
    return password && password2 && password.value !== password2.value
      ? { passwordCoincide: false }
      : null;
  };

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password2: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    [this.checkPasswords]
  );

  ngOnInit() {}

  register() {
    if (!this.registerForm.valid) {
      console.log('Invalid Form');
      return;
    }
    this.registerForm.removeControl('password2');
    const { name, lastname, username, email, password } =
      this.registerForm.value;
    this.authService
      .register(name, lastname, username, email, password)
      .subscribe({
        next: () => {
          this.navController.navigateRoot('/home');
        },
        error: (err) => {
          console.log(err);
          this.error = err.message;
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
