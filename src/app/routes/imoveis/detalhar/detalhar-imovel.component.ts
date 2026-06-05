import { AfterViewInit, Component, Inject, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../services/imovel.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MtxPhotoviewerModule } from '@ng-matero/extensions/photoviewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmacaoImportacaoRemocaoImovelDialogComponent } from '../dialog/confirmacao-importacao-remocao-imovel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { HotToastService } from '@ngxpert/hot-toast';
import { Imovel } from '@core/models/imovel';

@Component({
  selector: 'app-detalhar-imovel',
  templateUrl: './detalhar-imovel.component.html',
  styleUrls: ['./detalhar-imovel.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    CommonModule,
    MtxPhotoviewerModule,
    MatGridListModule,
    MtxButtonModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [ImovelService]
})
export class DetalharImovelComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private toast = inject(HotToastService);
  private imovelService = inject(ImovelService);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  imovelData: Observable<Imovel> | undefined;
  imovel: Imovel | undefined;
  imagensImovel: any[] = [];
  isSubmitting: boolean = false;

  ngAfterViewInit() {
    this.imovelService.obterPor(this.route.snapshot.params['id']).subscribe(
      imovel => {
        this.imovel = imovel;
        imovel.imagensImovel.forEach(
          imagem => {
            this.imagensImovel.push({
              title: '',
              src: imagem.link,
            })
          }
        )
      }
    );
  }

  public remover() {
    const dialogRef = this.dialog.open(ConfirmacaoImportacaoRemocaoImovelDialogComponent, {
      data: {
        descricao: 'remover o anúncio deste imóvel no seu site?',
        titulo: 'Remover Anúncio'
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result !== undefined){
        if (this.imovel && this.imovel.id) {
          this.imovelService.removerVinculoImovelCorretor(this.imovel.id).subscribe(
            () => {
              this.translateService.get('success_operation').subscribe(
                mensagem => this.toast.info(mensagem)
              );
              this.router.navigateByUrl('/imoveis');
            }
          );
        }
      }
    });
  }

  public importar() {
    const dialogRef = this.dialog.open(ConfirmacaoImportacaoRemocaoImovelDialogComponent, {
      data: {
        descricao: 'incluir o anúncio deste imóvel no seu site?',
        titulo: 'Incluir Anúncio'
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        if (this.imovel && this.imovel.id) {
          this.imovelService.vincularImovelAoCorretor(this.imovel.id).subscribe(
            () => {
              this.translateService.get('success_operation').subscribe(
                mensagem => this.toast.info(mensagem)
              );
              this.router.navigateByUrl('/imoveis');
            }
          );
        }
      }
    });
  }
}
