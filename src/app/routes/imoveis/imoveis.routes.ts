import { Route } from '@angular/router';
import { ListarImoveisPorCorretorComponent } from './listar-por-corretor/listar-imoveis-por-corretor.component';
import { DetalharImovelComponent } from './detalhar/detalhar-imovel.component';
import { IncluirImovelComponent } from './incluir/incluir-imovel.component';
import { AlterarImovelComponent } from './alterar/alterar-imovel.component';


export const IMOVEIS_ROUTES: Route[] = [
    { path: '', component: ListarImoveisPorCorretorComponent },
    { path: 'detalhar/:id', component: DetalharImovelComponent },
    { path: 'incluir', component: IncluirImovelComponent },
    { path: 'alterar/:id', component: AlterarImovelComponent }
];