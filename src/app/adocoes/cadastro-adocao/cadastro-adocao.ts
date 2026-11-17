import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdotanteService } from '../../adotantes/adotante-service';
import { AdotanteDetails } from '../../adotantes/dados-adotante';
import { AnimalService } from '../../animais/animal-service';
import { AnimalDetails } from '../../animais/dados-animal';
import { OngService } from '../../ongs/ong-service';
import { OngDetails } from '../../ongs/dados-ong';
import { AdocaoService } from '../adocao-service';

interface CadastroAdocaoForm {
  ongId: FormControl<number | null>;
  animalId: FormControl<number | null>;
  adotanteId: FormControl<number | null>;
  adoptionDocument: FormControl<File | null>;
}

@Component({
  selector: 'app-cadastro-adocao',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-adocao.html',
  styleUrl: '../../shared/registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroAdocao implements OnInit {
  @ViewChild('documentInput') private documentInput?: ElementRef<HTMLInputElement>;

  private readonly service = inject(AdocaoService);
  private readonly ongService = inject(OngService);
  private readonly animalService = inject(AnimalService);
  private readonly adotanteService = inject(AdotanteService);

  readonly ongs = signal<OngDetails[]>([]);
  readonly animais = signal<AnimalDetails[]>([]);
  readonly adotantes = signal<AdotanteDetails[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<CadastroAdocaoForm>({
    ongId: new FormControl<number | null>(null, Validators.required),
    animalId: new FormControl<number | null>(null, Validators.required),
    adotanteId: new FormControl<number | null>(null, Validators.required),
    adoptionDocument: new FormControl<File | null>(null, Validators.required),
  });

  ngOnInit(): void {
    forkJoin({
      ongs: this.ongService.listar(),
      animais: this.animalService.listar(),
      adotantes: this.adotanteService.listar(),
    }).subscribe({
      next: ({ ongs, animais, adotantes }) => {
        this.ongs.set(ongs);
        this.animais.set(animais);
        this.adotantes.set(adotantes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar dados para adoção:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível carregar ONGs, animais e adotantes. Confira o backend e tente novamente.',
        });
        this.loading.set(false);
      },
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { ongId, animalId, adotanteId, adoptionDocument } = this.form.getRawValue();
    if (ongId === null || animalId === null || adotanteId === null || adoptionDocument === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.feedback.set(null);
    this.submitting.set(true);

    this.service.criar({
      ongId,
      animalId,
      adotanteId,
      document: adoptionDocument,
      status: 'PENDENTE',
    }).subscribe({
      next: () => {
        this.feedback.set({ type: 'success', message: 'Adoção registrada com sucesso.' });
        this.reiniciarFormulario();
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao registrar adoção:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível registrar a adoção. Confira o backend e tente novamente.',
        });
        this.submitting.set(false);
      },
    });
  }

  selecionarDocumento(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const arquivo = event.target.files?.[0] ?? null;
    const ehPdf = arquivo !== null
      && arquivo.name.toLowerCase().endsWith('.pdf')
      && (!arquivo.type || arquivo.type === 'application/pdf');

    this.feedback.set(null);
    if (!ehPdf) {
      event.target.value = '';
      this.form.controls.adoptionDocument.setValue(null);
      this.form.controls.adoptionDocument.markAsTouched();
      if (arquivo) {
        this.feedback.set({ type: 'error', message: 'Selecione um arquivo PDF válido.' });
      }
      return;
    }

    this.form.controls.adoptionDocument.setValue(arquivo);
    this.form.controls.adoptionDocument.markAsTouched();
  }

  limparFormulario(): void {
    this.reiniciarFormulario();
    this.feedback.set(null);
  }

  private reiniciarFormulario(): void {
    this.form.reset({
      ongId: null,
      animalId: null,
      adotanteId: null,
      adoptionDocument: null,
    });
    if (this.documentInput) {
      this.documentInput.nativeElement.value = '';
    }
  }
}
