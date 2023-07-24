import {
  Component,
  EnvironmentInjector,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  IonLoading,
  IonicModule,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  private authService = inject(AuthService);
  private navController = inject(NavController);
  public environmentInjector = inject(EnvironmentInjector);
  public loadingController = inject(LoadingController);
  public loading!: HTMLIonLoadingElement;

  public authIsChecked = computed<boolean>(() => {
    
    if (this.authService.authStatus() === AuthStatus.authenticated) {
      this.navController.navigateRoot('/home');
    } else if (this.authService.authStatus() === AuthStatus.notAuthenticated) {
      this.navController.navigateRoot('/auth/login');
    }else{
      return false;
    }
    return true;
  });

  public authStatusChangedEffect = effect(() => {
    this.showLoading().then(() => {
      if (this.authIsChecked()) {
        this.loading.dismiss();
      }
    });
  });

  async showLoading() {
    this.loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'dots',
      cssClass: 'custom-loading',
    });
    this.loading.present();
  }
}
