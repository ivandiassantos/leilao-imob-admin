import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayout } from '@theme/admin-layout/admin-layout';
import { AuthLayout } from '@theme/auth-layout/auth-layout';
import { Dashboard } from './routes/dashboard/dashboard';
import { Error403 } from './routes/sessions/error-403';
import { Error404 } from './routes/sessions/error-404';
import { Error500 } from './routes/sessions/error-500';
import { Login } from './routes/sessions/login/login';
import { Register } from './routes/sessions/register/register';
import { ConfiguracoesComponent } from './routes/sessions/configuracoes/configuracoes.component';
import { AlterarSenhaPrimeiroAcessoComponent } from './routes/sessions/primeiro-acesso/alterar-senha-primeiro-acesso.component.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'imoveis', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: '403', component: Error403 },
      { path: '404', component: Error404 },
      { path: '500', component: Error500 },
      { path: 'imoveis', loadChildren: () => import('./routes/imoveis/imoveis.routes').then(mod => mod.IMOVEIS_ROUTES) }
    ],
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'configuracoes', component: ConfiguracoesComponent },
      { path: 'alterar-senha-primeiro-acesso', component: AlterarSenhaPrimeiroAcessoComponent }
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
