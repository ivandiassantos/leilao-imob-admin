import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Estado } from '@core/models/estado';

@Injectable({
    providedIn: 'root',
})
export class EstadoService{
    
    protected readonly http = inject(HttpClient);

    public listar(){
        return this.http.get<Estado[]>(`/api/estado`);
    }
}