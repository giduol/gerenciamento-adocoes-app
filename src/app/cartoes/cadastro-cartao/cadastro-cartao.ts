import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OngService } from '../../ongs/ong-service';

interface CadastroOngForm {
  name: FormControl<string>;
  cnpj: FormControl<string>;
  email: FormControl<string>;
  contact: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-ong',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-cartao.html',
  styleUrl: './cadastro-cartao.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroOng {
  private readonly service = inject(OngService);

  readonly submitting = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<CadastroOngForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    cnpj: new FormControl('', { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    contact: new FormControl('', { nonNullable: true }),
    phone: new FormControl('', { nonNullable: true }),
  });

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.feedback.set(null);
    this.submitting.set(true);

    this.service.criar(this.form.getRawValue()).subscribe({
      next: () => {
        this.feedback.set({ type: 'success', message: 'ONG cadastrada com sucesso.' });
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao cadastrar ONG:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível cadastrar a ONG. Confira o backend e tente novamente.',
        });
        this.submitting.set(false);
      },
    });
  }
}
