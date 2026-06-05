import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class AlterarSenhaPrimeiroAcessoService {
    protected readonly http = inject(HttpClient);

    alterar(alterarSenhaPrimeiroAcessoForm:any) {
        return this.http.post(`/api/usuario/alterar-senha-primeiro-acesso`, alterarSenhaPrimeiroAcessoForm);
    }
}