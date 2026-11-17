import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface LoginFormControls {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = new FormGroup<LoginFormControls>({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.loading.set(true);
    this.auth
      .login(this.form.controls.username.value.trim(), this.form.controls.password.value)
      .subscribe({
        next: () => {
          this.loading.set(false);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destino =
            returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';
          void this.router.navigateByUrl(destino);
        },
        error: (error: unknown) => {
          console.error('Erro ao fazer login:', error);
          this.error.set(
            error instanceof HttpErrorResponse && error.status === 401
              ? 'Usuário ou senha inválidos.'
              : error instanceof HttpErrorResponse && error.status === 403
                ? 'Não foi possível validar a solicitação de acesso. Atualize a página e tente novamente.'
                : 'Não foi possível conectar ao serviço de autenticação. Tente novamente.',
          );
          this.loading.set(false);
        },
      });
  }
}
