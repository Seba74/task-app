import {
  Component,
  EnvironmentInjector,
  computed,
  effect,
  inject,
} from '@angular/core';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';
import { TaskService } from './services/task.service';
import { PriorityService } from './services/priority.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private priorityService = inject(PriorityService);
  private navController = inject(NavController);
  public environmentInjector = inject(EnvironmentInjector);
  public loadingController = inject(LoadingController);

  public authIsChecked = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.authenticated) {
      this.navController.navigateRoot('/home');
    } else if (this.authService.authStatus() === AuthStatus.notAuthenticated) {
      this.navController.navigateRoot('/auth/login');
    } else {
      return false;
    }
    return true;
  });

  public authStatusChangedEffect = effect(async () => {
    if (this.authIsChecked()) {
      if (this.authService.authStatus() === AuthStatus.authenticated) {
        await this.taskService.getTasksFromStorage();
        await this.priorityService.getPrioritiesFromStorage();
      }
      await this.loadingController.dismiss();
    }
  });
}
