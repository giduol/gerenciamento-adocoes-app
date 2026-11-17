import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../animal-service';
import { AnimalDetails } from '../dados-animal';
import { ApiDateValue, formatarDataApi } from '../../shared/date-format';

@Component({
  selector: 'app-relatorio-animais',
  imports: [RouterLink],
  templateUrl: './relatorio-animais.html',
  styleUrl: './relatorio-animais.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatorioAnimais implements OnInit {
  private readonly service = inject(AnimalService);

  readonly animais = signal<AnimalDetails[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (animais) => {
        this.animais.set(animais);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        console.error('Erro ao carregar relatório de animais:', error);
        this.error.set('Não foi possível carregar o relatório. Confira o backend e tente novamente.');
        this.loading.set(false);
      },
    });
  }

  formatarData(data: ApiDateValue | undefined): string {
    return formatarDataApi(data);
  }
}
