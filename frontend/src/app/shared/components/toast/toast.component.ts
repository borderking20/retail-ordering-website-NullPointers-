import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notificationService.message()" class="fixed bottom-4 right-4 z-[80] rounded bg-slate-900 px-4 py-2 text-white shadow">
      {{ notificationService.message() }}
    </div>
  `,
})
export class ToastComponent {
  protected readonly notificationService = inject(NotificationService);
}
