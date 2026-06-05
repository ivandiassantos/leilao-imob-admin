import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cep } from '@core/models/cep';
import { environment } from '@env/environment';

@Injectable()
export class CepService{
    protected readonly http = inject(HttpClient);

    public consultaCep(cep:string){
        return this.http.get<Cep>(`${environment.apiCepUrl}/${cep}/json`);
    }
}