import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdotanteService } from '../adotante-service';
import { AdotanteDetails } from '../dados-adotante';
import { ApiDateValue, formatarDataApi } from '../../shared/date-format';

@Component({
  selector: 'app-relatorio-adotantes',
  imports: [RouterLink],
  templateUrl: './relatorio-adotantes.html',
  styleUrl: './relatorio-adotantes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioAdotantes implements OnInit {
  private readonly service = inject(AdotanteService);

  readonly adotantes = signal<AdotanteDetails[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (adotantes) => {
        this.adotantes.set(adotantes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar relatório de adotantes:', error);
        this.error.set('Não foi possível carregar o relatório. Confira o backend e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  formatarData(data: ApiDateValue | undefined): string {
    return formatarDataApi(data);
  }
}
