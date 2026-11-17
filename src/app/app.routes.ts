import { Routes } from '@angular/router';
import { Template } from './template/template';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { CadastroOng } from './cartoes/cadastro-cartao/cadastro-cartao';
import { Home } from './home/home';
import { CadastroAnimal } from './animais/cadastro-animal/cadastro-animal';
import { CadastroAdotante } from './adotantes/cadastro-adotante/cadastro-adotante';
import { CadastroAdocao } from './adocoes/cadastro-adocao/cadastro-adocao';
import { RelatorioAdocoes } from './adocoes/relatorio-adocoes/relatorio-adocoes';
import { RelatorioOngs } from './ongs/relatorio-ongs/relatorio-ongs';
import { RelatorioAnimais } from './animais/relatorio-animais/relatorio-animais';
import { RelatorioAdotantes } from './adotantes/relatorio-adotantes/relatorio-adotantes';
import { PainelRelatorios } from './relatorios/painel-relatorios';
import { CadastroAcompanhamento } from './acompanhamentos/cadastro-acompanhamento/cadastro-acompanhamento';
import { RelatorioAcompanhamentos } from './acompanhamentos/relatorio-acompanhamentos/relatorio-acompanhamentos';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Template,
        canActivateChild: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: Home
            },
            {
                path: 'cadastro-ongs',
                component: CadastroOng
            },
            {
                path: 'cadastro-animais',
                component: CadastroAnimal
            },
            {
                path: 'cadastro-adotantes',
                component: CadastroAdotante
            },
            {
                path: 'adocoes',
                component: CadastroAdocao
            },
            {
                path: 'relatorio-adocoes',
                component: RelatorioAdocoes
            },
            {
                path: 'relatorio-ongs',
                component: RelatorioOngs
            },
            {
                path: 'relatorio-animais',
                component: RelatorioAnimais
            },
            {
                path: 'relatorio-adotantes',
                component: RelatorioAdotantes
            },
            {
                path: 'relatorios',
                component: PainelRelatorios
            },
            {
                path: 'acompanhamentos',
                component: CadastroAcompanhamento
            },
            {
                path: 'relatorio-acompanhamentos',
                component: RelatorioAcompanhamentos
            }
        ]
    }
];
