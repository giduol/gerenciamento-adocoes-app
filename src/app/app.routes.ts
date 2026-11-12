import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CadastroOng } from './cartoes/cadastro-cartao/cadastro-cartao';
import { Home } from './home/home';
import { CadastroAnimal } from './animais/cadastro-animal/cadastro-animal';
import { CadastroAdotante } from './adotantes/cadastro-adotante/cadastro-adotante';

export const routes: Routes = [
    {
        path: '',
        component: Template,
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
            }
        ]
    }
];
