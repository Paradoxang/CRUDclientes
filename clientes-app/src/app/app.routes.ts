import { Routes } from '@angular/router';
import { ClienteList } from './clientes/cliente-list/cliente-list';
import { ClienteForm } from './clientes/cliente-form/cliente-form';
import { ClienteDetail } from './clientes/cliente-detail/cliente-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClienteList },
  { path: 'clientes/nuevo', component: ClienteForm },
  { path: 'clientes/editar/:id', component: ClienteForm },
  { path: 'clientes/:id', component: ClienteDetail }
];