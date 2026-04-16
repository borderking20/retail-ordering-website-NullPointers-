import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SpinnerComponent, ToastComponent],
  template: `
    <div class="min-h-screen bg-[var(--brand-cream)] text-slate-800">
      <app-navbar />
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
      <app-footer />
      <app-spinner />
      <app-toast />
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
}
