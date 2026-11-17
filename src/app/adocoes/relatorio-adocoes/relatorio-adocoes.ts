import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AdocaoService } from '../adocao-service';
import { AdocaoRelatorio, AnimalRelatorio, AdotanteRelatorio, DadosRelatorio } from '../dados-adocao';
import { formatarDataApi } from '../../shared/date-format';

interface CampoRelatorio {
  rotulo: string;
  valor: string;
}

interface DocumentoAberto {
  adocaoId: number;
  urlSegura: SafeResourceUrl;
  objectUrl: string;
}

const ROTULOS: Record<string, string> = {
  id: 'Código',
  name: 'Nome',
  cnpj: 'CNPJ',
  email: 'E-mail',
  contact: 'Contato',
  phone: 'Telefone',
  registrationDate: 'Data de cadastro',
  species: 'Espécie',
  birthDate: 'Data de nascimento',
  breed: 'Raça',
  specialCharacteristics: 'Características especiais',
  knownDiseases: 'Doenças conhecidas',
  cpf: 'CPF',
  address: 'Endereço',
  adoptionDate: 'Data da adoção',
  status: 'Status',
};

const CAMPOS_DE_DATA = new Set(['registrationDate', 'birthDate', 'adoptionDate']);

@Component({
  selector: 'app-relatorio-adocoes',
  imports: [RouterLink],
  templateUrl: './relatorio-adocoes.html',
  styleUrl: './relatorio-adocoes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioAdocoes implements OnInit, OnDestroy {
  private readonly service = inject(AdocaoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly adocoes = signal<AdocaoRelatorio[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly documentoAberto = signal<DocumentoAberto | null>(null);

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (adocoes) => {
        this.adocoes.set(adocoes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar relatório de adoções:', error);
        this.error.set('Não foi possível carregar o relatório. Confira o backend e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.fecharDocumento();
  }

  camposOng(ong: DadosRelatorio): CampoRelatorio[] {
    return this.criarCampos(ong);
  }

  camposAnimal(animal: AnimalRelatorio): CampoRelatorio[] {
    return this.criarCampos(animal);
  }

  camposAdotante(adotante: AdotanteRelatorio): CampoRelatorio[] {
    return this.criarCampos(adotante);
  }

  camposAdocao(adocao: AdocaoRelatorio): CampoRelatorio[] {
    return this.criarCampos({
      id: adocao.id,
      adoptionDate: adocao.adoptionDate,
      status: adocao.status,
    });
  }

  alternarDocumento(adocao: AdocaoRelatorio): void {
    if (!adocao.adoptionDocument) {
      return;
    }

    if (this.documentoAberto()?.adocaoId === adocao.id) {
      this.fecharDocumento();
      return;
    }

    this.fecharDocumento();
    try {
      const base64 = adocao.adoptionDocument.startsWith('data:')
        ? adocao.adoptionDocument.split(',', 2)[1]
        : adocao.adoptionDocument;
      const binario = atob(base64.replace(/\s/g, ''));
      const bytes = new Uint8Array(binario.length);
      for (let i = 0; i < binario.length; i++) {
        bytes[i] = binario.charCodeAt(i);
      }

      const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      this.documentoAberto.set({
        adocaoId: adocao.id,
        urlSegura: this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl),
        objectUrl,
      });
    } catch (error: unknown) {
      console.error('Erro ao abrir documento da adoção:', error);
      this.error.set('Não foi possível abrir o PDF deste registro.');
    }
  }

  fecharDocumento(): void {
    const aberto = this.documentoAberto();
    if (aberto) {
      URL.revokeObjectURL(aberto.objectUrl);
      this.documentoAberto.set(null);
    }
  }

  private criarCampos(dados: object): CampoRelatorio[] {
    const entradas = Object.entries(dados) as [string, unknown][];
    return entradas.map(([chave, valor]) => ({
      rotulo: ROTULOS[chave] ?? chave,
      valor: this.formatarValor(chave, valor),
    }));
  }

  private formatarValor(chave: string, valor: unknown): string {
    if (valor === null || valor === undefined || valor === '') {
      return 'Não informado';
    }

    if (CAMPOS_DE_DATA.has(chave)) {
      return formatarDataApi(valor);
    }

    if (typeof valor === 'string' || typeof valor === 'number') {
      return String(valor);
    }

    return JSON.stringify(valor) ?? String(valor);
  }
}
