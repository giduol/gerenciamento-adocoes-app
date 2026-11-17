import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AcompanhamentoService } from '../acompanhamento-service';
import { AcompanhamentoCadastro, MetodoAcompanhamento } from '../dados-acompanhamento';

interface CadastroAcompanhamentoForm {
  adocaoId: FormControl<number | null>;
  periodDays: FormControl<number | null>;
  animalWithAdopter: FormControl<boolean>;
  animalHealthy: FormControl<boolean>;
  animalReturned: FormControl<boolean>;
  animalNotFound: FormControl<boolean>;
  methods: FormControl<MetodoAcompanhamento[]>;
  notes: FormControl<string>;
  medias: FormControl<File[]>;
}

@Component({
  selector: 'app-cadastro-acompanhamento',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-acompanhamento.html',
  styleUrl: './cadastro-acompanhamento.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroAcompanhamento implements OnInit {
  @ViewChild('mediaInput') private mediaInput?: ElementRef<HTMLInputElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(AcompanhamentoService);

  readonly submitting = signal(false);
  readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<CadastroAcompanhamentoForm>({
    adocaoId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    periodDays: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    animalWithAdopter: new FormControl(false, { nonNullable: true }),
    animalHealthy: new FormControl(false, { nonNullable: true }),
    animalReturned: new FormControl(false, { nonNullable: true }),
    animalNotFound: new FormControl(false, { nonNullable: true }),
    methods: new FormControl<MetodoAcompanhamento[]>([], {
      nonNullable: true,
      validators: Validators.required,
    }),
    notes: new FormControl('', { nonNullable: true }),
    medias: new FormControl<File[]>([], { nonNullable: true }),
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const parametroId = params.get('adocaoId');
      const adocaoId = parametroId === null ? null : Number(parametroId);
      this.form.controls.adocaoId.reset(
        adocaoId !== null && Number.isSafeInteger(adocaoId) && adocaoId > 0 ? adocaoId : null,
      );
    });
  }

  alternarMetodo(metodo: MetodoAcompanhamento, event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const selecionados = new Set(this.form.controls.methods.value);
    if (event.target.checked) {
      selecionados.add(metodo);
    } else {
      selecionados.delete(metodo);
    }

    this.form.controls.methods.setValue([...selecionados]);
    this.form.controls.methods.markAsTouched();
  }

  selecionarMidias(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const arquivos = Array.from(event.target.files ?? []);
    const midiaInvalida = arquivos.find((arquivo) =>
      !arquivo.type.startsWith('image/') && !arquivo.type.startsWith('video/'),
    );

    this.feedback.set(null);
    if (midiaInvalida) {
      event.target.value = '';
      this.form.controls.medias.setValue([]);
      this.feedback.set({
        type: 'error',
        message: 'Selecione somente arquivos de imagem ou vídeo.',
      });
      return;
    }

    this.form.controls.medias.setValue(arquivos);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      adocaoId,
      periodDays,
      animalWithAdopter,
      animalHealthy,
      animalReturned,
      animalNotFound,
      methods,
      notes,
      medias,
    } = this.form.getRawValue();

    if (adocaoId === null || periodDays === null) {
      this.form.markAllAsTouched();
      return;
    }

    const dados: AcompanhamentoCadastro = {
      periodDays,
      animalWithAdopter,
      animalHealthy,
      animalReturned,
      animalNotFound,
      methods,
      notes,
      medias,
    };

    this.feedback.set(null);
    this.submitting.set(true);

    this.service.criar(adocaoId, dados).subscribe({
      next: () => {
        this.feedback.set({ type: 'success', message: 'Acompanhamento cadastrado com sucesso.' });
        this.resetarFormulario(true);
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao cadastrar acompanhamento:', error);
        this.feedback.set({
          type: 'error',
          message: 'Não foi possível cadastrar o acompanhamento. Confira o backend e tente novamente.',
        });
        this.submitting.set(false);
      },
    });
  }

  limparFormulario(): void {
    this.resetarFormulario();
    this.feedback.set(null);
  }

  private resetarFormulario(preservarAdocaoId = false): void {
    this.form.reset({
      adocaoId: preservarAdocaoId ? this.form.controls.adocaoId.value : null,
      periodDays: null,
      animalWithAdopter: false,
      animalHealthy: false,
      animalReturned: false,
      animalNotFound: false,
      methods: [],
      notes: '',
      medias: [],
    });
    if (this.mediaInput) {
      this.mediaInput.nativeElement.value = '';
    }
  }
}
