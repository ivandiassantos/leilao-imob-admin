import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, map, merge, of as observableOf, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ImovelService } from '../services/imovel.service';


import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TipoImovelService } from '@core/services/tipo-imovel.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmacaoImportacaoRemocaoImovelDialogComponent } from '../dialog/confirmacao-importacao-remocao-imovel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MensagemAssociacaoImoveisDialogComponent } from '../dialog/mensagem-associacao-imoveis.dialog.component';
import { ConfirmacaoExclusaoImovelDialogComponent } from '../dialog/confirmacao-exclusao-imovel-dialog.component';
import { HotToastService } from '@ngxpert/hot-toast';
import { Imovel } from '@core/models/imovel';
import { TipoImovel } from '@core/models/tipo-imovel';

@Component({
  selector: 'app-listar-imoveis-por-corretor',
  templateUrl: './listar-imoveis-por-corretor.component.html',
  styleUrls: ['./listar-imoveis-por-corretor.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    RouterModule,
    CommonModule,
    MatMenuModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MtxButtonModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [ImovelService, TipoImovelService]
})
export class ListarImoveisPorCorretorComponent implements AfterViewInit {

  private readonly imovelService = inject(ImovelService);
  private readonly fb = inject(FormBuilder);
  private readonly tipoImovelService = inject(TipoImovelService);
  readonly dialog = inject(MatDialog);
  private readonly translateService = inject(TranslateService);
  private readonly toastr = inject(HotToastService);
  private router = inject(Router);

  displayedColumns: string[] = ['selecao', 'importadoApi', 'numeroImovel', 'nome', 'tipoImovel.nome', 'quartos', 'municipio.nome', 'acoes'];
  data: Imovel[] = [];
  isSubmitting = false;
  tiposImoveis: TipoImovel[] = [];
  selecao = new SelectionModel<Imovel>(true, []);


  resultsLength = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pesquisaImoveisForm = this.fb.nonNullable.group({
    nome: ['', []],
    tipoImovel: ['', []],
    quartos: ['', []],
    vagasGaragem: ['', []],
    aceitaFinanciamento: ['', []],
    aceitaConsorcio: ['', []],
    aceitaParcelamento: ['', []],
    comAcaoJudicial: ['', []]
  });

  ngAfterViewInit() {
    this.listar();
    this.tipoImovelService.listar().subscribe(tiposImoveis => this.tiposImoveis = tiposImoveis);
  }

  pesquisar() {
    this.listar();
  }

  limpar() {
    this.pesquisaImoveisForm.reset();
    this.listar();
  }

  listar() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          let pageIndex = this.paginator.pageIndex + 1;
          return this.imovelService!.listar(
            this.pesquisaImoveisForm.value,
            this.sort.active,
            this.sort.direction.toUpperCase(),
            pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }
          this.resultsLength = data.meta.totalItems;
          return data.data;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  linhasSelecionadas() {
    const numSelected = this.selecao.selected.length;
    let linhasSelecionaveis = [];
    this.data.forEach(
      imovel => {
        if (imovel.corretoresImovel.length === 0) {
          linhasSelecionaveis.push(imovel);
        }
      }
    );
    const numRows = linhasSelecionaveis.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  selecionarLinhas() {
    if (this.linhasSelecionadas()) {
      this.selecao.clear();
      return;
    }
    this.data.forEach(
      imovel => {
        if (imovel.corretoresImovel.length === 0) {
          this.selecao.select(imovel);
        }
      }
    );
  }

  public anunciarTodos() {
    const dialogRef = this.dialog.open(ConfirmacaoImportacaoRemocaoImovelDialogComponent, {
      data: {
        descricao: 'incluir todos os imóveis dos municípios de interesse no seu site?',
        titulo: 'Incluir Anúncios'
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        this.dialog.open(MensagemAssociacaoImoveisDialogComponent, {
          disableClose: true, width: '200'
        });
        this.imovelService.vincularTodosOsImoveisAoCorretor().subscribe(
          () => {
            this.dialog.closeAll();
            this.translateService.get('success_operation').subscribe(
              mensagem => this.toastr.info(mensagem)
            );
            this.listar();
            this.selecao.clear();
          }
        );
      }
    });
  }

  public anunciarSelecionados() {
    const dialogRef = this.dialog.open(ConfirmacaoImportacaoRemocaoImovelDialogComponent, {
      data: {
        descricao: 'incluir os imóveis selecionados no seu site?',
        titulo: 'Incluir Anúncios'
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        this.dialog.open(MensagemAssociacaoImoveisDialogComponent, {
          disableClose: true, width: '200'
        });
        let idsSelecionados: number[] = [];
        this.selecao.selected.forEach(imovel => {
          idsSelecionados.push(imovel.id);  
        });
        this.imovelService.vincularImoveisSelecionados(idsSelecionados).subscribe(
          () => {
            this.dialog.closeAll();
            this.translateService.get('success_operation').subscribe(
              mensagem => this.toastr.info(mensagem)
            );
            this.listar();
            this.selecao.clear();
          }
        );
      }
    });
  }

  public excluirImovel(imovel:Imovel) {
    const dialogRef = this.dialog.open(ConfirmacaoExclusaoImovelDialogComponent, {
      data: {
        idImovel: imovel.id,
        descricao: imovel.nome,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        this.imovelService.excluir(result.idImovel).subscribe(
          ()=>{
            this.dialog.closeAll();
            this.translateService.get('success_operation').subscribe(
              mensagem => this.toastr.info(mensagem)
            );
            this.listar();
          }
        );
      }
    });
  }
}
