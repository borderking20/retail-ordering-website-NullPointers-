import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="mt-8 border-t border-red-100 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p class="font-semibold text-[var(--brand-red)]">RetailBite Foods</p>
        <p>Pizza, Cold Drinks and Breads delivered fresh.</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
