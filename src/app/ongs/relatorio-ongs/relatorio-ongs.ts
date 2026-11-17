import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OngService } from '../ong-service';
import { OngDetails, OngForm } from '../dados-ong';
import { ApiDateValue, formatarDataApi } from '../../shared/date-format';

interface EditarOngForm {
  name: FormControl<string>;
  cnpj: FormControl<string>;
  email: FormControl<string>;
  contact: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-relatorio-ongs',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './relatorio-ongs.html',
  styleUrl: './relatorio-ongs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioOngs implements OnInit {
  private readonly service = inject(OngService);

  readonly ongs = signal<OngDetails[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly editingOngId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly feedback = signal<{ ongId: number; type: 'success' | 'error'; message: string } | null>(null);

  readonly form = new FormGroup<EditarOngForm>({
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

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (ongs) => {
        this.ongs.set(ongs);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar relatório de ONGs:', error);
        this.error.set('Não foi possível carregar o relatório. Confira o backend e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  formatarData(data: ApiDateValue): string {
    return formatarDataApi(data);
  }

  alternarEdicao(ong: OngDetails): void {
    if (this.editingOngId() === ong.id) {
      this.cancelarEdicao();
      return;
    }

    this.feedback.set(null);
    this.form.reset({
      name: ong.name,
      cnpj: ong.cnpj,
      email: ong.email,
      contact: ong.contact,
      phone: ong.phone,
    });
    this.editingOngId.set(ong.id);
  }

  cancelarEdicao(): void {
    this.editingOngId.set(null);
    this.feedback.set(null);
  }

  salvarEdicao(ong: OngDetails): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados: OngForm = this.form.getRawValue();
    this.feedback.set(null);
    this.saving.set(true);

    this.service.atualizar(ong.id, dados).subscribe({
      next: () => {
        this.ongs.update((ongs) => ongs.map((item) =>
          item.id === ong.id ? { ...item, ...dados } : item,
        ));
        this.editingOngId.set(null);
        this.feedback.set({
          ongId: ong.id,
          type: 'success',
          message: 'ONG atualizada com sucesso.',
        });
        this.saving.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao atualizar ONG:', error);
        this.feedback.set({
          ongId: ong.id,
          type: 'error',
          message: 'Não foi possível atualizar a ONG. Confira o backend e tente novamente.',
        });
        this.saving.set(false);
      },
    });
  }
}
