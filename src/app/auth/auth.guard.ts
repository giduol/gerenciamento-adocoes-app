import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateChildFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.carregarUsuario().pipe(
    map(() => true),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
      }
      return throwError(() => error);
    }),
  );
};
