import {Component, inject, model} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
  } from '@angular/material/dialog';

@Component({
    selector: 'confirmacao-importacao-remocao-imovel-dialog',
    templateUrl: './confirmacao-importacao-remocao-imovel-dialog.component.html',
    standalone: true,
    imports: [
      MatDialogModule,
      MatButtonModule
    ],
  })
export class ConfirmacaoImportacaoRemocaoImovelDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmacaoImportacaoRemocaoImovelDialogComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly confirmacao = model(this.data);
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  export interface DialogData {
    titulo: string;
    descricao: string;
  }