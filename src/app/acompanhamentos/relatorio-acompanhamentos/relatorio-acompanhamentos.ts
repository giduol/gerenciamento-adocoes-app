import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AcompanhamentoService } from '../acompanhamento-service';
import {
  AcompanhamentoMedia,
  AcompanhamentoPorAdocao,
  AcompanhamentoRelatorio,
} from '../dados-acompanhamento';
import { ApiDateValue, formatarDataApi } from '../../shared/date-format';

interface ConsultaAcompanhamentosForm {
  cpf: FormControl<string>;
}

interface MidiaAberta {
  chave: string;
  url: string;
  fileName: string;
  contentType: string;
}

@Component({
  selector: 'app-relatorio-acompanhamentos',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './relatorio-acompanhamentos.html',
  styleUrl: './relatorio-acompanhamentos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioAcompanhamentos implements OnDestroy {
  private readonly service = inject(AcompanhamentoService);
  private objectUrl: string | null = null;

  readonly form = new FormGroup<ConsultaAcompanhamentosForm>({
    cpf: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{11}$/)],
    }),
  });
  readonly adocoes = signal<AcompanhamentoPorAdocao[]>([]);
  readonly loading = signal(false);
  readonly searched = signal(false);
  readonly error = signal<string | null>(null);
  readonly mediaError = signal<string | null>(null);
  readonly loadingMediaKey = signal<string | null>(null);
  readonly midiaAberta = signal<MidiaAberta | null>(null);

  ngOnDestroy(): void {
    this.fecharMidia();
  }

  buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cpf = this.form.controls.cpf.value;

    this.fecharMidia();
    this.mediaError.set(null);
    this.error.set(null);
    this.adocoes.set([]);
    this.loading.set(true);
    this.searched.set(true);

    this.service.listarPorCpf(cpf).subscribe({
      next: (adocoes) => {
        this.adocoes.set(adocoes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar relatório de acompanhamentos:', error);
        this.error.set(
          'Não foi possível carregar os acompanhamentos deste CPF. Confira os dados e tente novamente.',
        );
        this.loading.set(false);
      },
    });
  }

  chaveMidia(
    adocaoId: number,
    acompanhamento: AcompanhamentoRelatorio,
    media: AcompanhamentoMedia,
  ): string {
    return `${adocaoId}-${acompanhamento.id}-${media.index}`;
  }

  alternarMidia(
    adocaoId: number,
    acompanhamento: AcompanhamentoRelatorio,
    media: AcompanhamentoMedia,
  ): void {
    const chave = this.chaveMidia(adocaoId, acompanhamento, media);
    if (this.midiaAberta()?.chave === chave) {
      this.fecharMidia();
      return;
    }

    this.fecharMidia();
    this.mediaError.set(null);
    this.loadingMediaKey.set(chave);
    this.service.baixarMidia(media.downloadUrl).subscribe({
      next: (blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        this.midiaAberta.set({
          chave,
          url: this.objectUrl,
          fileName: media.fileName,
          contentType: media.contentType,
        });
        this.loadingMediaKey.set(null);
      },
      error: (error: unknown) => {
        console.error('Erro ao abrir mídia do acompanhamento:', error);
        this.mediaError.set(`Não foi possível abrir o arquivo "${media.fileName}".`);
        this.loadingMediaKey.set(null);
      },
    });
  }

  fecharMidia(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.midiaAberta.set(null);
  }

  formatarData(data: ApiDateValue): string {
    return formatarDataApi(data);
  }

  formatarMetodo(metodo: string): string {
    if (metodo === 'PHOTOS') {
      return 'Fotos';
    }
    if (metodo === 'VIDEOS') {
      return 'Vídeos';
    }
    return metodo;
  }

  formatarMetodos(metodos: string[]): string {
    return metodos.map((metodo) => this.formatarMetodo(metodo)).join(', ') || 'Não informado';
  }

  formatarTamanho(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  ehImagem(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  ehVideo(contentType: string): boolean {
    return contentType.startsWith('video/');
  }
}
