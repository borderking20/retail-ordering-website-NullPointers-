import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="rounded-2xl bg-gradient-to-r from-[var(--brand-red)] to-orange-500 p-8 text-white">
      <h1 class="text-4xl font-extrabold">Order Fresh. Eat Happy.</h1>
      <p class="mt-3 text-lg">Pizza, Cold Drinks and Breads delivered to your door.</p>
      <div class="mt-6 flex gap-3">
        <a routerLink="/menu" class="rounded bg-white px-4 py-2 font-semibold text-[var(--brand-red)]">Order Now</a>
        <a routerLink="/promotions" class="rounded border border-white px-4 py-2">View Offers</a>
      </div>
    </section>
    <section class="mt-6 grid gap-4 md:grid-cols-3">
      <article class="rounded-xl border bg-white p-4">
        <h3 class="font-semibold">Pizza</h3>
        <p class="mt-1 text-sm text-slate-600">Classic and premium pizzas with fresh toppings.</p>
      </article>
      <article class="rounded-xl border bg-white p-4">
        <h3 class="font-semibold">Cold Drinks</h3>
        <p class="mt-1 text-sm text-slate-600">Refreshing drinks and combos to pair with meals.</p>
      </article>
      <article class="rounded-xl border bg-white p-4">
        <h3 class="font-semibold">Breads</h3>
        <p class="mt-1 text-sm text-slate-600">Freshly baked breads and sides every day.</p>
      </article>
    </section>
    <section class="mt-6 rounded-xl border bg-white p-4">
      <h2 class="font-semibold">Why Choose Us</h2>
      <div class="mt-3 grid gap-2 md:grid-cols-4">
        <p class="text-sm">Fast Delivery</p>
        <p class="text-sm">Fresh Ingredients</p>
        <p class="text-sm">Secure Payment</p>
        <p class="text-sm">24/7 Support</p>
      </div>
    </section>
  `,
})
export class HomePageComponent {}
