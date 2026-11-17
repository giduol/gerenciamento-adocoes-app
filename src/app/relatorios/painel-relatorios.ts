import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ModuloRelatorio {
  titulo: string;
  descricao: string;
  rota: string;
  icone: string;
}

@Component({
  selector: 'app-painel-relatorios',
  imports: [RouterLink],
  templateUrl: './painel-relatorios.html',
  styleUrl: './painel-relatorios.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainelRelatorios {
  readonly modulos: ModuloRelatorio[] = [
    {
      titulo: 'Animais',
      descricao: 'Consulte os animais cadastrados e suas informações.',
      rota: '/relatorio-animais',
      icone: 'fa-paw',
    },
    {
      titulo: 'ONGs',
      descricao: 'Consulte as organizações parceiras e seus contatos.',
      rota: '/relatorio-ongs',
      icone: 'fa-hand-holding-heart',
    },
    {
      titulo: 'Adotantes',
      descricao: 'Consulte as pessoas cadastradas para adoção.',
      rota: '/relatorio-adotantes',
      icone: 'fa-users',
    },
    {
      titulo: 'Adoções',
      descricao: 'Acompanhe os registros e abra os documentos das adoções.',
      rota: '/relatorio-adocoes',
      icone: 'fa-file-lines',
    },
    {
      titulo: 'Acompanhamento',
      descricao: 'Consulte visitas, condições e mídias de acompanhamento.',
      rota: '/relatorio-acompanhamentos',
      icone: 'fa-clipboard-check',
    },
  ];
}
