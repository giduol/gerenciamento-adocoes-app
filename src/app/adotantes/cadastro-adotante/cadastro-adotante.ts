import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdotanteService } from '../adotante-service';

interface CadastroAdotanteForm {
  name: FormControl<string>;
  cpf: FormControl<string>;
  address: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-adotante',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-adotante.html',
  styleUrl: './cadastro-adotante.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroAdotante {
  private readonly service = inject(AdotanteService);

  readonly submitting = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<CadastroAdotanteForm>({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    cpf: new FormControl('', { nonNullable: true, validators: Validators.required }),
    address: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { nonNullable: true, validators: Validators.required }),
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
        this.feedback.set({ type: 'success', message: 'Cadastro de adotante realizado com sucesso.' });
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao cadastrar adotante:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível cadastrar o adotante. Confira o backend e tente novamente.',
        });
        this.submitting.set(false);
      },
    });
  }
}
