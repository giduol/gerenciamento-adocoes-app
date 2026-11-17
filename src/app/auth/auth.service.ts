import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { API_URL } from '../shared/api-url';

export interface UsuarioAutenticado {
  username: string;
}

interface TokenCsrf {
  headerName: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly usuarioAtual = signal<UsuarioAutenticado | null>(null);
  private tokenCsrfAtual: TokenCsrf | null = null;

  readonly usuario = this.usuarioAtual.asReadonly();

  login(username: string, password: string): Observable<UsuarioAutenticado> {
    return this.obterTokenCsrf().pipe(
      switchMap(() =>
        this.http.post<UsuarioAutenticado>(`${API_URL}/auth/login`, { username, password }),
      ),
      switchMap((usuario) => this.obterTokenCsrf().pipe(map(() => usuario))),
      tap((usuario) => this.usuarioAtual.set(usuario)),
      catchError((error: unknown) => {
        this.usuarioAtual.set(null);
        this.tokenCsrfAtual = null;
        return throwError(() => error);
      }),
    );
  }

  carregarUsuario(): Observable<UsuarioAutenticado> {
    return this.http.get<UsuarioAutenticado>(`${API_URL}/auth/me`).pipe(
      tap((usuario) => this.usuarioAtual.set(usuario)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.usuarioAtual.set(null);
          this.tokenCsrfAtual = null;
        }
        return throwError(() => error);
      }),
    );
  }

  logout(): Observable<void> {
    return this.obterTokenCsrf().pipe(
      switchMap(() => this.http.post<void>(`${API_URL}/auth/logout`, '')),
      tap(() => {
        this.usuarioAtual.set(null);
        this.tokenCsrfAtual = null;
      }),
    );
  }

  tokenCsrfParaRequisicao(): Observable<TokenCsrf> {
    return this.tokenCsrfAtual ? of(this.tokenCsrfAtual) : this.obterTokenCsrf();
  }

  private obterTokenCsrf(): Observable<TokenCsrf> {
    return this.http
      .get<TokenCsrf>(`${API_URL}/auth/csrf`)
      .pipe(tap((token) => (this.tokenCsrfAtual = token)));
  }
}
