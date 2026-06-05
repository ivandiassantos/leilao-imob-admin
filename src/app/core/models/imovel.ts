import { CorretorImovel } from './corretor-imovel';
import { ImagemImovel } from './imagem-imovel';
import { InformacaoAdicional } from './informacao-adicional';
import { Modalidade } from './modalidade';
import { Municipio } from './municipio';
import { TipoImovel } from './tipo-imovel';

export interface Imovel{
    id: number
    tipoImovel:TipoImovel;
    municipio:Municipio;
    modalidade:Modalidade;
    imagensImovel: ImagemImovel[]
    nome: string
    valorAvaliacao:number;
    valorMinimoVendaAVista:number;
    quartos:number;
    numeroImovel:string;
    matriculas:string;
    comarca:string;
    oficio:string;
    inscricaoImobiliaria:string;
    averbacaoLeiloesNegativos:string;
    areaPrivativa:number;
    areaTerreno:number;
    endereco:string;
    cep:string;
    descricao:string;
    vagasGaragem:number;
    edital:string;
    itemEdital:string;
    nomeLeiloeiro:string;
    dataLicitacaoAberta:string;
    ativo:boolean;
    dataAtualizacao:Date;
    aceitaFinanciamento:boolean;
    aceitaFgts:boolean;
    bairro:string;
    complemento:string;
    numero:string;
    valorMinimoVenda:number;
    percentualDesconto:number;
    informacoesAdicionais: InformacaoAdicional[]
    corretoresImovel:CorretorImovel[];
    valorVenda:number;
    suites:number;
}