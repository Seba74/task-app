import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ComponentsModule } from 'src/app/components/components.module';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, CommonModule],
})
export class Tab1Page {
  private authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe();
  }

}
