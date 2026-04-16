import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.page').then((m) => m.HomePageComponent) },
  { path: 'menu', loadComponent: () => import('./features/menu/menu.page').then((m) => m.MenuPageComponent) },
  { path: 'menu/:id', loadComponent: () => import('./features/menu/product-detail.page').then((m) => m.ProductDetailPageComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.page').then((m) => m.CartPageComponent) },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPageComponent),
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPageComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePageComponent),
  },
  {
    path: 'promotions',
    loadComponent: () => import('./features/promotions/promotions.page').then((m) => m.PromotionsPageComponent),
  },
  {
    path: 'order-success/:id',
    loadComponent: () => import('./features/order-success/order-success.page').then((m) => m.OrderSuccessPageComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login.page').then((m) => m.AdminLoginPageComponent),
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPageComponent),
  },
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/products/admin-products.page').then((m) => m.AdminProductsPageComponent),
  },
  {
    path: 'admin/orders',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/orders/admin-orders.page').then((m) => m.AdminOrdersPageComponent),
  },
  {
    path: 'admin/promotions',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/promotions/admin-promotions.page').then((m) => m.AdminPromotionsPageComponent),
  },
  { path: '**', redirectTo: '' },
];
