import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../animal-service';

interface CadastroAnimalForm {
  name: FormControl<string>;
  species: FormControl<string>;
  birthDate: FormControl<string>;
  breed: FormControl<string>;
  specialCharacteristics: FormControl<string>;
  knownDiseases: FormControl<string>;
}

@Component({
  selector: 'app-cadastro-animal',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-animal.html',
  styleUrl: './cadastro-animal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroAnimal {
  private readonly service = inject(AnimalService);

  readonly submitting = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<CadastroAnimalForm>({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    species: new FormControl('', { nonNullable: true, validators: Validators.required }),
    birthDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
    breed: new FormControl('', { nonNullable: true }),
    specialCharacteristics: new FormControl('', { nonNullable: true }),
    knownDiseases: new FormControl('', { nonNullable: true }),
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
        this.feedback.set({ type: 'success', message: 'Animal cadastrado com sucesso.' });
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao cadastrar animal:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível cadastrar o animal. Confira o backend e tente novamente.',
        });
        this.submitting.set(false);
      },
    });
  }
}
