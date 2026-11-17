import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface OpcaoMenu {
  titulo: string;
  rota: string;
  icone: string;
}

interface MenuPrincipal {
  id: string;
  titulo: string;
  opcoes: OpcaoMenu[];
}

@Component({
  selector: 'app-template',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly menuAberto = signal<string | null>(null);
  readonly usuario = this.auth.usuario;
  readonly erroLogout = signal<string | null>(null);

  readonly menus: MenuPrincipal[] = [
    {
      id: 'animais',
      titulo: 'Animais',
      opcoes: [
        { titulo: 'Cadastro', rota: '/cadastro-animais', icone: 'fa-plus' },
        { titulo: 'Consultar', rota: '/relatorio-animais', icone: 'fa-magnifying-glass' },
      ],
    },
    {
      id: 'adotante',
      titulo: 'Adotantes',
      opcoes: [
        { titulo: 'Cadastro', rota: '/cadastro-adotantes', icone: 'fa-plus' },
        { titulo: 'Consultar', rota: '/relatorio-adotantes', icone: 'fa-magnifying-glass' },
      ],
    },
    {
      id: 'ongs',
      titulo: 'ONGs',
      opcoes: [
        { titulo: 'Cadastro', rota: '/cadastro-ongs', icone: 'fa-plus' },
        { titulo: 'Consultar', rota: '/relatorio-ongs', icone: 'fa-magnifying-glass' },
      ],
    },
    {
      id: 'adocoes',
      titulo: 'Adoções',
      opcoes: [
        { titulo: 'Cadastro', rota: '/adocoes', icone: 'fa-plus' },
        { titulo: 'Consultar', rota: '/relatorio-adocoes', icone: 'fa-magnifying-glass' },
      ],
    },
    {
      id: 'acompanhamento',
      titulo: 'Acompanhamento',
      opcoes: [
        { titulo: 'Cadastro', rota: '/acompanhamentos', icone: 'fa-plus' },
        { titulo: 'Consultar', rota: '/relatorio-acompanhamentos', icone: 'fa-magnifying-glass' },
      ],
    },
  ];

  alternarMenu(id: string): void {
    this.menuAberto.set(this.menuAberto() === id ? null : id);
  }

  fecharMenu(): void {
    this.menuAberto.set(null);
  }

  sair(): void {
    this.erroLogout.set(null);
    this.auth.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      },
      error: (error: unknown) => {
        console.error('Erro ao encerrar sessão:', error);
        this.erroLogout.set('Não foi possível encerrar a sessão. Tente novamente.');
      },
    });
  }
}
