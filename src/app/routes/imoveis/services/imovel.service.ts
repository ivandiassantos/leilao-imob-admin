import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImoveisDisponiveis } from '@core/models/imoveis-disponiveis';
import { Imovel } from '@core/models/imovel';
import { ListaImoveis } from '@core/models/lista-imoveis';
import { RespostaInclusaoImovel } from '@core/models/resposta-inclusao-imovel';

@Injectable()
export class ImovelService {

    protected readonly http = inject(HttpClient);

    public obterQuantidadesImoveisDisponiveisParaAssociacao() {
        return this.http.get<ImoveisDisponiveis>(`/api/imovel/obter-quantidades-imoveis-disponiveis`);
    }

    public obterPor(id: string) {
        return this.http.get<Imovel>(`/api/imovel/obter-por-id/${id}`);
    }

    public listar(parametros: any, active: string, direction: string, pageIndex: number, pageSize: number) {
        let url = `/api/imovel?limit=${pageSize}&page=${pageIndex}&sortBy=${active}:${direction}&select=nome`;
        if (parametros.nome) {
            url = url.concat(`&filter.nome=$ilike:${parametros.nome}`);
        }
        if (parametros.tipoImovel) {
            url = url.concat(`&filter.tipoImovel.id=$in:${parametros.tipoImovel}`);
        }
        if (parametros.quartos) {
            url = url.concat(`&filter.quartos=$eq:${parametros.quartos}`);
        }
        if (parametros.vagasGaragem) {
            url = url.concat(`&filter.vagasGaragem=$eq:${parametros.vagasGaragem}`);
        }
        if (parametros.imovelLeilao !== null && parametros.imovelLeilao !== undefined && parametros.imovelLeilao !== '') {
            url = url.concat(`&filter.imovelLeilao=$eq:${parametros.imovelLeilao}`);
        }
        return this.http.get<ListaImoveis>(url);
    }

    vincularImovelAoCorretor(idImovel: number) {
        return this.http.post(`/api/imovel-corretor/vincular-imovel-ao-corretor`, { idImovel });
    }

    removerVinculoImovelCorretor(idImovel: number) {
        return this.http.delete(`/api/imovel-corretor/${idImovel}`);
    }

    public vincularTodosOsImoveisAoCorretor() {
        return this.http.post(`/api/imovel-corretor/vincular-todos-os-imoveis-ao-corretor`, {});
    }

    public vincularImoveisSelecionados(idsSelecionados: number[]) {
        return this.http.post(`/api/imovel-corretor/vincular-imoveis-selecionados`, idsSelecionados);
    }

    public incluirImovel(incluirImovelForm: any) {
        return this.http.post<RespostaInclusaoImovel>(`/api/imovel-corretor/incluir-imovel`, incluirImovelForm);
    }

    public uploadImagens(idImovel:number, formData:FormData) {
        return this.http.post(`/api/imovel-corretor/upload-imagens-imovel/${idImovel}`, formData);
    }

    public alterarImovel(idImovel: number, alterarImovelForm: any) {
        return this.http.put(`/api/imovel-corretor/alterar-imovel/${idImovel}`, alterarImovelForm);
    }

    public excluir(idImovel: number) {
        return this.http.delete(`/api/imovel-corretor/excluir-imovel/${idImovel}`);
    }
}