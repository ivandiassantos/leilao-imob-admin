import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class ImagemImovelService {
    protected readonly http = inject(HttpClient);

    public excluirImagemImovel(idImagemImovel: number) {
        return this.http.delete(`/api/imagem-imovel/${idImagemImovel}`);
    }
}