import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { AuthService } from './auth.service';

const METODOS_SEGUROS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const requestComCredenciais = request.clone({ withCredentials: true });

  if (METODOS_SEGUROS.has(request.method.toUpperCase())) {
    return next(requestComCredenciais);
  }

  return inject(AuthService)
    .tokenCsrfParaRequisicao()
    .pipe(
      switchMap(({ headerName, token }) =>
        next(requestComCredenciais.clone({ setHeaders: { [headerName]: token } })),
      ),
    );
};
