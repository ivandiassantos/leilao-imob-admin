import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoImovel } from '@core/models/tipo-imovel';
import { environment } from '@env/environment';

@Injectable()
export class TipoImovelService{
    
    protected readonly http = inject(HttpClient);

    public listar(){
        return this.http.get<TipoImovel[]>(`/api/tipo-imovel`);
    }
}