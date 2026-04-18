import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const requiredRole = route.data['role'];
    const userRole = auth.getRole();

    if (userRole === requiredRole) return true;

    // Redirect to correct dashboard based on actual role
    if (userRole === 'ngo') router.navigate(['/ngo/dashboard']);
    else if (userRole === 'restaurant') router.navigate(['/restaurant/dashboard']);
    else router.navigate(['/login']);

    return false;
};