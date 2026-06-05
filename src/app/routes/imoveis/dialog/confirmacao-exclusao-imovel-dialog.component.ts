import {Component, inject, model} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
  } from '@angular/material/dialog';

@Component({
    selector: 'confirmacao-exclusao-imovel-dialog',
    templateUrl: './confirmacao-exclusao-imovel-dialog.component.html',
    standalone: true,
    imports: [
      MatDialogModule,
      MatButtonModule
    ],
  })
export class ConfirmacaoExclusaoImovelDialogComponent {
    readonly dialogRef = inject(MatDialogRef<ConfirmacaoExclusaoImovelDialogComponent>);
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);
    readonly confirmacao = model(this.data);
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }

  export interface DialogData {
    descricao: string;
  }