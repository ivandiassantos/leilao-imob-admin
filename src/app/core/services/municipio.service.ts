import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Municipio } from '@core/models/municipio';

@Injectable({
    providedIn: 'root',
})
export class MunicipioService{
    
    protected readonly http = inject(HttpClient);

    public listarPorSiglasEstados(siglas:string[]){
        return this.http.get<Municipio[]>(`/api/municipio?siglas=${siglas}`);
    }
    
}