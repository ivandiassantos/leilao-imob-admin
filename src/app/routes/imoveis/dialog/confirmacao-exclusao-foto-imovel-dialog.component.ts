import {Component, inject, model} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
  } from '@angular/material/dialog';

@Component({
    selector: 'confirmacao-exclusao-foto-imovel-dialog',
    templateUrl: './confirmacao-exclusao-foto-imovel-dialog.component.html',
    standalone: true,
    imports: [
      MatDialogModule,
      MatButtonModule
    ],
  })
export class ConfirmacaoExclusaoFotoImovelDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmacaoExclusaoFotoImovelDialogComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly confirmacao = model(this.data);
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  export interface DialogData {
    descricao: string;
  }