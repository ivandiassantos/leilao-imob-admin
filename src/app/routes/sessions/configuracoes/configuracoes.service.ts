import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class ConfiguracoesService {
    protected readonly http = inject(HttpClient);

    registrarMunicipiosInteresse(idsMunicipios:number[]) {
        return this.http.post(`/api/pessoa/registrar-municipios-interesse`, idsMunicipios);
    }
}