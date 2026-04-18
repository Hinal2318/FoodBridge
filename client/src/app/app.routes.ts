import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/Role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // ── Public: Auth Pages ─────────────────────────────────────────────
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
    },

    // ── Protected: NGO ────────────────────────────────────────────────
    {
        path: 'ngo',
        canActivate: [authGuard, roleGuard],
        data: { role: 'ngo' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/NGO/ngo-dashboard.component').then(m => m.NgoDashboardComponent)
            },
            {
                path: 'available-food',
                loadComponent: () => import('./pages/NGO/available-food.component').then(m => m.AvailableFoodComponent)
            },
            {
                path: 'requests',
                loadComponent: () => import('./pages/NGO/ngo-requests.component').then(m => m.NgoRequestsComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // ── Protected: Restaurant ─────────────────────────────────────────
    {
        path: 'restaurant',
        canActivate: [authGuard, roleGuard],
        data: { role: 'restaurant' },
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/restaurant/restaurant-dashboard/restaurant-dashboard.component').then(m => m.RestaurantDashboardComponent)
            },
            {
                path: 'add-food',
                loadComponent: () => import('./pages/restaurant/add-food/add-food.component').then(m => m.AddFoodComponent)
            },
            {
                path: 'food-list',
                loadComponent: () => import('./pages/restaurant/food-list/food-list.component').then(m => m.FoodListComponent)
            },
            {
                path: 'requests',
                loadComponent: () => import('./pages/restaurant/restaurant-requests.component').then(m => m.RestaurantRequestsComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    { path: '**', redirectTo: '/login' }
];
